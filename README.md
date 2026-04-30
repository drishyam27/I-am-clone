# 🌟 I Am Clone - Daily Affirmations App

A beautiful, cross-platform mobile application clone of the popular "I Am" daily affirmations app. This project was built as a submission for the **8x Engineer Mobile App Challenge**.

The app focuses on delivering a premium user experience with smooth 60fps animations, intuitive gesture controls, and clean code architecture.

## ✨ Core Features

* **Swipeable Card Interface:** Full-screen, premium card UI for reading daily affirmations with smooth swipe gestures.
* **Personalized Categories:** Filter affirmations based on specific topics (e.g., Growth, Resilience, Success).
* **Favorites Collection:** Save your favorite affirmations to a dedicated local collection for easy reading later.
* **Streak Tracker:** Built-in habit tracking that monitors consecutive days the app is opened.
* **Daily Reminders:** Locally scheduled push notifications to deliver daily motivational quotes.

## 🛠️ Tech Stack

* **Framework:** React Native & [Expo](https://expo.dev/)
* **UI & Animations:** `react-native-reanimated` & `react-native-gesture-handler`
* **Storage:** `@react-native-async-storage/async-storage` (Favorites & Streaks)
* **Notifications:** `expo-notifications`

## 📁 Project Architecture

The codebase strictly adheres to a clean, modular architecture:

```text
├── assets/                 # Fonts, icons, and static images
├── src/
│   ├── components/         # Reusable UI (AffirmationCard, CustomButtons)
│   ├── data/               # Mock JSON data for categories and affirmations
│   ├── navigation/         # Bottom Tab and Stack Navigators
│   ├── screens/            # Main views (Home, Favorites, Settings)
│   ├── theme/              # Centralized typography, colors, and spacing
│   └── utils/              # Helper functions (notifications, streak logic)
├── App.js                  # Main entry point
└── package.json
```

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed and the Expo Go app downloaded on your physical device (or an iOS/Android emulator set up on your machine).

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/drishyam27/I-am-clone.git](https://github.com/drishyam27/I-am-clone.git)
   cd I-am-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

4. **Run the app:**
   Scan the QR code generated in your terminal using the Expo Go app on your phone, or press `i` to open in the iOS simulator or `a` for the Android emulator.

## 🏆 Contest Details
Submitted for the [8x Engineer](https://8xengineer.com/) "Build an I Am Clone" challenge.
