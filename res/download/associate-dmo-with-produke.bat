@echo off
setlocal

echo.
echo === Associating .dmo with produke.exe (User-level) ===

:: Get full path to produke.exe
set "EXEPATH=%~dp0produke.exe"
if not exist "%EXEPATH%" (
    echo produke.exe not found in this folder!
    pause
    exit /b
)

:: Escape backslashes for Registry format
set "EXEPATH_ESC=%EXEPATH:\=\\%"

:: Kill Explorer to unlock registry keys
echo Killing Explorer to unlock registry entries...
taskkill /F /IM explorer.exe >nul 2>&1

:: Delete user-specific overrides
echo Deleting user-specific overrides for .dmo...
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.dmo" /f >nul 2>&1

:: Register .dmo (User-level)
echo Registering .dmo file association...
reg add "HKCU\Software\Classes\.dmo" /ve /d "produke.dmo" /f >nul 2>&1
reg add "HKCU\Software\Classes\produke.dmo" /ve /d "Duke Nukem 3D Demo File" /f >nul 2>&1
reg add "HKCU\Software\Classes\produke.dmo\DefaultIcon" /ve /d "%EXEPATH_ESC%,1" /f >nul 2>&1
reg add "HKCU\Software\Classes\produke.dmo\shell\open\command" /ve /d "\"%EXEPATH%\" \"%%1\"" /f >nul 2>&1
assoc .dmo=produke.dmo
ftype produke.dmo="%EXEPATH%" "%%1"

:: Clear icon and thumbnail cache
echo Clearing icon and thumbnail cache...
del /A /F /Q "%LocalAppData%\IconCache.db" >nul 2>&1
del /A /F /Q "%LocalAppData%\Microsoft\Windows\Explorer\iconcache*" >nul 2>&1
del /A /F /Q "%LocalAppData%\Microsoft\Windows\Explorer\thumbcache*" >nul 2>&1

:: Restart Explorer
start explorer.exe

echo Associations and icons for .dmo applied successfully (user-level)!
pause