// Service for interacting with a local LLM running in LM Studio
import { Platform } from 'react-native';
import { LOCAL_LLM_URL, LOCAL_LLM_MODEL } from '@env';

// Get the correct localhost URL based on platform
const getBaseUrl = (): string => {
  const url = LOCAL_LLM_URL;
  if (!url || typeof url !== 'string') {
    console.error('LOCAL_LLM_URL not found or invalid in .env file. Falling back to default.');
    // Provide a default or throw an error, depending on desired behavior
    return 'http://127.0.0.1:1234'; // Fallback
  }
  return url;
};

// Function to get a response from the local LLM
export const getChatResponse = async (prompt: string): Promise<string> => {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Attempting to connect to LLM at: ${baseUrl}`);
    const model = LOCAL_LLM_MODEL || 'llama-3.2-1b-instruct'; // Read model from env, fallback

    const requestBody = {
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful college assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from server');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error in getChatResponse:', error);
    return `Error connecting to local LLM: ${error.message}. Make sure LM Studio is running at ${getBaseUrl()}.`;
  }
};

// Function to get a response with chat history
export const getChatResponseWithHistory = async (messages: { role: string; content: string }[]): Promise<string> => {
  try {
    const baseUrl = getBaseUrl();
    console.log(`Attempting to connect to LLM at: ${baseUrl} with chat history`);

    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : msg.role,
      content: msg.content
    }));
    const model = LOCAL_LLM_MODEL || 'llama-3.2-1b-instruct'; // Read model from env, fallback

    const requestBody = {
      model: model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: -1,
      stream: false
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from server');
    }

    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error in getChatResponseWithHistory:', error);
    return `Error connecting to local LLM: ${error.message}. Make sure LM Studio is running at ${getBaseUrl()}.`;
  }
};

// Function to get college-related information
export const getCollegeInfo = async (query: string): Promise<string> => {
  try {
    const url = getBaseUrl(); // Use the same URL for all platforms
    
    const response = await fetch(`${url}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        model: LOCAL_LLM_MODEL || 'llama-3.2-1b-instruct', // Read model from env, fallback
        messages: [
          {
            role: 'system',
            content: 'You are a helpful college assistant. Provide accurate and helpful information about college-related topics.' 
          },
          { role: 'user', content: query }
        ],
        temperature: 0.7,
        max_tokens: -1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error('Error getting college info from local LLM:', error);
    return `Sorry, I encountered an error connecting to the local LLM: ${error.message || 'Unknown error'}. Please make sure LM Studio is running at ${getBaseUrl()}.`;
  }
};
