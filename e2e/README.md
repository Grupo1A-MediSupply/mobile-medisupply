# Pruebas E2E con Maestro - MediSupply

Pruebas end-to-end usando [Maestro](https://maestro.mobile.dev/) para la app MediSupply.

## ⚠️ IMPORTANTE: Metro debe estar corriendo

**Las pruebas E2E requieren que Metro esté corriendo** porque la app compilada en modo desarrollo necesita Metro para cargar el código JavaScript.

### Iniciar Metro antes de las pruebas:

```powershell
# Terminal 1: Iniciar Metro
npm start

# Terminal 2: Ejecutar pruebas
npm run test:e2e:login
```

## 📋 Requisitos

1. **Maestro instalado** (`npm run install:maestro`)
2. **Java 17+** instalado
3. **Android SDK** con ADB en el PATH
4. **Dispositivo/Emulador** conectado
5. **App compilada** (`npx expo run:android`)
6. **Metro corriendo** (`npm start`)

## 🚀 Ejecutar Pruebas

### Script Principal (Recomendado)

```powershell
# Ejecuta verificaciones y luego las pruebas
npm run test:e2e login-simple.yaml
```

### Pruebas Específicas

```powershell
# Login
npm run test:e2e:login

# Navegación entre tabs
npm run test:e2e:navigation

# Dashboard
npm run test:e2e:dashboard

# Inventario
npm run test:e2e:inventory

# Pedidos
npm run test:e2e:orders
```

### Comando Directo

```powershell
maestro test e2e/login-simple.yaml
```

## 📁 Pruebas Disponibles

- `login-simple.yaml` - Login básico (recomendado)
- `login.yaml` - Login completo con múltiples escenarios
- `navigation.yaml` - Navegación entre tabs
- `dashboard.yaml` - Funcionalidades del Dashboard
- `inventory.yaml` - Gestión de inventario
- `orders.yaml` - Visualización de pedidos

## 🔧 Instalación de Maestro

```powershell
npm run install:maestro
```

O manualmente desde: https://maestro.mobile.dev/getting-started

## 🐛 Solución de Problemas

### "main has not been registered"
**Solución:** Asegúrate de que Metro esté corriendo (`npm start`)

### "Element not found"
**Solución:** Las pruebas usan coordenadas como fallback. Verifica que la app esté compilada correctamente.

### "No device found"
**Solución:** 
```powershell
adb devices  # Verificar dispositivos
npx expo run:android  # Reinstalar app
```

## 📚 Recursos

- [Documentación de Maestro](https://maestro.mobile.dev/)
- [Ejemplos de Pruebas](https://maestro.mobile.dev/examples)
