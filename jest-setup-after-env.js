// Configuración adicional para React Native Testing Library

// Agregar SafeAreaView al mock de react-native que el preset proporciona
const ReactNative = require('react-native');
if (ReactNative && !ReactNative.SafeAreaView) {
  ReactNative.SafeAreaView = ReactNative.View;
}

// Asegurar que Alert esté disponible en react-native
const mockAlert = jest.fn();
if (ReactNative && !ReactNative.Alert) {
  ReactNative.Alert = {
    alert: mockAlert,
  };
} else if (ReactNative && ReactNative.Alert && !ReactNative.Alert.alert) {
  ReactNative.Alert.alert = mockAlert;
}

// Suprimir warnings específicos
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    // Convertir todos los argumentos a string para buscar
    const errorMessage = args.map(arg => 
      typeof arg === 'string' ? arg : (typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg))
    ).join(' ');
    
    // Lista de patrones a ignorar
    const ignoredPatterns = [
      'Warning: ReactDOM.render',
      'Not implemented: HTMLFormElement.prototype.submit',
      'TurboModuleRegistry.getEnforcing',
      'DevMenu',
      'Invariant Violation',
    ];
    
    // Patrones específicos para advertencias de act() con Animated
    const actWarningPatterns = [
      'An update to Animated',
      'inside a test was not wrapped in act',
      'was not wrapped in act(...)',
      'When testing, code that causes React state updates should be wrapped into act',
    ];
    
    // Verificar si el mensaje contiene alguno de los patrones ignorados
    const shouldIgnore = ignoredPatterns.some(pattern => errorMessage.includes(pattern)) ||
      actWarningPatterns.some(pattern => errorMessage.includes(pattern));
    
    if (shouldIgnore) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Animated: `useNativeDriver`') ||
       args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Limpiar timers después de cada test para evitar que se queden colgados
afterEach(() => {
  // Limpiar todos los timers pendientes
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  }
  // Asegurar que estamos usando timers reales al final de cada test
  jest.useRealTimers();
});