@echo off
setlocal
title Dev Server Launcher

:: ========================================================
:: CONFIGURATION: Change this value if you need a longer wait time
set WAIT_SECONDS=4
:: ========================================================

:: 1. Ensure we are running from the directory where the .bat file is located (the root folder)
cd /d "%~dp0"

:: 2. Check if package.json exists to prevent errors if run in the wrong place
if not exist "package.json" (
    echo [ERROR] package.json not found in this directory!
    echo Please place this script in your project's root folder.
    pause
    exit /b 1
)

echo [1/3] Launching development server...

:: 3. Start the dev server in a separate persistent window so you can see logs
start "Dev Server" cmd /k "npm run dev"

echo [2/3] Waiting %WAIT_SECONDS% seconds for server to initialize...
timeout /t %WAIT_SECONDS% /nobreak > nul

echo [3/3] Opening default web browser...

:: 4. Open the browser to Vite's default port (5173)
start http://localhost:5173/

echo.
echo ========================================================
echo  Success! Dev server is running and browser has been opened.
echo ========================================================
endlocal
exit