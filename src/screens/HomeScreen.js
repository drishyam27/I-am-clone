import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { affirmationsData } from '../data/affirmations';
import AffirmationCard from '../components/AffirmationCard';
import { theme } from '../theme';
import { updateStreak } from '../utils/storage';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);

  const swipeTranslateX = useSharedValue(0);
  const mouseX = useSharedValue(0);
  const mouseY = useSharedValue(0);

  useEffect(() => {
    const initStreak = async () => {
      const currentStreak = await updateStreak();
      setStreak(currentStreak);
    };
    initStreak();
  }, []);

  const handleSwipeComplete = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % affirmationsData.length);
    swipeTranslateX.value = 0;
  };

  const handlePointerMove = (e) => {
    if (Platform.OS === 'web') {
      mouseX.value = e.nativeEvent.x;
      mouseY.value = e.nativeEvent.y;
    }
  };

  const glowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(mouseX.value - 150, { damping: 15 }) },
        { translateY: withSpring(mouseY.value - 150, { damping: 15 }) }
      ],
    };
  });

  const isWeb = Platform.OS === 'web';
  const currentAffirmation = affirmationsData[currentIndex];
  const nextIndex = (currentIndex + 1) % affirmationsData.length;
  const nextAffirmation = affirmationsData[nextIndex];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }} onPointerMove={handlePointerMove}>
      {isWeb && (
        <Animated.View style={[styles.mouseGlow, glowStyle]} pointerEvents="none" />
      )}
      
      <ImageBackground source={BG_IMAGE} style={styles.container} resizeMode="cover">
        <LinearGradient
          colors={['rgba(11, 19, 25, 0.4)', 'rgba(11, 19, 25, 0.95)']}
          style={[styles.gradientOverlay, { paddingTop: insets.top }]}
        >
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Image source={require('../../assets/icon.png')} style={styles.headerLogo} />
              <Text style={styles.headerTitle}>For You</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{streak}</Text>
              <Ionicons name="flame" size={24} color={theme.colors.accent} style={styles.streakIcon} />
            </View>
          </View>
          
          <View style={styles.cardContainer}>
            <View style={styles.cardWrapper}>
              <AffirmationCard affirmation={nextAffirmation} isNext={true} swipeTranslateX={swipeTranslateX} />
            </View>
            <View style={styles.cardWrapper}>
              <AffirmationCard key={currentAffirmation.id} affirmation={currentAffirmation} onSwipeComplete={handleSwipeComplete} isNext={false} swipeTranslateX={swipeTranslateX} />
            </View>
          </View>

        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientOverlay: {
    flex: 1,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
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
  },
  mouseGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    filter: 'blur(100px)',
    zIndex: 0,
  }
});
