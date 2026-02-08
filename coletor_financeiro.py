import requests
import json
import time
import os
import ftplib
from datetime import datetime

# Configurações
ARQUIVO_FINAL = "finance_data.json"
INTERVALO_SEGUNDOS = 300  # 5 minutos

# FTP (Mesmos dados do Waze)
FTP_HOST = "ftp.rota62go.com.br"
FTP_USER = "u718718103.admin.rota62go.com.br"
FTP_PASS = "Mpc@102030"

# URLs
API_URL = "https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL"

def buscar_cotacoes():
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            return {
                "dolar": {
                    "valor": f"R$ {float(data['USDBRL']['bid']):.2f}".replace('.', ','),
                    "var": f"{float(data['USDBRL']['pctChange']):.2f}%",
                    "trend": "up" if float(data['USDBRL']['pctChange']) > 0 else "down"
                },
                "euro": {
                    "valor": f"R$ {float(data['EURBRL']['bid']):.2f}".replace('.', ','),
                    "var": f"{float(data['EURBRL']['pctChange']):.2f}%",
                    "trend": "up" if float(data['EURBRL']['pctChange']) > 0 else "down"
                },
                "btc": {
                    "valor": f"R$ {float(data['BTCBRL']['bid']):,.2f}".replace('.', '#').replace(',', '.').replace('#', ','),
                    "var": f"{float(data['BTCBRL']['pctChange']):.2f}%",
                    "trend": "up" if float(data['BTCBRL']['pctChange']) > 0 else "down"
                }
            }
    except Exception as e:
        print(f"Erro ao buscar API: {e}")
        return None

def gerar_dados():
    cotacoes = buscar_cotacoes()
    
    # Dados Mockados para Commodities (Valores de referência)
    commodities = {
        "boi": {
            "valor": "R$ 312,00/@",
            "var": "+0,5%",
            "trend": "up"
        },
        "soja": {
            "valor": "R$ 120,00/sc",
            "var": "-0,2%",
            "trend": "down"
        }
    }

    if cotacoes:
        dados = {
            "atualizacao": datetime.now().strftime("%d/%m/%Y %H:%M"),
            "mercado": [
                {"name": "Dólar", "value": cotacoes['dolar']['valor'], "change": cotacoes['dolar']['var'].replace('.', ','), "trend": cotacoes['dolar']['trend'], "graph": [4.9, 4.95, 5.0, 5.02]}, # Graph simulado
                {"name": "Euro", "value": cotacoes['euro']['valor'], "change": cotacoes['euro']['var'].replace('.', ','), "trend": cotacoes['euro']['trend'], "graph": [5.4, 5.3, 5.35, 5.4]}, # Graph simulado
                {"name": "Boi Gordo", "value": commodities['boi']['valor'], "change": commodities['boi']['var'], "trend": commodities['boi']['trend'], "graph": [300, 305, 310, 312]}, # Graph simulado
                {"name": "Bitcoin", "value": cotacoes['btc']['valor'], "change": cotacoes['btc']['var'].replace('.', ','), "trend": cotacoes['btc']['trend'], "graph": [300000, 310000, 305000, 320000]} # Graph simulado
            ]
        }
        
        with open(ARQUIVO_FINAL, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=4, ensure_ascii=False)
        
        print(f"✅ Dados financeiros atualizados em {dados['atualizacao']}")

        # Upload FTP
        try:
            ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS)
            with open(ARQUIVO_FINAL, 'rb') as f:
                ftp.storbinary(f'STOR {ARQUIVO_FINAL}', f)
            ftp.quit()
            print("   🚀 Upload FTP realizado com sucesso!")
        except Exception as e:
            print(f"   ❌ Erro no Upload FTP: {e}")

    else:
        print("❌ Falha ao atualizar dados.")

if __name__ == "__main__":
    print("Iniciando Coletor Financeiro...")
    while True:
        gerar_dados()
        time.sleep(INTERVALO_SEGUNDOS)
