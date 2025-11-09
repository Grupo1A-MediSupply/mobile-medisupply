import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

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

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
