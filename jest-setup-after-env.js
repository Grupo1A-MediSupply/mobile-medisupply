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
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
       args[0].includes('TurboModuleRegistry.getEnforcing') ||
       args[0].includes('DevMenu') ||
       args[0].includes('Invariant Violation'))
    ) {
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
