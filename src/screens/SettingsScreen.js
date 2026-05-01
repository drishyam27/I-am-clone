import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, ImageBackground, TouchableOpacity, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestPermissionsAsync, scheduleDailyNotification, cancelAllNotifications } from '../utils/notifications';
import { getRandomAffirmations } from '../data/affirmations';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { getStreak } from '../utils/storage';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

export default function SettingsScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [reminders, setReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date(new Date().setHours(9, 0, 0, 0)));
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const handleReminderToggle = async (value) => {
    if (value) {
      const hasPermission = await requestPermissionsAsync();
      if (hasPermission) {
        setReminders(true);
        if (Platform.OS === 'android') {
          setShowTimePicker(true);
        } else {
          // On iOS, schedule immediately for default time, user can change later
          const randomAffirmation = getRandomAffirmations(1)[0];
          await scheduleDailyNotification(reminderTime, randomAffirmation);
        }
      } else {
        setReminders(false);
        Alert.alert('Permission Denied', 'Please enable notifications in your system settings to use this feature.');
      }
    } else {
      setReminders(false);
      setShowTimePicker(false);
      await cancelAllNotifications();
    }
  };

  const handleTimeChange = async (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedDate) {
      setReminderTime(selectedDate);
      
      if (event.type === 'set' || Platform.OS === 'ios') {
        const randomAffirmation = getRandomAffirmations(1)[0];
        await scheduleDailyNotification(selectedDate, randomAffirmation);
      }
    }
  };

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
                  <Switch value={reminders} onValueChange={handleReminderToggle} trackColor={{ true: theme.colors.primary }} />
                </View>
                
                {reminders && (
                  <>
                    <View style={styles.settingDivider} />
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>Reminder Time</Text>
                      {Platform.OS === 'android' ? (
                        <TouchableOpacity 
                          style={styles.timeButton}
                          onPress={() => setShowTimePicker(true)}
                        >
                          <Text style={styles.timeButtonText}>
                            {reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <DateTimePicker
                          value={reminderTime}
                          mode="time"
                          display="default"
                          onChange={handleTimeChange}
                          themeVariant="dark"
                          style={styles.datePickerIOS}
                        />
                      )}
                  </>
                )}
                
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

            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Content</Text>
              <BlurView intensity={50} tint="dark" style={styles.preferencesCard}>
                <TouchableOpacity 
                  style={styles.settingRow} 
                  onPress={() => navigation.navigate('CategorySelection')}
                >
                  <Text style={styles.settingLabel}>Personalize Categories</Text>
                  <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </BlurView>
            </View>
            
            {Platform.OS === 'android' && showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={handleTimeChange}
              />
            )}

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
  },
  timeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 8,
  },
  timeButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.medium,
  },
  datePickerIOS: {
    width: 90,
  }
});
