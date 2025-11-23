import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

import { COLORS, GRADIENTS } from '../constants';
import { StatsCard as StatsCardType } from '../types';

interface StatsCardProps {
  card: StatsCardType;
  onPress?: () => void;
  style?: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ card, onPress, style }) => {
  return (
    <TouchableOpacity
      testID="stats-card-touchable"
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      <View testID="stats-card-container" style={styles.gradientContainer}>
        <LinearGradient
          colors={GRADIENTS.primary}
          style={styles.gradient}
        >
        <MaterialIcons name={card.icon as any} size={32} color={COLORS.white} />
        <View style={styles.content}>
          <Text style={styles.value}>{card.value}</Text>
          <Text style={styles.label}>{card.title}</Text>
        </View>
        {onPress && (
          <MaterialIcons 
            name="arrow-forward" 
            size={20} 
            color="rgba(255, 255, 255, 0.7)" 
          />
        )}
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  gradientContainer: {
    flex: 1,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

export default StatsCard;
