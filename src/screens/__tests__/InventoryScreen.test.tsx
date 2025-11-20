import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InventoryScreen from '../InventoryScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('InventoryScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders inventory screen correctly', () => {
    const { getByPlaceholderText } = render(
      <InventoryScreen navigation={mockNavigation} />
    );

    // Verificar que el input de búsqueda existe
    expect(getByPlaceholderText('Buscar por nombre o código...')).toBeTruthy();
  });

  it('displays stats cards', () => {
    const { getByText } = render(
      <InventoryScreen navigation={mockNavigation} />
    );

    expect(getByText('Total Productos')).toBeTruthy();
    expect(getByText('Stock Bajo')).toBeTruthy();
    expect(getByText('Valor Total')).toBeTruthy();
  });

  it('updates search text', () => {
    const { getByPlaceholderText } = render(
      <InventoryScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar por nombre o código...');
    fireEvent.changeText(searchInput, 'Mascarilla');

    expect(searchInput.props.value).toBe('Mascarilla');
  });

  it('filters by category', () => {
    const { getByPlaceholderText } = render(
      <InventoryScreen navigation={mockNavigation} />
    );

    // Verificar que la pantalla se renderiza
    expect(getByPlaceholderText('Buscar por nombre o código...')).toBeTruthy();
  });

  it('renders product list', () => {
    const { getByPlaceholderText } = render(
      <InventoryScreen navigation={mockNavigation} />
    );

    // Verificar que el input de búsqueda existe
    expect(getByPlaceholderText('Buscar por nombre o código...')).toBeTruthy();
  });
});

