@echo off
title JNV Alumni - Live Mobile App Testing Server
cd /d "%~dp0"

echo =====================================================================
echo    JAWAHAR NAVODAYA VIDYALAYA ALUMNI MOBILE APP - TEST SERVER
echo    Gauriganj, Sultanpur / Amethi
echo =====================================================================
echo.
echo Launching network server to test directly on your Phone...
echo.

powershell -ExecutionPolicy Bypass -NoExit -File "%~dp0server.ps1"
pause
