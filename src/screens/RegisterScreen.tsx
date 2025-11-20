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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, FONTS, GRADIENTS } from '../constants';
import { validateEmail, validatePhone, validatePassword, validateRequired } from '../utils/validation';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validar campos requeridos
    if (!validateRequired(fullName)) {
      Alert.alert('Error', 'Por favor ingresa tu nombre completo');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('Error', 'Por favor ingresa un número de teléfono válido');
      return;
    }

    if (!validateRequired(company)) {
      Alert.alert('Error', 'Por favor ingresa el nombre de la compañía');
      return;
    }

    if (!validateRequired(username)) {
      Alert.alert('Error', 'Por favor ingresa un nombre de usuario');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Error',
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    // Simular registro
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Éxito', 'Registro completado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'),
        },
      ]);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigation.goBack();
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
              <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={24} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>Registro</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.registerContainer}>
                  {/* Welcome Section */}
                  <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeTitle}>¡Crea tu cuenta!</Text>
                    <Text style={styles.welcomeSubtitle}>Completa el formulario para registrarte</Text>
                  </View>

                  {/* Form */}
                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Nombre completo"
                        placeholderTextColor={COLORS.gray}
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor={COLORS.gray}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Número de teléfono"
                        placeholderTextColor={COLORS.gray}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Compañía"
                        placeholderTextColor={COLORS.gray}
                        value={company}
                        onChangeText={setCompany}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Usuario"
                        placeholderTextColor={COLORS.gray}
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor={COLORS.gray}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor={COLORS.gray}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                      style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                      onPress={handleRegister}
                      disabled={isLoading}
                    >
                      <Text style={styles.registerButtonText}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                      </Text>
                    </TouchableOpacity>

                    {/* Login Section */}
                    <View style={styles.loginSection}>
                      <Text style={styles.loginText}>
                        ¿Ya tienes cuenta? <Text style={styles.loginLink} onPress={handleBackToLogin}>Inicia sesión</Text>
                      </Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>

            {/* Home Indicator */}
            <View style={styles.homeIndicator} />
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
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
  registerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
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
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
  loginSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  loginText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '500',
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

export default RegisterScreen;

