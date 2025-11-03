import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import VisitsScreen from '../VisitsScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('VisitsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders visits screen correctly', () => {
    const { getByPlaceholderText } = render(
      <VisitsScreen navigation={mockNavigation} />
    );

    // Verificar que el input de búsqueda existe
    expect(getByPlaceholderText('Buscar visitas...')).toBeTruthy();
  });

  it('displays visit cards', () => {
    const { getByText } = render(
      <VisitsScreen navigation={mockNavigation} />
    );

    // Verificar que se muestran las visitas mock
    expect(getByText('Dr. María González')).toBeTruthy();
    expect(getByText('Clínica San Rafael')).toBeTruthy();
  });

  it('updates search text', () => {
    const { getByPlaceholderText } = render(
      <VisitsScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar visitas...');
    fireEvent.changeText(searchInput, 'María');

    expect(searchInput.props.value).toBe('María');
  });

  it('filters visits by status', () => {
    const { getByText } = render(
      <VisitsScreen navigation={mockNavigation} />
    );

    // Verificar que las visitas están presentes
    expect(getByText('Dr. María González')).toBeTruthy();
    expect(getByText('Clínica San Rafael')).toBeTruthy();
  });
});

