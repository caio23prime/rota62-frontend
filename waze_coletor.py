import json
import time
import os
import ftplib # Biblioteca para enviar o arquivo
from datetime import datetime
from playwright.sync_api import sync_playwright

# --- CONFIGURAÇÕES FTP ---
FTP_HOST = "ftp.rota62go.com.br"  # Confira na Hostinger se é esse mesmo
FTP_USER = "u123456789"           # <--- COLOCAR O USUÁRIO QUE COMEÇA COM 'u'
FTP_PASS = "SuaNovaSenha123"      # <--- A SENHA QUE VOCÊ ACABOU DE CRIAR
FTP_DIR  = "/domains/rota62go.com.br/public_html/admin" # Caminho da pasta

# --- CONFIGURAÇÕES DE COLETA ---
URL_ALVO = "https://www.waze.com/live-map/directions?latlng=-16.7166%2C-49.2706&zoom=13"
ARQUIVO_LOCAL = "waze_data.json"

# --- FILTROS (Igual ao anterior) ---
TIPOS_PERMITIDOS = ["ACCIDENT", "JAM", "ROAD_CLOSED", "HAZARD"]
SUBTIPOS_INTERESSE = ["HAZARD_ON_ROAD_CAR_STOPPED", "HAZARD_ON_ROAD_LANE_CLOSED", "HAZARD_ON_ROAD_POT_HOLE", "HAZARD_WEATHER_FLOOD", "HAZARD_WEATHER", "HAZARD_ON_ROAD_CONSTRUCTION"]

def filtrar_dados(dados_brutos):
    alertas_filtrados = []
    for alerta in dados_brutos.get("alertas", []):
        tipo = alerta.get("type", "")
        subtipo = alerta.get("subtype", "")
        if "POLICE" in tipo: continue
        
        if any(t in tipo for t in TIPOS_PERMITIDOS) or any(s in subtipo for s in SUBTIPOS_INTERESSE):
            categoria_pt = "ALERTA"
            if "ACCIDENT" in tipo: categoria_pt = "ACIDENTE"
            elif "JAM" in tipo: categoria_pt = "TRÂNSITO LENTO"
            elif "ROAD_CLOSED" in tipo: categoria_pt = "VIA INTERDITADA"
            elif "FLOOD" in subtipo: categoria_pt = "ALAGAMENTO"
            elif "CAR_STOPPED" in subtipo: categoria_pt = "VEÍCULO PARADO"
            elif "POT_HOLE" in subtipo: categoria_pt = "BURACO NA VIA"
            
            alerta["categoria_formatada"] = categoria_pt
            alertas_filtrados.append(alerta)
    return alertas_filtrados

def capturar_waze():
    # ... (Lógica do Playwright igual ao anterior) ...
    # Vou resumir aqui pra caber na resposta, use a mesma lógica de captura do script anterior
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 📡 Escaneando Waze...")
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={'width': 1920, 'height': 1080})
            dados_temp = {"alertas": [], "transito": []}

            def interceptar_resposta(response):
                try:
                    if "waze.com" in response.url and "json" in response.headers.get("content-type", ""):
                        texto = response.text()
                        if '"alerts":' in texto or '"jams":' in texto:
                            data = json.loads(texto)
                            if 'alerts' in data: dados_temp["alertas"].extend(data['alerts'])
                            if 'jams' in data: dados_temp["transito"].extend(data['jams'])
                except: pass

            page.on("response", interceptar_resposta)
            page.goto(URL_ALVO, wait_until="networkidle", timeout=60000)
            time.sleep(12)
            browser.close()
            
            alertas_unicos = list({v['uuid']:v for v in dados_temp["alertas"]}.values())
            alertas_finais = filtrar_dados({"alertas": alertas_unicos})
            transito_final = list({v['uuid']:v for v in dados_temp["transito"]}.values())
            return {"alertas": alertas_finais, "transito": transito_final}
        except Exception as e:
            print(f"❌ Erro: {e}")
            return None

def upload_ftp():
    print("🚀 Enviando para o servidor...")
    try:
        session = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
        session.cwd(FTP_DIR) # Entra na pasta pública
        file = open(ARQUIVO_LOCAL, 'rb')
        session.storbinary(f'STOR {ARQUIVO_LOCAL}', file)
        file.close()
        session.quit()
        print(f"✅ Arquivo atualizado em: https://admin.rota62go.com.br/{ARQUIVO_LOCAL}")
    except Exception as e:
        print(f"❌ Erro no FTP: {e}")

if __name__ == "__main__":
    resultado = capturar_waze()
    if resultado:
        dados_com_meta = {
            "atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "fonte": "Waze Live Map",
            "dados": resultado
        }
        with open(ARQUIVO_LOCAL, "w", encoding="utf-8") as f:
            json.dump(dados_com_meta, f, indent=4, ensure_ascii=False)
        
        # CHAMA O UPLOAD
        upload_ftp()
    else:
        print("⚠️ Falha na coleta.")