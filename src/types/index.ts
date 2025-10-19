// Tipos principales de la aplicación MediSupply

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'premium';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: 'medicamentos' | 'equipos' | 'insumos' | 'dispositivos' | 'proteccion' | 'instrumentos';
  price: number;
  stock: number;
  description?: string;
  supplier: string;
  expiryDate?: string;
  image?: string;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Visit {
  id: string;
  clientId: string;
  clientName: string;
  address: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  scheduledDate: string;
  duration: number; // en minutos
  distance: number; // en km
  latitude?: number;
  longitude?: number;
}

export interface Return {
  id: string;
  orderId: string;
  clientId: string;
  clientName: string;
  productId: string;
  productName: string;
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  photos: string[];
  createdAt: string;
}

export interface StatsCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Inventory: undefined;
  Orders: undefined;
  Visits: undefined;
  Returns: undefined;
  NewOrder: undefined;
};
