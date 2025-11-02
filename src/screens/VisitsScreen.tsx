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

import { COLORS, SIZES, VISIT_STATUS, GRADIENTS } from '../constants';
import { Visit } from '../types';

interface VisitsScreenProps {
  navigation: any;
}

const VisitsScreen: React.FC<VisitsScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockVisits: Visit[] = [
    {
      id: '1',
      clientId: '1',
      clientName: 'Dr. María González',
      address: 'Calle 123 #45-67, Bogotá',
      status: 'pending',
      priority: 'high',
      scheduledDate: '2024-01-15T10:00:00Z',
      duration: 60,
      distance: 5.2,
      latitude: 4.6097,
      longitude: -74.0817,
    },
    {
      id: '2',
      clientId: '2',
      clientName: 'Clínica San Rafael',
      address: 'Carrera 15 #93-20, Bogotá',
      status: 'in-progress',
      priority: 'medium',
      scheduledDate: '2024-01-15T14:00:00Z',
      duration: 90,
      distance: 8.5,
      latitude: 4.6500,
      longitude: -74.0500,
    },
    {
      id: '3',
      clientId: '3',
      clientName: 'Dr. Carlos Ruiz',
      address: 'Avenida 68 #25-30, Bogotá',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2024-01-15T16:30:00Z',
      duration: 45,
      distance: 12.3,
      latitude: 4.7000,
      longitude: -74.1000,
    },
  ];

  const statsCards = [
    {
      title: 'Visitas Hoy',
      value: '12',
      icon: 'location-on',
      color: COLORS.primary,
    },
    {
      title: 'Pendientes',
      value: '5',
      icon: 'schedule',
      color: COLORS.warning,
    },
    {
      title: 'Completadas',
      value: '7',
      icon: 'check-circle',
      color: COLORS.success,
    },
  ];

  const getStatusColor = (status: string) => {
    const statusObj = VISIT_STATUS.find(s => s.value === status);
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

  const renderVisitItem = ({ item }: { item: Visit }) => (
    <TouchableOpacity style={styles.visitItem}>
      <View style={styles.visitHeader}>
        <Text style={styles.visitClient}>{item.clientName}</Text>
        <View style={styles.visitStatusContainer}>
          <View style={[styles.visitStatus, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.visitStatusText}>
              {VISIT_STATUS.find(s => s.value === item.status)?.label}
            </Text>
          </View>
          <View style={[styles.visitPriority, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
      </View>
      
      <View style={styles.visitContent}>
        <View style={styles.visitInfo}>
          <Text style={styles.visitAddress} numberOfLines={1}>{item.address}</Text>
          <Text style={styles.visitTime}>
            {new Date(item.scheduledDate).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
      
      <View style={styles.visitDetails}>
        <Text style={styles.visitDistance}>{item.distance} km</Text>
        <Text style={styles.visitDuration}>{item.duration} min</Text>
      </View>
      
      <View style={styles.visitProgress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: item.status === 'completed' ? '100%' : 
                       item.status === 'in-progress' ? '50%' : '0%'
              }
            ]} 
          />
        </View>
      </View>
      
      <View style={styles.visitActions}>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
          <MaterialIcons name="navigation" size={16} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Navegar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
          <MaterialIcons name="visibility" size={16} color={COLORS.gray} />
          <Text style={[styles.actionBtnText, { color: COLORS.gray }]}>Ver</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity style={[styles.actionBtn, styles.successBtn]}>
            <MaterialIcons name="play-arrow" size={16} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Iniciar</Text>
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
          <Text style={styles.welcomeTitle}>Gestión de Visitas</Text>
          <Text style={styles.welcomeSubtitle}>Planifica y rastrea tus visitas a clientes</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          {statsCards.map((card, index) => renderStatsCard(card, index))}
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <View style={styles.mapHeader}>
            <Text style={styles.sectionTitle}>Mapa de Visitas</Text>
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.mapBtn}>
                <MaterialIcons name="my-location" size={16} color={COLORS.white} />
                <Text style={styles.mapBtnText}>Mi Ubicación</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn}>
                <MaterialIcons name="layers" size={16} color={COLORS.white} />
                <Text style={styles.mapBtnText}>Capas</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={48} color={COLORS.gray} />
              <Text style={styles.mapPlaceholderText}>Mapa interactivo</Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Aquí se mostraría el mapa con las ubicaciones de las visitas
              </Text>
            </View>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar visitas..."
              placeholderTextColor={COLORS.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.searchButton}>
              <MaterialIcons name="search" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Estado:</Text>
            <View style={styles.filterSelect}>
              <Text style={styles.filterSelectText}>
                {VISIT_STATUS.find(s => s.value === statusFilter)?.label || 'Todos'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
            </View>
          </View>
        </View>

        {/* Visits List */}
        <View style={styles.visitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Visitas</Text>
            <TouchableOpacity style={styles.addVisitBtn}>
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.addVisitBtnText}>Nueva Visita</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={mockVisits}
            renderItem={renderVisitItem}
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
  mapSection: {
    marginBottom: 25,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  mapControls: {
    flexDirection: 'row',
    gap: 8,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  mapBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
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
  filterSelect: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 8,
  },
  visitsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addVisitBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  visitItem: {
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
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  visitClient: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  visitStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  visitStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  visitPriority: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  visitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitInfo: {
    flex: 1,
  },
  visitAddress: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  visitTime: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  visitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitDistance: {
    fontSize: 12,
    color: COLORS.gray,
  },
  visitDuration: {
    fontSize: 12,
    color: COLORS.gray,
  },
  visitProgress: {
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
  visitActions: {
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

export default VisitsScreen;
