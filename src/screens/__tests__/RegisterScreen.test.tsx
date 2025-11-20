import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import RegisterScreen from '../RegisterScreen';

// Mock de navegación
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

// Los mocks ya están en jest-setup.js global

describe('RegisterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders all register elements correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    expect(getByText('¡Crea tu cuenta!')).toBeTruthy();
    expect(getByText('Completa el formulario para registrarte')).toBeTruthy();
    expect(getByPlaceholderText('Nombre completo')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByPlaceholderText('Número de teléfono')).toBeTruthy();
    expect(getByPlaceholderText('Compañía')).toBeTruthy();
    expect(getByPlaceholderText('Usuario')).toBeTruthy();
    expect(getByPlaceholderText('Contraseña')).toBeTruthy();
    expect(getByPlaceholderText('Confirmar contraseña')).toBeTruthy();
    expect(getByText('Registrarse')).toBeTruthy();
    const loginText = getByText(/¿Ya tienes cuenta?|Inicia sesión/);
    expect(loginText).toBeTruthy();
  });

  it('updates fullName input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    fireEvent.changeText(fullNameInput, 'Juan Pérez');

    expect(fullNameInput.props.value).toBe('Juan Pérez');
  });

  it('updates email input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('updates phone input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Número de teléfono');
    fireEvent.changeText(phoneInput, '3001234567');

    expect(phoneInput.props.value).toBe('3001234567');
  });

  it('updates company input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const companyInput = getByPlaceholderText('Compañía');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');

    expect(companyInput.props.value).toBe('Hospital San Rafael');
  });

  it('updates username input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const usernameInput = getByPlaceholderText('Usuario');
    fireEvent.changeText(usernameInput, 'juanperez');

    expect(usernameInput.props.value).toBe('juanperez');
  });

  it('updates password input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const passwordInput = getByPlaceholderText('Contraseña');
    fireEvent.changeText(passwordInput, 'Password123');

    expect(passwordInput.props.value).toBe('Password123');
  });

  it('updates confirmPassword input correctly', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
    fireEvent.changeText(confirmPasswordInput, 'Password123');

    expect(confirmPasswordInput.props.value).toBe('Password123');
  });

  it('shows alert when fullName is empty', () => {
    const { getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const registerButton = getByText('Registrarse');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa tu nombre completo'
    );
  });

  it('shows alert when email is invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa un correo electrónico válido'
    );
  });

  it('shows alert when phone is invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '123');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa un número de teléfono válido'
    );
  });

  it('shows alert when company is empty', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa el nombre de la compañía'
    );
  });

  it('shows alert when username is empty', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const companyInput = getByPlaceholderText('Compañía');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa un nombre de usuario'
    );
  });

  it('shows alert when password is invalid', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const companyInput = getByPlaceholderText('Compañía');
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');
    fireEvent.changeText(usernameInput, 'juanperez');
    fireEvent.changeText(passwordInput, 'weak');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número'
    );
  });

  it('shows alert when passwords do not match', () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const companyInput = getByPlaceholderText('Compañía');
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');
    fireEvent.changeText(usernameInput, 'juanperez');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password456');
    fireEvent.press(registerButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Las contraseñas no coinciden'
    );
  });

  it('navigates to login screen when registration is successful', async () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const companyInput = getByPlaceholderText('Compañía');
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
    const registerButton = getByText('Registrarse');

    // Cambiar los textos
    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');
    fireEvent.changeText(usernameInput, 'juanperez');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password123');

    // Presionar el botón
    fireEvent.press(registerButton);

    // Esperar a que se complete el registro (setTimeout es de 1500ms)
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Éxito',
        'Registro completado correctamente',
        expect.any(Array)
      );
    }, { timeout: 3000 });
  }, 10000);

  it('shows loading state during registration', async () => {
    const { getByPlaceholderText, getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const fullNameInput = getByPlaceholderText('Nombre completo');
    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const companyInput = getByPlaceholderText('Compañía');
    const usernameInput = getByPlaceholderText('Usuario');
    const passwordInput = getByPlaceholderText('Contraseña');
    const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');
    const registerButton = getByText('Registrarse');

    fireEvent.changeText(fullNameInput, 'Juan Pérez');
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(companyInput, 'Hospital San Rafael');
    fireEvent.changeText(usernameInput, 'juanperez');
    fireEvent.changeText(passwordInput, 'Password123');
    fireEvent.changeText(confirmPasswordInput, 'Password123');
    fireEvent.press(registerButton);

    // Verificar que el botón muestra el estado de carga inmediatamente
    expect(getByText('Registrando...')).toBeTruthy();
  });

  it('navigates back to login when login link is pressed', () => {
    const { getByText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    // Buscar el texto de login
    const loginLink = getByText('Inicia sesión');
    fireEvent.press(loginLink);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('has correct input types and properties', () => {
    const { getByPlaceholderText } = render(
      <RegisterScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const phoneInput = getByPlaceholderText('Número de teléfono');
    const passwordInput = getByPlaceholderText('Contraseña');
    const confirmPasswordInput = getByPlaceholderText('Confirmar contraseña');

    expect(emailInput.props.keyboardType).toBe('email-address');
    expect(emailInput.props.autoCapitalize).toBe('none');
    expect(emailInput.props.autoCorrect).toBe(false);

    expect(phoneInput.props.keyboardType).toBe('phone-pad');
    expect(phoneInput.props.autoCapitalize).toBe('none');

    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(passwordInput.props.autoCapitalize).toBe('none');

    expect(confirmPasswordInput.props.secureTextEntry).toBe(true);
    expect(confirmPasswordInput.props.autoCapitalize).toBe('none');
  });
});

