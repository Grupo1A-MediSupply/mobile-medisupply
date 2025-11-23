import React, { useState } from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, MOCK_DATA } from '../constants';
import { Client } from '../types';

interface SelectClientScreenProps {
  navigation: any;
}

const SelectClientScreen: React.FC<SelectClientScreenProps> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const clients = MOCK_DATA.clients;

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchText.toLowerCase()) ||
    client.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelectClient = (clientId: string) => {
    setSelectedClient(clientId);
    navigation.navigate('NewOrder', { clientId });
  };

  const renderClientItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={[
        styles.clientItem,
        selectedClient === item.id && styles.clientItemSelected
      ]}
      onPress={() => handleSelectClient(item.id)}
    >
      <View style={styles.clientAvatar}>
        <Text style={styles.clientAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.clientInfo}>
        <Text style={styles.clientName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.clientEmail} numberOfLines={1}>
          {item.email}
        </Text>
        <View style={styles.clientStatusContainer}>
          <View style={[
            styles.clientStatus,
            styles[`clientStatus${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]
          ]}>
            <Text style={styles.clientStatusText}>
              {item.status === 'active' ? 'Activo' : 
               item.status === 'inactive' ? 'Inactivo' : 'Premium'}
            </Text>
          </View>
        </View>
      </View>
      <MaterialIcons 
        name="chevron-right" 
        size={24} 
        color={COLORS.gray} 
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Seleccionar Cliente</Text>
          <Text style={styles.headerSubtitle}>
            Elige el cliente para el nuevo pedido
          </Text>
        </View>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cliente por nombre o email..."
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

        {/* Clients List */}
        <View style={styles.clientsSection}>
          <Text style={styles.sectionTitle}>
            Clientes Disponibles ({filteredClients.length})
          </Text>
          
          {filteredClients.length > 0 ? (
            <FlatList
              data={filteredClients}
              renderItem={renderClientItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-off" size={48} color={COLORS.gray} />
              <Text style={styles.emptyStateText}>
                No se encontraron clientes
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Intenta con otro término de búsqueda
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
  },
  searchSection: {
    marginBottom: 24,
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
  clientsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 16,
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientItemSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.light,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  clientEmail: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  clientStatusContainer: {
    flexDirection: 'row',
  },
  clientStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clientStatusActive: {
    backgroundColor: COLORS.success + '20',
  },
  clientStatusInactive: {
    backgroundColor: COLORS.gray + '20',
  },
  clientStatusPremium: {
    backgroundColor: COLORS.primary + '20',
  },
  clientStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.black,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default SelectClientScreen;



