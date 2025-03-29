import OpenAI from 'openai';
import { Faculty, Classroom, Event, Timetable } from '../types';

// Replace with your OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

interface ChatbotContext {
  faculty?: Faculty[];
  classrooms?: Classroom[];
  events?: Event[];
  timetable?: Timetable[];
}

export const generateChatbotResponse = async (
  query: string,
  context: ChatbotContext
): Promise<string> => {
  try {
    // Create a system message with context data
    const systemMessage = `You are a helpful college services assistant. 
    You have access to the following data:
    
    ${context.faculty ? `Faculty: ${JSON.stringify(context.faculty)}` : ''}
    ${context.classrooms ? `Classrooms: ${JSON.stringify(context.classrooms)}` : ''}
    ${context.events ? `Events: ${JSON.stringify(context.events)}` : ''}
    ${context.timetable ? `Timetable: ${JSON.stringify(context.timetable)}` : ''}
    
    Answer questions based on this data. If you don't know the answer, say so politely.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: query }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    return 'Sorry, there was an error processing your request. Please try again later.';
  }
};

export const generateSearchSuggestions = async (
  query: string,
  context: ChatbotContext
): Promise<string[]> => {
  try {
    const systemMessage = `You are a helpful college services assistant. 
    Based on the following data and the user's partial query, suggest 3-5 complete search queries they might be looking for.
    
    ${context.faculty ? `Faculty: ${JSON.stringify(context.faculty)}` : ''}
    ${context.classrooms ? `Classrooms: ${JSON.stringify(context.classrooms)}` : ''}
    ${context.events ? `Events: ${JSON.stringify(context.events)}` : ''}
    ${context.timetable ? `Timetable: ${JSON.stringify(context.timetable)}` : ''}
    
    Return ONLY a JSON array of strings with no additional text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: `Partial query: "${query}"` }
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content || '{"suggestions": []}';
    const suggestions = JSON.parse(content).suggestions || [];
    return suggestions;
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return [];
  }
}; 