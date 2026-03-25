@echo off
setlocal enabledelayedexpansion

:: Info Hub Project Launcher
:: Uses Node.js directly to run Vite (avoids pnpm/npm .ps1 script issues)

set "LOG_DIR=D:\logs"
set "FRONTEND_LOG=%LOG_DIR%\info-hub-frontend.log"
set "PROJECT_LOG=%LOG_DIR%\info-hub.log"

echo [%date% %time%] === Info Hub Starting === > "%PROJECT_LOG%"

:: Kill existing
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3005 " ^| findstr "LISTENING"') do (
    echo [%date% %time%] Killing %%a >> "%PROJECT_LOG%"
    taskkill /F /PID %%a >> "%PROJECT_LOG%" 2>&1
)

timeout /t 2 /nobreak > nul

:: Start using node.exe directly (avoids PowerShell script issues)
echo [%date% %time%] Starting frontend via node... >> "%PROJECT_LOG%"
start "infohub" cmd /c "cd /d F:\docs\project\info-hub && node node_modules\vite\bin\vite.js --port 3005 --host 127.0.0.1 --base /docs >> "%FRONTEND_LOG%" 2>&1"

echo [%date% %time%] Started >> "%PROJECT_LOG%"

:: Monitor
:monitor
timeout /t 20 /nobreak > nul
netstat -ano | findstr ":3005 " | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo [%date% %time%] Port down, restarting... >> "%PROJECT_LOG%"
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3005 " ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
    start "infohub" cmd /c "cd /d F:\docs\project\info-hub && node node_modules\vite\bin\vite.js --port 3005 --host 127.0.0.1 --base /docs >> "%FRONTEND_LOG%" 2>&1"
)
goto monitor
