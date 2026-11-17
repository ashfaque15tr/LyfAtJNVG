@echo off
title Jawahar Navodaya Vidyalaya - Platform Launcher
echo ==============================================================
echo    Jawahar Navodaya Vidyalaya Alumni Association
echo    Gauriganj, Sultanpur / Amethi (U.P.)
echo ==============================================================
echo.
echo Choose which application channel you would like to run:
echo.
echo   [1] Desktop Web Portal (Widescreen, Enterprise Admin Ledger)
echo   [2] Native Mobile App Channel (Google Play & App Store UX)
echo   [3] Open Both Simultaneously
echo   [4] Start Temporary Meeting Demo Link (Cloudflare Live Tunnel for Attendees)
echo.
set /p choice="Enter choice (1, 2, 3, or 4) [Default 1]: "

if "%choice%"=="2" goto open_mobile
if "%choice%"=="3" goto open_both
if "%choice%"=="4" goto open_meeting
goto open_desktop

:open_desktop
echo Opening Desktop Web Portal...
start "" "%~dp0login.html"
goto end

:open_mobile
echo Opening Mobile App Channel...
call "%~dp0run_mobile_app.bat"
goto end

:open_both
echo Opening Desktop Portal and Mobile App...
start "" "%~dp0login.html"
call "%~dp0run_mobile_app.bat"
goto end

:open_meeting
echo Starting Temporary Meeting Demo Link...
call "%~dp0start_meeting_live_link.bat"
goto end

:end
