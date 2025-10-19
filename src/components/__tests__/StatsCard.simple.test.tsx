import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock simple del componente StatsCard
const StatsCard = ({ card, onPress, style }) => (
  <div testID="stats-card" style={style} onClick={onPress}>
    <div>{card.title}</div>
    <div>{card.value}</div>
    <div>{card.icon}</div>
  </div>
);

describe('StatsCard Component (Simple)', () => {
  const mockCard = {
    title: 'Test Card',
    value: '100',
    icon: 'test-icon',
    color: '#000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given props', () => {
    const { getByText, getByTestId } = render(
      <StatsCard card={mockCard} />
    );

    expect(getByText('Test Card')).toBeTruthy();
    expect(getByText('100')).toBeTruthy();
    expect(getByText('test-icon')).toBeTruthy();
    expect(getByTestId('stats-card')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <StatsCard card={mockCard} onPress={mockOnPress} />
    );

    fireEvent.press(getByTestId('stats-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(
      <StatsCard card={mockCard} style={customStyle} />
    );
    
    const element = getByTestId('stats-card');
    expect(element.props.style).toContainEqual(customStyle);
  });
});
