#!/usr/bin/env node

/**
 * Script principal para ejecutar pruebas E2E con Maestro
 * Verifica requisitos y ejecuta las pruebas
 */

const { execSync } = require('child_process');
const path = require('path');

function runCommand(command, options = {}) {
  try {
    execSync(command, { encoding: 'utf8', stdio: 'inherit', ...options });
    return true;
  } catch {
    return false;
  }
}

function checkADB() {
  if (!runCommand('adb version', { stdio: 'pipe' })) {
    console.error('❌ ADB no está instalado');
    process.exit(1);
  }
  console.log('✅ ADB disponible');
}

function checkDevices() {
  try {
    const output = execSync('adb devices', { encoding: 'utf8' });
    const devices = output.split('\n').filter(line => 
      line.includes('device') && !line.includes('List of devices')
    );
    if (devices.length === 0) {
      console.error('❌ No hay dispositivos conectados');
      process.exit(1);
    }
    console.log(`✅ ${devices.length} dispositivo(s) conectado(s)`);
  } catch {
    console.error('❌ Error al verificar dispositivos');
    process.exit(1);
  }
}

function checkMaestro() {
  if (!runCommand('maestro --version', { stdio: 'pipe' })) {
    console.error('❌ Maestro no está instalado. Ejecuta: npm run install:maestro');
    process.exit(1);
  }
  console.log('✅ Maestro disponible');
}

function runTests(testFile) {
  const testPath = path.join(__dirname, '..', 'e2e', testFile);
  console.log(`\n🚀 Ejecutando: ${testFile}\n`);
  const success = runCommand(`maestro test "${testPath}"`);
  process.exit(success ? 0 : 1);
}

// Obtener archivo de prueba desde argumentos
const testFile = process.argv[2] || 'login-simple.yaml';

console.log('📱 Verificando requisitos para pruebas E2E\n');
checkADB();
checkDevices();
checkMaestro();
runTests(testFile);

