import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Linking,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, FONTS, GRADIENTS, MOCK_DATA } from '../constants';
import { Client, Order, Visit, Product } from '../types';
import { formatCurrency, formatDate, formatNIT, formatPhone } from '../utils/formatting';

interface ClientDetailScreenProps {
  navigation: any;
  route: {
    params: {
      client: Client;
    };
  };
}

const ClientDetailScreen: React.FC<ClientDetailScreenProps> = ({ navigation, route }) => {
  const { client } = route.params;
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(client.notes || '');
  const [showEditModal, setShowEditModal] = useState(false);

  // Datos mock para estadísticas e historiales
  const [clientStats, setClientStats] = useState({
    totalOrders: 12,
    totalValue: 2450000,
    lastVisit: '2024-01-15',
  });

  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [clientVisits, setClientVisits] = useState<Visit[]>([]);
  const [topProducts, setTopProducts] = useState<{ product: Product; quantity: number; total: number }[]>([]);

  useEffect(() => {
    // Simular carga de datos del cliente
    loadClientData();
  }, []);

  const loadClientData = () => {
    // Mock de pedidos del cliente
    const orders: Order[] = [
      {
        id: '1',
        clientId: client.id,
        clientName: client.name,
        products: [
          { productId: '1', productName: 'Mascarillas N95', quantity: 50, price: 2500 },
          { productId: '2', productName: 'Termómetro Digital', quantity: 2, price: 45000 },
        ],
        total: 215000,
        status: 'delivered',
        priority: 'high',
        createdAt: '2024-01-10T10:00:00',
        updatedAt: '2024-01-12T14:30:00',
      },
      {
        id: '2',
        clientId: client.id,
        clientName: client.name,
        products: [
          { productId: '3', productName: 'Guantes Nitrilo', quantity: 20, price: 12000 },
        ],
        total: 240000,
        status: 'delivered',
        priority: 'medium',
        createdAt: '2024-01-05T09:00:00',
        updatedAt: '2024-01-07T11:00:00',
      },
    ];

    // Mock de visitas del cliente
    const visits: Visit[] = [
      {
        id: '1',
        clientId: client.id,
        clientName: client.name,
        address: client.address,
        status: 'completed',
        priority: 'high',
        scheduledDate: '2024-01-15T14:00:00',
        duration: 45,
        distance: 5.2,
        latitude: client.latitude,
        longitude: client.longitude,
      },
      {
        id: '2',
        clientId: client.id,
        clientName: client.name,
        address: client.address,
        status: 'completed',
        priority: 'medium',
        scheduledDate: '2024-01-08T10:00:00',
        duration: 30,
        distance: 5.2,
      },
    ];

    // Mock de productos más comprados
    const topProductsData = [
      { product: MOCK_DATA.products[0], quantity: 150, total: 375000 },
      { product: MOCK_DATA.products[2], quantity: 80, total: 960000 },
      { product: MOCK_DATA.products[1], quantity: 5, total: 225000 },
    ];

    setClientOrders(orders);
    setClientVisits(visits);
    setTopProducts(topProductsData);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${client.phone.replace(/\s/g, '')}`);
  };

  const handleWhatsApp = () => {
    const phoneNumber = client.phone.replace(/[^\d]/g, '');
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${client.email}`);
  };

  const handleCreateOrder = () => {
    navigation.navigate('NewOrder', { clientId: client.id });
  };

  const handleScheduleVisit = () => {
    navigation.navigate('Visits', { clientId: client.id });
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSaveNotes = () => {
    // Aquí se guardaría las notas en el backend
    Alert.alert('Éxito', 'Notas guardadas correctamente');
    setIsEditing(false);
  };

  const handleSaveClient = () => {
    // Aquí se guardaría la información editada del cliente
    Alert.alert('Éxito', 'Información del cliente actualizada correctamente');
    setShowEditModal(false);
  };

  const [editName, setEditName] = useState(client.name);
  const [editNit, setEditNit] = useState(client.nit || '');
  const [editPhone, setEditPhone] = useState(client.phone);
  const [editEmail, setEditEmail] = useState(client.email);
  const [editAddress, setEditAddress] = useState(client.address);
  const [editCity, setEditCity] = useState(client.city || '');

  const renderEditModal = () => {
    return (
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Cliente</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre *</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Nombre del cliente"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIT</Text>
                <TextInput
                  style={styles.input}
                  value={editNit}
                  onChangeText={(text) => {
                    const numbers = text.replace(/\D/g, '');
                    setEditNit(numbers);
                  }}
                  keyboardType="numeric"
                  placeholder="NIT"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono *</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  keyboardType="phone-pad"
                  placeholder="Teléfono"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo *</Text>
                <TextInput
                  style={styles.input}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Correo electrónico"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Dirección</Text>
                <TextInput
                  style={styles.input}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholder="Dirección"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ciudad</Text>
                <TextInput
                  style={styles.input}
                  value={editCity}
                  onChangeText={setEditCity}
                  placeholder="Ciudad"
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveClient}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <MaterialIcons name="edit" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
              {client.photo ? (
                <Image source={{ uri: client.photo }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.profileAvatar}>
                  <Text style={styles.profileAvatarText}>
                    {client.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <Text style={styles.clientName}>{client.name}</Text>
              {client.nit && (
                <Text style={styles.clientNIT}>NIT: {formatNIT(client.nit)}</Text>
              )}
            </View>

            {/* Contact Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información de Contacto</Text>
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{formatPhone(client.phone)}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="email" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{client.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>{client.address}</Text>
                {client.city && <Text style={styles.infoText}>{client.city}</Text>}
              </View>
            </View>

            {/* Map Section */}
            {client.latitude && client.longitude && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ubicación</Text>
                <View style={styles.mapContainer}>
                  <Text style={styles.mapPlaceholder}>
                    Mapa aquí (requiere react-native-maps)
                  </Text>
                  <Text style={styles.coordinatesText}>
                    {client.latitude.toFixed(6)}, {client.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            )}

            {/* Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estadísticas</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <MaterialIcons name="shopping-cart" size={24} color={COLORS.primary} />
                  <Text style={styles.statValue}>{clientStats.totalOrders}</Text>
                  <Text style={styles.statLabel}>Total Pedidos</Text>
                </View>
                <View style={styles.statCard}>
                  <MaterialIcons name="attach-money" size={24} color={COLORS.primary} />
                  <Text style={styles.statValue}>{formatCurrency(clientStats.totalValue)}</Text>
                  <Text style={styles.statLabel}>Valor Total</Text>
                </View>
                <View style={styles.statCard}>
                  <MaterialIcons name="event" size={24} color={COLORS.primary} />
                  <Text style={styles.statValue}>{formatDate(clientStats.lastVisit)}</Text>
                  <Text style={styles.statLabel}>Última Visita</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
              <View style={styles.actionButtonsGrid}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                  <MaterialIcons name="phone" size={24} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Llamar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.whatsappButton]} onPress={handleWhatsApp}>
                  <MaterialIcons name="chat" size={24} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.emailButton]} onPress={handleEmail}>
                  <MaterialIcons name="email" size={24} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.orderButton]} onPress={handleCreateOrder}>
                  <MaterialIcons name="add-shopping-cart" size={24} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Crear Pedido</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.visitButton]} onPress={handleScheduleVisit}>
                  <MaterialIcons name="event" size={24} color={COLORS.white} />
                  <Text style={styles.actionButtonText}>Agendar Visita</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Orders History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Historial de Pedidos</Text>
              {clientOrders.length > 0 ? (
                clientOrders.map((order) => (
                  <View key={order.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Pedido #{order.id}</Text>
                      <Text style={styles.historyDate}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <Text style={styles.historyAmount}>{formatCurrency(order.total)}</Text>
                    <View style={styles.historyStatus}>
                      <Text style={styles.historyStatusText}>
                        {order.status === 'delivered' ? 'Entregado' :
                         order.status === 'pending' ? 'Pendiente' :
                         order.status === 'processing' ? 'Procesando' :
                         order.status === 'shipped' ? 'Enviado' : 'Cancelado'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay pedidos registrados</Text>
              )}
            </View>

            {/* Visits History */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Historial de Visitas</Text>
              {clientVisits.length > 0 ? (
                clientVisits.map((visit) => (
                  <View key={visit.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyTitle}>Visita #{visit.id}</Text>
                      <Text style={styles.historyDate}>{formatDate(visit.scheduledDate)}</Text>
                    </View>
                    <Text style={styles.historySubtext}>
                      {visit.duration} min • {visit.distance} km
                    </Text>
                    <View style={styles.historyStatus}>
                      <Text style={styles.historyStatusText}>
                        {visit.status === 'completed' ? 'Completada' :
                         visit.status === 'pending' ? 'Pendiente' :
                         visit.status === 'in-progress' ? 'En Progreso' : 'Cancelada'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay visitas registradas</Text>
              )}
            </View>

            {/* Top Products */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Productos Más Comprados</Text>
              {topProducts.length > 0 ? (
                topProducts.map((item, index) => (
                  <View key={index} style={styles.productItem}>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName}>{item.product.name}</Text>
                      <Text style={styles.productDetails}>
                        Cantidad: {item.quantity} • Total: {formatCurrency(item.total)}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hay productos registrados</Text>
              )}
            </View>

            {/* Notes Section */}
            <View style={styles.section}>
              <View style={styles.notesHeader}>
                <Text style={styles.sectionTitle}>Notas del Cliente</Text>
                {!isEditing ? (
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <MaterialIcons name="edit" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={handleSaveNotes}>
                    <MaterialIcons name="check" size={20} color={COLORS.success} />
                  </TouchableOpacity>
                )}
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.notesInput, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Agregar notas sobre el cliente..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.notesText}>
                  {notes || 'No hay notas registradas'}
                </Text>
              )}
            </View>
          </ScrollView>

      {renderEditModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  headerSpacer: {
    flex: 1,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileAvatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: COLORS.white,
  },
  clientName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  clientNIT: {
    fontSize: 16,
    color: COLORS.gray,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
  },
  mapContainer: {
    height: 200,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapPlaceholder: {
    fontSize: 14,
    color: COLORS.gray,
  },
  coordinatesText: {
    marginTop: 8,
    fontSize: 12,
    color: COLORS.gray,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    gap: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
  actionButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    gap: 8,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  emailButton: {
    backgroundColor: COLORS.info,
  },
  orderButton: {
    backgroundColor: COLORS.success,
  },
  visitButton: {
    backgroundColor: COLORS.warning,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  historyDate: {
    fontSize: 14,
    color: COLORS.gray,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  historySubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  historyStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: COLORS.success,
    borderRadius: 12,
  },
  historyStatusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  productItem: {
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: COLORS.gray,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesInput: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  notesText: {
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 24,
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  editForm: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.light,
  },
  cancelButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ClientDetailScreen;

