// Configuración global de Jest para React Native

// Mock de TurboModuleRegistry ANTES de cualquier otra cosa
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn((moduleName) => {
    if (moduleName === 'DevMenu') {
      return {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      };
    }
    if (moduleName === 'DeviceInfo') {
      const mockDeviceInfo = {
        getConstants: () => ({
          windowPhysicalPixels: { width: 375, height: 812 },
          screenPhysicalPixels: { width: 375, height: 812 },
          Dimensions: {
            window: { width: 375, height: 812, scale: 2, fontScale: 1 },
            screen: { width: 375, height: 812, scale: 2, fontScale: 1 },
          },
        }),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      };
      return mockDeviceInfo;
    }
    if (moduleName === 'StatusBarManager') {
      return {
        setStyle: jest.fn(),
        setHidden: jest.fn(),
        setNetworkActivityIndicatorVisible: jest.fn(),
        setBackgroundColor: jest.fn(),
        setTranslucent: jest.fn(),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
        getConstants: () => ({}),
      };
    }
    if (moduleName === 'NativeAnimatedModule' || moduleName === 'ReanimatedModule') {
      return {
        createAnimatedNode: jest.fn(),
        connectAnimatedNodes: jest.fn(),
        disconnectAnimatedNodes: jest.fn(),
        startAnimatingNode: jest.fn(),
        stopAnimation: jest.fn(),
        setAnimatedNodeValue: jest.fn(),
        setAnimatedNodeOffset: jest.fn(),
        flattenAnimatedNodeOffset: jest.fn(),
        extractAnimatedNodeValue: jest.fn(),
        startListeningToAnimatedNodeValue: jest.fn(),
        stopListeningToAnimatedNodeValue: jest.fn(),
        addAnimatedEventToNode: jest.fn(),
        removeAnimatedEventFromNode: jest.fn(),
        dropAnimatedNode: jest.fn(),
        setAnimatedNodeProps: jest.fn(),
        addListener: jest.fn(),
        removeListeners: jest.fn(),
        queueAndExecuteBatchedOperations: jest.fn(),
      };
    }
    return {
      addListener: jest.fn(),
      removeListeners: jest.fn(),
      getConstants: () => ({}),
    };
  }),
  get: jest.fn(() => null),
}));

// Mock de NativeEventEmitter
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  return jest.fn().mockImplementation((nativeModule) => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  }));
});

// Mock de NativeAnimatedHelper
jest.mock('react-native/src/private/animated/NativeAnimatedHelper', () => ({
  API: {
    setNativeProps: jest.fn(),
    createAnimatedNode: jest.fn(),
    connectAnimatedNodes: jest.fn(),
    disconnectAnimatedNodes: jest.fn(),
    startAnimatingNode: jest.fn(),
    stopAnimation: jest.fn(),
    setAnimatedNodeValue: jest.fn(),
    setAnimatedNodeOffset: jest.fn(),
    flattenAnimatedNodeOffset: jest.fn(),
    extractAnimatedNodeValue: jest.fn(),
    startListeningToAnimatedNodeValue: jest.fn(),
    stopListeningToAnimatedNodeValue: jest.fn(),
    addAnimatedEventToNode: jest.fn(),
    removeAnimatedEventFromNode: jest.fn(),
    dropAnimatedNode: jest.fn(),
    setAnimatedNodeProps: jest.fn(),
    queueAndExecuteBatchedOperations: jest.fn(),
    flushQueue: jest.fn(),
  },
  shouldUseNativeDriver: jest.fn(() => false),
}));

// NO mockear Dimensions - el preset 'react-native' ya lo mockea

// Mock de warnOnce ANTES de cualquier otra cosa
jest.mock('react-native/Libraries/Utilities/warnOnce', () => {
  const mockWarnOnce = jest.fn(() => {});
  return {
    __esModule: true,
    default: mockWarnOnce,
    warnOnce: mockWarnOnce,
  };
});

// Mock de @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock de expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => {
    const React = require('react');
    return React.createElement('View', props, children);
  },
}));

