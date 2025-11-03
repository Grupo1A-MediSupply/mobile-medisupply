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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, MOCK_DATA, CATEGORIES, GRADIENTS } from '../constants';
import { Product } from '../types';

interface InventoryScreenProps {
  navigation: any;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [products, setProducts] = useState<Product[]>(MOCK_DATA.products);
  const [showAddModal, setShowAddModal] = useState(false);

  const statsCards = [
    {
      title: 'Productos',
      value: '48',
      icon: 'inventory',
      color: COLORS.primary,
    },
    {
      title: 'Stock Bajo',
      value: '7',
      icon: 'warning',
      color: COLORS.warning,
    },
    {
      title: 'Valor Total',
      value: '$45.2M',
      icon: 'attach-money',
      color: COLORS.success,
    },
  ];

  const getStockStatus = (stock: number) => {
    if (stock < 10) return { status: 'low', color: COLORS.danger };
    if (stock < 50) return { status: 'normal', color: COLORS.warning };
    return { status: 'high', color: COLORS.success };
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

  const renderProductItem = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item.stock);
    
    return (
      <TouchableOpacity style={styles.productItem}>
        <View style={styles.productHeader}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.productCategory, { backgroundColor: COLORS.light }]}>
            <Text style={styles.productCategoryText}>
              {CATEGORIES.find(cat => cat.value === item.category)?.label}
            </Text>
          </View>
        </View>
        
        <View style={styles.productContent}>
          <View style={styles.productInfo}>
            <Text style={styles.productCode}>{item.code}</Text>
            <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
          </View>
        </View>
        
        <View style={styles.productStock}>
          <View style={styles.stockIndicator}>
            <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
            <Text style={[styles.stockText, { color: stockStatus.color }]}>
              {item.stock} unidades
            </Text>
          </View>
          <View style={styles.stockBar}>
            <View 
              style={[
                styles.stockBarFill, 
                { 
                  width: `${Math.min((item.stock / 100) * 100, 100)}%`,
                  backgroundColor: stockStatus.color 
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.productDetails}>
          <Text style={styles.productSupplier}>Proveedor: {item.supplier}</Text>
          {item.expiryDate && (
            <Text style={styles.productExpiry}>Vence: {item.expiryDate}</Text>
          )}
        </View>
        
        <View style={styles.productActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
            <MaterialIcons name="edit" size={16} color={COLORS.white} />
            <Text style={styles.actionBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]}>
            <MaterialIcons name="visibility" size={16} color={COLORS.gray} />
            <Text style={[styles.actionBtnText, { color: COLORS.gray }]}>Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]}>
            <MaterialIcons name="delete" size={16} color={COLORS.danger} />
            <Text style={[styles.actionBtnText, { color: COLORS.danger }]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddProductModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Producto</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Nombre del Producto</Text>
              <TextInput style={styles.formInput} placeholder="Ingresa el nombre" />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Código</Text>
              <TextInput style={styles.formInput} placeholder="Código del producto" />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Categoría</Text>
              <View style={styles.formSelect}>
                <Text style={styles.formSelectText}>Seleccionar categoría</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.gray} />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Precio</Text>
              <TextInput style={styles.formInput} placeholder="0" keyboardType="numeric" />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Stock</Text>
              <TextInput style={styles.formInput} placeholder="0" keyboardType="numeric" />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Proveedor</Text>
              <TextInput style={styles.formInput} placeholder="Nombre del proveedor" />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalBtn, styles.secondaryBtn]}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.gray }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.primaryBtn]}>
              <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Guardar</Text>
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
          <Text style={styles.welcomeTitle}>Gestión de Inventario</Text>
          <Text style={styles.welcomeSubtitle}>Controla el stock de productos médicos</Text>
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
              placeholder="Buscar productos..."
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
              <Text style={styles.filterLabel}>Categoría</Text>
              <View style={styles.filterSelect}>
                <Text style={styles.filterSelectText}>
                  {CATEGORIES.find(cat => cat.value === categoryFilter)?.label || 'Todas'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Stock</Text>
              <View style={styles.filterSelect}>
                <Text style={styles.filterSelectText}>
                  {stockFilter === 'all' ? 'Todo' : 
                   stockFilter === 'low' ? 'Bajo' :
                   stockFilter === 'normal' ? 'Normal' : 'Alto'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={20} color={COLORS.gray} />
              </View>
            </View>
          </View>
        </View>

        {/* View Controls */}
        <View style={styles.viewControls}>
          <View style={styles.viewOptions}>
            <TouchableOpacity
              style={[styles.viewOption, viewMode === 'grid' && styles.viewOptionActive]}
              onPress={() => setViewMode('grid')}
            >
              <MaterialIcons name="grid-view" size={16} color={viewMode === 'grid' ? COLORS.white : COLORS.gray} />
              <Text style={[styles.viewOptionText, viewMode === 'grid' && styles.viewOptionTextActive]}>
                Cuadrícula
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewOption, viewMode === 'cards' && styles.viewOptionActive]}
              onPress={() => setViewMode('cards')}
            >
              <MaterialIcons name="view-module" size={16} color={viewMode === 'cards' ? COLORS.white : COLORS.gray} />
              <Text style={[styles.viewOptionText, viewMode === 'cards' && styles.viewOptionTextActive]}>
                Tarjetas
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.viewInfo}>
            <Text style={styles.viewInfoText}>{products.length} productos</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.viewInfoText}>Mostrando todos</Text>
          </View>
        </View>

        {/* Products List */}
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lista de Productos</Text>
            <TouchableOpacity 
              style={styles.addProductBtn}
              onPress={() => setShowAddModal(true)}
            >
              <MaterialIcons name="add" size={16} color={COLORS.white} />
              <Text style={styles.addProductBtnText}>Nuevo Producto</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            numColumns={viewMode === 'grid' ? 2 : 1}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
          />
        </View>
      </ScrollView>

      {renderAddProductModal()}
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
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  viewOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  viewOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
  },
  viewOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  viewOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
    marginLeft: 4,
  },
  viewOptionTextActive: {
    color: COLORS.white,
  },
  viewInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewInfoText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  separator: {
    color: COLORS.gray,
  },
  productsSection: {
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
  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addProductBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  productItem: {
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
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    flex: 1,
  },
  productCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productCategoryText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: COLORS.gray,
  },
  productContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
  },
  productCode: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  productStock: {
    marginBottom: 12,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
  },
  stockBar: {
    height: 6,
    backgroundColor: COLORS.light,
    borderRadius: 3,
    overflow: 'hidden',
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productSupplier: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productExpiry: {
    fontSize: 12,
    color: COLORS.gray,
  },
  productActions: {
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
  dangerBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  gridRow: {
    justifyContent: 'space-between',
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

export default InventoryScreen;
