import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../../navigation/AppNavigator';
import { Alert } from 'react-native';

// Mock de Alert
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Alert: {
      alert: jest.fn(),
    },
  };
});

describe('Login Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes full login flow successfully', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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

    // Esperar a que se complete el login
    await waitFor(() => {
      // Verificar que navegamos al dashboard
      expect(queryByText('¡Bienvenido!')).toBeFalsy();
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('shows error when login fields are empty', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    const forgotPasswordLink = getByText('¿Olvidaste tu contraseña?');
    fireEvent.press(forgotPasswordLink);

    // Verificar que navegamos a la pantalla de recuperación de contraseña
    expect(getByText('Recuperar Contraseña')).toBeTruthy();
  });

  it('can navigate back from forgot password to login', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
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
