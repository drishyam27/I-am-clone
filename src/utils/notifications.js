import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Request user permission for push notifications
 * @returns {Promise<boolean>} True if permission is granted
 */
export async function requestPermissionsAsync() {
  if (Platform.OS === 'android') {
    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Daily Reminders',
        importance: Notifications.AndroidImportance.MAX || 5,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    } catch (e) {
      console.warn('Could not set notification channel', e);
    }
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (e) {
    console.warn('Could not request permissions', e);
    return false;
  }
}

/**
 * Cancels all scheduled local notifications
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Schedules a daily repeating local notification
 * @param {Date} time - The Date object containing the time to schedule
 * @param {Object|string} affirmation - The affirmation to display
 */
export async function scheduleDailyNotification(time, affirmation) {
  // First, cancel any existing notifications to avoid duplicates
  await cancelAllNotifications();

  // Extract hour and minute from the Date object
  const hour = time.getHours();
  const minute = time.getMinutes();

  const textToDisplay = typeof affirmation === 'string' ? affirmation : affirmation.text;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌟 Your Daily Affirmation',
      body: textToDisplay,
      sound: true,
    },
    trigger: {
      hour: hour,
      minute: minute,
      repeats: true,
    },
  });
}
