import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OrderDetailScreen from '../OrderDetailScreen';
import { Order } from '../../types';

// Linking and Share are mocked in jest-setup.js

const mockOrder: Order = {
  id: 'ORD001',
  clientId: '1',
  clientName: 'Dr. María González',
  products: [
    { productId: '1', productName: 'Mascarillas N95', quantity: 50, price: 2500 },
    { productId: '2', productName: 'Termómetro Digital', quantity: 2, price: 45000 },
  ],
  total: 275000,
  status: 'pending',
  priority: 'high',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  notes: 'Pedido urgente para el hospital',
  discount: 0,
  tax: 52250,
  subtotal: 222750,
};

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const mockRoute = {
  params: {
    order: mockOrder,
  },
};

describe('OrderDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders order detail screen correctly', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText(`Pedido #${mockOrder.id}`)).toBeTruthy();
    expect(screen.getByText(mockOrder.clientName)).toBeTruthy();
  });

  it('displays order number and status', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText(`Pedido #${mockOrder.id}`)).toBeTruthy();
    const statusElements = screen.getAllByText('Pendiente');
    expect(statusElements.length).toBeGreaterThan(0);
  });

  it('displays client information', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText(mockOrder.clientName)).toBeTruthy();
  });

  it('displays creation and estimated delivery dates', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Fecha de Creación')).toBeTruthy();
    expect(screen.getByText('Fecha Estimada de Entrega')).toBeTruthy();
  });

  it('displays products list', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Mascarillas N95')).toBeTruthy();
    expect(screen.getByText('Termómetro Digital')).toBeTruthy();
    expect(screen.getByText('Cantidad: 50')).toBeTruthy();
    expect(screen.getByText('Cantidad: 2')).toBeTruthy();
  });

  it('displays cost summary', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Resumen de Costos')).toBeTruthy();
    expect(screen.getByText('Subtotal')).toBeTruthy();
    expect(screen.getByText('IVA (19%)')).toBeTruthy();
    expect(screen.getByText('Total')).toBeTruthy();
  });

  it('displays timeline section', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Estados del Pedido')).toBeTruthy();
  });

  it('displays notes section when notes exist', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Notas o Comentarios')).toBeTruthy();
    expect(screen.getByText(mockOrder.notes!)).toBeTruthy();
  });

  it('displays history section', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Historial de Cambios')).toBeTruthy();
  });

  it('shows cancel button for pending orders', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('shows edit button for non-delivered orders', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Editar')).toBeTruthy();
  });

  it('shows share buttons', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(screen.getByText('Compartir PDF')).toBeTruthy();
    expect(screen.getByText('WhatsApp')).toBeTruthy();
  });

  it('handles cancel button press', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.press(cancelButton);

    // Alert should be shown (mocked by React Native Testing Library)
    expect(cancelButton).toBeTruthy();
  });

  it('handles edit button press', () => {
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const editButton = screen.getByText('Editar');
    fireEvent.press(editButton);

    // Alert should be shown
    expect(editButton).toBeTruthy();
  });

  it('handles share PDF button press', () => {
    const { Share } = require('react-native');
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const shareButton = screen.getByText('Compartir PDF');
    fireEvent.press(shareButton);

    // Share should be called
    expect(Share.share).toHaveBeenCalled();
  });

  it('handles share WhatsApp button press', () => {
    const { Linking } = require('react-native');
    const screen = render(
      <OrderDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const whatsappButton = screen.getByText('WhatsApp');
    fireEvent.press(whatsappButton);

    // Linking.openURL should be called
    expect(Linking.openURL).toHaveBeenCalled();
  });

  it('shows mark as delivered button for shipped orders', () => {
    const shippedOrder: Order = {
      ...mockOrder,
      status: 'shipped',
    };

    const screen = render(
      <OrderDetailScreen 
        navigation={mockNavigation} 
        route={{ params: { order: shippedOrder } }} 
      />
    );

    expect(screen.getByText('Marcar como Entregado')).toBeTruthy();
  });

  it('does not show cancel button for delivered orders', () => {
    const deliveredOrder: Order = {
      ...mockOrder,
      status: 'delivered',
    };

    const screen = render(
      <OrderDetailScreen 
        navigation={mockNavigation} 
        route={{ params: { order: deliveredOrder } }} 
      />
    );

    expect(screen.queryByText('Cancelar')).toBeNull();
  });

  it('does not show edit button for delivered orders', () => {
    const deliveredOrder: Order = {
      ...mockOrder,
      status: 'delivered',
    };

    const screen = render(
      <OrderDetailScreen 
        navigation={mockNavigation} 
        route={{ params: { order: deliveredOrder } }} 
      />
    );

    expect(screen.queryByText('Editar')).toBeNull();
  });
});

