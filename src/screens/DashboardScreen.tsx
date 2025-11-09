import React, { useState, useEffect } from 'react';
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

import { COLORS, SIZES, MOCK_DATA, GRADIENTS } from '../constants';
import { Client, StatsCard } from '../types';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('all');
  const [clients, setClients] = useState<Client[]>(MOCK_DATA.clients);

  const statsCards: StatsCard[] = [
    {
      title: 'Clientes',
      value: '24',
      icon: 'people',
      color: COLORS.primary,
    },
    {
      title: 'Pedidos',
      value: '156',
      icon: 'shopping-cart',
      color: COLORS.success,
    },
    {
      title: 'Visitas Hoy',
      value: '12',
      icon: 'location-on',
      color: COLORS.warning,
    },
  ];

  const quickVisits = [
    {
      id: '1',
      client: 'Dr. María González',
      address: 'Calle 123 #45-67, Bogotá',
      time: '10:00 AM',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '2',
      client: 'Clínica San Rafael',
      address: 'Carrera 15 #93-20, Bogotá',
      time: '2:00 PM',
      status: 'in-progress',
      priority: 'medium',
    },
    {
      id: '3',
      client: 'Dr. Carlos Ruiz',
      address: 'Avenida 68 #25-30, Bogotá',
      time: '4:30 PM',
      status: 'completed',
      priority: 'low',
    },
  ];

  const renderStatsCard = (card: StatsCard, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.statsCard}
      onPress={() => {
        if (card.title === 'Pedidos') {
          navigation.navigate('Orders');
        } else if (card.title === 'Visitas Hoy') {
          navigation.navigate('Visits');
        }
      }}
    >
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.statsCardGradient}
      >
        <MaterialIcons name={card.icon} size={32} color={COLORS.white} />
        <View style={styles.statsContent}>
          <Text style={styles.statsNumber}>{card.value}</Text>
          <Text style={styles.statsLabel}>{card.title}</Text>
        </View>
        <MaterialIcons name="arrow-forward" size={20} color="rgba(255, 255, 255, 0.7)" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity style={styles.clientItem}>
      <View style={styles.clientAvatar}>
        <Text style={styles.clientAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.clientEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <View style={styles.clientStatusContainer}>
          <View style={[styles.clientStatus, styles[`clientStatus${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]]}>
            <Text style={styles.clientStatusText}>
              {item.status === 'active' ? 'Activo' : item.status === 'inactive' ? 'Inactivo' : 'Premium'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.clientActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => navigation.navigate('ClientDetail', { client: item })}
        >
          <MaterialIcons name="edit" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <MaterialIcons name="delete" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderQuickVisitItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.quickVisitItem}>
      <View style={styles.quickVisitHeader}>
        <Text style={styles.quickVisitClient} numberOfLines={1}>
          {item.client}
        </Text>
        <View style={[styles.quickVisitStatus, styles[`visitStatus${item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', '')}`]]}>
          <Text style={styles.quickVisitStatusText}>
            {item.status === 'pending' ? 'Pendiente' : 
             item.status === 'in-progress' ? 'En Progreso' : 'Completada'}
          </Text>
        </View>
      </View>
      <View style={styles.quickVisitContent}>
        <View style={styles.quickVisitInfo}>
          <Text style={styles.quickVisitAddress} numberOfLines={1}>
            {item.address}
          </Text>
          <Text style={styles.quickVisitTime}>{item.time}</Text>
        </View>
      </View>
      <View style={[styles.quickVisitPriority, styles[`visitPriority${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}`]]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>¡Bienvenido de vuelta!</Text>
          <Text style={styles.welcomeSubtitle}>Gestiona tus clientes y pedidos</Text>
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
              placeholder="Buscar clientes..."
              placeholderTextColor={COLORS.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filtrar:</Text>
            <View style={styles.filterButtons}>
              {['all', 'active', 'inactive', 'premium'].map((filterType) => (
                <TouchableOpacity
                  key={filterType}
                  style={[
                    styles.filterButton,
                    filter === filterType && styles.filterButtonActive
                  ]}
                  onPress={() => setFilter(filterType)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    filter === filterType && styles.filterButtonTextActive
                  ]}>
                    {filterType === 'all' ? 'Todos' : 
                     filterType === 'active' ? 'Activos' :
                     filterType === 'inactive' ? 'Inactivos' : 'Premium'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Clients List */}
        <View style={styles.clientsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Clientes</Text>
            <TouchableOpacity 
              style={styles.addClientBtn}
              onPress={() => navigation.navigate('NewClient')}
            >
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.addClientBtnText}>Nuevo</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={clients}
            renderItem={renderClientItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Visits Section */}
        <View style={styles.visitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visitas de Hoy</Text>
            <TouchableOpacity 
              style={styles.viewAllVisitsBtn}
              onPress={() => navigation.navigate('Visits')}
            >
              <Text style={styles.viewAllVisitsBtnText}>Ver Todas</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={quickVisits}
            renderItem={renderQuickVisitItem}
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
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsCard: {
    width: '48%',
    marginBottom: 15,
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
    padding: 20,
  },
  statsContent: {
    flex: 1,
    marginLeft: 15,
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 14,
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
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginRight: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  filterButtonTextActive: {
    color: COLORS.white,
  },
  clientsSection: {
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
  addClientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addClientBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  clientAvatarText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '600',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  clientStatusContainer: {
    flexDirection: 'row',
  },
  clientStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clientStatusActive: {
    backgroundColor: '#d4edda',
  },
  clientStatusInactive: {
    backgroundColor: '#f8d7da',
  },
  clientStatusPremium: {
    backgroundColor: '#fff3cd',
  },
  clientStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  clientStatusActive: {
    color: '#155724',
  },
  clientStatusInactive: {
    color: '#721c24',
  },
  clientStatusPremium: {
    color: '#856404',
  },
  clientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
  },
  visitsSection: {
    marginTop: 30,
  },
  viewAllVisitsBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewAllVisitsBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },
  quickVisitItem: {
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
  quickVisitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  quickVisitClient: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  quickVisitStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  quickVisitStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  visitStatusPending: {
    backgroundColor: '#fff3cd',
  },
  visitStatusInprogress: {
    backgroundColor: '#cce5ff',
  },
  visitStatusCompleted: {
    backgroundColor: '#d4edda',
  },
  quickVisitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickVisitInfo: {
    flex: 1,
  },
  quickVisitAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  quickVisitTime: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  quickVisitPriority: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  visitPriorityHigh: {
    backgroundColor: COLORS.danger,
  },
  visitPriorityMedium: {
    backgroundColor: COLORS.warning,
  },
  visitPriorityLow: {
    backgroundColor: COLORS.success,
  },
});

export default DashboardScreen;