// Mock de expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock de expo-image-picker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ 
    canceled: false, 
    assets: [{ uri: 'file://test-image.jpg' }] 
  })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ 
    canceled: false, 
    assets: [{ uri: 'file://test-image.jpg' }] 
  })),
  MediaTypeOptions: {
    Images: 'Images',
    Videos: 'Videos',
    All: 'All',
  },
}));

// Mock de expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: {
      latitude: 4.6097,
      longitude: -74.0817,
      altitude: null,
      accuracy: 10,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  })),
  reverseGeocodeAsync: jest.fn(() => Promise.resolve([{
    street: 'Calle 123',
    streetNumber: '45-67',
    city: 'Bogotá',
    region: 'Cundinamarca',
    country: 'Colombia',
    postalCode: '110111',
  }])),
}));

// Mock de @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  Ionicons: 'Ionicons',
  Feather: 'Feather',
}));

// Mock de react-native-maps
jest.mock('react-native-maps', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: View,
    Marker: View,
    PROVIDER_GOOGLE: 'google',
  };
});

// Mock de react-native-image-picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
  launchCamera: jest.fn(),
}));

// Mock de @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return {
    ...jest.requireActual('@react-navigation/native'),
    NavigationContainer: ({ children }: any) => React.createElement(View, {}, children),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
      replace: jest.fn(),
      setOptions: jest.fn(),
      canGoBack: jest.fn(() => true),
      dispatch: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route',
      name: 'Test',
    }),
    useFocusEffect: jest.fn((callback) => {
      React.useEffect(() => {
        callback();
      }, []);
    }),
    CommonActions: {
      navigate: jest.fn(),
      reset: jest.fn(),
      goBack: jest.fn(),
    },
  };
});

// Mock de @react-navigation/stack con contexto de navegación que reacciona a cambios
jest.mock('@react-navigation/stack', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Estado global compartido usando un objeto que podemos observar
  // Inicializar el estado en cada creación del mock para evitar interferencias entre tests
  let globalRouteState: any = { route: 'Login', setRouteFn: null };
  
  // Función para resetear el estado global (llamada antes de cada test)
  const resetGlobalRouteState = () => {
    globalRouteState = { route: 'Login', setRouteFn: null };
  };
  
  return {
    createStackNavigator: () => {
      const Navigator = ({ children, initialRouteName }: any) => {
        const initialRoute = initialRouteName || 'Login';
        const [route, setRoute] = React.useState(initialRoute);
        
        // Guardar la función setRoute globalmente para que replace/navigate puedan usarla
        React.useEffect(() => {
          globalRouteState.setRouteFn = setRoute;
          globalRouteState.route = route;
          
          return () => {
            if (globalRouteState.setRouteFn === setRoute) {
              globalRouteState.setRouteFn = null;
            }
          };
        }, [route]);
        
        // Sincronizar con el estado global si cambia externamente
        React.useEffect(() => {
          if (globalRouteState.route !== route && globalRouteState.setRouteFn === setRoute) {
            // No hacer nada - el estado global se actualiza cuando llamamos replace/navigate
          }
        }, [route]);
        
        // Función para navegar
        const navigate = (routeName: string) => {
          globalRouteState.route = routeName;
          if (globalRouteState.setRouteFn) {
            globalRouteState.setRouteFn(routeName);
          }
          setRoute(routeName);
        };
        
        // Función para replace - actualizar inmediatamente
        const replace = (routeName: string) => {
          globalRouteState.route = routeName;
          // Actualizar el estado local inmediatamente
          setRoute(routeName);
          // También actualizar a través de la función global si está disponible
          if (globalRouteState.setRouteFn) {
            globalRouteState.setRouteFn(routeName);
          }
        };
        
        const mockNavigation = {
          navigate,
          replace,
          goBack: jest.fn(() => {
            const newRoute = 'Login';
            globalRouteState.route = newRoute;
            setRoute(newRoute);
            if (globalRouteState.setRouteFn && globalRouteState.setRouteFn !== setRoute) {
              globalRouteState.setRouteFn(newRoute);
            }
          }),
          setOptions: jest.fn(),
          canGoBack: jest.fn(() => route !== 'Login'),
          dispatch: jest.fn(),
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
        
        const navigationProp = mockNavigation;
        
        // Encontrar y renderizar el componente de la ruta actual
        let currentComponent = null;
        React.Children.forEach(children, (child) => {
          if (child && child.props && child.props.name === route && child.props.component) {
            const Component = child.props.component;
            // Si es MainTabNavigator, no pasar navigation (usa useNavigation hook internamente)
            if (route === 'Main') {
              currentComponent = React.createElement(Component);
            } else {
              currentComponent = React.createElement(Component, { navigation: navigationProp });
            }
          }
        });
        
        // Si no se encontró, usar el componente de la ruta inicial
        if (!currentComponent) {
          React.Children.forEach(children, (child) => {
            if (child && child.props && child.props.component && !currentComponent) {
              const Component = child.props.component;
              const routeName = child.props.name || initialRoute || 'Login';
              if (routeName === 'Main') {
                currentComponent = React.createElement(Component);
              } else {
                currentComponent = React.createElement(Component, { navigation: navigationProp });
              }
            }
          });
        }
        
        return React.createElement(View, { testID: 'stack-navigator' }, currentComponent);
      };
      
      const Screen = ({ component, children }: any) => {
        return null;
      };
      
      return { Navigator, Screen };
    },
    TransitionPresets: {
      SlideFromRightIOS: {},
      ModalPresentationIOS: {},
      FadeFromBottomAndroid: {},
    },
    CardStyleInterpolators: {
      forHorizontalIOS: jest.fn(),
      forVerticalIOS: jest.fn(),
    },
  };
});

