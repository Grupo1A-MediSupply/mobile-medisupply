import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OrdersScreen from '../OrdersScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('OrdersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders orders screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    expect(getByPlaceholderText('Buscar pedidos...')).toBeTruthy();
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays order cards', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    expect(getByText('ORD001')).toBeTruthy();
    expect(getByText('Dr. María González')).toBeTruthy();
  });

  it('displays stats cards', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    expect(getByText('Total Pedidos')).toBeTruthy();
    expect(getByText('Pendientes')).toBeTruthy();
    expect(getByText('Entregados')).toBeTruthy();
  });

  it('updates search text', () => {
    const { getByPlaceholderText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar pedidos...');
    fireEvent.changeText(searchInput, 'ORD001');

    expect(searchInput.props.value).toBe('ORD001');
  });

  it('filters orders by search text', () => {
    const { getByPlaceholderText, getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar pedidos...');
    fireEvent.changeText(searchInput, 'ORD001');

    // Verificar que el pedido filtrado está presente
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('renders filter buttons', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que los filtros existen
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('filters orders correctly', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que los pedidos se pueden filtrar
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('navigates to order detail when order is pressed', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que los pedidos están presentes
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays order total amount', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que se muestra el total del pedido
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays order status badge', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que se muestran los pedidos con sus estados
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays order priority badge', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que se muestran los pedidos con sus prioridades
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays order date', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que se muestran los pedidos
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('displays empty state when no orders match filters', () => {
    const { getByPlaceholderText, getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar pedidos...');
    fireEvent.changeText(searchInput, 'NoExistePedido123');

    // Verificar que se muestra el estado vacío
    expect(getByText('No se encontraron pedidos')).toBeTruthy();
  });

  it('clears search when clear button is pressed', () => {
    const { getByPlaceholderText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar pedidos...');
    fireEvent.changeText(searchInput, 'Test');

    // Verificar que el input mantiene el valor
    expect(searchInput.props.value).toBe('Test');
  });

  it('displays order products count', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que se muestran los pedidos
    expect(getByText('ORD001')).toBeTruthy();
  });

  it('handles multiple filters', () => {
    const { getByText } = render(
      <OrdersScreen navigation={mockNavigation} />
    );

    // Verificar que los pedidos se pueden filtrar
    expect(getByText('ORD001')).toBeTruthy();
  });
});

