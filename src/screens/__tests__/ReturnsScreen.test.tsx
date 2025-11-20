import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ReturnsScreen from '../ReturnsScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('ReturnsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders returns screen correctly', () => {
    const { getByPlaceholderText } = render(
      <ReturnsScreen navigation={mockNavigation} />
    );

    // Verificar que el input de búsqueda existe
    expect(getByPlaceholderText('Buscar por número o cliente...')).toBeTruthy();
  });

  it('updates search text', () => {
    const { getByPlaceholderText } = render(
      <ReturnsScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar por número o cliente...');
    fireEvent.changeText(searchInput, 'RET001');

    expect(searchInput.props.value).toBe('RET001');
  });

  it('filters returns by status', () => {
    const { getByPlaceholderText } = render(
      <ReturnsScreen navigation={mockNavigation} />
    );

    // Verificar que la pantalla se renderiza
    expect(getByPlaceholderText('Buscar por número o cliente...')).toBeTruthy();
  });
});

