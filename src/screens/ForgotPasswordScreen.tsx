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

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    
    // Simular proceso de envío
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Información', 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña');
    }, 2000);
  };

  const handleResendEmail = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Información', 'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña');
    }, 1000);
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
              <Text style={styles.title}>Recuperar Contraseña</Text>
              <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.forgotPasswordContainer}>
                {/* Icon Section */}
                <View style={styles.iconSection}>
                  <MaterialIcons name="lock-reset" size={64} color={COLORS.primary} />
                </View>

                {/* Welcome Section */}
                <View style={styles.welcomeSection}>
                  <Text style={styles.welcomeTitle}>¿Olvidaste tu contraseña?</Text>
                  <Text style={styles.welcomeSubtitle}>
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
                  </Text>
                </View>

                {/* Form */}
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

                  <TouchableOpacity
                    style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                    onPress={handleSendEmail}
                    disabled={isLoading}
                  >
                    <Text style={styles.sendButtonText}>
                      {isLoading ? 'Enviando...' : 'Enviar enlace'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Help Section */}
                <View style={styles.helpSection}>
                  <Text style={styles.helpText}>¿No recibiste el email?</Text>
                  <TouchableOpacity onPress={handleResendEmail} disabled={isLoading}>
                    <Text style={styles.resendLink}>
                      {isLoading ? 'Reenviando...' : 'Reenviar email'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={styles.loginLink}>Volver al login</Text>
                  </TouchableOpacity>
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
    padding: 20,
  },
  forgotPasswordContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
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
  sendButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '600',
  },
  successSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  helpSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  helpText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
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

export default ForgotPasswordScreen;
