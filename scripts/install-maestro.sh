#!/bin/bash
# Script para instalar Maestro en macOS/Linux
# Ejecuta este script con: bash scripts/install-maestro.sh

echo "📦 Instalando Maestro..."

# Descargar e instalar Maestro
curl -Ls "https://get.maestro.mobile.dev" | bash

if [ $? -eq 0 ]; then
    echo "✅ Maestro instalado correctamente"
    echo ""
    echo "Verifica la instalación con:"
    echo "  maestro --version"
    echo ""
    echo "Si el comando no funciona, cierra y vuelve a abrir la terminal"
else
    echo "❌ Error al instalar Maestro"
    echo ""
    echo "Instalación manual:"
    echo "1. Visita: https://maestro.mobile.dev/getting-started"
    echo "2. Sigue las instrucciones para tu sistema operativo"
    exit 1
fi


