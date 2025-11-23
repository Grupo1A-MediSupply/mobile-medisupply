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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, SIZES, FONTS, GRADIENTS } from '../constants';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    
    // Simular login
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
              <Text style={styles.title}>Login</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.loginContainer}>
                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                  <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
                  <Text style={styles.welcomeSubtitle}>Inicia sesión en tu cuenta</Text>
                </View>

                {/* Login Form */}
                <View style={styles.form}>
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
                      placeholder="Contraseña"
                      placeholderTextColor={COLORS.gray}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Form Options */}
                  <View style={styles.formOptions}>
                    <TouchableOpacity
                      style={styles.rememberMe}
                      onPress={() => setRememberMe(!rememberMe)}
                    >
                      <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                        {rememberMe && <MaterialIcons name="check" size={16} color={COLORS.white} />}
                      </View>
                      <Text style={styles.rememberMeText}>Recordarme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleForgotPassword}>
                      <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Text>
                  </TouchableOpacity>

                  {/* Signup Section */}
                  <View style={styles.signupSection}>
                    <Text style={styles.signupText}>
                      ¿No tienes cuenta?{' '}
                      <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>
                        Regístrate aquí
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
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
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
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
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
    gap: 10,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rememberMeText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  forgotPassword: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
  signupSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  signupLink: {
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

export default LoginScreen;
