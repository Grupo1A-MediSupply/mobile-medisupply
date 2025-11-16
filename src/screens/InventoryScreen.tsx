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
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { COLORS, SIZES, MOCK_DATA, CATEGORIES, GRADIENTS } from '../constants';
import { Product } from '../types';
import { validateRequired, validatePrice, validateStock } from '../utils/validation';

interface InventoryScreenProps {
  navigation: any;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('cards');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCategorySelectModal, setShowCategorySelectModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    specifications: '',
    wholesalePrice: '',
    minStock: '',
    supplier: '',
    photos: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const allProducts = MOCK_DATA.products;

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalProducts = allProducts.length;
    const lowStock = allProducts.filter(p => p.stock < 10).length;
    const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    return {
      totalProducts,
      lowStock,
      totalValue,
    };
  }, [allProducts]);

  // Filtrar y ordenar productos
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Filtro de búsqueda (nombre o código)
      const matchesSearch = searchText === '' || 
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.code.toLowerCase().includes(searchText.toLowerCase());
      
      // Filtro de categoría
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      
      // Filtro de stock
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = product.stock < 10;
      } else if (stockFilter === 'normal') {
        matchesStock = product.stock >= 10 && product.stock < 50;
      } else if (stockFilter === 'high') {
        matchesStock = product.stock >= 50;
      }
      
      return matchesSearch && matchesCategory && matchesStock;
    });

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, searchText, categoryFilter, stockFilter, sortBy]);

  const getStockStatus = (stock: number) => {
    if (stock < 10) return { status: 'low', color: COLORS.danger, label: 'Bajo' };
    if (stock < 50) return { status: 'normal', color: COLORS.warning, label: 'Medio' };
    return { status: 'high', color: COLORS.success, label: 'Alto' };
  };

  const statsCards = [
    {
      title: 'Total Productos',
      value: stats.totalProducts.toString(),
      icon: 'inventory',
      color: COLORS.primary,
    },
    {
      title: 'Stock Bajo',
      value: stats.lowStock.toString(),
      icon: 'warning',
      color: COLORS.warning,
    },
    {
      title: 'Valor Total',
      value: `$${(stats.totalValue / 1000000).toFixed(1)}M`,
      icon: 'attach-money',
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

  const handleProductPress = (product: Product) => {
    // Por ahora mostrar un alert, luego se puede crear una pantalla de detalle
    navigation.navigate('ProductDetail', { product });
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item.stock);
    
    return (
      <TouchableOpacity 
        style={styles.productItem}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.7}
      >
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.productImage} />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <MaterialIcons name="inventory" size={40} color={COLORS.gray} />
            </View>
          )}
        </View>

        <View style={styles.productContent}>
          <View style={styles.productHeader}>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productCode}>{item.code}</Text>
            </View>
            <View style={[styles.productCategory, { backgroundColor: COLORS.light }]}>
              <Text style={styles.productCategoryText}>
                {CATEGORIES.find(cat => cat.value === item.category)?.label}
              </Text>
            </View>
          </View>
          
          <View style={styles.productDetails}>
            <View style={styles.productPriceContainer}>
              <Text style={styles.productPriceLabel}>Precio</Text>
              <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
            </View>
            <View style={styles.productStockContainer}>
              <Text style={styles.productStockLabel}>Stock</Text>
              <View style={styles.stockIndicator}>
                <View style={[styles.stockDot, { backgroundColor: stockStatus.color }]} />
                <Text style={[styles.stockText, { color: stockStatus.color }]}>
                  {item.stock} unidades
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      specifications: '',
      wholesalePrice: '',
      minStock: '',
      supplier: '',
      photos: [],
    });
    setFormErrors({});
  };

  const handlePickImage = async () => {
    if (formData.photos.length >= 5) {
      Alert.alert('Límite alcanzado', 'Solo puedes agregar un máximo de 5 fotos');
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.slice(0, 5 - formData.photos.length).map(asset => asset.uri);
        setFormData({ ...formData, photos: [...formData.photos, ...newPhotos] });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la imagen');
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: newPhotos });
  };

  const handleScanBarcode = () => {
    // Simulación de escaneo de código de barras
    Alert.alert(
      'Escanear Código',
      'Funcionalidad de escaneo de código de barras. En producción, esto abriría la cámara para escanear.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular Escaneo',
          onPress: () => {
            // Generar un código aleatorio para simular
            const randomCode = 'PROD' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            setFormData({ ...formData, code: randomCode });
            Alert.alert('Código Escaneado', `Código: ${randomCode}`);
          },
        },
      ]
    );
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      errors.name = 'El nombre es obligatorio';
    }

    if (!validateRequired(formData.code)) {
      errors.code = 'El código es obligatorio';
    } else {
      // Validar que el código no exista
      const codeExists = allProducts.some(p => p.code.toLowerCase() === formData.code.toLowerCase());
      if (codeExists) {
        errors.code = 'Este código ya existe';
      }
    }

    if (!validateRequired(formData.category)) {
      errors.category = 'La categoría es obligatoria';
    }

    if (!validateRequired(formData.price)) {
      errors.price = 'El precio es obligatorio';
    } else if (!validatePrice(formData.price)) {
      errors.price = 'El precio debe ser un número positivo';
    }

    if (!validateRequired(formData.stock)) {
      errors.stock = 'El stock inicial es obligatorio';
    } else if (!validateStock(formData.stock)) {
      errors.stock = 'El stock debe ser un número entero positivo';
    }

    if (formData.wholesalePrice && !validatePrice(formData.wholesalePrice)) {
      errors.wholesalePrice = 'El precio mayorista debe ser un número positivo';
    }

    if (formData.minStock && !validateStock(formData.minStock)) {
      errors.minStock = 'El stock mínimo debe ser un número entero positivo';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (addAnother: boolean = false) => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor corrige los errores en el formulario');
      return;
    }

    setIsSaving(true);

    // Simular guardado
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'Éxito',
        'Producto guardado exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              if (addAnother) {
                resetForm();
                setShowPreviewModal(false);
              } else {
                resetForm();
                setShowAddModal(false);
                setShowPreviewModal(false);
              }
            },
          },
        ]
      );
    }, 1000);
  };

  const handlePreview = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }
    setShowPreviewModal(true);
  };

  const renderAddProductModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setShowAddModal(false);
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nuevo Producto</Text>
            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
            {/* Fotos */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Fotos del Producto (máximo 5)</Text>
              <View style={styles.photosContainer}>
                {formData.photos.map((photo, index) => (
                  <View key={index} style={styles.photoItem}>
                    <Image source={{ uri: photo }} style={styles.photoPreview} />
                    <TouchableOpacity
                      style={styles.removePhotoButton}
                      onPress={() => handleRemovePhoto(index)}
                    >
                      <MaterialIcons name="close" size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
                {formData.photos.length < 5 && (
                  <TouchableOpacity style={styles.addPhotoButton} onPress={handlePickImage}>
                    <MaterialIcons name="add-a-photo" size={24} color={COLORS.primary} />
                    <Text style={styles.addPhotoText}>Agregar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Nombre - Obligatorio */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Nombre <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.formInput, formErrors.name && styles.formInputError]}
                placeholder="Ingresa el nombre del producto"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
              />
              {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            {/* Código - Obligatorio */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Código <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.codeInputContainer}>
                <TextInput
                  style={[styles.formInput, styles.codeInput, formErrors.code && styles.formInputError]}
                  placeholder="Código del producto"
                  value={formData.code}
                  onChangeText={(text) => {
                    setFormData({ ...formData, code: text });
                    if (formErrors.code) setFormErrors({ ...formErrors, code: '' });
                  }}
                />
                <TouchableOpacity style={styles.scanButton} onPress={handleScanBarcode}>
                  <MaterialIcons name="qr-code-scanner" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              {formErrors.code && <Text style={styles.errorText}>{formErrors.code}</Text>}
            </View>

            {/* Categoría - Obligatorio */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Categoría <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={[styles.formSelect, formErrors.category && styles.formInputError]}
                onPress={() => setShowCategorySelectModal(true)}
              >
                <Text style={[styles.formSelectText, !formData.category && { color: COLORS.gray }]}>
                  {formData.category
                    ? CATEGORIES.find(cat => cat.value === formData.category)?.label
                    : 'Seleccionar categoría'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color={COLORS.gray} />
              </TouchableOpacity>
              {formErrors.category && <Text style={styles.errorText}>{formErrors.category}</Text>}
            </View>

            {/* Precio - Obligatorio */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Precio <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.formInput, formErrors.price && styles.formInputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(text) => {
                  setFormData({ ...formData, price: text });
                  if (formErrors.price) setFormErrors({ ...formErrors, price: '' });
                }}
              />
              {formErrors.price && <Text style={styles.errorText}>{formErrors.price}</Text>}
            </View>

            {/* Stock Inicial - Obligatorio */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Stock Inicial <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.formInput, formErrors.stock && styles.formInputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.stock}
                onChangeText={(text) => {
                  setFormData({ ...formData, stock: text });
                  if (formErrors.stock) setFormErrors({ ...formErrors, stock: '' });
                }}
              />
              {formErrors.stock && <Text style={styles.errorText}>{formErrors.stock}</Text>}
            </View>

            {/* Descripción - Opcional */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Descripción</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Descripción del producto"
                multiline
                numberOfLines={3}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>

            {/* Especificaciones - Opcional */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Especificaciones</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Especificaciones técnicas"
                multiline
                numberOfLines={3}
                value={formData.specifications}
                onChangeText={(text) => setFormData({ ...formData, specifications: text })}
              />
            </View>

            {/* Precio Mayorista - Opcional */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Precio Mayorista</Text>
              <TextInput
                style={[styles.formInput, formErrors.wholesalePrice && styles.formInputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.wholesalePrice}
                onChangeText={(text) => {
                  setFormData({ ...formData, wholesalePrice: text });
                  if (formErrors.wholesalePrice) setFormErrors({ ...formErrors, wholesalePrice: '' });
                }}
              />
              {formErrors.wholesalePrice && <Text style={styles.errorText}>{formErrors.wholesalePrice}</Text>}
            </View>

            {/* Stock Mínimo - Opcional */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Stock Mínimo</Text>
              <TextInput
                style={[styles.formInput, formErrors.minStock && styles.formInputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.minStock}
                onChangeText={(text) => {
                  setFormData({ ...formData, minStock: text });
                  if (formErrors.minStock) setFormErrors({ ...formErrors, minStock: '' });
                }}
              />
              {formErrors.minStock && <Text style={styles.errorText}>{formErrors.minStock}</Text>}
            </View>

            {/* Proveedor - Opcional */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Proveedor</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Nombre del proveedor"
                value={formData.supplier}
                onChangeText={(text) => setFormData({ ...formData, supplier: text })}
              />
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.secondaryBtn]}
              onPress={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.gray }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.previewBtn]}
              onPress={handlePreview}
            >
              <MaterialIcons name="visibility" size={16} color={COLORS.white} />
              <Text style={[styles.modalBtnText, { color: COLORS.white, marginLeft: 4 }]}>Vista Previa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.primaryBtn]}
              onPress={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPreviewModal = () => (
    <Modal
      visible={showPreviewModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPreviewModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vista Previa del Producto</Text>
            <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
              <MaterialIcons name="close" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
            {/* Fotos */}
            {formData.photos.length > 0 && (
              <View style={styles.previewPhotos}>
                {formData.photos.map((photo, index) => (
                  <Image key={index} source={{ uri: photo }} style={styles.previewPhoto} />
                ))}
              </View>
            )}

            <View style={styles.previewSection}>
              <Text style={styles.previewName}>{formData.name || 'Nombre del producto'}</Text>
              <Text style={styles.previewCode}>Código: {formData.code || 'N/A'}</Text>
              {formData.category && (
                <View style={styles.previewCategory}>
                  <Text style={styles.previewCategoryText}>
                    {CATEGORIES.find(cat => cat.value === formData.category)?.label}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.previewDetails}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Precio:</Text>
                <Text style={styles.previewValue}>${parseFloat(formData.price || '0').toLocaleString()}</Text>
              </View>
              {formData.wholesalePrice && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Precio Mayorista:</Text>
                  <Text style={styles.previewValue}>${parseFloat(formData.wholesalePrice).toLocaleString()}</Text>
                </View>
              )}
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Stock Inicial:</Text>
                <Text style={styles.previewValue}>{formData.stock || '0'} unidades</Text>
              </View>
              {formData.minStock && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Stock Mínimo:</Text>
                  <Text style={styles.previewValue}>{formData.minStock} unidades</Text>
                </View>
              )}
              {formData.supplier && (
                <View style={styles.previewRow}>
                  <Text style={styles.previewLabel}>Proveedor:</Text>
                  <Text style={styles.previewValue}>{formData.supplier}</Text>
                </View>
              )}
              {formData.description && (
                <View style={styles.previewDescription}>
                  <Text style={styles.previewLabel}>Descripción:</Text>
                  <Text style={styles.previewDescriptionText}>{formData.description}</Text>
                </View>
              )}
              {formData.specifications && (
                <View style={styles.previewDescription}>
                  <Text style={styles.previewLabel}>Especificaciones:</Text>
                  <Text style={styles.previewDescriptionText}>{formData.specifications}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalBtn, styles.secondaryBtn]}
              onPress={() => setShowPreviewModal(false)}
            >
              <Text style={[styles.modalBtnText, { color: COLORS.gray }]}>Volver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.successBtn]}
              onPress={() => handleSave(true)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <MaterialIcons name="add" size={16} color={COLORS.white} />
                  <Text style={[styles.modalBtnText, { color: COLORS.white, marginLeft: 4 }]}>
                    Guardar y Agregar Otro
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, styles.primaryBtn]}
              onPress={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={[styles.modalBtnText, { color: COLORS.white }]}>Guardar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const categoryOptions = [
    { value: 'all', label: 'Todas' },
    ...CATEGORIES.map(cat => ({ value: cat.value, label: cat.label })),
  ];

  const stockOptions = [
    { value: 'all', label: 'Todo' },
    { value: 'low', label: 'Stock Bajo' },
    { value: 'normal', label: 'Stock Normal' },
    { value: 'high', label: 'Stock Alto' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Por Nombre' },
    { value: 'price', label: 'Por Precio' },
    { value: 'stock', label: 'Por Stock' },
    { value: 'category', label: 'Por Categoría' },
  ];

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

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre o código..."
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

        {/* Filters */}
        <View style={styles.filtersSection}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <MaterialIcons name="category" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>
              {categoryOptions.find(opt => opt.value === categoryFilter)?.label || 'Categoría'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowStockModal(true)}
          >
            <MaterialIcons name="inventory" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>
              {stockOptions.find(opt => opt.value === stockFilter)?.label || 'Stock'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSortModal(true)}
          >
            <MaterialIcons name="sort" size={16} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>
              {sortOptions.find(opt => opt.value === sortBy)?.label || 'Ordenar'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={16} color={COLORS.gray} />
          </TouchableOpacity>
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
          
          <Text style={styles.productCount}>
            {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'producto' : 'productos'}
          </Text>
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
              <Text style={styles.addProductBtnText}>Nuevo</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredAndSortedProducts}
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
      {renderPreviewModal()}
      {renderFilterModal(
        showCategoryModal,
        () => setShowCategoryModal(false),
        'Filtrar por Categoría',
        categoryOptions,
        categoryFilter,
        setCategoryFilter
      )}
      {renderFilterModal(
        showStockModal,
        () => setShowStockModal(false),
        'Filtrar por Stock',
        stockOptions,
        stockFilter,
        setStockFilter
      )}
      {renderFilterModal(
        showSortModal,
        () => setShowSortModal(false),
        'Ordenar por',
        sortOptions,
        sortBy,
        setSortBy
      )}
      {renderFilterModal(
        showCategorySelectModal,
        () => setShowCategorySelectModal(false),
        'Seleccionar Categoría',
        CATEGORIES.map(cat => ({ value: cat.value, label: cat.label })),
        formData.category,
        (value) => {
          setFormData({ ...formData, category: value });
          if (formErrors.category) setFormErrors({ ...formErrors, category: '' });
        }
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
  filtersSection: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.black,
    flex: 1,
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
  productCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
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
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageContainer: {
    marginRight: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.light,
  },
  productImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  productCode: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'monospace',
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
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPriceContainer: {
    flex: 1,
  },
  productPriceLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },
  productStockContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productStockLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginBottom: 2,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridRow: {
    justifyContent: 'space-between',
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
  modalContentLarge: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
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
  primaryBtn: {
    backgroundColor: COLORS.primary,
  },
  secondaryBtn: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewBtn: {
    backgroundColor: COLORS.info,
  },
  successBtn: {
    backgroundColor: COLORS.success,
  },
  required: {
    color: COLORS.danger,
  },
  formInputError: {
    borderColor: COLORS.danger,
    borderWidth: 1,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  photoItem: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light,
  },
  addPhotoText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeInput: {
    flex: 1,
  },
  scanButton: {
    padding: 10,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  previewContent: {
    flex: 1,
  },
  previewPhotos: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  previewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  previewSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  previewName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  previewCode: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  previewCategory: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  previewCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  previewDetails: {
    gap: 16,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
  },
  previewDescription: {
    marginTop: 8,
  },
  previewDescriptionText: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 20,
    marginTop: 4,
  },
});

export default InventoryScreen;
