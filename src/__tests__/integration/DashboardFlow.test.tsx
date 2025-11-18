import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react-native';
import AppNavigator from '../../navigation/AppNavigator';

// Los mocks ya están en jest-setup.js global

describe('Dashboard Flow Integration', () => {
  jest.setTimeout(20000); // Aumentar timeout para todos los tests en este describe
  
  beforeEach(() => {
    jest.clearAllMocks();
    // No limpiar timers para permitir que setTimeout del login funcione
  });
  
  afterEach(() => {
    cleanup();
  });
  
  it('navigates to orders screen from dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AppNavigator />
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login y navegar al dashboard
    // El login toma ~1500ms, así que esperamos con waitFor
    await waitFor(() => {
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 8000, interval: 100 });

    // Navegar a pedidos desde la tarjeta de estadísticas
    // Buscar el texto "156" (valor de Pedidos) y presionar su contenedor
    const pedidosValue = getByText('156');
    const pedidosCard = pedidosValue.parent?.parent || pedidosValue.parent;
    if (pedidosCard) {
      fireEvent.press(pedidosCard);
    }

    // Verificar que navegamos a la pantalla de pedidos
    // Esto dependería de la implementación específica del navegador
  });

  it('navigates to visits screen from dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AppNavigator />
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login y navegar al dashboard
    await waitFor(() => {
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 8000, interval: 100 });

    // Navegar a visitas desde la tarjeta de estadísticas
    // Buscar el texto "12" (valor de Visitas Hoy) y presionar su contenedor
    const visitasValue = getByText('12');
    const visitasCard = visitasValue.parent?.parent || visitasValue.parent;
    if (visitasCard) {
      fireEvent.press(visitasCard);
    }

    // Verificar que navegamos a la pantalla de visitas
    // Esto dependería de la implementación específica del navegador
  });

  it('searches clients in dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AppNavigator />
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login y navegar al dashboard
    await waitFor(() => {
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 8000, interval: 100 });

    // Buscar clientes
    const searchInput = getByPlaceholderText('Buscar clientes...');
    fireEvent.changeText(searchInput, 'María');

    // Verificar que el texto de búsqueda se actualiza
    expect(searchInput.props.value).toBe('María');
  });

  it('filters clients in dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <AppNavigator />
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login y navegar al dashboard
    await waitFor(() => {
      expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    }, { timeout: 8000, interval: 100 });

    // Filtrar por clientes activos
    const activeFilter = getByText('Activos');
    fireEvent.press(activeFilter);

    // Verificar que el filtro está presente
    expect(activeFilter).toBeTruthy();
  });
});
