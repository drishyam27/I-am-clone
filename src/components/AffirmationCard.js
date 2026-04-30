import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

export default function AffirmationCard({ affirmation, onSwipeComplete, isNext }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // DECISION: Using PanGesture from react-native-gesture-handler for 60fps native-driven interactions.
  // runOnJS is used to call the React state setter on the JS thread after the animation completes.
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      const swipeThreshold = width * 0.3; // 30% of screen width to trigger swipe
      if (Math.abs(event.translationX) > swipeThreshold) {
        // Swipe off screen
        translateX.value = withTiming(Math.sign(event.translationX) * width * 1.5, { duration: 250 }, () => {
          if (onSwipeComplete) {
            runOnJS(onSwipeComplete)();
          }
        });
      } else {
        // Snap back to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    if (isNext) {
      // DECISION: The background card is scaled down and slightly transparent to create depth.
      return {
        transform: [{ scale: 0.95 }],
        opacity: 0.6,
      };
    }

    // Foreground card rotates slightly as it is dragged for a natural feel.
    const rotate = `${(translateX.value / width) * 10}deg`;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: rotate }
      ],
      zIndex: 10,
    };
  });

  const CardContent = (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{affirmation.category}</Text>
      </View>
      <Text style={styles.text}>{affirmation.text}</Text>
    </Animated.View>
  );

  if (isNext) {
    return CardContent; // No gestures for background card
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
    width: width * 0.85,
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
  text: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    lineHeight: 36,
  }
});
