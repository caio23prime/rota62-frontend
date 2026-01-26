import json
import time
import os
import requests
from datetime import datetime
from playwright.sync_api import sync_playwright

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(BASE_DIR, "public", "data", "traffic_weather_data.json")

def buscar_clima_preciso():
    try:
        # Pega dados com sensor de dia/noite (is_day) para precisão total
        url = "https://api.open-meteo.com/v1/forecast?latitude=-16.73&longitude=-49.24&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day"
        res = requests.get(url, timeout=10).json()
        c = res['current']
        
        code = c['weather_code']
        is_day = c['is_day'] # 1 para dia, 0 para noite
        
        # Mapeamento Realista (Respeitando a Noite - 22:15h)
        if code == 0: icon = "☀️" if is_day else "🌙"
        elif code in [1, 2]: icon = "🌤️" if is_day else "☁️"
        elif code == 3: icon = "☁️"
        elif code in [51, 53, 55, 61, 63, 65]: icon = "🌧️"
        elif code >= 80: icon = "⛈️"
        else: icon = "☁️"

        return {
            "temp": round(c['temperature_2m']),
            "feels": round(c['apparent_temperature']),
            "humidity": c['relative_humidity_2m'],
            "wind": round(c['wind_speed_10m']),
            "icon": icon,
            "city": "APARECIDA DE GOIÂNIA"
        }
    except: return None

def pescar_alertas_waze():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🕵️  Pescando alertas reais do Waze...")
    alertas = []
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            def interceptar(response):
                if "TGeoRPC" in response.url and response.status == 200:
                    try:
                        data = response.json()
                        for a in data.get('alerts', []):
                            tipo = a['type']
                            cat = "ACIDENTE" if "ACCIDENT" in tipo else "TRÂNSITO" if "JAM" in tipo else "PERIGO"
                            alertas.append({
                                "category": cat, "street": a.get('street', 'Via Principal'),
                                "city": "GOIÂNIA", "desc": a.get('reportDescription', 'Atenção'),
                                "lat": a['location']['y'], "lon": a['location']['x'], "important": cat == "ACIDENTE"
                            })
                    except: pass
            page.on("response", interceptar)
            page.goto("https://www.waze.com/live-map/directions?latlng=-16.735%2C-49.255&zoom=13", wait_until="commit", timeout=60000)
            time.sleep(15)
            browser.close()
            return alertas
        except: return None

if __name__ == "__main__":
    while True:
        clima = buscar_clima_preciso()
        waze = pescar_alertas_waze()
        banco = {"weather": clima if clima else {}, "alerts_pool": waze if waze else []}
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(banco, f, ensure_ascii=False, indent=4)
        print(f"[{datetime.now().strftime('%H:%M')}] ✅ Motor Rota 62 sincronizado.")
        time.sleep(300)