// Mock de @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  // Mock de navegación para tabs
  const mockTabNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    replace: jest.fn(),
    setOptions: jest.fn(),
    canGoBack: jest.fn(() => false),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
  
  return {
    createBottomTabNavigator: () => {
      const Navigator = ({ children }: any) => {
        // Renderizar Dashboard (primer tab) por defecto
        let dashboardComponent = null;
        React.Children.forEach(children, (child) => {
          if (child && child.props && child.props.name === 'Dashboard' && child.props.component && !dashboardComponent) {
            const Component = child.props.component;
            // Pasar navigation a DashboardScreen
            dashboardComponent = React.createElement(Component, { navigation: mockTabNavigation });
          }
        });
        
        // Si no se encuentra Dashboard, usar el primer componente
        if (!dashboardComponent) {
          React.Children.forEach(children, (child) => {
            if (child && child.props && child.props.component && !dashboardComponent) {
              const Component = child.props.component;
              // Pasar navigation a todos los componentes
              dashboardComponent = React.createElement(Component, { navigation: mockTabNavigation });
            }
          });
        }
        
        return React.createElement(View, { testID: 'tab-navigator' }, dashboardComponent || children);
      };
      
      const Screen = ({ component, children }: any) => {
        return null;
      };
      
      return { Navigator, Screen };
    },
  };
});

// Mock de react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  const MockGestureHandler = ({ children, ...props }: any) => {
    return React.createElement(View, props, children);
  };
  
  return {
    Swipeable: MockGestureHandler,
    DrawerLayout: MockGestureHandler,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: MockGestureHandler,
    TapGestureHandler: MockGestureHandler,
    FlingGestureHandler: MockGestureHandler,
    ForceTouchGestureHandler: MockGestureHandler,
    LongPressGestureHandler: MockGestureHandler,
    PanGestureHandler: MockGestureHandler,
    PinchGestureHandler: MockGestureHandler,
    RotationGestureHandler: MockGestureHandler,
    RawButton: MockGestureHandler,
    BaseButton: MockGestureHandler,
    RectButton: MockGestureHandler,
    BorderlessButton: MockGestureHandler,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((component) => component),
    Directions: {},
  };
});

// Mock de Alert - debe ser accesible como Alert.alert
const mockAlert = jest.fn();
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: mockAlert,
  default: {
    alert: mockAlert,
  },
}));

// Mock de Keyboard para KeyboardAvoidingView
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => ({
  addListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
  dismiss: jest.fn(),
  isVisible: jest.fn(() => false),
}));

// NO mockear react-native aquí - el preset 'react-native' ya lo mockea
// SafeAreaView se agregará en jest-setup-after-env.js
