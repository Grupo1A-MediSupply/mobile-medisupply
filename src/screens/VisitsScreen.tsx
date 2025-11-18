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
  Modal,
  Alert,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

import { COLORS, SIZES, VISIT_STATUS, GRADIENTS, MOCK_DATA, PRIORITIES } from '../constants';
import { Visit, Client } from '../types';

interface VisitsScreenProps {
  navigation: any;
}

const VisitsScreen: React.FC<VisitsScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  
  // Estados para el formulario de nueva visita
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchText, setClientSearchText] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [visitObjective, setVisitObjective] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [suggestedTime, setSuggestedTime] = useState<Date | null>(null);

  const initialVisits: Visit[] = [
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

  const [mockVisits, setMockVisits] = useState<Visit[]>(initialVisits);

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

  // Filtrar visitas según el estado seleccionado
  const filteredVisits = mockVisits.filter(visit => {
    // Filtro por estado
    const statusMatch = statusFilter === 'all' || visit.status === statusFilter;
    
    // Filtro por búsqueda (nombre del cliente o dirección)
    const searchMatch = searchText === '' || 
      visit.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
      visit.address.toLowerCase().includes(searchText.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Filtrar visitas pendientes para el mapa
  const pendingVisits = mockVisits.filter(visit => visit.status === 'pending');

  // Calcular región del mapa para mostrar todas las visitas pendientes
  const getMapRegion = (): Region => {
    if (pendingVisits.length === 0) {
      // Región por defecto (Bogotá)
      return {
        latitude: 4.6097,
        longitude: -74.0817,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const validVisits = pendingVisits.filter(v => v.latitude && v.longitude);
    if (validVisits.length === 0) {
      return {
        latitude: 4.6097,
        longitude: -74.0817,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const latitudes = validVisits.map(v => v.latitude!);
    const longitudes = validVisits.map(v => v.longitude!);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.1;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.1;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.05),
      longitudeDelta: Math.max(lngDelta, 0.05),
    };
  };

  const mapRegion = getMapRegion();

  // Función para navegar a la ubicación
  const handleNavigate = (visit: Visit) => {
    if (!visit.latitude || !visit.longitude) {
      Alert.alert('Error', 'No hay coordenadas disponibles para esta visita');
      return;
    }

    const { latitude, longitude } = visit;
    const url = Platform.select({
      ios: `maps://app?daddr=${latitude},${longitude}&dirflg=d`,
      android: `google.navigation:q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.openURL(url).catch(() => {
        // Si falla, intentar con Google Maps web
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(webUrl).catch(() => {
          Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
        });
      });
    } else {
      // Fallback a Google Maps web
      const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(webUrl).catch(() => {
        Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
      });
    }
  };

  // Función para ver detalles de la visita
  const handleView = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowVisitModal(true);
  };

  // Obtener ubicación actual
  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        try {
          const location = await Location.getCurrentPositionAsync({});
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.log('Error obteniendo ubicación:', error);
        }
      }
    };
    getCurrentLocation();
  }, []);

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Calcular distancia cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClient && selectedClient.latitude && selectedClient.longitude && currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        selectedClient.latitude,
        selectedClient.longitude
      );
      setDistance(dist);
      
      // Sugerir mejor hora basada en distancia (asumiendo velocidad promedio de 30 km/h)
      const travelTimeHours = dist / 30;
      const suggested = new Date();
      suggested.setHours(suggested.getHours() + Math.ceil(travelTimeHours) + 1);
      suggested.setMinutes(0);
      setSuggestedTime(suggested);
    }
  }, [selectedClient, currentLocation]);

  // Filtrar clientes por búsqueda
  const filteredClients = MOCK_DATA.clients.filter(client =>
    client.name.toLowerCase().includes(clientSearchText.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearchText.toLowerCase()) ||
    client.address.toLowerCase().includes(clientSearchText.toLowerCase())
  );

  // Objetivos de visita
  const visitObjectives = [
    { value: 'seguimiento', label: 'Seguimiento' },
    { value: 'nuevo-pedido', label: 'Nuevo Pedido' },
    { value: 'cobro', label: 'Cobro' },
    { value: 'presentacion', label: 'Presentación' },
  ];

  // Opciones de recordatorio
  const reminderOptions = [
    { value: '15', label: '15 minutos antes' },
    { value: '30', label: '30 minutos antes' },
    { value: '60', label: '1 hora antes' },
  ];

  // Función para guardar nueva visita
  const handleSaveNewVisit = () => {
    if (!selectedClient) {
      Alert.alert('Error', 'Por favor selecciona un cliente');
      return;
    }
    if (!visitObjective) {
      Alert.alert('Error', 'Por favor selecciona un objetivo de visita');
      return;
    }

    const newVisit: Visit = {
      id: Date.now().toString(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      address: selectedClient.address,
      status: 'pending',
      priority: priority,
      scheduledDate: scheduledDate.toISOString(),
      duration: 60, // Duración por defecto
      distance: distance || 0,
      latitude: selectedClient.latitude,
      longitude: selectedClient.longitude,
    };

    setMockVisits(prev => [newVisit, ...prev]);
    Alert.alert('Éxito', 'Visita creada correctamente');
    handleCloseNewVisitModal();
  };

  // Función para cerrar y resetear el modal
  const handleCloseNewVisitModal = () => {
    setShowNewVisitModal(false);
    setSelectedClient(null);
    setClientSearchText('');
    setScheduledDate(new Date());
    setPriority('medium');
    setVisitObjective('');
    setNotes('');
    setReminder('');
    setDistance(null);
    setSuggestedTime(null);
  };

  // Función para sincronizar con calendario
  const handleSyncCalendar = async () => {
    if (!selectedClient || !scheduledDate) {
      Alert.alert('Error', 'Completa la información de la visita primero');
      return;
    }

    // Crear URL para agregar evento al calendario
    const startDate = scheduledDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(scheduledDate.getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = `Visita: ${selectedClient.name}`;
    const details = `Objetivo: ${visitObjectives.find(o => o.value === visitObjective)?.label || visitObjective}\n${notes ? `Notas: ${notes}` : ''}`;
    const location = selectedClient.address;

    // Google Calendar
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    // Intentar abrir Google Calendar
    Linking.openURL(googleUrl).catch(() => {
      Alert.alert('Info', 'Abre tu aplicación de calendario y agrega el evento manualmente');
    });
  };

  // Función para iniciar una visita
  const handleStartVisit = (visit: Visit) => {
    Alert.alert(
      'Iniciar Visita',
      `¿Deseas iniciar la visita a ${visit.clientName}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Iniciar',
          onPress: () => {
            // Actualizar el estado de la visita
            setMockVisits(prevVisits =>
              prevVisits.map(v =>
                v.id === visit.id ? { ...v, status: 'in-progress' as const } : v
              )
            );
            Alert.alert('Éxito', 'Visita iniciada correctamente');
          },
        },
      ]
    );
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
        <TouchableOpacity 
          style={[styles.actionBtn, styles.primaryBtn]}
          onPress={() => handleNavigate(item)}
        >
          <MaterialIcons name="navigation" size={16} color={COLORS.white} />
          <Text style={styles.actionBtnText}>Navegar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionBtn, styles.secondaryBtn]}
          onPress={() => handleView(item)}
        >
          <MaterialIcons name="visibility" size={16} color={COLORS.gray} />
          <Text style={[styles.actionBtnText, { color: COLORS.gray }]}>Ver</Text>
        </TouchableOpacity>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.successBtn]}
            onPress={() => handleStartVisit(item)}
          >
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
            <MapView
              style={styles.map}
              initialRegion={mapRegion}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              {pendingVisits
                .filter(visit => visit.latitude && visit.longitude)
                .map((visit) => (
                  <Marker
                    key={visit.id}
                    coordinate={{
                      latitude: visit.latitude!,
                      longitude: visit.longitude!,
                    }}
                    title={visit.clientName}
                    description={visit.address}
                  >
                    <View style={[styles.markerContainer, { backgroundColor: getStatusColor(visit.status) }]}>
                      <MaterialIcons 
                        name="location-on" 
                        size={24} 
                        color={COLORS.white} 
                      />
                    </View>
                  </Marker>
                ))}
            </MapView>
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
            <TouchableOpacity 
              style={styles.filterSelect}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterSelectText}>
                {statusFilter === 'all' ? 'Todos' : VISIT_STATUS.find(s => s.value === statusFilter)?.label || 'Todos'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Visits List */}
        <View style={styles.visitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Visitas</Text>
            <TouchableOpacity 
              style={styles.addVisitBtn}
              onPress={() => setShowNewVisitModal(true)}
            >
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.addVisitBtnText}>Nueva Visita</Text>
            </TouchableOpacity>
          </View>
          
          {filteredVisits.length > 0 ? (
            <FlatList
              data={filteredVisits}
              renderItem={renderVisitItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={48} color={COLORS.gray} />
              <Text style={styles.emptyStateText}>No se encontraron visitas</Text>
              <Text style={styles.emptyStateSubtext}>
                Intenta cambiar los filtros o la búsqueda
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Detalles de Visita */}
      <Modal
        visible={showVisitModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVisitModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalles de la Visita</Text>
              <TouchableOpacity onPress={() => setShowVisitModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            {selectedVisit && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Cliente</Text>
                  <Text style={styles.detailValue}>{selectedVisit.clientName}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Dirección</Text>
                  <Text style={styles.detailValue}>{selectedVisit.address}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <View style={styles.detailValueContainer}>
                    <View style={[styles.detailStatusBadge, { backgroundColor: getStatusColor(selectedVisit.status) }]}>
                      <Text style={styles.detailStatusText}>
                        {VISIT_STATUS.find(s => s.value === selectedVisit.status)?.label}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Prioridad</Text>
                  <View style={styles.detailValueContainer}>
                    <View style={[styles.detailPriorityDot, { backgroundColor: getPriorityColor(selectedVisit.priority) }]} />
                    <Text style={styles.detailValue}>
                      {selectedVisit.priority === 'high' ? 'Alta' : 
                       selectedVisit.priority === 'medium' ? 'Media' : 'Baja'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Fecha y Hora Programada</Text>
                  <Text style={styles.detailValue}>
                    {new Date(selectedVisit.scheduledDate).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Distancia</Text>
                    <Text style={styles.detailValue}>{selectedVisit.distance} km</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Duración Estimada</Text>
                    <Text style={styles.detailValue}>{selectedVisit.duration} min</Text>
                  </View>
                </View>

                {selectedVisit.latitude && selectedVisit.longitude && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Coordenadas</Text>
                    <Text style={styles.detailValue}>
                      {selectedVisit.latitude.toFixed(6)}, {selectedVisit.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  {selectedVisit.latitude && selectedVisit.longitude && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonPrimary]}
                      onPress={() => {
                        setShowVisitModal(false);
                        handleNavigate(selectedVisit);
                      }}
                    >
                      <MaterialIcons name="navigation" size={20} color={COLORS.white} />
                      <Text style={styles.modalButtonText}>Navegar</Text>
                    </TouchableOpacity>
                  )}
                  {selectedVisit.status === 'pending' && (
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonSuccess]}
                      onPress={() => {
                        setShowVisitModal(false);
                        handleStartVisit(selectedVisit);
                      }}
                    >
                      <MaterialIcons name="play-arrow" size={20} color={COLORS.white} />
                      <Text style={styles.modalButtonText}>Iniciar Visita</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Filtro de Estado */}
      <Modal
        visible={showFilterModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
          <View style={styles.filterModalContent}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>Filtrar por Estado</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  statusFilter === 'all' && styles.filterOptionSelected
                ]}
                onPress={() => {
                  setStatusFilter('all');
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.filterOptionText,
                  statusFilter === 'all' && styles.filterOptionTextSelected
                ]}>
                  Todos
                </Text>
                {statusFilter === 'all' && (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>

              {VISIT_STATUS.filter(status => status.value !== 'cancelled').map((status) => (
                <TouchableOpacity
                  key={status.value}
                  style={[
                    styles.filterOption,
                    statusFilter === status.value && styles.filterOptionSelected
                  ]}
                  onPress={() => {
                    setStatusFilter(status.value);
                    setShowFilterModal(false);
                  }}
                >
                  <View style={styles.filterOptionLeft}>
                    <View style={[styles.filterStatusDot, { backgroundColor: status.color }]} />
                    <Text style={[
                      styles.filterOptionText,
                      statusFilter === status.value && styles.filterOptionTextSelected
                    ]}>
                      {status.label}
                    </Text>
                  </View>
                  {statusFilter === status.value && (
                    <MaterialIcons name="check" size={20} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Nueva Visita */}
      <Modal
        visible={showNewVisitModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseNewVisitModal}
      >
        <View style={styles.newVisitModalOverlay}>
          <View style={styles.newVisitModalContent}>
            <View style={styles.newVisitModalHeader}>
              <Text style={styles.newVisitModalTitle}>Nueva Visita</Text>
              <TouchableOpacity onPress={handleCloseNewVisitModal}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.newVisitModalBody}
              showsVerticalScrollIndicator={true}
            >
              {/* 1. Selector de Cliente */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Cliente *</Text>
                <TouchableOpacity
                  style={styles.clientSelector}
                  onPress={() => setShowClientPicker(!showClientPicker)}
                >
                  <Text style={[styles.clientSelectorText, !selectedClient && styles.placeholderText]}>
                    {selectedClient ? selectedClient.name : 'Seleccionar cliente'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                {showClientPicker && (
                  <View style={styles.clientPickerContainer}>
                    <TextInput
                      style={styles.clientSearchInput}
                      placeholder="Buscar cliente..."
                      value={clientSearchText}
                      onChangeText={setClientSearchText}
                      placeholderTextColor={COLORS.gray}
                    />
                    <ScrollView 
                      style={styles.clientList}
                      nestedScrollEnabled={true}
                      keyboardShouldPersistTaps="handled"
                    >
                      {filteredClients.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.clientOption}
                          onPress={() => {
                            setSelectedClient(item);
                            setShowClientPicker(false);
                            setClientSearchText('');
                          }}
                        >
                          <Text style={styles.clientOptionName}>{item.name}</Text>
                          <Text style={styles.clientOptionAddress}>{item.address}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* 2. Selector de Fecha y Hora */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Fecha y Hora *</Text>
                <View style={styles.dateTimeRow}>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons name="calendar-today" size={20} color={COLORS.primary} />
                    <Text style={styles.dateTimeText}>
                      {scheduledDate.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
                    <Text style={styles.dateTimeText}>
                      {scheduledDate.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
                {suggestedTime && (
                  <TouchableOpacity
                    style={styles.suggestedTimeButton}
                    onPress={() => {
                      setScheduledDate(suggestedTime);
                      setSuggestedTime(null);
                    }}
                  >
                    <MaterialIcons name="lightbulb" size={16} color={COLORS.warning} />
                    <Text style={styles.suggestedTimeText}>
                      Sugerencia: {suggestedTime.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* 3. Selector de Prioridad */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Prioridad *</Text>
                <View style={styles.priorityContainer}>
                  {PRIORITIES.filter(p => ['low', 'medium', 'high'].includes(p.value)).map((p) => {
                    const isSelected = priority === p.value;
                    return (
                      <TouchableOpacity
                        key={p.value}
                        style={[
                          styles.priorityOption,
                          isSelected && styles.priorityOptionSelected,
                          { 
                            borderColor: p.color,
                            backgroundColor: isSelected ? `${p.color}15` : COLORS.white,
                          },
                        ]}
                        onPress={() => setPriority(p.value as 'high' | 'medium' | 'low')}
                      >
                        <View style={[styles.priorityDot, { backgroundColor: p.color }]} />
                        <Text style={[
                          styles.priorityText,
                          isSelected && styles.priorityTextSelected,
                          isSelected && { color: p.color }
                        ]}>
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* 4. Objetivo de la Visita */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Objetivo de la Visita *</Text>
                <View style={styles.objectiveContainer}>
                  {visitObjectives.map((obj) => (
                    <TouchableOpacity
                      key={obj.value}
                      style={[
                        styles.objectiveOption,
                        visitObjective === obj.value && styles.objectiveOptionSelected,
                      ]}
                      onPress={() => setVisitObjective(obj.value)}
                    >
                      <Text style={[
                        styles.objectiveText,
                        visitObjective === obj.value && styles.objectiveTextSelected
                      ]}>
                        {obj.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 5. Campo de Notas */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Notas (Opcional)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Agregar notas sobre la visita..."
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.gray}
                  textAlignVertical="top"
                />
              </View>

              {/* 6. Mapa con Ubicación del Cliente */}
              {selectedClient && selectedClient.latitude && selectedClient.longitude && (
                <View style={styles.formSection}>
                  <Text style={styles.formLabel}>Ubicación del Cliente</Text>
                  <View style={styles.mapContainerSmall}>
                    <MapView
                      style={styles.mapSmall}
                      initialRegion={{
                        latitude: selectedClient.latitude,
                        longitude: selectedClient.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: selectedClient.latitude,
                          longitude: selectedClient.longitude,
                        }}
                        title={selectedClient.name}
                        description={selectedClient.address}
                      />
                    </MapView>
                  </View>
                  {distance !== null && (
                    <Text style={styles.distanceText}>
                      Distancia: {distance.toFixed(2)} km
                    </Text>
                  )}
                </View>
              )}

              {/* 9. Recordatorio */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Recordatorio</Text>
                <View style={styles.reminderContainer}>
                  {reminderOptions.map((rem) => (
                    <TouchableOpacity
                      key={rem.value}
                      style={[
                        styles.reminderOption,
                        reminder === rem.value && styles.reminderOptionSelected,
                      ]}
                      onPress={() => setReminder(rem.value)}
                    >
                      <Text style={[
                        styles.reminderText,
                        reminder === rem.value && styles.reminderTextSelected
                      ]}>
                        {rem.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* 10. Sincronizar con Calendario */}
              <View style={styles.formSection}>
                <TouchableOpacity
                  style={styles.calendarSyncButton}
                  onPress={handleSyncCalendar}
                >
                  <MaterialIcons name="event" size={20} color={COLORS.primary} />
                  <Text style={styles.calendarSyncText}>Sincronizar con Calendario</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Botones de Acción */}
            <View style={styles.newVisitModalActions}>
              <TouchableOpacity
                style={[styles.newVisitButton, styles.cancelButton]}
                onPress={handleCloseNewVisitModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.newVisitButton, styles.saveButton]}
                onPress={handleSaveNewVisit}
              >
                <Text style={styles.saveButtonText}>Guardar Visita</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerModalContent}>
                <Text style={styles.pickerModalTitle}>Seleccionar Fecha</Text>
                {Platform.OS === 'ios' ? (
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerText}>
                      {scheduledDate.toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerText}>
                      {scheduledDate.toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                )}
                <View style={styles.pickerModalActions}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      const newDate = new Date();
                      setScheduledDate(newDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.pickerButtonText}>Hoy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={() => {
                      const newDate = new Date();
                      newDate.setDate(newDate.getDate() + 1);
                      setScheduledDate(newDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.pickerButtonText}>Mañana</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.pickerButtonPrimary]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.pickerButtonTextPrimary}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

        {/* Time Picker Modal */}
        {showTimePicker && (
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.pickerModalOverlay}>
              <View style={styles.pickerModalContent}>
                <Text style={styles.pickerModalTitle}>Seleccionar Hora</Text>
                <View style={styles.timePickerContainer}>
                  <View style={styles.timeInputRow}>
                    <TextInput
                      style={styles.timeInput}
                      value={scheduledDate.getHours().toString().padStart(2, '0')}
                      onChangeText={(text) => {
                        const hours = parseInt(text) || 0;
                        if (hours >= 0 && hours <= 23) {
                          const newDate = new Date(scheduledDate);
                          newDate.setHours(hours);
                          setScheduledDate(newDate);
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text style={styles.timeSeparator}>:</Text>
                    <TextInput
                      style={styles.timeInput}
                      value={scheduledDate.getMinutes().toString().padStart(2, '0')}
                      onChangeText={(text) => {
                        const minutes = parseInt(text) || 0;
                        if (minutes >= 0 && minutes <= 59) {
                          const newDate = new Date(scheduledDate);
                          newDate.setMinutes(minutes);
                          setScheduledDate(newDate);
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
                <View style={styles.pickerModalActions}>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.pickerButtonPrimary]}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.pickerButtonTextPrimary}>Aceptar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </Modal>
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
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  modalBody: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  detailPriorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  modalButtonSuccess: {
    backgroundColor: COLORS.success,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Filter Modal Styles
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    width: '85%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  filterOptions: {
    padding: 8,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.light,
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  filterOptionText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  // New Visit Modal Styles
  newVisitModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  newVisitModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  newVisitModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  newVisitModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  newVisitModalBody: {
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  newVisitModalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  // Form Styles
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  // Client Selector
  clientSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  clientSelectorText: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  clientPickerContainer: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  clientSearchInput: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    fontSize: 16,
    color: COLORS.black,
  },
  clientList: {
    maxHeight: 150,
  },
  clientOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clientOptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  clientOptionAddress: {
    fontSize: 14,
    color: COLORS.gray,
  },
  // Date Time
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  dateTimeText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  suggestedTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  suggestedTimeText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  // Priority
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
  },
  priorityOptionSelected: {
    borderWidth: 3,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    transform: [{ scale: 1.02 }],
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  priorityTextSelected: {
    fontWeight: '700',
    fontSize: 15,
  },
  // Objective
  objectiveContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  objectiveOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  objectiveOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  objectiveText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: '500',
  },
  objectiveTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  // Notes
  notesInput: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.black,
    minHeight: 100,
  },
  // Map Small
  mapContainerSmall: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  mapSmall: {
    width: '100%',
    height: '100%',
  },
  distanceText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Reminder
  reminderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reminderOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  reminderOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reminderText: {
    fontSize: 12,
    color: COLORS.black,
    fontWeight: '500',
  },
  reminderTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  // Calendar Sync
  calendarSyncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  calendarSyncText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  // Buttons
  newVisitButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  // Picker Modals
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  datePickerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.black,
  },
  timePickerContainer: {
    padding: 20,
    alignItems: 'center',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    width: 60,
    height: 60,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    color: COLORS.black,
  },
  timeSeparator: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.black,
  },
  pickerModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  pickerButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  pickerButtonPrimary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pickerButtonText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  pickerButtonTextPrimary: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default VisitsScreen;
