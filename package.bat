@echo off
setlocal

cd /d "%~dp0"

echo.
echo  Pi-hole Toggle - package for Chrome Web Store
echo  ---------------------------------------------

rem --- sanity: icons must exist ---
for %%F in (icons\icon-16.png icons\icon-48.png icons\icon-128.png) do (
  if not exist "%%F" (
    echo  [x] Missing %%F
    echo      Open icons\generate.html in Chrome and click "Generate all" first.
    echo.
    pause
    exit /b 1
  )
)

rem --- pull version from manifest.json ---
for /f "usebackq delims=" %%V in (`powershell -NoProfile -Command "(Get-Content -Raw manifest.json | ConvertFrom-Json).version"`) do set VERSION=%%V

if "%VERSION%"=="" (
  echo  [x] Could not read version from manifest.json
  pause
  exit /b 1
)

set OUTDIR=dist
set ZIP=%OUTDIR%\pihole-toggle-%VERSION%.zip

if not exist "%OUTDIR%" mkdir "%OUTDIR%"
if exist "%ZIP%" del "%ZIP%"

echo  [i] Version: %VERSION%
echo  [i] Output : %ZIP%
echo.

powershell -NoProfile -Command ^
  "Compress-Archive -Force -Path manifest.json,background.js,popup.html,popup.css,popup.js,options.html,options.js,icons/icon-16.png,icons/icon-48.png,icons/icon-128.png -DestinationPath '%ZIP%'"

if errorlevel 1 (
  echo.
  echo  [x] Packaging failed.
  pause
  exit /b 1
)

echo.
echo  [ok] Built %ZIP%
echo.
echo  Next: upload this zip at https://chrome.google.com/webstore/devconsole
echo.
pause
