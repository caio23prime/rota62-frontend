import json
import time
import requests
import ftplib
import os
import math
import random
from datetime import datetime
from playwright.sync_api import sync_playwright

# --- CONFIGURAÇÕES ---
FTP_HOST = "ftp.rota62go.com.br"
FTP_USER = "u718718103.admin.rota62go.com.br"
FTP_PASS = "Mpc@102030"
ARQUIVO_LOCAL = "waze_data.json"
INTERVALO_MINUTOS = 10
VALIDADE_MANUAL_MINUTOS = 30 

# MAPA DE BAIRROS
BAIRROS_REF = {
    "Centro": (-16.682, -49.256),
    "St. Bueno": (-16.708, -49.270),
    "St. Marista": (-16.700, -49.263),
    "St. Oeste": (-16.686, -49.278),
    "Campinas": (-16.670, -49.293),
    "Jd. Goiás": (-16.705, -49.243),
    "St. Pedro Ludovico": (-16.717, -49.255),
    "Pq. Amazônia": (-16.727, -49.283),
    "St. Universitário": (-16.676, -49.244),
    "Jd. América": (-16.715, -49.290),
    "St. Sul": (-16.689, -49.255),
    "Norte Ferroviário": (-16.665, -49.260),
    "Aparecida (Centro)": (-16.822, -49.246),
    "Vila Brasília": (-16.745, -49.255),
    "Garavelo": (-16.770, -49.320),
    "BR-153": (-16.760, -49.250),
    "St. Aeroporto": (-16.676, -49.275),
    "Nova Suíça": (-16.720, -49.280)
}

ZONAS = [
    {"nome": "Geral_Goiania", "url": "https://www.waze.com/live-map?latlng=-16.6950%2C-49.2600&zoom=14"},
    {"nome": "Sul_Aparecida", "url": "https://www.waze.com/live-map?latlng=-16.7400%2C-49.2500&zoom=14"}
]

def descobrir_bairro(lat, lon):
    if not lat or not lon: return ""
    menor = 1000
    nome_bairro = ""
    for nome, coord in BAIRROS_REF.items():
        dist = math.sqrt((coord[0] - lat)**2 + (coord[1] - lon)**2)
        if dist < menor:
            menor = dist
            nome_bairro = nome
    if menor < 0.03: return nome_bairro
    return ""

def traduzir(tipo, subtipo, nivel=0):
    t = f"{tipo}|{subtipo}"
    
    # --- FILTRO ANTI-LIXO (Ignora Buracos) ---
    if "POT_HOLE" in t: return None, 0, ""  # <--- SE FOR BURACO, JOGA FORA!

    # --- CATEGORIAS VÁLIDAS ---
    if "CONSTRUCTION" in t: return "Obras na via", 4, "text-orange-500 font-black"
    if "ACCIDENT" in t: return "Acidente de carro", 5, "text-red-500 font-black"
    if "FLOOD" in t: return "Alagamento", 5, "text-blue-400 font-bold"
    if "ROAD_CLOSED" in t: return "Via interditada", 5, "text-red-600 font-black"
    if "TRAFFIC_LIGHT" in t: return "Falha no semáforo", 3, "text-orange-500 font-bold"
    
    # Perigo na via (Objetos, animais, óleo - MENOS buraco)
    if "HAZARD" in t or "OBJECT" in t or "KILL" in t: return "Perigo na via", 3, "text-orange-600 font-bold"
    
    if "CAR_STOPPED" in t: return "Carro parado na via", 2, "text-yellow-400 font-bold"
    
    if "JAM" in tipo: 
        if nivel >= 4: return "Trânsito muito intenso", 4, "text-red-500 font-bold"
        if nivel == 3: return "Trânsito intenso", 3, "text-orange-500 font-bold"
        return "Trânsito moderado", 2, "text-yellow-400 font-bold"
        
    return None, 0, ""

