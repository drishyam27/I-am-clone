import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getCategories, saveCategories } from '../utils/storage';
import { affirmationsData } from '../data/affirmations';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

// Extract unique categories from data
const AVAILABLE_CATEGORIES = [...new Set(affirmationsData.map(item => item.category))];

export default function CategorySelectionScreen({ navigation }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const saved = await getCategories();
      setSelectedCategories(saved);
    };
    loadCategories();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSave = async () => {
    await saveCategories(selectedCategories);
    navigation.goBack();
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.safeArea} resizeMode="cover">
      <LinearGradient
        colors={['rgba(11, 19, 25, 0.6)', 'rgba(11, 19, 25, 0.98)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeAreaContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Personalize</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <Text style={styles.subtitle}>Choose the areas you want to focus on. If none are selected, we'll show you a mix of everything.</Text>

            <View style={styles.grid}>
              {AVAILABLE_CATEGORIES.map(category => {
                const isSelected = selectedCategories.includes(category);
                return (
                  <TouchableOpacity 
                    key={category} 
                    style={styles.categoryWrapper}
                    onPress={() => toggleCategory(category)}
                    activeOpacity={0.8}
                  >
                    <BlurView 
                      intensity={isSelected ? 60 : 20} 
                      tint={isSelected ? "light" : "dark"} 
                      style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    >
                      <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                        {category}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} style={styles.icon} />
                      )}
                    </BlurView>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Preferences</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xlarge,
    fontWeight: theme.typography.weights.bold,
  },
  closeBtn: {
    padding: theme.spacing.xs,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.medium,
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryWrapper: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  categoryCard: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  categoryCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(24, 139, 141, 0.2)',
  },
  categoryText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.medium,
  },
  categoryTextSelected: {
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.bold,
  },
  icon: {
    position: 'absolute',
    right: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
  }
});
