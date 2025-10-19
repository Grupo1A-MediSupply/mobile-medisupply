# 🚀 GitHub Actions Pipelines

Este repositorio incluye pipelines automatizados de GitHub Actions para ejecutar pruebas unitarias en los proyectos React Native y Flutter.

## 📋 Workflows Configurados

### 🔄 CI/CD Pipeline Principal
- **Archivo**: `ci.yml`
- **Trigger**: Push y Pull Requests a ramas principales
- **Funciones**:
  - ✅ Tests de React Native
  - ✅ Tests de Flutter
  - ✅ Generación de reportes de cobertura
  - ✅ Artifacts con resultados

### 📱 React Native Tests
- **Archivo**: `react-native-tests.yml`
- **Trigger**: Cambios en `reactMobile/`
- **Funciones**:
  - ✅ Tests unitarios con Jest
  - ✅ Cobertura de código
  - ✅ Comentarios automáticos en PRs
  - ✅ Artifacts con reportes

### 🦋 Flutter Tests
- **Archivo**: `flutter-tests.yml`
- **Trigger**: Cambios en `medisupply-mobile/`
- **Funciones**:
  - ✅ Tests unitarios de Flutter
  - ✅ Análisis de código
  - ✅ Verificación de build

## 🎯 Estado Actual

### ✅ Tests Funcionando
- **React Native**: 27 tests pasando (utilidades)
- **Cobertura**: Configurada y funcionando
- **Tiempo de ejecución**: ~2-3 minutos

### 📊 Métricas
- **Tests de Validación**: 12 tests ✅
- **Tests de Formateo**: 15 tests ✅
- **Cobertura de Código**: Disponible en artifacts

## 🔍 Monitoreo

### Status Badges
Puedes agregar estos badges a tu README principal:

```markdown
![CI/CD Pipeline](https://github.com/Grupo1A-MediSupply/mobile-medisupply/workflows/CI%2FCD%20Pipeline/badge.svg)
![React Native Tests](https://github.com/Grupo1A-MediSupply/mobile-medisupply/workflows/React%20Native%20Tests/badge.svg)
```

### Notificaciones
- ✅ Comentarios automáticos en Pull Requests
- ✅ Reportes de cobertura en artifacts
- ✅ Resúmenes de ejecución en GitHub Actions

## 🛠️ Ejecución Local

Para ejecutar los mismos tests localmente:

```bash
# React Native
cd reactMobile
npm test

# Flutter
cd medisupply-mobile
flutter test
```

## 📈 Próximos Pasos

- ✅ Configurar tests de componentes cuando se implementen
- ✅ Agregar tests de integración
- ✅ Configurar deployment automático
- ✅ Integrar con servicios de calidad de código

---

**Última actualización**: 19 de Octubre de 2024  
**Estado**: ✅ Pipelines configurados y funcionando
