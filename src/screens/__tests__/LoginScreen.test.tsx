import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';

// Mock de navegación
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

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

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all login elements correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('¡Bienvenido!')).toBeTruthy();
    expect(getByText('Inicia sesión en tu cuenta')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByText('Recordarme')).toBeTruthy();
    expect(getByText('¿Olvidaste tu contraseña?')).toBeTruthy();
    expect(getByText('Iniciar sesión')).toBeTruthy();
    expect(getByText('¿No tienes cuenta?')).toBeTruthy();
    expect(getByText('Regístrate aquí')).toBeTruthy();
  });

  it('updates email input correctly', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('updates password input correctly', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText('Contraseña');
    fireEvent.changeText(passwordInput, 'password123');

    expect(passwordInput.props.value).toBe('password123');
  });

  it('toggles remember me checkbox', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const rememberMeText = getByText('Recordarme');
    fireEvent.press(rememberMeText.parent!);

    // Verificar que el checkbox cambió de estado
    expect(rememberMeText.parent!.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('shows alert when login button is pressed with empty fields', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const loginButton = getByText('Iniciar sesión');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor completa todos los campos'
    );
  });

  it('shows alert when email is empty', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor completa todos los campos'
    );
  });

  it('shows alert when password is empty', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor completa todos los campos'
    );
  });

  it('navigates to main screen when login is successful', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el setTimeout del login
    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Main');
    }, { timeout: 2000 });
  });

  it('shows loading state during login', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónicoTh');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Verificar que el botón muestra el estado de carga
    expect(getByText('Iniciando sesión...')).toBeTruthy();
  });

  it('navigates to forgot password screen when forgot password is pressed', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const forgotPasswordLink = getByText('¿Olvidaste tu contraseña?');
    fireEvent.press(forgotPasswordLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('ForgotPassword');
  });

  it('disables login button during loading', async () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Verificar que el botón está deshabilitado durante la carga
    expect(loginButton.parent!.props.disabled).toBe(true);
  });

  it('has correct input types and properties', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');

    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(emailInput.props.autoCapitalize).toBe('none');
    expect(emailInput.props.autoCorrect).toBe(false);

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(passwordInput.props.autoCapitalize).toBe('none');
  });
});
