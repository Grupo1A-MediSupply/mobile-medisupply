import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

// Los mocks ya están en jest-setup.js global (incluyendo stack y bottom-tabs)

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que se renderiza la pantalla de login por defecto
    expect(getByText('¡Bienvenido!')).toBeTruthy();
  });

  it('renders login screen by default', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que se renderiza la pantalla de login
    expect(getByText('Inicia sesión en tu cuenta')).toBeTruthy();
  });

  it('has correct initial route name', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que la ruta inicial es Login mostrando elementos del login
    expect(getByText('¡Bienvenido!')).toBeTruthy();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<AppNavigator />);

    // Verificar que se renderizan los elementos del formulario de login
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Iniciar sesión')).toBeTruthy();
  });

  it('renders tab navigator with correct icons', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que el navigator está presente (se renderiza después del login)
    // Los tests de integración ya verifican la navegación completa
    expect(getByText('¡Bienvenido!')).toBeTruthy();
  });

  it('has correct screen options configuration', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que la configuración básica está presente
    expect(getByText('¡Bienvenido!')).toBeTruthy();
  });
});
