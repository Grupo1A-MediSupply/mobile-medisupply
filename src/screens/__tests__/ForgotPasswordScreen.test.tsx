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
    const { getByPlaceholderText, getByText, queryByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Correo electrónico');
    const sendButton = getByText('Enviar enlace');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(sendButton);

    expect(getByText('Enviando...')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('¡Email enviado!')).toBeTruthy();
      expect(getByText(/Hemos enviado un enlace de recuperación a test@example.com/)).toBeTruthy();
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

    // Esperar a que se envíe el email
    await waitFor(() => {
      expect(getByText('¡Email enviado!')).toBeTruthy();
    }, { timeout: 3000 });

    // Ahora intentar reenviar
    const resendButton = getByText('Reenviar email');
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Email reenviado correctamente');
    }, { timeout: 2000 });
  });

  it('handles resend email before email sent', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordScreen navigation={mockNavigation} />
    );

    // Intentar reenviar sin haber enviado primero
    const resendButton = getByText('Reenviar email');
    fireEvent.press(resendButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Éxito', 'Email reenviado correctamente');
    }, { timeout: 2000 });
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

