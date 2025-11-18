import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Alert } from 'react-native';

import { RootStackParamList, MainTabParamList } from '../types';
import { COLORS } from '../constants';

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import OrdersScreen from '../screens/OrdersScreen';
import VisitsScreen from '../screens/VisitsScreen';
import ReturnsScreen from '../screens/ReturnsScreen';
import NewOrderScreen from '../screens/NewOrderScreen';
import NewClientScreen from '../screens/NewClientScreen';
import ClientDetailScreen from '../screens/ClientDetailScreen';
import SelectClientScreen from '../screens/SelectClientScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Estilos del menú
const menuStyles = StyleSheet.create({
  menuButton: {
    marginRight: 15,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    width: 280,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
  menuItems: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.black,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  logoutItem: {
    backgroundColor: COLORS.light,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '600',
  },
});

// Componente de menú
const MenuButton = ({ navigation }: { navigation: any }) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    setShowMenu(false);
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => {
            // Obtener el navegador padre (Stack Navigator) y resetear a Login
            const parent = navigation.getParent();
            if (parent) {
              parent.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={menuStyles.menuButton}
      >
        <MaterialIcons name="menu" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={menuStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={menuStyles.menuContainer}>
            <View style={menuStyles.menuHeader}>
              <Text style={menuStyles.menuTitle}>Menú</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.black} />
              </TouchableOpacity>
            </View>

            <View style={menuStyles.menuItems}>
              <TouchableOpacity
                style={menuStyles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  // Aquí puedes agregar más opciones del menú
                }}
              >
                <MaterialIcons name="settings" size={20} color={COLORS.gray} />
                <Text style={menuStyles.menuItemText}>Configuración</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={menuStyles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  // Aquí puedes agregar más opciones del menú
                }}
              >
                <MaterialIcons name="help" size={20} color={COLORS.gray} />
                <Text style={menuStyles.menuItemText}>Ayuda</Text>
              </TouchableOpacity>

              <View style={menuStyles.menuDivider} />

              <TouchableOpacity
                style={[menuStyles.menuItem, menuStyles.logoutItem]}
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={20} color={COLORS.danger} />
                <Text style={[menuStyles.menuItemText, menuStyles.logoutText]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Inventory':
              iconName = 'inventory';
              break;
            case 'Orders':
              iconName = 'shopping-cart';
              break;
            case 'Visits':
              iconName = 'location-on';
              break;
            case 'Returns':
              iconName = 'assignment-return';
              break;
            default:
              iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerRight: () => <MenuButton navigation={navigation} />,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{ title: 'Inventario' }}
      />
      <Tab.Screen 
        name="Orders" 
        component={OrdersScreen}
        options={{ title: 'Pedidos' }}
      />
      <Tab.Screen 
        name="Visits" 
        component={VisitsScreen}
        options={{ title: 'Visitas' }}
      />
      <Tab.Screen 
        name="Returns" 
        component={ReturnsScreen}
        options={{ title: 'Devoluciones' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ title: 'Recuperar Contraseña' }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="NewClient" 
          component={NewClientScreen}
          options={{ title: 'Nuevo Cliente' }}
        />
        <Stack.Screen 
          name="ClientDetail" 
          component={ClientDetailScreen}
          options={{ title: 'Detalle del Cliente' }}
        />
        <Stack.Screen 
          name="SelectClient" 
          component={SelectClientScreen}
          options={{ title: 'Seleccionar Cliente' }}
        />
        <Stack.Screen 
          name="NewOrder" 
          component={NewOrderScreen}
          options={{ title: 'Nuevo Pedido' }}
        />
        <Stack.Screen 
          name="OrderDetail" 
          component={OrderDetailScreen}
          options={{ title: 'Detalle del Pedido' }}
        />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ title: 'Detalle del Producto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
