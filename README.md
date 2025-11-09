# MediSupply Mobile App

Una aplicación móvil de React Native para la gestión de suministros médicos, basada en la aplicación web PROTOMOBILE.

## Características

- **Login y Autenticación**: Sistema de inicio de sesión con recuperación de contraseña
- **Dashboard**: Vista general con estadísticas y gestión de clientes
- **Inventario**: Gestión completa de productos médicos con categorías y control de stock
- **Pedidos**: Administración de pedidos con seguimiento de estado
- **Visitas**: Planificación y seguimiento de visitas a clientes con mapa
- **Devoluciones**: Gestión de devoluciones con fotos y seguimiento
- **Nuevo Pedido**: Carrito de compras para crear pedidos

## Tecnologías Utilizadas

- **React Native** con Expo
- **TypeScript** para tipado estático
- **React Navigation** para navegación
- **React Native Vector Icons** para iconografía
- **React Native Linear Gradient** para gradientes
- **React Native Maps** para mapas (configurado pero no implementado)
- **React Native Image Picker** para selección de imágenes

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── constants/           # Constantes y configuraciones
├── navigation/          # Configuración de navegación
├── screens/            # Pantallas de la aplicación
├── types/              # Definiciones de tipos TypeScript
└── utils/              # Utilidades y helpers
```

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Para iOS:
```bash
npm run ios
```

3. Para Android:
```bash
npm run android
```

4. Para Web:
```bash
npm run web
```

## Pantallas Implementadas

### 1. Login Screen
- Formulario de inicio de sesión
- Opción "Recordarme"
- Enlace a recuperación de contraseña
- Diseño tipo iPhone con frame negro

### 2. Forgot Password Screen
- Formulario de recuperación de contraseña
- Confirmación de envío de email
- Opción de reenvío

### 3. Dashboard Screen
- Tarjetas de estadísticas interactivas
- Lista de clientes con filtros
- Visitas rápidas del día
- Búsqueda y filtrado

### 4. Inventory Screen
- Gestión de productos médicos
- Categorías (Medicamentos, Equipos, Insumos, etc.)
- Control de stock con indicadores visuales
- Modal para agregar nuevos productos
- Vista en cuadrícula y tarjetas

### 5. Orders Screen
- Lista de pedidos con estados
- Filtros por estado y prioridad
- Barra de progreso de pedidos
- Acciones rápidas

### 6. Visits Screen
- Mapa de visitas (placeholder)
- Lista de visitas programadas
- Seguimiento de estado
- Navegación a ubicaciones

### 7. Returns Screen
- Gestión de devoluciones
- Subida de fotos
- Estados de procesamiento
- Modal para crear nuevas devoluciones

### 8. New Order Screen
- Carrito de compras
- Selección de productos
- Control de cantidades
- Resumen de pedido

## Diseño

La aplicación replica el diseño de la aplicación web original con:
- Frame de iPhone negro con bordes redondeados
- Gradientes azules y púrpuras
- Status bar personalizado
- Navegación por tabs en la parte inferior
- Componentes con sombras y efectos visuales

## Datos Mock

La aplicación incluye datos de ejemplo para demostrar la funcionalidad:
- 3 clientes de ejemplo
- 3 productos médicos
- Pedidos, visitas y devoluciones de muestra

## Próximos Pasos

- Integración con API real
- Implementación de mapas reales
- Funcionalidad de cámara para fotos
- Persistencia de datos local
- Notificaciones push
- Autenticación real

## Pruebas end-to-end

Se añadió una configuración base con Appium + WebdriverIO. Consulta `docs/e2e-appium.md` para conocer requisitos, generación de builds y comandos disponibles (`npm run test:e2e:android`, `npm run test:e2e:ios`).

## Notas de Desarrollo

- La aplicación está configurada para funcionar con Expo
- Los iconos vectoriales requieren configuración adicional para producción
- Los mapas necesitan configuración de API keys
- La selección de imágenes requiere permisos de cámara/galería
