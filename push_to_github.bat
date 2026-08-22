@echo off
title Push BioBae to GitHub
cd /d "%~dp0"
echo ============================================================
echo   Pushing BioBae Longevity Architect to GitHub Repository
echo   https://github.com/persephoneslove/bae-peptides
echo ============================================================
echo.

set "GIT_CMD=%LOCALAPPDATA%\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"

if not exist "%GIT_CMD%" (
    set "GIT_CMD=git"
)

"%GIT_CMD%" push -u origin main --force

echo.
echo ============================================================
echo   Push Complete!
echo ============================================================
pause
