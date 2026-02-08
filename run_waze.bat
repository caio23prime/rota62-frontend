@echo off
cd /d "%~dp0"
echo ==========================================
echo      INICIANDO COLETOR WAZE - ROTA 62
echo ==========================================
echo.

:: Verifica se o Python esta instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado! Instale o Python e marque "Add to PATH".
    pause
    exit /b
)

:: Instala dependencias caso nao existam
echo [INFO] Verificando dependencias...
pip install -r requirements.txt >nul 2>&1
playwright install chromium >nul 2>&1

:: Executa o script
echo [INFO] Rodando o coletor...
python coletor_waze.py

pause
