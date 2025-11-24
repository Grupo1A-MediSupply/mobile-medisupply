# Instalar Maestro en Windows
Write-Host "Instalando Maestro..." -ForegroundColor Cyan

$maestroDir = "$env:USERPROFILE\maestro"
$zipPath = "$env:TEMP\maestro.zip"

if (-not (Test-Path $maestroDir)) {
    New-Item -ItemType Directory -Path $maestroDir -Force | Out-Null
}

try {
    $downloadUrl = "https://github.com/mobile-dev-inc/maestro/releases/latest/download/maestro.zip"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing
    Expand-Archive -Path $zipPath -DestinationPath $maestroDir -Force
    
    $maestroExe = Get-ChildItem -Path $maestroDir -Recurse -Filter "maestro.bat" -ErrorAction SilentlyContinue | Select-Object -First 1
    
    if ($maestroExe) {
        $binDir = $maestroExe.DirectoryName
        $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
        
        if ($currentPath -notlike "*$binDir*") {
            $newPath = $currentPath + ";" + $binDir
            [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
            Write-Host "✅ Maestro instalado y agregado al PATH" -ForegroundColor Green
            Write-Host "⚠️  Cierra y vuelve a abrir PowerShell" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Maestro ya está en el PATH" -ForegroundColor Green
        }
    }
    
    Remove-Item $zipPath -ErrorAction SilentlyContinue
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "Instalación manual: https://maestro.mobile.dev/getting-started" -ForegroundColor Yellow
    exit 1
}
