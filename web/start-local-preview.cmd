@echo off
setlocal
cd /d "%~dp0"

echo Starting Draw Steel Traditional Chinese Compendium...
echo Keep this window open while using the site.
echo.

call npm.cmd run dev -- --host 127.0.0.1 --port 4173 --strictPort --open

echo.
echo The local site has stopped.
pause
