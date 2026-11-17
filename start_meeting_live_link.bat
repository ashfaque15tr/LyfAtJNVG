@echo off
title [DO NOT CLOSE DURING MEETING] JNV Alumni - Live Mobile Demo Server
cd /d "%~dp0"

echo =====================================================================
echo    JAWAHAR NAVODAYA VIDYALAYA ALUMNI ASSOCIATION
echo    Live Meeting Mobile App Demo Broadcast
echo =====================================================================
echo.
echo Initializing temporary live demo broadcast for meeting attendees...
echo.

powershell -ExecutionPolicy Bypass -NoExit -File "%~dp0meeting_server.ps1"
