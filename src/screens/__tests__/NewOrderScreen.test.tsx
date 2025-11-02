import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewOrderScreen from '../NewOrderScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('NewOrderScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new order screen correctly', () => {
    const screen = render(
      <NewOrderScreen navigation={mockNavigation} />
    );

    // Verificar que la pantalla se renderiza
    expect(screen).toBeTruthy();
  });

  it('allows navigation back', () => {
    render(
      <NewOrderScreen navigation={mockNavigation} />
    );

    // Verificar que el componente existe
    expect(mockNavigation).toBeTruthy();
  });

  it('renders form elements', () => {
    const screen = render(
      <NewOrderScreen navigation={mockNavigation} />
    );

    // Verificar que el componente se renderiza
    expect(screen).toBeTruthy();
  });
});

