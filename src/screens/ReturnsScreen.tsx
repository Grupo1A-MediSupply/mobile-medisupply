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
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, RETURN_STATUS } from '../constants';
import { Return } from '../types';

interface ReturnsScreenProps {
  navigation: any;
}

const ReturnsScreen: React.FC<ReturnsScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewReturnModal, setShowNewReturnModal] = useState(false);

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
  ];

  const statsCards = [
    {
      title: 'Total Devoluciones',
      value: '23',
      icon: 'assignment-return',
      color: COLORS.danger,
    },
    {
      title: 'Pendientes',
      value: '8',
      icon: 'schedule',
      color: COLORS.warning,
    },
    {
      title: 'Completadas',
      value: '15',
      icon: 'check-circle',
      color: COLORS.success,
    },
  ];

  const getStatusColor = (status: string) => {
    const statusObj = RETURN_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : COLORS.gray;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return COLORS.danger;
      case 'high': return '#ff6b6b';
      case 'medium': return COLORS.warning;
      case 'low': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  const renderStatsCard = (card: any, index: number) => (
    <View key={index} style={styles.statsCard}>
      <LinearGradient
        colors={COLORS.GRADIENTS.danger}
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

  const renderReturnItem = ({ item }: { item: Return }) => (
    <TouchableOpacity style={styles.returnItem}>
      <View style={styles.returnHeader}>
        <Text style={styles.returnId}>{item.id}</Text>
        <View style={styles.returnStatusContainer}>
          <View style={[styles.returnStatus, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.returnStatusText}>
              {RETURN_STATUS.find(s => s.value === item.status)?.label}
            </Text>
          </View>
          <View style={[styles.returnPriority, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
      </View>
      
      <View style={styles.returnContent}>
        <View style={styles.returnInfo}>
          <Text style={styles.returnClient}>{item.clientName}</Text>
          <Text style={styles.returnProduct}>{item.productName}</Text>
        </View>
        <Text style={styles.returnDate}>
          {new Date(item.createdAt).toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      <Text style={styles.returnReason} numberOfLines={2}>
        <Text style={styles.returnReasonLabel}>Motivo: </Text>
        {item.reason}
      </Text>
      
      {item.photos.length > 0 && (
        <View style={styles.returnPhotos}>
          {item.photos.slice(0, 3).map((photo, index) => (
            <View key={index} style={styles.returnPhotoThumb}>
              <MaterialIcons name="image" size={20} color={COLORS.gray} />
            </View>
          ))}
          {item.photos.length > 3 && (
            <View style={styles.returnPhotoThumb}>
              <Text style={styles.morePhotosText}>+{item.photos.length - 3}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.returnActions}>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nueva Devolución</Text>
            <TouchableOpacity 
              style={styles.newReturnBtn}
              onPress={() => setShowNewReturnModal(true)}
            >
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.newReturnBtnText}>Crear Devolución</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar devoluciones..."
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
                {RETURN_STATUS.find(s => s.value === statusFilter)?.label || 'Todos'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
            </View>
          </View>
        </View>

        {/* Returns List */}
        <View style={styles.returnsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Devoluciones</Text>
          </View>
          
          <FlatList
            data={mockReturns}
            renderItem={renderReturnItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      {renderNewReturnModal()}
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
  },
  newReturnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newReturnBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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
  returnsSection: {
    marginBottom: 20,
  },
  returnItem: {
    backgroundColor: COLORS.light,
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
  returnId: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  returnStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  returnStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  returnStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  returnPriority: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  returnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  returnInfo: {
    flex: 1,
  },
  returnClient: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  returnProduct: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
  },
  returnDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  returnReason: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 12,
    lineHeight: 20,
  },
  returnReasonLabel: {
    fontWeight: '600',
  },
  returnPhotos: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  returnPhotoThumb: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  morePhotosText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray,
  },
  returnActions: {
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
    backgroundColor: COLORS.danger,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
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
    height: 80,
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
});

export default ReturnsScreen;
