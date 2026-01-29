import json
import time
import math
from playwright.sync_api import sync_playwright

# Link focado em Goiânia
URL_ALVO = "https://www.waze.com/live-map/directions?latlng=-16.7166%2C-49.2706&zoom=13"

def teste_captura():
    print("\n🕵️  INICIANDO TESTE DE CAPTURA WAZE...")
    print(f"📍 Alvo: {URL_ALVO}")
    
    with sync_playwright() as p:
        # headless=False abre o navegador para você VER ele trabalhando (bom para teste)
        browser = p.chromium.launch(headless=False) 
        context = browser.new_context(viewport={'width': 1920, 'height': 1080})
        page = context.new_page()
        
        dados_temp = {"alertas": [], "transito": []}

        # Interceptador
        def interceptar(response):
            try:
                if "waze.com" in response.url and "json" in response.headers.get("content-type", ""):
                    if '"alerts":' in response.text() or '"jams":' in response.text():
                        print("   ⚡ Capturado pacote de dados JSON!")
                        data = response.json()
                        if 'alerts' in data: dados_temp["alertas"].extend(data['alerts'])
                        if 'jams' in data: dados_temp["transito"].extend(data['jams'])
            except: pass

        page.on("response", interceptar)
        
        print("⏳ Carregando mapa...")
        page.goto(URL_ALVO, wait_until="networkidle")
        
        # Espera extra para garantir que os ícones carreguem
        print("⏳ Aguardando renderização (15s)...")
        time.sleep(15)
        
        browser.close()
        
        # --- CONTAGEM FINAL ---
        # Remove duplicatas
        alertas = list({v['uuid']:v for v in dados_temp["alertas"]}.values())
        transito = list({v['uuid']:v for v in dados_temp["transito"]}.values())
        
        print("\n" + "="*40)
        print("📊 RESULTADO DO TESTE NO VSCODE:")
        print("="*40)
        print(f"🔴 ALERTAS TOTAIS:   {len(alertas)}")
        print(f"🟠 LENTIDÃO/JAMS:    {len(transito)}")
        print("="*40)
        
        if len(alertas) > 0:
            print("\nExemplos encontrados:")
            for a in alertas[:3]: # Mostra só os 3 primeiros
                print(f"- {a.get('type')} na {a.get('street')}")
        else:
            print("\n❌ NENHUM ALERTA ENCONTRADO.")
            print("Dica: Tente aumentar o zoom na URL ou verificar se o mapa carregou.")

if __name__ == "__main__":
    teste_captura()