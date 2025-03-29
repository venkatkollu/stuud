import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variable
const apiKey = 'a8f80b23ca5e4d649f186b69c91f4266';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(apiKey);

// Function to get a response from Gemini
export const getChatResponse = async (prompt: string): Promise<string> => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error getting response from Gemini:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
};

// Function to get a response with chat history
export const getChatResponseWithHistory = async (
  messages: { role: 'user' | 'model'; content: string }[]
): Promise<string> => {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Start a chat session
    const chat = model.startChat();
    
    // Send the last message from the user
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || '';
    
    const result = await chat.sendMessage(lastUserMessage);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error getting response from Gemini with history:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
};

// Function to get college-related information
export const getCollegeInfo = async (query: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Add context about being a college assistant
    const promptWithContext = `As a college assistant, please provide information about: ${query}`;
    
    const result = await model.generateContent(promptWithContext);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error getting college info from Gemini:', error);
    return 'Sorry, I encountered an error processing your request. Please try again later.';
  }
}; 