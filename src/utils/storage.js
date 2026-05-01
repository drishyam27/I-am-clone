import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@affirmations_favorites';
const STREAK_KEY = '@affirmations_streak';
const LAST_OPENED_KEY = '@affirmations_last_opened';

// --- FAVORITES ---

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error fetching favorites", e);
    return [];
  }
};

export const toggleFavorite = async (affirmation) => {
  try {
    const favorites = await getFavorites();
    const isExist = favorites.some(item => item.id === affirmation.id);
    
    let newFavorites;
    if (isExist) {
      newFavorites = favorites.filter(item => item.id !== affirmation.id);
    } else {
      newFavorites = [affirmation, ...favorites];
    }
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return !isExist; // Returns true if added, false if removed
  } catch (e) {
    console.error("Error toggling favorite", e);
    return false;
  }
};

export const checkIsFavorite = async (id) => {
  const favorites = await getFavorites();
  return favorites.some(item => item.id === id);
};

// --- STREAKS ---

export const getStreak = async () => {
  try {
    const streakStr = await AsyncStorage.getItem(STREAK_KEY);
    return streakStr ? parseInt(streakStr, 10) : 0;
  } catch (e) {
    console.error("Error fetching streak", e);
    return 0;
  }
};

// Returns a simple YYYY-MM-DD string to ignore timezones/time
const getTodayDateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const updateStreak = async () => {
  try {
    const today = getTodayDateString();
    const lastOpened = await AsyncStorage.getItem(LAST_OPENED_KEY);
    let currentStreak = await getStreak();

    if (!lastOpened) {
      // First time opening app
      currentStreak = 1;
    } else if (lastOpened !== today) {
      // Check if it was exactly yesterday
      const lastDate = new Date(lastOpened);
      const todayDate = new Date(today);
      
      // Calculate difference in days
      const diffTime = Math.abs(todayDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        // Opened yesterday, increment streak
        currentStreak += 1;
      } else if (diffDays > 1) {
        // More than 48 hours passed (ignoring time of day), reset streak
        currentStreak = 1;
      }
    }

    await AsyncStorage.setItem(STREAK_KEY, currentStreak.toString());
    await AsyncStorage.setItem(LAST_OPENED_KEY, today);
    
    return currentStreak;
  } catch (e) {
    console.error("Error updating streak", e);
    return 0;
  }
};
