import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import NewOrderScreen from '../NewOrderScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    clientId: '1',
  },
};

describe('NewOrderScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new order screen correctly', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Resumen del Pedido')).toBeTruthy();
    expect(getByText('Productos Disponibles')).toBeTruthy();
  });

  it('displays order summary with client information', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Resumen del Pedido')).toBeTruthy();
    expect(getByText('Cliente')).toBeTruthy();
  });

  it('displays products list', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Productos Disponibles')).toBeTruthy();
  });

  it('renders products list', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que los productos se muestran
    expect(getByText('Productos Disponibles')).toBeTruthy();
  });

  it('renders order summary', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que el resumen se muestra
    expect(getByText('Resumen del Pedido')).toBeTruthy();
  });

  it('renders create order button', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que el botón de crear pedido existe
    const createButton = getByText(/Crear Pedido/);
    expect(createButton).toBeTruthy();
  });

  it('navigates back when cancel button is pressed', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    const cancelButton = getByText('Cancelar');
    fireEvent.press(cancelButton);

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('displays product information', () => {
    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que se muestra información de productos
    expect(getByText('Productos Disponibles')).toBeTruthy();
  });

  it('handles route without clientId', () => {
    const routeWithoutClient = {
      params: {},
    };

    const { getByText } = render(
      <NewOrderScreen navigation={mockNavigation} route={routeWithoutClient} />
    );

    expect(getByText('Resumen del Pedido')).toBeTruthy();
  });
});