def detectar_sentido(rua, bairro_detectado):
    """Detecta se o fluxo é sentido centro ou bairro baseado em palavras-chave"""
    rua_lower = rua.lower() if rua else ""
    
    # Palavras que indicam sentido centro
    palavras_centro = ["centro", "downtown", "setor central", "praça cívica"]
    # Palavras que indicam sentido bairro
    palavras_bairro = ["bairro", "setor", "jardim", "vila", "parque", "residencial"]
    
    for palavra in palavras_centro:
        if palavra in rua_lower:
            return "sentido Centro"
    
    for palavra in palavras_bairro:
        if palavra in rua_lower and bairro_detectado:
            return f"sentido {bairro_detectado}"
    
    # Se não detectou, tenta inferir pelo bairro
    if bairro_detectado and bairro_detectado.lower() != "centro":
        return f"sentido {bairro_detectado}"
    
    return None

def formatar_texto_inteligente(rua, descricao, perto_de, bairro_detectado):
    """Formata texto completo e informativo para os alertas"""
    texto_base = ""
    
    # Prioriza o nome completo da rua (sem abreviar)
    if rua and len(rua) > 2:
        texto_base = rua
    elif perto_de:
        texto_base = f"Próximo a {perto_de}"
    elif bairro_detectado:
        texto_base = f"Via no {bairro_detectado}"
    else:
        return None
    
    # Adiciona bairro se não estiver no texto
    if bairro_detectado and bairro_detectado.lower() not in texto_base.lower():
        texto_base += f" ({bairro_detectado})"
    
    # Detecta e adiciona sentido
    sentido = detectar_sentido(rua, bairro_detectado)
    if sentido:
        texto_base += f" - {sentido}"
    
    # Adiciona descrição adicional se houver e for relevante
    if descricao and descricao not in texto_base and len(descricao) < 60:
        # Remove redundâncias comuns
        if not any(palavra in descricao.lower() for palavra in ['acidente', 'congestionamento', 'obra', 'perigo']):
            texto_base += f" | {descricao}"
    
    return texto_base

def capturar_waze():
    print("   📡 Iniciando Farejador V9 (Sem Buracos)...")
    dados_brutos = {"alertas": [], "transito": []}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            viewport={'width': 1366, 'height': 768},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        
        for zona in ZONAS:
            print(f"      📍 {zona['nome']}...")
            page = context.new_page()
            
            def interceptar(res):
                try:
                    if "json" in res.headers.get("content-type", ""):
                        try: body = res.json()
                        except: return
                        if isinstance(body, dict):
                            if 'alerts' in body and body['alerts']: dados_brutos["alertas"].extend(body['alerts'])
                            if 'jams' in body and body['jams']: dados_brutos["transito"].extend(body['jams'])
                except: pass

            page.on("response", interceptar)
            try:
                page.goto(zona['url'], wait_until="domcontentloaded", timeout=60000)
                for _ in range(4): # Mouse move
                    page.mouse.move(random.randint(100, 1000), random.randint(100, 600))
                    time.sleep(1)
                time.sleep(5)
            except: pass
            page.close()
        browser.close()

    print("   🧹 Filtrando...")
    lista_waze = []
    ids_vistos = set()
    
    # ALERTAS
    for item in dados_brutos["alertas"]:
        if item.get('uuid') in ids_vistos: continue
        tit, prior, cor = traduzir(item.get('type',''), item.get('subtype',''))
        
        if tit:
            lat = item.get('location', {}).get('y')
            lon = item.get('location', {}).get('x')
            bairro = descobrir_bairro(lat, lon)
            
            texto_limpo = formatar_texto_inteligente(
                item.get('street', '').strip(),
                item.get('reportDescription', '').strip(),
                item.get('near', '').strip(),
                bairro
            )
            
            if texto_limpo:
                lista_waze.append({"id": item.get('uuid'), "titulo": tit, "texto": texto_limpo, "prioridade": prior, "corTitulo": cor, "origem": "waze", "atraso": None})
                ids_vistos.add(item.get('uuid'))

    # TRÂNSITO
    for item in dados_brutos["transito"]:
        if item.get('uuid') in ids_vistos: continue
        delay, nivel = item.get('delay', 0), item.get('level', 0)
        
        if delay > 120 or nivel >= 3:
            tit, prior, cor = traduzir("JAM", "", nivel)
            
            caminho = item.get('line', [])
            bairro = ""
            if caminho: bairro = descobrir_bairro(caminho[0].get('y'), caminho[0].get('x'))
            
            rua = item.get('street', '').strip()
            if not rua and bairro: 
                rua = f"Trânsito no {bairro}"
            elif not rua: 
                continue
            
            # Monta texto completo com sentido
            texto_final = rua
            
            # Adiciona bairro se não estiver no nome da rua
            if bairro and bairro.lower() not in rua.lower():
                texto_final += f" ({bairro})"
            
            # Detecta e adiciona sentido
            sentido = detectar_sentido(rua, bairro)
            if sentido:
                texto_final += f" - {sentido}"
            elif item.get('endNode'):
                # Se não detectou automaticamente, usa o endNode do Waze
                texto_final += f" - sentido {item.get('endNode')}"
            
            # Adiciona informação de atraso
            atraso_texto = f"+{math.ceil(delay/60)} min"

            lista_waze.append({
                "id": item.get('uuid'), 
                "titulo": tit, 
                "texto": texto_final, 
                "atraso": atraso_texto, 
                "prioridade": prior, 
                "corTitulo": cor, 
                "origem": "waze"
            })
            ids_vistos.add(item.get('uuid'))

    return lista_waze

