import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { affirmationsData } from '../data/affirmations';
import AffirmationCard from '../components/AffirmationCard';
import { theme } from '../theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  // DECISION: Looping the array once the user reaches the end for an infinite swipe experience.
  const handleSwipeComplete = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmationsData.length);
  };

  const currentAffirmation = affirmationsData[currentIndex];
  const nextIndex = (currentIndex + 1) % affirmationsData.length;
  const nextAffirmation = affirmationsData[nextIndex];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>For You</Text>
      </View>
      
      <View style={styles.cardContainer}>
        {/* Next Card (rendered behind, scaled down) */}
        <View style={styles.cardWrapper}>
          <AffirmationCard affirmation={nextAffirmation} isNext={true} />
        </View>

        {/* Current Card (rendered on top, interactive) */}
        {/* DECISION: Using key={currentAffirmation.id} forces React to remount the component on swipe, 
            resetting the Reanimated shared values (translateX/Y) cleanly without manual imperative resets. */}
        <View style={styles.cardWrapper}>
          <AffirmationCard 
            key={currentAffirmation.id} 
            affirmation={currentAffirmation} 
            onSwipeComplete={handleSwipeComplete} 
            isNext={false}
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
    alignItems: 'center', 
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: 1,
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
