import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, Text, View, TouchableOpacity } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS, interpolate, Extrapolation } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';
import { checkIsFavorite, toggleFavorite } from '../utils/storage';

const { width, height } = Dimensions.get('window');

export default function AffirmationCard({ affirmation, onSwipeComplete, isNext, swipeTranslateX }) {
  const translateY = useSharedValue(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkFav = async () => {
      const status = await checkIsFavorite(affirmation.id);
      if (isMounted) setIsFavorited(status);
    };
    checkFav();
    return () => { isMounted = false; };
  }, [affirmation.id]);

  const handleFavoritePress = async () => {
    // Fire light haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Optimistic UI update
    setIsFavorited(!isFavorited);
    const newStatus = await toggleFavorite(affirmation);
    setIsFavorited(newStatus); // Sync with actual storage result
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (swipeTranslateX) {
        swipeTranslateX.value = event.translationX;
      }
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const swipeThreshold = width * 0.3; 
      if (Math.abs(event.translationX) > swipeThreshold) {
        const direction = Math.sign(event.translationX);
        if (swipeTranslateX) {
          swipeTranslateX.value = withTiming(direction * width * 1.5, { duration: 250 }, () => {
            if (onSwipeComplete) {
              runOnJS(onSwipeComplete)();
            }
          });
        }
      } else {
        if (swipeTranslateX) {
          swipeTranslateX.value = withSpring(0);
        }
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (isNext) {
      const safeTranslateX = swipeTranslateX ? swipeTranslateX.value : 0;
      const scale = interpolate(Math.abs(safeTranslateX), [0, width * 0.8], [0.9, 1], Extrapolation.CLAMP);
      const opacity = interpolate(Math.abs(safeTranslateX), [0, width * 0.8], [0.6, 1], Extrapolation.CLAMP);

      return {
        transform: [{ scale }],
        opacity,
      };
    }

    const safeTranslateX = swipeTranslateX ? swipeTranslateX.value : 0;
    const rotate = `${(safeTranslateX / width) * 10}deg`;
    
    return {
      transform: [
        { translateX: safeTranslateX },
        { translateY: translateY.value },
        { rotate: rotate }
      ],
      zIndex: 10,
    };
  });

  const CardContent = (
    <Animated.View style={[styles.card, animatedStyle, { overflow: 'hidden' }]}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{affirmation.category}</Text>
      </View>

      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={handleFavoritePress}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons 
          name={isFavorited ? "heart" : "heart-outline"} 
          size={32} 
          color={isFavorited ? theme.colors.favorite : theme.colors.textSecondary} 
        />
      </TouchableOpacity>

      <Text style={styles.text}>{affirmation.text}</Text>
    </Animated.View>
  );

  if (isNext) {
    return CardContent;
  }

  return (
    <GestureDetector gesture={panGesture}>
      {CardContent}
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '90%',
    maxWidth: 400,
    height: height * 0.65,
    backgroundColor: theme.colors.card,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryBadge: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
  },
  categoryText: {
    color: '#FFF',
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 20,
  },
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xlarge,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    lineHeight: 44,
    flexShrink: 1,
    flexWrap: 'wrap',
  }
});
