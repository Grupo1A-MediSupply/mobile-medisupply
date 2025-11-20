import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, ORDER_STATUS, MOCK_DATA, GRADIENTS } from '../constants';
import { Order, OrderProduct, OrderHistory } from '../types';
import { formatNIT } from '../utils/formatting';

interface OrderDetailScreenProps {
  navigation: any;
  route: {
    params: {
      order: Order;
    };
  };
}

const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const { order } = route.params;
  const [isEditing, setIsEditing] = useState(false);

  // Obtener información del cliente
  const client = MOCK_DATA.clients.find(c => c.id === order.clientId) || {
    id: order.clientId,
    name: order.clientName,
    email: '',
    phone: '',
    address: '',
    status: 'active' as const,
  };

  // Calcular valores si no existen
  const subtotal = order.subtotal || order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const discount = order.discount || 0;
  const tax = order.tax || Math.round(subtotal * 0.19); // IVA 19%
  const total = order.total || (subtotal - discount + tax);

  // Fecha estimada de entrega (3 días después de la creación)
  const estimatedDeliveryDate = order.estimatedDeliveryDate || 
    new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

  // Historial del pedido
  const history: OrderHistory[] = order.history || [
    { id: '1', status: 'pending', date: order.createdAt, notes: 'Pedido creado' },
    ...(order.status !== 'pending' ? [{ id: '2', status: order.status, date: order.updatedAt }] : []),
  ];

  const getStatusColor = (status: string) => {
    const statusObj = ORDER_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.color : COLORS.gray;
  };

  const getStatusLabel = (status: string) => {
    const statusObj = ORDER_STATUS.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Pedido',
      '¿Estás seguro de que deseas cancelar este pedido?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Cancelar',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Éxito', 'El pedido ha sido cancelado');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
    Alert.alert('Editar Pedido', 'Funcionalidad de edición en desarrollo');
    setIsEditing(false);
  };

  const handleMarkAsDelivered = () => {
    Alert.alert(
      'Marcar como Entregado',
      '¿Confirmas que este pedido ha sido entregado?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, Confirmar',
          onPress: () => {
            Alert.alert('Éxito', 'El pedido ha sido marcado como entregado');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSharePDF = async () => {
    try {
      await Share.share({
        message: `Pedido ${order.id}\nCliente: ${order.clientName}\nTotal: $${total.toLocaleString()}`,
        title: `Pedido ${order.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el pedido');
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Pedido ${order.id}\nCliente: ${order.clientName}\nTotal: $${total.toLocaleString()}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp no está instalado');
    });
  };

  const renderProductItem = ({ item }: { item: OrderProduct }) => {
    const product = MOCK_DATA.products.find(p => p.id === item.productId);
    const subtotal = item.price * item.quantity;

    return (
      <View style={styles.productItem}>
        <View style={styles.productImageContainer}>
          {product?.image ? (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <MaterialIcons name="inventory" size={32} color={COLORS.gray} />
            </View>
          )}
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          <View style={styles.productDetails}>
            <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
            <Text style={styles.productPrice}>${item.price.toLocaleString()} c/u</Text>
          </View>
          <Text style={styles.productSubtotal}>
            Subtotal: ${subtotal.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderTimelineItem = ({ item, index }: { item: OrderHistory; index: number }) => {
    const isLast = index === history.length - 1;
    const statusColor = getStatusColor(item.status);

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineDotContainer}>
          <View style={[styles.timelineDot, { backgroundColor: statusColor }]} />
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.timelineStatus}>{getStatusLabel(item.status)}</Text>
          <Text style={styles.timelineDate}>
            {new Date(item.date).toLocaleString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {item.notes && (
            <Text style={styles.timelineNotes}>{item.notes}</Text>
          )}
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item }: { item: OrderHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyStatus}>{getStatusLabel(item.status)}</Text>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleString('es-ES')}
        </Text>
      </View>
      {item.notes && (
        <Text style={styles.historyNotes}>{item.notes}</Text>
      )}
      {item.userName && (
        <Text style={styles.historyUser}>Por: {item.userName}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={GRADIENTS.primary}
            style={styles.headerGradient}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.orderNumber}>Pedido #{order.id}</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
                  <Text style={styles.statusText}>{getStatusLabel(order.status)}</Text>
                </View>
              </View>
              <Text style={styles.orderTotal}>${total.toLocaleString()}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Cliente</Text>
          <View style={styles.clientCard}>
            <Text style={styles.clientName}>{client.name}</Text>
            {client.nit && (
              <Text style={styles.clientDetail}>NIT: {formatNIT(client.nit)}</Text>
            )}
            <Text style={styles.clientDetail}>Dirección: {client.address || 'No especificada'}</Text>
            <Text style={styles.clientDetail}>Teléfono: {client.phone || 'No especificado'}</Text>
            <Text style={styles.clientDetail}>Email: {client.email || 'No especificado'}</Text>
          </View>
        </View>

        {/* Dates Section */}
        <View style={styles.section}>
          <View style={styles.datesRow}>
            <View style={styles.dateCard}>
              <Text style={styles.dateLabel}>Fecha de Creación</Text>
              <Text style={styles.dateValue}>
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.dateTime}>
                {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.dateCard}>
              <Text style={styles.dateLabel}>Fecha Estimada de Entrega</Text>
              <Text style={styles.dateValue}>
                {new Date(estimatedDeliveryDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Text style={styles.dateTime}>
                {new Date(estimatedDeliveryDate).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos del Pedido</Text>
          <FlatList
            data={order.products}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => `${item.productId}-${index}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Cost Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de Costos</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toLocaleString()}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Descuento</Text>
                <Text style={[styles.summaryValue, styles.discountValue]}>
                  -${discount.toLocaleString()}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>IVA (19%)</Text>
              <Text style={styles.summaryValue}>${tax.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Timeline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estados del Pedido</Text>
          <View style={styles.timelineContainer}>
            <FlatList
              data={history}
              renderItem={renderTimelineItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>

        {/* Notes Section */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notas o Comentarios</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          </View>
        )}

        {/* History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Cambios</Text>
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {order.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
            >
              <MaterialIcons name="cancel" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.editButton]}
                onPress={handleEdit}
              >
                <MaterialIcons name="edit" size={20} color={COLORS.white} />
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>
            </>
          )}

          {order.status === 'shipped' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deliveredButton]}
              onPress={handleMarkAsDelivered}
            >
              <MaterialIcons name="check-circle" size={20} color={COLORS.white} />
              <Text style={styles.actionButtonText}>Marcar como Entregado</Text>
            </TouchableOpacity>
          )}

          <View style={styles.shareButtons}>
            <TouchableOpacity
              style={[styles.shareButton, styles.pdfButton]}
              onPress={handleSharePDF}
            >
              <MaterialIcons name="picture-as-pdf" size={20} color={COLORS.white} />
              <Text style={styles.shareButtonText}>Compartir PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.shareButton, styles.whatsappButton]}
              onPress={handleShareWhatsApp}
            >
              <MaterialIcons name="chat" size={20} color={COLORS.white} />
              <Text style={styles.shareButtonText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
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
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerSection: {
    marginBottom: 20,
    borderRadius: 0,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  orderTotal: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 12,
  },
  clientCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  clientDetail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCard: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.light,
  },
  productImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: COLORS.gray,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  productSubtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  discountValue: {
    color: COLORS.success,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timelineContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDotContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.border,
    marginTop: 4,
    minHeight: 30,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  timelineNotes: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  notesCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
  },
  historyItem: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.gray,
  },
  historyNotes: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
  },
  historyUser: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deliveredButton: {
    backgroundColor: COLORS.success,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  shareButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
  },
  pdfButton: {
    backgroundColor: COLORS.danger,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
});

export default OrderDetailScreen;

