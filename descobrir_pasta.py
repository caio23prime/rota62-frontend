import ftplib

# SEUS DADOS DA HOSTINGER
HOST = "ftp.rota62go.com.br"
USER = "u718718103.admin.rota62go.com.br"
PASS = "Mpc@102030"

def investigar():
    print("\n🕵️  INVESTIGANDO ONDE O ROBÔ ESTÁ SALVANDO...")
    try:
        ftp = ftplib.FTP(HOST, USER, PASS)
        
        # 1. Onde caímos assim que conectamos?
        pasta_inicial = ftp.pwd()
        print(f"✅ Conectado! A pasta raiz deste usuário é: {pasta_inicial}")
        
        # 2. O que tem aqui dentro?
        print("\n📂 ARQUIVOS NESTA PASTA:")
        arquivos = ftp.nlst()
        for f in arquivos:
            print(f"   - {f}")
            
        # 3. Tenta achar o arquivo do Waze
        if "waze_data.json" in arquivos:
            print("\n⚠️  ACHEI O ARQUIVO AQUI NA RAIZ!")
            print("    (Se o site não lê, então o site espera que esteja em outra pasta)")
        else:
            print("\n❌ O arquivo waze_data.json NÃO está aqui.")

        # 4. Procura por public_html (pasta comum de sites)
        if "public_html" in arquivos:
            print("\n➡️  Achei uma pasta 'public_html'. O site deve estar lá dentro.")
        elif "domains" in arquivos:
            print("\n➡️  Achei uma pasta 'domains'.")

        ftp.quit()
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")

if __name__ == "__main__":
    investigar()