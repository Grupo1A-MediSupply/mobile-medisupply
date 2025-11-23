import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ForgotPasswordScreen from '../ForgotPasswordScreen';

const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('ForgotPasswordScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders forgot password screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    expect(getByText('¿Olvidaste tu contraseña?')).toBeTruthy();
    expect(getByPlaceholderText('Correo electrónico')).toBeTruthy();
    expect(getByText('Enviar enlace')).toBeTruthy();
  });

  it('shows alert when email is empty', async () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const sendButton = getByText('Enviar enlace');
    fireEvent.press(sendButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa tu correo electrónico'
    );
  });

  it('sends email when form is filled', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const sendButton = getByText('Enviar enlace');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(sendButton);

    // Verificar que muestra el estado de carga
    expect(getByText('Enviando...')).toBeTruthy();

    // Esperar a que termine el proceso (el setTimeout es de 2000ms)
    // Después de enviar, debería mostrar un Alert informativo
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Información',
        'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña'
      );
    }, { timeout: 3000 });
  });

  it('navigates back to login', () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const backButton = getByText('Volver al login');
    fireEvent.press(backButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('handles resend email after email sent', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const sendButton = getByText('Enviar enlace');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(sendButton);

    // Esperar a que se complete el envío (setTimeout de 2000ms)
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Información',
        'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña'
      );
    }, { timeout: 3000 });

    // Limpiar las llamadas anteriores de Alert
    jest.clearAllMocks();

    // Ahora intentar reenviar
    const resendButton = getByText('Reenviar email');
    fireEvent.press(resendButton);

    // Verificar que muestra el estado de reenvío
    expect(getByText('Reenviando...')).toBeTruthy();

    // Esperar a que se complete el reenvío (setTimeout de 1000ms)
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Información',
        'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña'
      );
    }, { timeout: 2000 });
  });

  it('handles resend email before email sent', async () => {
    const { getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Intentar reenviar sin haber ingresado email primero
    const resendButton = getByText('Reenviar email');
    fireEvent.press(resendButton);

    // Debería mostrar un error porque no hay email
    expect(Alert.alert).toHaveBeenCalledWith(
      'Error',
      'Por favor ingresa tu correo electrónico'
    );
  });

  it('updates email input', () => {
    const { getByPlaceholderText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    fireEvent.changeText(emailInput, 'user@example.com');

    expect(emailInput.props.value).toBe('user@example.com');
  });
});

