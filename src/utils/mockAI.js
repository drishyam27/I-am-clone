export const generateAIResponse = (userMessage) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = [
        "I hear you. Remember that growth takes time, and you are doing exactly what you need to do today. Keep going!",
        "It's okay to feel overwhelmed. Take a deep breath. You possess a unique light that the world needs.",
        "Every step you take today is a beautiful investment in your future. Be proud of your journey.",
        "Your feelings are valid. Let's focus on the present moment and find peace within it.",
        "You have overcome challenges before, and you will overcome this one. Trust your inner strength.",
        "That's completely understandable. Remember to be gentle with yourself today.",
        "I believe in you. Even the smallest step forward is progress worth celebrating."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1500 + Math.random() * 1000); // 1.5s to 2.5s delay
  });
};
