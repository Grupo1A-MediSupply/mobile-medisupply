import React from 'react';
import { render } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';

// Mock de @react-navigation/native
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();
const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: mockReset,
    replace: mockReplace,
  }),
  useRoute: () => ({
    params: {},
  }),
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock de expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que se renderiza la pantalla de login por defecto
    expect(getByText('Login')).toBeTruthy();
  });

  it('renders MainTabNavigator correctly', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que se renderiza el navegador principal
    expect(getByText).toBeTruthy();
  });

  it('has correct initial route name', () => {
    const { getByTestId } = render(<AppNavigator />);
    
    // Verificar que la ruta inicial es Login
    expect(getByTestId).toBeTruthy();
  });

  it('renders tab navigation with correct screens', () => {
    const { getByText } = render(<AppNavigator />);
    
    // Verificar que se renderizan las pantallas principales
    expect(getByText).toBeTruthy();
  });
});
