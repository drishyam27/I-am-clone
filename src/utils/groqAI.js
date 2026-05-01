const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

const SYSTEM_PROMPT = {
  role: 'system',
  content: "You are a compassionate, empathetic AI Coach. Your sole purpose is to provide advice, emotional support, and motivation to the user. Keep your responses concise, encouraging, and focused on personal growth. Do not answer questions or perform tasks outside of emotional support and motivation."
};

export const generateAIResponse = async (chatHistory) => {
  if (!GROQ_API_KEY) {
    return "API Key is missing. Please check your .env file.";
  }

  // Map the chat history to the format expected by OpenAI/Groq API
  const formattedHistory = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text
  }));

  const messages = [SYSTEM_PROMPT, ...formattedHistory];

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Updated fast model
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error('Groq API Error:', await response.text());
      return "I'm having trouble connecting to my servers right now. Please try again later.";
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Network Error:', error);
    return "I'm having trouble connecting to the network right now. Please check your connection.";
  }
};
