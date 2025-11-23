import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import ClientDetailScreen from '../ClientDetailScreen';
import { Client } from '../../types';
import { MOCK_DATA } from '../../constants';

// Mock de navegación
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock de Linking
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Linking: {
      ...RN.Linking,
      openURL: jest.fn(() => Promise.resolve()),
    },
  };
});

// Mock de cliente
const mockClient: Client = {
  id: '1',
  name: 'Dr. María González',
  email: 'maria.gonzalez@hospital.com',
  phone: '+57 300 123 4567',
  address: 'Calle 123 #45-67, Bogotá',
  status: 'premium',
  nit: '1234567890',
  city: 'Bogotá',
  notes: 'Cliente premium con buen historial',
  latitude: 4.6097,
  longitude: -74.0817,
};

const mockRoute = {
  params: {
    client: mockClient,
  },
};

describe('ClientDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders client detail screen correctly', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Dr. María González')).toBeTruthy();
    expect(getByText(/NIT:/)).toBeTruthy();
    expect(getByText('Información de Contacto')).toBeTruthy();
    expect(getByText('Estadísticas')).toBeTruthy();
    expect(getByText('Acciones Rápidas')).toBeTruthy();
    expect(getByText('Historial de Pedidos')).toBeTruthy();
    expect(getByText('Historial de Visitas')).toBeTruthy();
    expect(getByText('Productos Más Comprados')).toBeTruthy();
    expect(getByText('Notas del Cliente')).toBeTruthy();
  });

  it('displays client contact information', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('maria.gonzalez@hospital.com')).toBeTruthy();
    expect(getByText('Calle 123 #45-67, Bogotá')).toBeTruthy();
  });

  it('displays client statistics', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Total Pedidos')).toBeTruthy();
    expect(getByText('Valor Total')).toBeTruthy();
    expect(getByText('Última Visita')).toBeTruthy();
  });

  it('displays action buttons', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Llamar')).toBeTruthy();
    expect(getByText('WhatsApp')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Crear Pedido')).toBeTruthy();
    expect(getByText('Agendar Visita')).toBeTruthy();
  });

  it('calls phone number when call button is pressed', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const callButton = getByText('Llamar');
    fireEvent.press(callButton);

    expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('tel:'));
  });

  it('opens WhatsApp when WhatsApp button is pressed', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const whatsappButton = getByText('WhatsApp');
    fireEvent.press(whatsappButton);

    expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('wa.me'));
  });

  it('opens email when email button is pressed', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const emailButton = getByText('Email');
    fireEvent.press(emailButton);

    expect(Linking.openURL).toHaveBeenCalledWith(expect.stringContaining('mailto:'));
  });

  it('navigates to NewOrder when create order button is pressed', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const createOrderButton = getByText('Crear Pedido');
    fireEvent.press(createOrderButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('NewOrder', { clientId: mockClient.id });
  });

  it('navigates to Visits when schedule visit button is pressed', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const scheduleVisitButton = getByText('Agendar Visita');
    fireEvent.press(scheduleVisitButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Visits', { clientId: mockClient.id });
  });

  it('displays orders history', async () => {
    const { getAllByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      const orders = getAllByText(/Pedido #/);
      expect(orders.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  it('displays visits history', async () => {
    const { getAllByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      const visits = getAllByText(/Visita #/);
      expect(visits.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  it('displays top products', async () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Mascarillas N95')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('displays map placeholder when client has location', () => {
    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Ubicación')).toBeTruthy();
    expect(getByText(/Mapa aquí/)).toBeTruthy();
  });

  it('handles client without location', () => {
    const clientWithoutLocation: Client = {
      ...mockClient,
      latitude: undefined,
      longitude: undefined,
    };

    const routeWithoutLocation = {
      params: {
        client: clientWithoutLocation,
      },
    };

    const { queryByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={routeWithoutLocation} />
    );

    // No debería mostrar la sección de ubicación
    expect(queryByText('Ubicación')).toBeFalsy();
  });

  it('handles client without notes', () => {
    const clientWithoutNotes: Client = {
      ...mockClient,
      notes: undefined,
    };

    const routeWithoutNotes = {
      params: {
        client: clientWithoutNotes,
      },
    };

    const { getByText } = render(
      <ClientDetailScreen navigation={mockNavigation} route={routeWithoutNotes} />
    );

    expect(getByText('No hay notas registradas')).toBeTruthy();
  });
});

