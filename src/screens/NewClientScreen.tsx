import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { COLORS, SIZES, FONTS, GRADIENTS } from '../constants';
import { validateEmail, validatePhone, validateNIT, validateRequired } from '../utils/validation';
import { formatNIT, formatPhone } from '../utils/formatting';
import { Client } from '../types';

interface NewClientScreenProps {
  navigation: any;
}

const NewClientScreen: React.FC<NewClientScreenProps> = ({ navigation }) => {
  // Campos obligatorios
  const [name, setName] = useState('');
  const [nit, setNit] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Campos opcionales
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');

  // Otros campos
  const [clientType, setClientType] = useState<'regular' | 'premium'>('regular');
  const [photo, setPhoto] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState('');

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesitan permisos para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos', 'Se necesitan permisos para acceder a la ubicación');
      return;
    }

    setIsLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      // Obtener nombre de la ubicación (geocodificación inversa)
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const addr = geocode[0];
        const addrStr = `${addr.street || ''} ${addr.streetNumber || ''}, ${addr.city || ''}, ${addr.region || ''}`.trim();
        setLocationName(addrStr || 'Ubicación actual');
      } else {
        setLocationName('Ubicación actual');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación actual');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = () => {
    setShowMapModal(true);
  };

  const handleValidateForm = (): boolean => {
    if (!validateRequired(name)) {
      Alert.alert('Error', 'Por favor ingresa el nombre del cliente');
      return false;
    }

    if (!validateNIT(nit)) {
      Alert.alert('Error', 'Por favor ingresa un NIT válido (solo números, entre 9 y 11 dígitos)');
      return false;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Por favor ingresa un teléfono válido (mínimo 10 dígitos)');
      return false;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleShowPreview = () => {
    if (handleValidateForm()) {
      setShowPreview(true);
    }
  };

  const handleSave = async () => {
    if (!handleValidateForm()) {
      setShowPreview(false);
      return;
    }

    setIsLoading(true);

    // Simular guardado
    setTimeout(() => {
      setIsLoading(false);
      setShowPreview(false);
      
      Alert.alert(
        'Éxito',
        'Cliente guardado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };

  const renderPreview = () => {
    return (
      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Vista Previa</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.previewContent}>
              {photo && (
                <View style={styles.previewPhotoContainer}>
                  <Image source={{ uri: photo }} style={styles.previewPhoto} />
                </View>
              )}

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Nombre:</Text>
                <Text style={styles.previewValue}>{name}</Text>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>NIT:</Text>
                <Text style={styles.previewValue}>{formatNIT(nit)}</Text>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Teléfono:</Text>
                <Text style={styles.previewValue}>{formatPhone(phone)}</Text>
              </View>

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Correo:</Text>
                <Text style={styles.previewValue}>{email}</Text>
              </View>

              {address && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewLabel}>Dirección:</Text>
                  <Text style={styles.previewValue}>{address}</Text>
                </View>
              )}

              {city && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewLabel}>Ciudad:</Text>
                  <Text style={styles.previewValue}>{city}</Text>
                </View>
              )}

              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Tipo de Cliente:</Text>
                <Text style={styles.previewValue}>
                  {clientType === 'premium' ? 'Premium' : 'Regular'}
                </Text>
              </View>

              {locationName && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewLabel}>Ubicación:</Text>
                  <Text style={styles.previewValue}>{locationName}</Text>
                </View>
              )}

              {notes && (
                <View style={styles.previewSection}>
                  <Text style={styles.previewLabel}>Notas:</Text>
                  <Text style={styles.previewValue}>{notes}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPreview(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderMapModal = () => {
    return (
      <Modal
        visible={showMapModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Ubicación</Text>
              <TouchableOpacity onPress={() => setShowMapModal(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <Text style={styles.mapPlaceholder}>
                Mapa aquí (requiere react-native-maps)
              </Text>
              {latitude && longitude && (
                <Text style={styles.coordinatesText}>
                  Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </Text>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowMapModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  // Aquí se podría guardar la ubicación seleccionada del mapa
                  setShowMapModal(false);
                }}
              >
                <Text style={styles.saveButtonText}>Confirmar</Text>
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
      
      <LinearGradient
        colors={GRADIENTS.primary}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.phoneFrame}>
            {/* Status Bar */}
            <View style={styles.statusBar}>
              <Text style={styles.time}>9:41</Text>
              <View style={styles.statusIcons}>
                <MaterialIcons name="signal-cellular-4-bar" size={16} color={COLORS.black} />
                <MaterialIcons name="wifi" size={16} color={COLORS.black} />
                <MaterialIcons name="battery-full" size={16} color={COLORS.black} />
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>Nuevo Cliente</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Campos Obligatorios */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Información Obligatoria</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre del cliente"
                      placeholderTextColor={COLORS.gray}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>NIT *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="NIT (solo números)"
                      placeholderTextColor={COLORS.gray}
                      value={nit}
                      onChangeText={(text) => {
                        // Solo permitir números
                        const numbers = text.replace(/\D/g, '');
                        setNit(numbers);
                      }}
                      keyboardType="numeric"
                      maxLength={11}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Teléfono *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Teléfono (mínimo 10 dígitos)"
                      placeholderTextColor={COLORS.gray}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Correo Electrónico *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="correo@ejemplo.com"
                      placeholderTextColor={COLORS.gray}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                {/* Campos Opcionales */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Información Opcional</Text>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Dirección</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Dirección"
                      placeholderTextColor={COLORS.gray}
                      value={address}
                      onChangeText={setAddress}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Ciudad</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ciudad"
                      placeholderTextColor={COLORS.gray}
                      value={city}
                      onChangeText={setCity}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Notas</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Notas adicionales"
                      placeholderTextColor={COLORS.gray}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                {/* Tipo de Cliente */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tipo de Cliente</Text>
                  <View style={styles.clientTypeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.clientTypeButton,
                        clientType === 'regular' && styles.clientTypeButtonActive,
                      ]}
                      onPress={() => setClientType('regular')}
                    >
                      <MaterialIcons
                        name={clientType === 'regular' ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={20}
                        color={clientType === 'regular' ? COLORS.white : COLORS.gray}
                      />
                      <Text
                        style={[
                          styles.clientTypeText,
                          clientType === 'regular' && styles.clientTypeTextActive,
                        ]}
                      >
                        Regular
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.clientTypeButton,
                        clientType === 'premium' && styles.clientTypeButtonActive,
                      ]}
                      onPress={() => setClientType('premium')}
                    >
                      <MaterialIcons
                        name={clientType === 'premium' ? 'radio-button-checked' : 'radio-button-unchecked'}
                        size={20}
                        color={clientType === 'premium' ? COLORS.white : COLORS.gray}
                      />
                      <Text
                        style={[
                          styles.clientTypeText,
                          clientType === 'premium' && styles.clientTypeTextActive,
                        ]}
                      >
                        Premium
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Foto del Local */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Foto del Local</Text>
                  {photo ? (
                    <View style={styles.photoContainer}>
                      <Image source={{ uri: photo }} style={styles.photo} />
                      <TouchableOpacity
                        style={styles.removePhotoButton}
                        onPress={() => setPhoto(null)}
                      >
                        <MaterialIcons name="close" size={20} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.photoButtonsContainer}>
                      <TouchableOpacity
                        style={styles.photoButton}
                        onPress={handlePickImage}
                      >
                        <MaterialIcons name="photo-library" size={24} color={COLORS.primary} />
                        <Text style={styles.photoButtonText}>Galería</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.photoButton}
                        onPress={handleTakePhoto}
                      >
                        <MaterialIcons name="camera-alt" size={24} color={COLORS.primary} />
                        <Text style={styles.photoButtonText}>Cámara</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Ubicación */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ubicación</Text>
                  {locationName ? (
                    <View style={styles.locationContainer}>
                      <MaterialIcons name="location-on" size={20} color={COLORS.primary} />
                      <Text style={styles.locationText}>{locationName}</Text>
                      <TouchableOpacity onPress={() => {
                        setLocationName('');
                        setLatitude(null);
                        setLongitude(null);
                      }}>
                        <MaterialIcons name="close" size={20} color={COLORS.gray} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.locationButtonsContainer}>
                      <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleGetCurrentLocation}
                        disabled={isLoading}
                      >
                        <MaterialIcons name="my-location" size={24} color={COLORS.primary} />
                        <Text style={styles.locationButtonText}>
                          {isLoading ? 'Obteniendo...' : 'Ubicación Actual'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleSelectLocation}
                      >
                        <MaterialIcons name="map" size={24} color={COLORS.primary} />
                        <Text style={styles.locationButtonText}>Seleccionar en Mapa</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Botón Preview */}
                <TouchableOpacity
                  style={styles.previewButton}
                  onPress={handleShowPreview}
                >
                  <MaterialIcons name="preview" size={20} color={COLORS.white} />
                  <Text style={styles.previewButtonText}>Vista Previa</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicator} />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>

      {renderPreview()}
      {renderMapModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  phoneFrame: {
    width: 375,
    height: 812,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    height: 44,
    backgroundColor: COLORS.white,
  },
  time: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.black,
  },
  statusIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  clientTypeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  clientTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    gap: 8,
  },
  clientTypeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  clientTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.gray,
  },
  clientTypeTextActive: {
    color: COLORS.white,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  photoButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.danger,
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  locationButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    gap: 8,
  },
  locationButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    gap: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  previewButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
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
  previewContent: {
    maxHeight: 400,
  },
  previewSection: {
    marginBottom: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 16,
    color: COLORS.black,
  },
  previewPhotoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  previewPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  mapContainer: {
    height: 300,
    backgroundColor: COLORS.light,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -67,
    width: 134,
    height: 5,
    backgroundColor: COLORS.black,
    borderRadius: 3,
  },
});

export default NewClientScreen;