def buscar_clima():
    try:
        r = requests.get("https://api.open-meteo.com/v1/forecast?latitude=-16.68&longitude=-49.26&current=weather_code&timezone=America%2FSao_Paulo", timeout=5)
        d = r.json().get('current', {}).get('weather_code', 0)
        if d in [95, 96, 99]: return [{"titulo": "PERIGO CLIMÁTICO", "desc": "Tempestade e Raios na região"}]
        if d in [61, 63, 65, 80, 81, 82]: return [{"titulo": "CLIMA", "desc": "Chuva em pontos isolados"}]
    except: pass
    return []

def loop():
    manuais = []
    try:
        if os.path.exists(ARQUIVO_LOCAL):
            with open(ARQUIVO_LOCAL, 'r', encoding='utf-8') as f:
                antigos = json.load(f).get("dados", {}).get("lista_mista", [])
                agora = datetime.now().timestamp()
                for item in antigos:
                    if item.get("origem") == "manual" and (agora - item.get("timestamp", 0))/60 < VALIDADE_MANUAL_MINUTOS:
                        manuais.append(item)
    except: pass

    waze = capturar_waze()
    clima = buscar_clima()
    final = manuais + waze
    
    print(f"   ✅ {len(waze)} Alertas Filtrados (Sem buracos).")
    
    payload = {"atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M"), "dados": {"lista_mista": final, "clima": clima}}
    with open(ARQUIVO_LOCAL, "w", encoding="utf-8") as f: json.dump(payload, f, indent=4, ensure_ascii=False)
    
    try:
        ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
        with open(ARQUIVO_LOCAL, 'rb') as f: ftp.storbinary(f'STOR {ARQUIVO_LOCAL}', f)
        ftp.quit()
        print("   🚀 Upload OK!")
    except: print("   ❌ Erro FTP")

if __name__ == "__main__":
    os.system('cls' if os.name == 'nt' else 'clear')
    print("🤖 ROBÔ V9 - SEM BURACOS")
    while True:
        loop()
        print(f"💤 Aguardando {INTERVALO_MINUTOS} min...")
        time.sleep(INTERVALO_MINUTOS * 60)