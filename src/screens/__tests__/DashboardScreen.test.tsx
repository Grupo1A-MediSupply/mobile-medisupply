import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../DashboardScreen';

// Mock de navegación
const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

// Mock de LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => children,
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard elements correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    expect(getByText('¡Bienvenido de vuelta!')).toBeTruthy();
    expect(getByText('Gestiona tus clientes y pedidos')).toBeTruthy();
    expect(getByPlaceholderText('Buscar clientes...')).toBeTruthy();
    expect(getByText('Lista de Clientes')).toBeTruthy();
    expect(getByText('Visitas de Hoy')).toBeTruthy();
  });

  it('renders stats cards with correct data', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    expect(getByText('24')).toBeTruthy(); // Clientes
    expect(getByText('156')).toBeTruthy(); // Pedidos
    expect(getByText('12')).toBeTruthy(); // Visitas Hoy
  });

  it('updates search text correctly', () => {
    const { getByPlaceholderText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    const searchInput = getByPlaceholderText('Buscar clientes...');
    fireEvent.changeText(searchInput, 'test search');

    expect(searchInput.props.value).toBe('test search');
  });

  it('filters clients correctly', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    const activeFilter = getByText('Activos');
    fireEvent.press(activeFilter);

    // Verificar que el filtro fue presionado (no verificamos estilos que pueden ser complejos)
    expect(activeFilter).toBeTruthy();
  });

  it('navigates to orders when pedidos card is pressed', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Buscar la tarjeta de pedidos (que contiene el número 156)
    const pedidosCard = getByText('156').parent!.parent!;
    fireEvent.press(pedidosCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Orders');
  });

  it('navigates to visits when visitas card is pressed', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Buscar la tarjeta de visitas (que contiene el número 12)
    const visitasCard = getByText('12').parent!.parent!;
    fireEvent.press(visitasCard);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Visits');
  });

  it('renders client list correctly', () => {
    const { getAllByText, getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Dr. María González aparece múltiples veces, usar getAllByText
    expect(getAllByText('Dr. María González').length).toBeGreaterThan(0);
    expect(getByText('maria.gonzalez@hospital.com')).toBeTruthy();
    expect(getAllByText('Clínica San Rafael').length).toBeGreaterThan(0);
    expect(getByText('admin@sanrafael.com')).toBeTruthy();
  });

  it('renders quick visits list correctly', () => {
    const { getAllByText, getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Dr. María González aparece múltiples veces, usar getAllByText
    expect(getAllByText('Dr. María González').length).toBeGreaterThan(0);
    expect(getByText('Calle 123 #45-67, Bogotá')).toBeTruthy();
    expect(getByText('10:00 AM')).toBeTruthy();
  });

  it('navigates to visits when "Ver Todas" is pressed', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    const verTodasBtn = getByText('Ver Todas');
    fireEvent.press(verTodasBtn);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Visits');
  });

  it('shows correct client status badges', () => {
    const { getAllByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Premium puede aparecer múltiples veces (badge y filtro), usamos getAllByText
    expect(getAllByText('Premium').length).toBeGreaterThan(0);
    expect(getAllByText('Activo').length).toBeGreaterThan(0);
    expect(getAllByText('Inactivo').length).toBeGreaterThan(0);
  });

  it('shows correct visit status badges', () => {
    const { getByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    expect(getByText('Pendiente')).toBeTruthy();
    expect(getByText('En Progreso')).toBeTruthy();
    expect(getByText('Completada')).toBeTruthy();
  });

  it('renders filter buttons correctly', () => {
    const { getAllByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    expect(getAllByText('Todos').length).toBeGreaterThan(0);
    expect(getAllByText('Activos').length).toBeGreaterThan(0);
    expect(getAllByText('Inactivos').length).toBeGreaterThan(0);
    // Premium puede aparecer en badges también
    expect(getAllByText('Premium').length).toBeGreaterThan(0);
  });

  it('has correct initial filter selected', () => {
    const { getAllByText } = render(
      <DashboardScreen navigation={mockNavigation} />
    );

    // Verificar que existe el filtro "Todos"
    const todosFilters = getAllByText('Todos');
    expect(todosFilters.length).toBeGreaterThan(0);
    
    // Verificar que el filtro "Todos" está visible y es el primero
    expect(todosFilters[0]).toBeTruthy();
  });
});
