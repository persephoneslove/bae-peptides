@echo off
title Launching BioBae Pro...
cd /d "%~dp0"
set PATH=%PATH%;C:\Program Files\nodejs

echo ========================================================
echo       Starting BioBae Pro Biohacking Core...
echo ========================================================

start /b npm run dev:vite >nul 2>&1
timeout /t 2 /nobreak >nul

start chrome.exe --app=http://localhost:5173
exit
