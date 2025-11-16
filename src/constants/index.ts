// Constantes de la aplicación MediSupply

export const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  secondary: '#667eea',
  secondaryDark: '#764ba2',
  success: '#28a745',
  warning: '#FFA500',
  danger: '#FF3B30',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: '#6c757d',
  lightGray: '#e9ecef',
  border: '#e0e0e0',
};

export const GRADIENTS = {
  primary: ['#667eea', '#764ba2'],
  success: ['#28a745', '#20c997'],
  warning: ['#FFA500', '#fd7e14'],
  danger: ['#ff6b6b', '#ee5a24'],
  info: ['#17a2b8', '#6f42c1'],
};

export const SIZES = {
  // Tamaños de fuente
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  body: 14,
  caption: 12,
  small: 10,

  // Espaciado
  padding: 20,
  margin: 16,
  radius: 12,
  radiusSmall: 8,
  radiusLarge: 16,

  // Iconos
  iconSmall: 16,
  iconMedium: 24,
  iconLarge: 32,
  iconXLarge: 48,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const CATEGORIES = [
  { value: 'medicamentos', label: 'Medicamentos' },
  { value: 'equipos', label: 'Equipos Médicos' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'dispositivos', label: 'Dispositivos' },
  { value: 'proteccion', label: 'Protección' },
  { value: 'instrumentos', label: 'Instrumentos' },
];

export const ORDER_STATUS = [
  { value: 'pending', label: 'Pendiente', color: '#FFA500' },
  { value: 'processing', label: 'Procesando', color: '#007AFF' },
  { value: 'shipped', label: 'Enviado', color: '#17a2b8' },
  { value: 'delivered', label: 'Entregado', color: '#28a745' },
  { value: 'cancelled', label: 'Cancelado', color: '#FF3B30' },
];

export const VISIT_STATUS = [
  { value: 'pending', label: 'Pendiente', color: '#FFA500' },
  { value: 'in-progress', label: 'En Progreso', color: '#007AFF' },
  { value: 'completed', label: 'Completada', color: '#28a745' },
  { value: 'cancelled', label: 'Cancelada', color: '#FF3B30' },
];

export const RETURN_STATUS = [
  { value: 'pending', label: 'Pendiente', color: '#FFA500' },
  { value: 'processing', label: 'Procesando', color: '#007AFF' },
  { value: 'completed', label: 'Completada', color: '#28a745' },
  { value: 'rejected', label: 'Rechazada', color: '#FF3B30' },
];

export const PRIORITIES = [
  { value: 'low', label: 'Baja', color: '#28a745' },
  { value: 'medium', label: 'Media', color: '#FFA500' },
  { value: 'high', label: 'Alta', color: '#FF3B30' },
  { value: 'urgent', label: 'Urgente', color: '#dc3545' },
];

export const MOCK_DATA = {
  clients: [
    {
      id: '1',
      name: 'Dr. María González',
      email: 'maria.gonzalez@hospital.com',
      phone: '+57 300 123 4567',
      address: 'Calle 123 #45-67, Bogotá',
      status: 'premium' as const,
      nit: '900123456',
    },
    {
      id: '2',
      name: 'Clínica San Rafael',
      email: 'admin@sanrafael.com',
      phone: '+57 1 234 5678',
      address: 'Carrera 15 #93-20, Bogotá',
      status: 'active' as const,
    },
    {
      id: '3',
      name: 'Dr. Carlos Ruiz',
      email: 'carlos.ruiz@medicina.com',
      phone: '+57 310 987 6543',
      address: 'Avenida 68 #25-30, Bogotá',
      status: 'inactive' as const,
    },
  ],
  products: [
    {
      id: '1',
      name: 'Mascarillas N95',
      code: 'MASK001',
      category: 'proteccion' as const,
      price: 2500,
      stock: 150,
      description: 'Mascarillas de protección respiratoria N95 con filtro de alta eficiencia. Certificadas por FDA y CE. Protección contra partículas, bacterias y virus.',
      supplier: 'MedSupply Colombia',
      expiryDate: '2025-12-31',
      wholesalePrice: 2000,
      specifications: 'Material: Polipropileno no tejido\nFiltración: 95% de partículas\nTamaño: Universal\nCertificación: FDA, CE\nCantidad por caja: 50 unidades',
      lastStockUpdate: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'Termómetro Digital',
      code: 'THERM001',
      category: 'equipos' as const,
      price: 45000,
      stock: 25,
      description: 'Termómetro digital infrarrojo sin contacto. Medición rápida y precisa. Pantalla LCD retroiluminada. Ideal para uso médico y doméstico.',
      supplier: 'MedTech Solutions',
      expiryDate: '2026-06-30',
      wholesalePrice: 38000,
      specifications: 'Rango de medición: 32°C - 42.9°C\nPrecisión: ±0.2°C\nDistancia de medición: 1-5 cm\nPantalla: LCD retroiluminada\nBatería: 2x AAA (incluidas)',
      lastStockUpdate: '2024-01-14T14:30:00Z',
    },
    {
      id: '3',
      name: 'Guantes Nitrilo',
      code: 'GLOVE001',
      category: 'insumos' as const,
      price: 12000,
      stock: 8,
      description: 'Guantes de nitrilo desechables, caja x 100 unidades. Sin polvo, hipoalergénicos. Resistencia a químicos y punción.',
      supplier: 'SafeMed Supplies',
      expiryDate: '2025-08-15',
      wholesalePrice: 10000,
      specifications: 'Material: Nitrilo 100%\nTamaño: Mediano\nCantidad: 100 unidades por caja\nSin polvo: Sí\nResistencia: Químicos, punción\nCertificación: FDA, CE',
      lastStockUpdate: '2024-01-13T09:15:00Z',
    },
  ],
};