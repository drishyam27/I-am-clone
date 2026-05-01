import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getStreak } from '../utils/storage';

export default function SettingsScreen() {
  const [streak, setStreak] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchStreak = async () => {
        const currentStreak = await getStreak();
        setStreak(currentStreak);
      };
      fetchStreak();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Settings</Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statCard}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Current Streak</Text>
              <Text style={styles.statSubText}>Open the app daily to build your streak</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streak}</Text>
              <Ionicons name="flame" size={28} color={theme.colors.accent} />
            </View>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xlarge,
    fontWeight: theme.typography.weights.bold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statInfo: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  statLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.bold,
    marginBottom: 4,
  },
  statSubText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: theme.typography.weights.bold,
    marginRight: 8,
  }
});
