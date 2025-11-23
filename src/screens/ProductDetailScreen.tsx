import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, CATEGORIES, MOCK_DATA } from '../constants';
import { Product, StockMovement } from '../types';

interface ProductDetailScreenProps {
  navigation: any;
  route: {
    params: {
      product: Product;
    };
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ navigation, route }) => {
  const { product } = route.params;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomImageIndex, setZoomImageIndex] = useState(0);

  // Obtener imágenes del producto (usar images si existe, sino usar image)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : [];

  // Historial de movimientos de stock (mock data)
  const stockHistory: StockMovement[] = product.stockHistory || [
    { id: '1', type: 'entry', quantity: 50, date: '2024-01-10T10:00:00Z', reason: 'Compra inicial', userName: 'Admin' },
    { id: '2', type: 'exit', quantity: 25, date: '2024-01-12T14:30:00Z', reason: 'Venta', userName: 'Vendedor 1' },
    { id: '3', type: 'entry', quantity: 100, date: '2024-01-14T09:15:00Z', reason: 'Reabastecimiento', userName: 'Admin' },
    { id: '4', type: 'exit', quantity: 15, date: '2024-01-15T16:45:00Z', reason: 'Venta', userName: 'Vendedor 2' },
  ];

  // Productos relacionados (misma categoría, excluyendo el actual)
  const relatedProducts = MOCK_DATA.products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const getStockStatus = (stock: number) => {
    if (stock < 10) return { status: 'low', color: COLORS.danger, label: 'Bajo', percentage: (stock / 10) * 100 };
    if (stock < 50) return { status: 'normal', color: COLORS.warning, label: 'Medio', percentage: ((stock - 10) / 40) * 100 };
    return { status: 'high', color: COLORS.success, label: 'Alto', percentage: Math.min(((stock - 50) / 100) * 100, 100) };
  };

  const stockStatus = getStockStatus(product.stock);

  const handleAddToOrder = () => {
    // Navegar a SelectClient para iniciar un nuevo pedido con este producto
    navigation.navigate('SelectClient');
  };

  const handleImagePress = (index: number) => {
    setZoomImageIndex(index);
    setShowImageModal(true);
  };

  const handleRelatedProductPress = (relatedProduct: Product) => {
    navigation.replace('ProductDetail', { product: relatedProduct });
  };

  const renderImageGallery = () => {
    if (productImages.length === 0) {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.productImagePlaceholder}>
            <MaterialIcons name="inventory" size={80} color={COLORS.gray} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.imageGalleryContainer}>
        {/* Imagen principal */}
        <TouchableOpacity 
          style={styles.mainImageContainer}
          onPress={() => handleImagePress(selectedImageIndex)}
          activeOpacity={0.9}
        >
          <Image 
            source={{ uri: productImages[selectedImageIndex] }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          {productImages.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {selectedImageIndex + 1} / {productImages.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Miniaturas */}
        {productImages.length > 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailsContainer}
            contentContainerStyle={styles.thumbnailsContent}
          >
            {productImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailSelected
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderStockHistoryItem = ({ item }: { item: StockMovement }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyIconContainer}>
        <MaterialIcons 
          name={item.type === 'entry' ? 'arrow-downward' : 'arrow-upward'} 
          size={20} 
          color={item.type === 'entry' ? COLORS.success : COLORS.danger} 
        />
      </View>
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyType}>
            {item.type === 'entry' ? 'Entrada' : 'Salida'}
          </Text>
          <Text style={styles.historyQuantity}>
            {item.type === 'entry' ? '+' : '-'}{item.quantity} unidades
          </Text>
        </View>
        <Text style={styles.historyDate}>
          {new Date(item.date).toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
        {item.reason && (
          <Text style={styles.historyReason}>{item.reason}</Text>
        )}
        {item.userName && (
          <Text style={styles.historyUser}>Por: {item.userName}</Text>
        )}
      </View>
    </View>
  );

  const renderRelatedProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.relatedProductItem}
      onPress={() => handleRelatedProductPress(item)}
      activeOpacity={0.7}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.relatedProductImage} />
      ) : (
        <View style={styles.relatedProductImagePlaceholder}>
          <MaterialIcons name="inventory" size={24} color={COLORS.gray} />
        </View>
      )}
      <Text style={styles.relatedProductName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.relatedProductPrice}>
        ${item.price.toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Gallery */}
        {renderImageGallery()}

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productCode}>Código: {product.code}</Text>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {CATEGORIES.find(cat => cat.value === product.category)?.label}
            </Text>
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Precios</Text>
          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio Unitario</Text>
              <Text style={styles.priceValue}>${product.price.toLocaleString()}</Text>
            </View>
            {product.wholesalePrice && (
              <View style={[styles.priceRow, styles.priceRowHighlighted]}>
                <View style={styles.wholesaleBadge}>
                  <Text style={styles.wholesaleBadgeText}>MAYORISTA</Text>
                </View>
                <Text style={styles.priceValue}>${product.wholesalePrice.toLocaleString()}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stock Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stock</Text>
          <View style={styles.stockCard}>
            <View style={styles.stockHeader}>
              <Text style={styles.stockLabel}>Stock Actual</Text>
              <View style={styles.stockBadge}>
                <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
                <Text style={[styles.stockValue, { color: stockStatus.color }]}>
                  {product.stock} unidades ({stockStatus.label})
                </Text>
              </View>
            </View>
            
            {/* Stock Level Indicator */}
            <View style={styles.stockIndicatorContainer}>
              <View style={styles.stockIndicatorBar}>
                <View 
                  style={[
                    styles.stockIndicatorFill,
                    { 
                      width: `${Math.min(stockStatus.percentage, 100)}%`,
                      backgroundColor: stockStatus.color 
                    }
                  ]} 
                />
              </View>
              <View style={styles.stockLevels}>
                <Text style={styles.stockLevelText}>Bajo</Text>
                <Text style={styles.stockLevelText}>Medio</Text>
                <Text style={styles.stockLevelText}>Alto</Text>
              </View>
            </View>

            {product.lastStockUpdate && (
              <Text style={styles.lastUpdateText}>
                Última actualización: {new Date(product.lastStockUpdate).toLocaleDateString('es-ES')}
              </Text>
            )}
          </View>
        </View>

        {/* Description */}
        {product.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{product.description}</Text>
            </View>
          </View>
        )}

        {/* Specifications */}
        {product.specifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificaciones Técnicas</Text>
            <View style={styles.specificationsCard}>
              <Text style={styles.specificationsText}>{product.specifications}</Text>
            </View>
          </View>
        )}

        {/* Stock History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial de Movimientos</Text>
          {stockHistory.length > 0 ? (
            <View style={styles.historyCard}>
              <FlatList
                data={stockHistory}
                renderItem={renderStockHistoryItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>
          ) : (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryText}>No hay movimientos registrados</Text>
            </View>
          )}
        </View>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos Relacionados</Text>
            <FlatList
              data={relatedProducts}
              renderItem={renderRelatedProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedProductsList}
            />
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.addToOrderButton}
            onPress={handleAddToOrder}
          >
            <MaterialIcons name="add-shopping-cart" size={24} color={COLORS.white} />
            <Text style={styles.addToOrderButtonText}>Agregar al Pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Zoom Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalCloseButton}
            onPress={() => setShowImageModal(false)}
          >
            <MaterialIcons name="close" size={30} color={COLORS.white} />
          </TouchableOpacity>
          
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: zoomImageIndex * SCREEN_WIDTH, y: 0 }}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setZoomImageIndex(index);
              setSelectedImageIndex(index);
            }}
          >
            {productImages.map((image, index) => (
              <View key={index} style={styles.zoomImageContainer}>
                <Image 
                  source={{ uri: image }} 
                  style={styles.zoomImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {productImages.length > 1 && (
            <View style={styles.zoomImageCounter}>
              <Text style={styles.zoomImageCounterText}>
                {zoomImageIndex + 1} / {productImages.length}
              </Text>
            </View>
          )}
        </View>
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
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageGalleryContainer: {
    marginBottom: 0,
  },
  mainImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.light,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  imageCounterText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  thumbnailsContainer: {
    maxHeight: 80,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.light,
  },
  thumbnailsContent: {
    gap: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailSelected: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  productCode: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  pricingCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRowHighlighted: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  wholesaleBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  wholesaleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  stockCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  stockIndicatorContainer: {
    marginBottom: 12,
  },
  stockIndicatorBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  stockIndicatorFill: {
    height: '100%',
    borderRadius: 4,
  },
  stockLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockLevelText: {
    fontSize: 10,
    color: COLORS.gray,
  },
  lastUpdateText: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
    marginTop: 8,
  },
  descriptionCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
  },
  specificationsCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  specificationsText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  historyCard: {
    backgroundColor: COLORS.light,
    borderRadius: 12,
    padding: 16,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  historyQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  historyDate: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  historyReason: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 2,
  },
  historyUser: {
    fontSize: 12,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  emptyHistory: {
    padding: 20,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  relatedProductsList: {
    paddingHorizontal: 4,
    gap: 12,
  },
  relatedProductItem: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  relatedProductImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
    minHeight: 36,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionSection: {
    padding: 20,
  },
  addToOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  addToOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  zoomImageContainer: {
    width: SCREEN_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  zoomImageCounter: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zoomImageCounterText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
