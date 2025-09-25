@echo off
echo.
echo ============================================
echo   GOOGLE OAUTH SETUP HELPER
echo ============================================
echo.
echo 1. Opening Google Cloud Console...
start https://console.cloud.google.com/
echo.
echo 2. Follow these steps:
echo    - Create new project "News App OAuth" 
echo    - Enable Google+ API and Identity API
echo    - Setup OAuth consent screen
echo    - Create OAuth 2.0 credentials
echo    - Add localhost origins: http://localhost:3000 and http://localhost:3001
echo.
echo 3. After getting your credentials:
echo    - Copy Client ID and Client Secret
echo    - Update the .env file in your project
echo.
echo 4. Your .env file location:
echo    %~dp0.env
echo.
echo Press any key to open the .env file for editing...
pause >nul
notepad "%~dp0.env"
echo.
echo After updating .env file, restart your servers!
echo.
pause