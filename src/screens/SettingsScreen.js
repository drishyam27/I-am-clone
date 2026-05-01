import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { getStreak } from '../utils/storage';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

export default function SettingsScreen() {
  const [streak, setStreak] = useState(0);
  const [reminders, setReminders] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [animations, setAnimations] = useState(true);

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
    <ImageBackground source={BG_IMAGE} style={styles.safeArea} resizeMode="cover">
      <LinearGradient
        colors={['rgba(11, 19, 25, 0.4)', 'rgba(11, 19, 25, 0.95)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeAreaContent}>
          <View style={styles.container}>
            <Text style={styles.headerTitle}>Settings</Text>
            
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <BlurView intensity={50} tint="dark" style={styles.statCard}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>Current Streak</Text>
                  <Text style={styles.statSubText}>Open the app daily to build your streak</Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>{streak}</Text>
                  <Ionicons name="flame" size={28} color={theme.colors.accent} />
                </View>
              </BlurView>
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <BlurView intensity={50} tint="dark" style={styles.preferencesCard}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Daily Reminders</Text>
                  <Switch value={reminders} onValueChange={setReminders} trackColor={{ true: theme.colors.primary }} />
                </View>
                <View style={styles.settingDivider} />
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>Haptic Feedback</Text>
                  <Switch value={haptics} onValueChange={setHaptics} trackColor={{ true: theme.colors.primary }} />
                </View>
                <View style={styles.settingDivider} />
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>High Quality Animations</Text>
                  <Switch value={animations} onValueChange={setAnimations} trackColor={{ true: theme.colors.primary }} />
                </View>
              </BlurView>
            </View>

          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientOverlay: {
    flex: 1,
  },
  safeAreaContent: {
    flex: 1,
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
    backgroundColor: 'rgba(20, 30, 40, 0.4)',
    borderRadius: 16,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  preferencesCard: {
    backgroundColor: 'rgba(20, 30, 40, 0.4)',
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
  },
  settingLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.medium,
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: theme.spacing.sm,
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
