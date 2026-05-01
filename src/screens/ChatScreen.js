import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { generateAIResponse } from '../utils/groqAI';

const BG_IMAGE = { uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' };

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your AI Coach. How can I support you today?', sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now().toString(), text: inputText.trim(), sender: 'user' };
    
    // Create the updated history array to pass to the AI
    const updatedHistory = [...messages, userMsg];
    
    setMessages(updatedHistory);
    setInputText('');
    Keyboard.dismiss();

    setIsTyping(true);
    
    // Call real Groq API with context
    const aiResponseText = await generateAIResponse(updatedHistory);
    const aiMsg = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.messageWrapperUser : styles.messageWrapperAI]}>
        <BlurView 
          intensity={isUser ? 40 : 60} 
          tint={isUser ? "light" : "dark"} 
          style={[styles.messageBubble, isUser ? styles.messageBubbleUser : styles.messageBubbleAI]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </BlurView>
      </View>
    );
  };

  return (
    <ImageBackground source={BG_IMAGE} style={styles.safeArea} resizeMode="cover">
      <LinearGradient
        colors={['rgba(11, 19, 25, 0.4)', 'rgba(11, 19, 25, 0.95)']}
        style={styles.gradientOverlay}
      >
        <SafeAreaView style={styles.safeAreaContent}>
          <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Coach</Text>
              <Text style={styles.headerSub}>Always here for you</Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {isTyping && (
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>Coach is typing...</Text>
              </View>
            )}

            <BlurView intensity={60} tint="dark" style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Message your coach..."
                placeholderTextColor={theme.colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={300}
              />
              <TouchableOpacity 
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
                onPress={sendMessage}
                disabled={!inputText.trim() || isTyping}
              >
                <Ionicons name="arrow-up" size={24} color="#FFF" />
              </TouchableOpacity>
            </BlurView>
          </KeyboardAvoidingView>
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
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.xlarge,
    fontWeight: theme.typography.weights.bold,
  },
  headerSub: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  messageWrapper: {
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
  },
  messageWrapperUser: {
    justifyContent: 'flex-end',
  },
  messageWrapperAI: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
  },
  messageBubbleUser: {
    backgroundColor: 'rgba(24, 139, 141, 0.2)', // Teal tint
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageBubbleAI: {
    backgroundColor: 'rgba(20, 30, 40, 0.4)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    lineHeight: 24,
  },
  typingIndicator: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  typingText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.sizes.small,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: theme.spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  }
});
