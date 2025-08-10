# Este script automatiza la instalación de dependencias, la compilación del proyecto y el despliegue en Surge.sh

# --- PASO 1: VERIFICAR LA EXISTENCIA DE ARCHIVOS CLAVE ---
if (-not (Test-Path -Path "package.json")) {
    Write-Host "Error: No se encontró el archivo package.json. Asegúrate de estar en la carpeta raíz del proyecto." -ForegroundColor Red
    return
}

# --- PASO 2: INSTALAR DEPENDENCIAS ---
Write-Host "Paso 1 de 3: Instalando las dependencias del proyecto..." -ForegroundColor Cyan
Write-Host "Ejecutando el comando: npm install" -ForegroundColor Green
try {
    npm install
}
catch {
    Write-Host "Error: Fallo al instalar las dependencias. Verifica tu conexión a internet o los permisos." -ForegroundColor Red
    return
}

# --- PASO 3: EJECUTAR EL COMANDO DE COMPILACIÓN (BUILD) ---
Write-Host "`nPaso 2 de 3: Compilando el proyecto..." -ForegroundColor Cyan
Write-Host "Ejecutando el comando: npm run build" -ForegroundColor Green
try {
    npm run build
}
catch {
    Write-Host "Error: Fallo en la compilación del proyecto. Revisa el archivo de registro para más detalles." -ForegroundColor Red
    return
}

# --- PASO 4: DESPLEGAR EN SURGE ---
Write-Host "`nPaso 3 de 3: Desplegando el proyecto en Surge.sh..." -ForegroundColor Cyan

# Define la carpeta de salida (commonmente 'dist' o 'build' con Vite)
$buildFolder = "dist"

if (-not (Test-Path -Path $buildFolder)) {
    Write-Host "Error: La carpeta '$buildFolder' no se encontró después de la compilación." -ForegroundColor Red
    return
}

Write-Host "Ejecutando el comando: surge" -ForegroundColor Green
try {
    # Navega a la carpeta de compilación para el despliegue
    Set-Location $buildFolder

    # Ejecuta el comando de surge
    surge

    # Vuelve a la carpeta raíz del proyecto
    Set-Location ..
}
catch {
    Write-Host "Error: Fallo en el despliegue a Surge.sh. Asegúrate de estar logeado." -ForegroundColor Red
    return
}

Write-Host "`n¡Proceso completado exitosamente!" -ForegroundColor Green
Write-Host "Si no hubo errores, tu proyecto ha sido desplegado en Surge." -ForegroundColor Green   --powershell -ExecutionPolicy Bypass -File .\full_deploy.ps1