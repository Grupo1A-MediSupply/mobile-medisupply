import React, { useState, useMemo } from 'react';
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
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, RETURN_STATUS, GRADIENTS } from '../constants';
import { Return } from '../types';

interface ReturnsScreenProps {
  navigation: any;
}

const ReturnsScreen: React.FC<ReturnsScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReturnModal, setShowNewReturnModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const mockReturns: Return[] = [
    {
      id: 'RET001',
      orderId: 'ORD001',
      clientId: '1',
      clientName: 'Dr. María González',
      productId: '1',
      productName: 'Mascarillas N95',
      reason: 'Producto defectuoso',
      status: 'pending',
      priority: 'high',
      photos: ['photo1.jpg', 'photo2.jpg'],
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 'RET002',
      orderId: 'ORD002',
      clientId: '2',
      clientName: 'Clínica San Rafael',
      productId: '2',
      productName: 'Termómetro Digital',
      reason: 'No cumple especificaciones',
      status: 'processing',
      priority: 'medium',
      photos: ['photo3.jpg'],
      createdAt: '2024-01-14T14:20:00Z',
    },
    {
      id: 'RET003',
      orderId: 'ORD003',
      clientId: '3',
      clientName: 'Dr. Carlos Ruiz',
      productId: '3',
      productName: 'Guantes Nitrilo',
      reason: 'Producto vencido',
      status: 'completed',
      priority: 'low',
      photos: ['photo4.jpg', 'photo5.jpg', 'photo6.jpg'],
      createdAt: '2024-01-13T16:45:00Z',
    },
    {
      id: 'RET004',
      orderId: 'ORD004',
      clientId: '1',
      clientName: 'Dr. María González',
      productId: '1',
      productName: 'Mascarillas N95',
      reason: 'Producto dañado en el transporte',
      status: 'rejected',
      priority: 'urgent',
      photos: [],
      createdAt: '2024-01-12T09:15:00Z',
    },
  ];

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = mockReturns.length;
    const pending = mockReturns.filter(r => r.status === 'pending').length;
    const processed = mockReturns.filter(r => r.status === 'completed' || r.status === 'processing').length;
    
    return { total, pending, processed };
  }, [mockReturns]);

  // Filtrar y ordenar devoluciones
  const filteredAndSortedReturns = useMemo(() => {
    let filtered = mockReturns.filter(returnItem => {
      // Filtro de búsqueda (número o cliente)
      const matchesSearch = searchText === '' || 
        returnItem.id.toLowerCase().includes(searchText.toLowerCase()) ||
        returnItem.clientName.toLowerCase().includes(searchText.toLowerCase());
      
      // Filtro de estado
      const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [mockReturns, searchText, statusFilter]);

  const getStatusColor = (status: string) => {
    const statusObj = RETURN_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : COLORS.gray;
  };

  const getStatusLabel = (status: string) => {
    const statusObj = RETURN_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simular actualización
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const statsCards = [
    {
      title: 'Total Devoluciones',
      value: stats.total.toString(),
      icon: 'assignment-return',
      color: COLORS.danger,
    },
    {
      title: 'Pendientes',
      value: stats.pending.toString(),
      icon: 'schedule',
      color: COLORS.warning,
    },
    {
      title: 'Procesadas',
      value: stats.processed.toString(),
      icon: 'check-circle',
      color: COLORS.success,
    },
  ];

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

  const handleReturnPress = (returnItem: Return) => {
    // Por ahora mostrar alert, luego se puede crear una pantalla de detalle
    Alert.alert(
      'Detalle de Devolución',
      `Devolución: ${returnItem.id}\nCliente: ${returnItem.clientName}\nProducto: ${returnItem.productName}\nMotivo: ${returnItem.reason}\nEstado: ${getStatusLabel(returnItem.status)}`,
      [{ text: 'OK' }]
    );
  };

  const renderReturnItem = ({ item }: { item: Return }) => (
    <TouchableOpacity 
      style={styles.returnItem}
      onPress={() => handleReturnPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.returnHeader}>
        <View style={styles.returnIdContainer}>
          <Text style={styles.returnId}>{item.id}</Text>
          {item.photos.length > 0 && (
            <View style={styles.photoIndicator}>
              <MaterialIcons name="photo" size={14} color={COLORS.primary} />
              <Text style={styles.photoCount}>{item.photos.length}</Text>
            </View>
          )}
        </View>
        <View style={[styles.returnStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.returnStatusText}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.returnContent}>
        <View style={styles.returnInfo}>
          <View style={styles.returnInfoRow}>
            <MaterialIcons name="person" size={16} color={COLORS.gray} />
            <Text style={styles.returnClient}>{item.clientName}</Text>
          </View>
          <View style={styles.returnInfoRow}>
            <MaterialIcons name="inventory" size={16} color={COLORS.gray} />
            <Text style={styles.returnProduct}>{item.productName}</Text>
          </View>
          <View style={styles.returnInfoRow}>
            <MaterialIcons name="event" size={16} color={COLORS.gray} />
            <Text style={styles.returnDate}>
              {new Date(item.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.returnReasonContainer}>
        <Text style={styles.returnReasonLabel}>Motivo:</Text>
        <Text style={styles.returnReason} numberOfLines={2}>
          {item.reason}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons name="assignment-return" size={64} color={COLORS.gray} />
      <Text style={styles.emptyStateText}>No hay devoluciones</Text>
      <Text style={styles.emptyStateSubtext}>
        {statusFilter !== 'all' 
          ? 'No se encontraron devoluciones con el filtro seleccionado'
          : 'No hay devoluciones registradas en este momento'}
      </Text>
    </View>
  );

  const renderFilterModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: { value: string; label: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalOptions}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  selectedValue === option.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedValue === option.value && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <MaterialIcons name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderNewReturnModal = () => (
    <Modal
      visible={showNewReturnModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowNewReturnModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nueva Devolución</Text>
            <TouchableOpacity onPress={() => setShowNewReturnModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Pedido</Text>
              <View style={styles.formSelect}>
                <Text style={styles.formSelectText}>Seleccionar pedido</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.gray} />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Producto</Text>
              <View style={styles.formSelect}>
                <Text style={styles.formSelectText}>Seleccionar producto</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.gray} />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Motivo de la devolución</Text>
              <TextInput 
                style={[styles.formInput, styles.textArea]} 
                placeholder="Describe el motivo de la devolución"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Fotos del producto</Text>
              <TouchableOpacity style={styles.photoUploadArea}>
                <MaterialIcons name="add-a-photo" size={48} color={COLORS.danger} />
                <Text style={styles.uploadText}>Agregar fotos</Text>
                <Text style={styles.uploadSubtext}>Toca para seleccionar imágenes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.secondaryBtn]}
              onPress={() => setShowNewReturnModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.gray }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.primaryBtn]}>
              <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Crear Devolución</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const statusOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'processing', label: 'En proceso' },
    { value: 'completed', label: 'Completadas' },
    { value: 'rejected', label: 'Rechazadas' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Gestión de Devoluciones</Text>
          <Text style={styles.welcomeSubtitle}>Administra las devoluciones de productos</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          {statsCards.map((card, index) => renderStatsCard(card, index))}
        </View>

        {/* New Return Section */}
        <View style={styles.newReturnSection}>
          <Text style={styles.sectionTitle}>Nueva Devolución</Text>
          <TouchableOpacity 
            style={styles.newReturnBtn}
            onPress={() => setShowNewReturnModal(true)}
          >
            <MaterialIcons name="add" size={20} color={COLORS.white} />
            <Text style={styles.newReturnBtnText}>Crear Devolución</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por número o cliente..."
              placeholderTextColor={COLORS.gray}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <MaterialIcons name="close" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filtrar por estado:</Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStatusModal(true)}
          >
            <MaterialIcons name="filter-list" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>
              {statusOptions.find(opt => opt.value === statusFilter)?.label || 'Todas'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* Returns List */}
        <View style={styles.returnsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Devoluciones</Text>
            <Text style={styles.returnsCount}>
              {filteredAndSortedReturns.length} {filteredAndSortedReturns.length === 1 ? 'devolución' : 'devoluciones'}
            </Text>
          </View>
          
          {filteredAndSortedReturns.length > 0 ? (
            <FlatList
              data={filteredAndSortedReturns}
              renderItem={renderReturnItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            renderEmptyState()
          )}
        </View>
      </ScrollView>

      {renderNewReturnModal()}
      {renderFilterModal(
        showStatusModal,
        () => setShowStatusModal(false),
        'Filtrar por Estado',
        statusOptions,
        statusFilter,
        setStatusFilter
      )}
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
  newReturnSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    marginBottom: 12,
  },
  newReturnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  newReturnBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  returnsSection: {
    marginBottom: 20,
  },
  returnsCount: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  returnItem: {
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
  returnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  returnIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  returnId: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  photoIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
  },
  photoCount: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  returnStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  returnStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  returnContent: {
    marginBottom: 12,
  },
  returnInfo: {
    gap: 8,
  },
  returnInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  returnClient: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  returnProduct: {
    fontSize: 14,
    color: COLORS.black,
  },
  returnDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  returnReasonContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  returnReasonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 4,
  },
  returnReason: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  modalOptions: {
    maxHeight: 400,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.light,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  modalOptionTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalForm: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 5,
  },
  formInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  formSelectText: {
    fontSize: 14,
    color: COLORS.black,
  },
  photoUploadArea: {
    borderWidth: 2,
    borderColor: COLORS.danger,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff5f5',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.danger,
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: COLORS.danger,
  },
  secondaryBtn: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default ReturnsScreen;
