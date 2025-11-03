import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatsCard from '../StatsCard';
import { StatsCard as StatsCardType } from '../../types';

// Los mocks ya están en jest-setup.js global

describe('StatsCard Component', () => {
  const mockCard: StatsCardType = {
    title: 'Clientes',
    value: '24',
    icon: 'people',
    color: '#007AFF',
  };

  it('renders correctly with all props', () => {
    const { getByText, getByTestId } = render(
      <StatsCard card={mockCard} />
    );

    expect(getByText('24')).toBeTruthy();
    expect(getByText('Clientes')).toBeTruthy();
  });

  it('renders without onPress handler', () => {
    const { getByText } = render(
      <StatsCard card={mockCard} />
    );

    expect(getByText('24')).toBeTruthy();
    expect(getByText('Clientes')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <StatsCard card={mockCard} onPress={mockOnPress} />
    );

    const touchable = getByTestId('stats-card-touchable');
    fireEvent.press(touchable);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <StatsCard card={mockCard} style={customStyle} />
    );

    // El estilo se aplica al TouchableOpacity, no al container interno
    const touchable = getByTestId('stats-card-touchable');
    const styles = Array.isArray(touchable.props.style) 
      ? touchable.props.style 
      : [touchable.props.style];
    const hasCustomStyle = styles.some((style: any) => 
      style && style.marginTop === 20
    );
    expect(hasCustomStyle).toBe(true);
  });

  it('renders different card data correctly', () => {
    const differentCard: StatsCardType = {
      title: 'Pedidos',
      value: '156',
      icon: 'shopping-cart',
      color: '#28a745',
    };

    const { getByText } = render(
      <StatsCard card={differentCard} />
    );

    expect(getByText('156')).toBeTruthy();
    expect(getByText('Pedidos')).toBeTruthy();
  });

  it('renders numeric values correctly', () => {
    const numericCard: StatsCardType = {
      title: 'Visitas Hoy',
      value: 12,
      icon: 'location-on',
      color: '#FFA500',
    };

    const { getByText } = render(
      <StatsCard card={numericCard} />
    );

    expect(getByText('12')).toBeTruthy();
  });

  it('handles empty title gracefully', () => {
    const emptyTitleCard: StatsCardType = {
      title: '',
      value: '0',
      icon: 'help',
      color: '#6c757d',
    };

    const { getByText } = render(
      <StatsCard card={emptyTitleCard} />
    );

    expect(getByText('0')).toBeTruthy();
  });

  it('handles zero value correctly', () => {
    const zeroCard: StatsCardType = {
      title: 'Sin datos',
      value: 0,
      icon: 'info',
      color: '#6c757d',
    };

    const { getByText } = render(
      <StatsCard card={zeroCard} />
    );

    expect(getByText('0')).toBeTruthy();
  });
});
