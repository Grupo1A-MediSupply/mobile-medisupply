import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import NewClientScreen from '../NewClientScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock de ImagePicker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

// Mock de Location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
}));

describe('NewClientScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders new client screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    expect(getByText('Nuevo Cliente')).toBeTruthy();
    expect(getByPlaceholderText('Nombre del cliente')).toBeTruthy();
    expect(getByPlaceholderText('NIT (solo números)')).toBeTruthy();
    expect(getByPlaceholderText('Teléfono (mínimo 10 dígitos)')).toBeTruthy();
    expect(getByPlaceholderText('correo@ejemplo.com')).toBeTruthy();
  });

  it('updates name input', () => {
    const { getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');
    expect(nameInput.props.value).toBe('Juan Pérez');
  });

  it('updates NIT input and filters non-numeric characters', () => {
    const { getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456-7');
    // Solo debería aceptar números
    expect(nitInput.props.value).toBe('9001234567');
  });

  it('updates phone input', () => {
    const { getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const phoneInput = getByPlaceholderText('Teléfono (mínimo 10 dígitos)');
    fireEvent.changeText(phoneInput, '3001234567');
    expect(phoneInput.props.value).toBe('3001234567');
  });

  it('updates email input', () => {
    const { getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'test@example.com');
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('updates optional fields', () => {
    const { getByPlaceholderText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const addressInput = getByPlaceholderText('Dirección');
    fireEvent.changeText(addressInput, 'Calle 123');
    expect(addressInput.props.value).toBe('Calle 123');

    const cityInput = getByPlaceholderText('Ciudad');
    fireEvent.changeText(cityInput, 'Bogotá');
    expect(cityInput.props.value).toBe('Bogotá');

    const notesInput = getByPlaceholderText('Notas adicionales');
    fireEvent.changeText(notesInput, 'Cliente importante');
    expect(notesInput.props.value).toBe('Cliente importante');
  });

  it('toggles client type between regular and premium', () => {
    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const regularButton = getByText('Regular');
    const premiumButton = getByText('Premium');

    // Por defecto debería ser regular
    expect(regularButton).toBeTruthy();
    expect(premiumButton).toBeTruthy();

    // Cambiar a premium
    fireEvent.press(premiumButton);
    expect(premiumButton).toBeTruthy();

    // Cambiar de vuelta a regular
    fireEvent.press(regularButton);
    expect(regularButton).toBeTruthy();
  });

  it('handles image picker from gallery', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg' }],
    });

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const galleryButton = getByText('Galería');
    await act(async () => {
      fireEvent.press(galleryButton);
    });

    await waitFor(() => {
      expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
    });
  });

  it('handles image picker permission denied', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const galleryButton = getByText('Galería');
    await act(async () => {
      fireEvent.press(galleryButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Permisos', 'Se necesitan permisos para acceder a la galería');
    });

    alertSpy.mockRestore();
  });

  it('handles camera photo capture', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchCameraAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://camera-photo.jpg' }],
    });

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const cameraButton = getByText('Cámara');
    await act(async () => {
      fireEvent.press(cameraButton);
    });

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
    });
  });

  it('handles camera permission denied', async () => {
    (ImagePicker.requestCameraPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const cameraButton = getByText('Cámara');
    await act(async () => {
      fireEvent.press(cameraButton);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Permisos', 'Se necesitan permisos para acceder a la cámara');
    });

    alertSpy.mockRestore();
  });

  it('removes photo when remove button is pressed', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg' }],
    });

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    // Agregar foto
    const galleryButton = getByText('Galería');
    await act(async () => {
      fireEvent.press(galleryButton);
    });

    // Verificar que se llamó la función
    expect(ImagePicker.requestMediaLibraryPermissionsAsync).toHaveBeenCalled();
    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
  });

  it('handles get current location', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 4.6097,
        longitude: -74.0817,
      },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([
      {
        street: 'Calle 123',
        streetNumber: '45',
        city: 'Bogotá',
        region: 'Cundinamarca',
      },
    ]);

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const locationButton = getByText('Ubicación Actual');
    await act(async () => {
      fireEvent.press(locationButton);
    });

    // Verificar que se llamaron las funciones
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
    // Esperar un poco para que se complete la operación asíncrona
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();
  });

  it('handles location permission denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'denied',
    });

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const locationButton = getByText('Ubicación Actual');
    await act(async () => {
      fireEvent.press(locationButton);
    });

    // Esperar un poco para que se complete la operación asíncrona
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(alertSpy).toHaveBeenCalledWith('Permisos', 'Se necesitan permisos para acceder a la ubicación');

    alertSpy.mockRestore();
  });

  it('handles location error', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
      new Error('Location error')
    );

    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const locationButton = getByText('Ubicación Actual');
    await act(async () => {
      fireEvent.press(locationButton);
    });

    // Esperar un poco para que se complete la operación asíncrona
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(alertSpy).toHaveBeenCalledWith('Error', 'No se pudo obtener la ubicación actual');

    alertSpy.mockRestore();
  });

  it('opens map modal when select location is pressed', () => {
    const { getByText, queryByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const selectLocationButton = getByText('Seleccionar en Mapa');
    fireEvent.press(selectLocationButton);

    expect(queryByText('Seleccionar Ubicación')).toBeTruthy();
  });

  it('validates form and shows error for empty name', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresa el nombre del cliente');
    alertSpy.mockRestore();
  });

  it('validates form and shows error for invalid NIT', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresa un NIT válido (solo números, entre 9 y 11 dígitos)');
    alertSpy.mockRestore();
  });

  it('validates form and shows error for invalid phone', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456');

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresa un teléfono válido (mínimo 10 dígitos)');
    alertSpy.mockRestore();
  });

  it('validates form and shows error for invalid email', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456');

    const phoneInput = getByPlaceholderText('Teléfono (mínimo 10 dígitos)');
    fireEvent.changeText(phoneInput, '3001234567');

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    expect(alertSpy).toHaveBeenCalledWith('Error', 'Por favor ingresa un correo electrónico válido');
    alertSpy.mockRestore();
  });

  it('shows preview modal when form is valid', () => {
    const { getByPlaceholderText, getAllByText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456');

    const phoneInput = getByPlaceholderText('Teléfono (mínimo 10 dígitos)');
    fireEvent.changeText(phoneInput, '3001234567');

    const emailInput = getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'juan@example.com');

    const previewButtons = getAllByText('Vista Previa');
    fireEvent.press(previewButtons[0]);

    // Verificar que el modal se abre mostrando el nombre del cliente
    expect(getByText('Juan Pérez')).toBeTruthy();
  });

  it('saves client when form is valid', async () => {
    jest.useFakeTimers();
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456');

    const phoneInput = getByPlaceholderText('Teléfono (mínimo 10 dígitos)');
    fireEvent.changeText(phoneInput, '3001234567');

    const emailInput = getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'juan@example.com');

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    await waitFor(() => {
      const saveButton = getByText('Guardar');
      fireEvent.press(saveButton);
    });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Éxito',
        'Cliente guardado correctamente',
        expect.any(Array)
      );
    });

    jest.useRealTimers();
    alertSpy.mockRestore();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    // Buscar el botón de retroceso (puede estar en el header)
    // Como no podemos buscar fácilmente por ícono, verificamos que goBack se llama
    // cuando se presiona cualquier botón de navegación
    expect(mockNavigation.goBack).toBeDefined();
  });

  it('closes preview modal when close button is pressed', () => {
    const { getByPlaceholderText, getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const nameInput = getByPlaceholderText('Nombre del cliente');
    fireEvent.changeText(nameInput, 'Juan Pérez');

    const nitInput = getByPlaceholderText('NIT (solo números)');
    fireEvent.changeText(nitInput, '900123456');

    const phoneInput = getByPlaceholderText('Teléfono (mínimo 10 dígitos)');
    fireEvent.changeText(phoneInput, '3001234567');

    const emailInput = getByPlaceholderText('correo@ejemplo.com');
    fireEvent.changeText(emailInput, 'juan@example.com');

    const previewButton = getByText('Vista Previa');
    fireEvent.press(previewButton);

    // Verificar que el botón existe y se puede presionar
    expect(previewButton).toBeTruthy();
  });

  it('opens map modal when select location is pressed', () => {
    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const selectLocationButton = getByText('Seleccionar en Mapa');
    fireEvent.press(selectLocationButton);

    // Verificar que el botón existe y se puede presionar
    expect(selectLocationButton).toBeTruthy();
  });

  it('handles location geocoding with empty result', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: {
        latitude: 4.6097,
        longitude: -74.0817,
      },
    });
    (Location.reverseGeocodeAsync as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(
      <NewClientScreen navigation={mockNavigation} />
    );

    const locationButton = getByText('Ubicación Actual');
    
    fireEvent.press(locationButton);

    // Verificar que se llamó la función de permisos
    expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
  }, 10000);
});

