@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "WRAPPER_DIR=%SCRIPT_DIR%.mvn\wrapper"
set "MAVEN_VERSION=3.9.9"
set "MAVEN_BASE=apache-maven-%MAVEN_VERSION%"
set "ZIP_FILE=%WRAPPER_DIR%\%MAVEN_BASE%-bin.zip"
set "MAVEN_HOME=%WRAPPER_DIR%\%MAVEN_BASE%"
set "MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if not exist "%WRAPPER_DIR%" (
  mkdir "%WRAPPER_DIR%"
)

if not exist "%MVN_CMD%" (
  echo Downloading Maven %MAVEN_VERSION%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip' -OutFile '%ZIP_FILE%'"
  if errorlevel 1 (
    echo Failed to download Maven distribution.
    exit /b 1
  )

  echo Extracting Maven...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%ZIP_FILE%' -DestinationPath '%WRAPPER_DIR%' -Force"
  if errorlevel 1 (
    echo Failed to extract Maven distribution.
    exit /b 1
  )
)

call "%MVN_CMD%" %*
exit /b %ERRORLEVEL%
