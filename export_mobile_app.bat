@echo off
title Export JNV Alumni Mobile App Package
cd /d "%~dp0"

echo =====================================================================
echo    EXPORTING JNV ALUMNI MOBILE APP PACKAGE FOR PHONE TESTING
echo =====================================================================
echo.
echo Packaging mobile app files into JNV_Alumni_Mobile_App_Bundle.zip...
echo.

powershell -Command "if (Test-Path 'JNV_Alumni_Mobile_App_Bundle.zip') { Remove-Item 'JNV_Alumni_Mobile_App_Bundle.zip' -Force }; Compress-Archive -Path 'mobile_app', 'assets', 'login.html', 'index.html', 'manifest.json', 'run_mobile_app.bat', 'STORE_DEPLOYMENT_GUIDE.md' -DestinationPath 'JNV_Alumni_Mobile_App_Bundle.zip' -Force"

if exist "%~dp0JNV_Alumni_Mobile_App_Bundle.zip" (
    echo.
    echo =====================================================================
    echo [SUCCESS] Package created successfully!
    echo Location: %~dp0JNV_Alumni_Mobile_App_Bundle.zip
    echo.
    echo How you can use this ZIP on your phone:
    echo 1. Send JNV_Alumni_Mobile_App_Bundle.zip to your phone (via WhatsApp, Google Drive, or USB).
    echo 2. Extract it on your phone.
    echo 3. Open mobile_app/index.html in Chrome or any browser on your phone.
    echo =====================================================================
) else (
    echo [ERROR] Failed to create zip bundle.
)
echo.
pause
