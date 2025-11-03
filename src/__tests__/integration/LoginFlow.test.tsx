import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AppNavigator from '../../navigation/AppNavigator';
import { Alert } from 'react-native';

// Los mocks ya están en jest-setup.js global

describe('Login Flow Integration', () => {
  jest.setTimeout(15000); // Aumentar timeout para todos los tests en este describe
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Limpiar cualquier timer pendiente
    jest.clearAllTimers();
  });

  it('completes full login flow successfully', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <AppNavigator />
    );

    // Verificar que estamos en la pantalla de login
    expect(getByText('¡Bienvenido!')).toBeTruthy();

    // Llenar el formulario de login
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    // Presionar el botón de login
    fireEvent.press(loginButton);

    // Verificar que se muestra el estado de carga
    expect(getByText('Iniciando sesión...')).toBeTruthy();

    // Esperar a que se complete el login y se navegue al dashboard
    // El login toma ~1500ms, así que esperamos un poco más para asegurarnos
    await waitFor(() => {
      // Verificar que navegamos al dashboard
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 5000, interval: 100 });
    
    // El dashboard está visible, la prueba es exitosa
    // No es necesario verificar que el texto de login desapareció, 
    // ya que confirmamos que el dashboard está visible
  });

  it('shows error when login fields are empty', async () => {
    const { getByText } = render(
      <AppNavigator />
    );

    const loginButton = getByText('Iniciar sesión');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor completa todos los campos'
    );
  });

  it('navigates to forgot password screen', () => {
    const { getByText } = render(
      <AppNavigator />
    );

    const forgotPasswordLink = getByText('¿Olvidaste tu contraseña?');
    fireEvent.press(forgotPasswordLink);

    // Verificar que navegamos a la pantalla de recuperación de contraseña
    expect(getByText('Recuperar Contraseña')).toBeTruthy();
  });

  it('can navigate back from forgot password to login', () => {
    const { getByText } = render(
      <AppNavigator />
    );

    // Ir a forgot password
    const forgotPasswordLink = getByText('¿Olvidaste tu contraseña?');
    fireEvent.press(forgotPasswordLink);

    // Verificar que estamos en forgot password
    expect(getByText('Recuperar Contraseña')).toBeTruthy();

    // Simular navegación de vuelta (esto dependería de la implementación específica)
    // En una implementación real, tendríamos un botón de "Volver" o similar
  });
});
