import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { getFavorites, toggleFavorite } from '../utils/storage';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        const favs = await getFavorites();
        setFavorites(favs);
      };
      fetchFavorites();
    }, [])
  );

  const handleRemove = async (affirmation) => {
    await toggleFavorite(affirmation);
    setFavorites(prev => prev.filter(item => item.id !== affirmation.id));
  };

  const renderItem = ({ item }) => (
    <BlurView intensity={50} tint="dark" style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardText}>{item.text}</Text>
    </BlurView>
  );

  return (
    <ImageBackground source={BG_IMAGE} style={styles.safeArea} resizeMode="cover">
      <LinearGradient
        colors={['rgba(11, 19, 25, 0.4)', 'rgba(11, 19, 25, 0.95)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeAreaContent}>
          <View style={styles.container}>
            <Text style={styles.headerTitle}>Your Favorites</Text>
            
            {favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="heart-half-outline" size={64} color={theme.colors.border} />
                <Text style={styles.emptyText}>No favorites yet.</Text>
                <Text style={styles.emptySubText}>Tap the heart on any affirmation to save it here.</Text>
              </View>
            ) : (
              <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
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
  listContainer: {
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  cardText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    lineHeight: 24,
    fontWeight: theme.typography.weights.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
    marginTop: theme.spacing.md,
  },
  emptySubText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  }
});
