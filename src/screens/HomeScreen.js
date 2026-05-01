import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { affirmationsData } from '../data/affirmations';
import AffirmationCard from '../components/AffirmationCard';
import { theme } from '../theme';
import { updateStreak } from '../utils/storage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);

  const swipeTranslateX = useSharedValue(0);

  useEffect(() => {
    const initStreak = async () => {
      const currentStreak = await updateStreak();
      setStreak(currentStreak);
    };
    initStreak();
  }, []);

  const handleSwipeComplete = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmationsData.length);
    // Reset the shared value for the next card immediately
    swipeTranslateX.value = 0;
  };

  const currentAffirmation = affirmationsData[currentIndex];
  const nextIndex = (currentIndex + 1) % affirmationsData.length;
  const nextAffirmation = affirmationsData[nextIndex];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For You</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>{streak}</Text>
          <Ionicons name="flame" size={24} color={theme.colors.accent} style={styles.streakIcon} />
        </View>
      </View>
      
      <View style={styles.cardContainer}>
        {/* Next Card (rendered behind) */}
        <View style={styles.cardWrapper}>
          <AffirmationCard 
            affirmation={nextAffirmation} 
            isNext={true} 
            swipeTranslateX={swipeTranslateX}
          />
        </View>

        {/* Current Card (rendered on top, interactive) */}
        <View style={styles.cardWrapper}>
          <AffirmationCard 
            key={currentAffirmation.id} 
            affirmation={currentAffirmation} 
            onSwipeComplete={handleSwipeComplete} 
            isNext={false}
            swipeTranslateX={swipeTranslateX}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  streakText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.bold,
    marginRight: 4,
  },
  streakIcon: {
    marginTop: -2,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
