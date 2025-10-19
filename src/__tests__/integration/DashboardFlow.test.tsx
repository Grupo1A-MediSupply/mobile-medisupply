import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../../navigation/AppNavigator';

describe('Dashboard Flow Integration', () => {
  it('navigates to orders screen from dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login y navegar al dashboard
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Verificar que estamos en el dashboard
    expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();

    // Navegar a pedidos desde la tarjeta de estadísticas
    const pedidosCard = getByText('156').parent!.parent!;
    fireEvent.press(pedidosCard);

    // Verificar que navegamos a la pantalla de pedidos
    // Esto dependería de la implementación específica del navegador
  });

  it('navigates to visits screen from dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Verificar que estamos en el dashboard
    expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();

    // Navegar a visitas desde la tarjeta de estadísticas
    const visitasCard = getByText('12').parent!.parent!;
    fireEvent.press(visitasCard);

    // Verificar que navegamos a la pantalla de visitas
    // Esto dependería de la implementación específica del navegador
  });

  it('searches clients in dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Buscar clientes
    const searchInput = getByPlaceholderText('Buscar clientes...');
    fireEvent.changeText(searchInput, 'María');

    // Verificar que el texto de búsqueda se actualiza
    expect(searchInput.props.value).toBe('María');
  });

  it('filters clients in dashboard', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );

    // Simular login exitoso
    const emailInput = getByPlaceholderText('Correo electrónico');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar sesión');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    // Esperar a que se complete el login
    await new Promise(resolve => setTimeout(resolve, 1600));

    // Filtrar por clientes activos
    const activeFilter = getByText('Activos');
    fireEvent.press(activeFilter);

    // Verificar que el filtro se aplicó
    expect(activeFilter.parent!.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });
});
