import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, MOCK_DATA, GRADIENTS } from '../constants';
import { Product, OrderProduct } from '../types';

interface NewOrderScreenProps {
  navigation: any;
  route: {
    params: {
      clientId: string;
    };
  };
}

const NewOrderScreen: React.FC<NewOrderScreenProps> = ({ navigation, route }) => {
  const [cart, setCart] = useState<OrderProduct[]>([]);
  const selectedClient = route.params?.clientId || '1';
  const [showProductModal, setShowProductModal] = useState(false);

  const products = MOCK_DATA.products;
  const clients = MOCK_DATA.clients;

  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderOrderSummary = () => (
    <View style={styles.orderSummarySection}>
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.summaryGradient}
      >
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          <View style={styles.orderTotal}>
            <Text style={styles.totalAmount}>${getTotalAmount().toLocaleString()}</Text>
          </View>
        </View>
        
        <View style={styles.summaryDetails}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Productos</Text>
            <Text style={styles.summaryValue}>{getTotalItems()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Cliente</Text>
            <Text style={styles.summaryValue}>
              {clients.find(c => c.id === selectedClient)?.name}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <View style={styles.productImage}>
        <MaterialIcons name="inventory" size={40} color={COLORS.gray} />
      </View>
      
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.productCategory}>
            <Text style={styles.productCategoryText}>
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.productDetails}>
          <Text style={styles.productCode}>{item.code}</Text>
          <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
        </View>
        
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description || 'Sin descripción disponible'}
        </Text>
        
        <Text style={styles.productStock}>
          Stock disponible: {item.stock} unidades
        </Text>
      </View>
      
      <View style={styles.productActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => {
              const cartItem = cart.find(c => c.productId === item.id);
              const currentQuantity = cartItem ? cartItem.quantity : 0;
              if (currentQuantity > 0) {
                updateQuantity(item.id, currentQuantity - 1);
              }
            }}
          >
            <MaterialIcons name="remove" size={16} color={COLORS.white} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>
            {cart.find(c => c.productId === item.id)?.quantity || 0}
          </Text>
          
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => {
              const cartItem = cart.find(c => c.productId === item.id);
              const currentQuantity = cartItem ? cartItem.quantity : 0;
              if (currentQuantity < item.stock) {
                updateQuantity(item.id, currentQuantity + 1);
              }
            }}
            disabled={cart.find(c => c.productId === item.id)?.quantity >= item.stock}
          >
            <MaterialIcons name="add" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.addToCartBtn,
            cart.find(c => c.productId === item.id) && styles.addToCartBtnInCart
          ]}
          onPress={() => {
            const cartItem = cart.find(c => c.productId === item.id);
            if (!cartItem) {
              addToCart(item, 1);
            }
          }}
        >
          <MaterialIcons 
            name={cart.find(c => c.productId === item.id) ? "check" : "add-shopping-cart"} 
            size={16} 
            color={COLORS.white} 
          />
          <Text style={styles.addToCartBtnText}>
            {cart.find(c => c.productId === item.id) ? 'En Carrito' : 'Agregar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCartItem = ({ item }: { item: OrderProduct }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.productName}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toLocaleString()} c/u</Text>
      </View>
      
      <View style={styles.cartItemControls}>
        <TouchableOpacity 
          style={styles.cartQuantityBtn}
          onPress={() => updateQuantity(item.productId, item.quantity - 1)}
        >
          <MaterialIcons name="remove" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        
        <Text style={styles.cartQuantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.cartQuantityBtn}
          onPress={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          <MaterialIcons name="add" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.cartItemTotal}>
        ${(item.price * item.quantity).toLocaleString()}
      </Text>
    </View>
  );

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      alert('Agrega al menos un producto al carrito');
      return;
    }
    
    // Simular creación de pedido
    alert(`Pedido creado exitosamente por $${getTotalAmount().toLocaleString()}`);
    setCart([]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        {renderOrderSummary()}

        {/* Products Section */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos Disponibles</Text>
            <View style={styles.productsCount}>
              <Text style={styles.productsCountText}>{products.length} productos</Text>
            </View>
          </View>
          
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Cart Section */}
        {cart.length > 0 && (
          <View style={styles.cartSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Carrito de Compras</Text>
              <Text style={styles.cartTotal}>
                Total: ${getTotalAmount().toLocaleString()}
              </Text>
            </View>
            
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.productId}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}

        {/* Order Actions */}
        <View style={styles.orderActionsSection}>
          <TouchableOpacity 
            style={[styles.orderBtn, styles.secondaryBtn]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.orderBtnText, { color: COLORS.gray }]}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.orderBtn, styles.primaryBtn]}
            onPress={handleCreateOrder}
            disabled={cart.length === 0}
          >
            <Text style={[styles.orderBtnText, { color: COLORS.white }]}>
              Crear Pedido (${getTotalAmount().toLocaleString()})
            </Text>
          </TouchableOpacity>
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
  orderSummarySection: {
    marginBottom: 25,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  orderTotal: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  productsSection: {
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
  productsCount: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productsCountText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  productCategory: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productCategoryText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '500',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'monospace',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.success,
  },
  productDescription: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 16,
    marginBottom: 8,
  },
  productStock: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  addToCartBtnInCart: {
    backgroundColor: COLORS.success,
  },
  addToCartBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cartSection: {
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
  cartTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 12,
    color: COLORS.gray,
  },
  cartItemControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  cartQuantityBtn: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartQuantityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    minWidth: 60,
    textAlign: 'right',
  },
  orderActionsSection: {
    flexDirection: 'row',
    gap: 15,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  secondaryBtn: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NewOrderScreen;
