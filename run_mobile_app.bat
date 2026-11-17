@echo off
title Jawahar Navodaya Vidyalaya - Native Mobile App
echo ==============================================================
echo    Jawahar Navodaya Vidyalaya Alumni Association
echo    Mobile App Channel (iOS / Android / Google Play / App Store)
echo ==============================================================
echo.
echo Launching the Dedicated Mobile App in Phone Form Factor...
echo.

set "MOBILE_URL=%~dp0mobile_app\index.html"

:: Try launching in Chrome in standalone app window (390x844 iPhone/Android dimension)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" --app="file:///%MOBILE_URL:\=/%" --window-size=400,860
    goto launched
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" --app="file:///%MOBILE_URL:\=/%" --window-size=400,860
    goto launched
)

:: Try Microsoft Edge app mode
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="file:///%MOBILE_URL:\=/%" --window-size=400,860
    goto launched
)

:: Default browser fallback
start "" "%MOBILE_URL%"

:launched
echo Mobile App launched in independent phone dimensions!
echo.
echo App Features:
echo - Bottom Navigation Bar (Home, Meet '26, Fund, Stories, Directory)
echo - Touch-optimized RSVP & UPI Payment confirmation
echo - Ready for Google Play Store (.aab) & Apple App Store (.ipa)
echo.
pause
