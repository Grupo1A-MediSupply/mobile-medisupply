import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, ORDER_STATUS, GRADIENTS } from '../constants';
import { Order } from '../types';

interface OrdersScreenProps {
  navigation: any;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const mockOrders: Order[] = [
    {
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
    },
    {
      id: 'ORD002',
      clientId: '2',
      clientName: 'Clínica San Rafael',
      products: [
        { productId: '3', productName: 'Guantes Nitrilo', quantity: 10, price: 12000 },
      ],
      total: 120000,
      status: 'processing',
      priority: 'medium',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-15T09:15:00Z',
    },
    {
      id: 'ORD003',
      clientId: '3',
      clientName: 'Dr. Carlos Ruiz',
      products: [
        { productId: '1', productName: 'Mascarillas N95', quantity: 100, price: 2500 },
        { productId: '2', productName: 'Termómetro Digital', quantity: 5, price: 45000 },
      ],
      total: 475000,
      status: 'delivered',
      priority: 'low',
      createdAt: '2024-01-13T16:45:00Z',
      updatedAt: '2024-01-15T11:30:00Z',
    },
  ];

  const statsCards = [
    {
      title: 'Total Pedidos',
      value: '156',
      icon: 'shopping-cart',
      color: COLORS.primary,
    },
    {
      title: 'Pendientes',
      value: '23',
      icon: 'schedule',
      color: COLORS.warning,
    },
    {
      title: 'Entregados',
      value: '133',
      icon: 'check-circle',
      color: COLORS.success,
    },
  ];

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : COLORS.gray;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return COLORS.danger;
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  const renderStatsCard = (card: any, index: number) => (
    <View key={index} style={styles.statsCard}>
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.statsCardGradient}
      >
        <MaterialIcons name={card.icon} size={24} color={COLORS.white} />
        <View style={styles.statsContent}>
          <Text style={styles.statsNumber}>{card.value}</Text>
          <Text style={styles.statsLabel}>{card.title}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>{item.id}</Text>
        <View style={styles.orderStatusContainer}>
          <View style={[styles.orderStatus, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.orderStatusText}>
              {ORDER_STATUS.find(s => s.value === item.status)?.label}
            </Text>
          </View>
          <View style={[styles.orderPriority, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
      </View>
      
      <View style={styles.orderContent}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderClient}>{item.clientName}</Text>
          <Text style={styles.orderAmount}>${item.total.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderItems}>{item.products.length} productos</Text>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      <View style={styles.orderProgress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: item.status === 'delivered' ? '100%' : 
                       item.status === 'shipped' ? '75%' :
                       item.status === 'processing' ? '50%' : '25%'
              }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => navigation.navigate('OrderDetail', { order: item })}
        >
          <MaterialIcons name="visibility" size={16} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
          <MaterialIcons name="edit" size={16} color={COLORS.gray} />
          <Text style={[styles.actionBtnText, { color: COLORS.gray }]}>Editar</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionBtn, styles.successBtn]}>
            <MaterialIcons name="check" size={16} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Procesar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Gestión de Pedidos</Text>
          <Text style={styles.welcomeSubtitle}>Administra y rastrea todos los pedidos</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          {statsCards.map((card, index) => renderStatsCard(card, index))}
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar pedidos..."
              placeholderTextColor={COLORS.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Estado</Text>
              <View style={styles.filterSelect}>
                <Text style={styles.filterSelectText}>
                  {ORDER_STATUS.find(s => s.value === statusFilter)?.label || 'Todos'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Prioridad</Text>
              <View style={styles.filterSelect}>
                <Text style={styles.filterSelectText}>
                  {priorityFilter === 'all' ? 'Todas' : 
                   priorityFilter === 'high' ? 'Alta' :
                   priorityFilter === 'medium' ? 'Media' : 'Baja'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
              </View>
            </View>
          </View>
        </View>

        {/* Orders List */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Pedidos</Text>
            <TouchableOpacity 
              style={styles.addOrderBtn}
              onPress={() => navigation.navigate('SelectClient')}
            >
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.addOrderBtnText}>Nuevo Pedido</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  statsCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statsContent: {
    flex: 1,
    marginLeft: 12,
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  searchSection: {
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  searchButton: {
    padding: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterGroup: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 5,
  },
  filterSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterSelectText: {
    fontSize: 14,
    color: COLORS.black,
  },
  ordersSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.black,
  },
  addOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addOrderBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  orderItem: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  orderPriority: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderClient: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItems: {
    fontSize: 12,
    color: COLORS.gray,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  orderProgress: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  secondaryBtn: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  successBtn: {
    backgroundColor: COLORS.success,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    color: COLORS.white,
  },
});

export default OrdersScreen;
