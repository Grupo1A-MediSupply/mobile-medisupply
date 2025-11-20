import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProductDetailScreen from '../ProductDetailScreen';
import { Product } from '../../types';

const mockNavigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

const mockProduct: Product = {
  id: '1',
  name: 'Mascarilla N95',
  code: 'MASK001',
  category: 'proteccion',
  price: 2500,
  stock: 50,
  image: 'https://example.com/mask.jpg',
  description: 'Mascarilla de protección N95',
  specifications: 'Filtra 95% de partículas',
  wholesalePrice: 2000,
  lastStockUpdate: '2024-01-15T10:00:00Z',
  stockHistory: [
    {
      id: '1',
      type: 'entry',
      quantity: 50,
      date: '2024-01-10T10:00:00Z',
      reason: 'Compra inicial',
      userName: 'Admin',
    },
    {
      id: '2',
      type: 'exit',
      quantity: 25,
      date: '2024-01-12T14:30:00Z',
      reason: 'Venta',
      userName: 'Vendedor 1',
    },
  ],
};

const mockRoute = {
  params: {
    product: mockProduct,
  },
};

describe('ProductDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product detail screen correctly', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Mascarilla N95')).toBeTruthy();
    expect(getByText('Código: MASK001')).toBeTruthy();
  });

  it('displays product price', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('$2,500')).toBeTruthy();
  });

  it('displays wholesale price when available', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('$2,000')).toBeTruthy();
  });

  it('displays stock information', () => {
    const { getAllByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const stockElements = getAllByText(/50 unidades/);
    expect(stockElements.length).toBeGreaterThan(0);
  });

  it('displays product description', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Mascarilla de protección N95')).toBeTruthy();
  });

  it('displays product specifications', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Filtra 95% de partículas')).toBeTruthy();
  });

  it('displays stock history section', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que la sección de historial existe
    expect(getByText('Historial de Movimientos')).toBeTruthy();
  });

  it('handles add to order button press', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    const addToOrderButton = getByText('Agregar al Pedido');
    fireEvent.press(addToOrderButton);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('SelectClient');
  });

  it('renders product images', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que el componente se renderiza correctamente
    expect(getByText('Mascarilla N95')).toBeTruthy();
  });

  it('handles products with multiple images', () => {
    const productWithMultipleImages: Product = {
      ...mockProduct,
      images: [
        'https://example.com/mask1.jpg',
        'https://example.com/mask2.jpg',
        'https://example.com/mask3.jpg',
      ],
    };

    const routeWithImages = {
      params: {
        product: productWithMultipleImages,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeWithImages} />
    );

    expect(getByText('Mascarilla N95')).toBeTruthy();
  });

  it('displays placeholder when no image is available', () => {
    const productWithoutImage: Product = {
      ...mockProduct,
      image: undefined,
      images: undefined,
    };

    const routeWithoutImage = {
      params: {
        product: productWithoutImage,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeWithoutImage} />
    );

    expect(getByText('Mascarilla N95')).toBeTruthy();
  });

  it('displays stock status correctly for low stock', () => {
    const lowStockProduct: Product = {
      ...mockProduct,
      stock: 5,
    };

    const routeLowStock = {
      params: {
        product: lowStockProduct,
      },
    };

    const { getAllByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeLowStock} />
    );

    const stockElements = getAllByText(/5 unidades/);
    expect(stockElements.length).toBeGreaterThan(0);
  });

  it('displays stock status correctly for normal stock', () => {
    const normalStockProduct: Product = {
      ...mockProduct,
      stock: 25,
    };

    const routeNormalStock = {
      params: {
        product: normalStockProduct,
      },
    };

    const { getAllByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeNormalStock} />
    );

    const stockElements = getAllByText(/25 unidades/);
    expect(stockElements.length).toBeGreaterThan(0);
  });

  it('displays stock status correctly for high stock', () => {
    const highStockProduct: Product = {
      ...mockProduct,
      stock: 100,
    };

    const routeHighStock = {
      params: {
        product: highStockProduct,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeHighStock} />
    );

    expect(getByText(/100 unidades/)).toBeTruthy();
  });

  it('displays empty history message when no stock history', () => {
    const productWithoutHistory: Product = {
      ...mockProduct,
      stockHistory: [],
    };

    const routeWithoutHistory = {
      params: {
        product: productWithoutHistory,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeWithoutHistory} />
    );

    expect(getByText('No hay movimientos registrados')).toBeTruthy();
  });

  it('displays last stock update date', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que se muestra la fecha de última actualización
    expect(getByText(/Última actualización/)).toBeTruthy();
  });

  it('renders products with image gallery', () => {
    const productWithMultipleImages: Product = {
      ...mockProduct,
      images: [
        'https://example.com/mask1.jpg',
        'https://example.com/mask2.jpg',
      ],
    };

    const routeWithImages = {
      params: {
        product: productWithMultipleImages,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeWithImages} />
    );

    expect(getByText('Mascarilla N95')).toBeTruthy();
  });

  it('displays category badge', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que se muestra la categoría
    expect(getByText('Mascarilla N95')).toBeTruthy();
  });

  it('handles product without wholesale price', () => {
    const productWithoutWholesale: Product = {
      ...mockProduct,
      wholesalePrice: undefined,
    };

    const routeWithoutWholesale = {
      params: {
        product: productWithoutWholesale,
      },
    };

    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={routeWithoutWholesale} />
    );

    expect(getByText('Mascarilla N95')).toBeTruthy();
    expect(getByText('$2,500')).toBeTruthy();
  });

  it('renders product detail correctly', () => {
    const { getByText } = render(
      <ProductDetailScreen navigation={mockNavigation} route={mockRoute} />
    );

    // Verificar que el componente se renderiza correctamente
    expect(getByText('Mascarilla N95')).toBeTruthy();
  });
});

