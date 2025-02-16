import { streamingCompletion } from '@/lib/services/ai.service';
import { NextRequest } from 'next/server';
import { type Message } from '@/lib/services/ai.service';

const WORD_COUNT_MAP = {
  brief: '50-100',
  standard: '150-200',
  detailed: '300-400'
};

export async function POST(req: NextRequest) {
  try {
    const { context, userInput } = await req.json();

    const baseSystemPrompt = `You are an expert art curator and writer for prestigious contemporary art galleries and museums.
    You are writing content for an artwork with the following details:
    
    Title: ${context.title}
    Medium: ${context.medium}
    Year: ${context.year}
    Dimensions: ${context.dimensions}
    ${context.imageUrl ? `Image URL: ${context.imageUrl}` : ''}

    Writing Preferences:
    - Tone: ${context.preferences.tone}
    - Length: ${WORD_COUNT_MAP[context.preferences.length]} words
    ${context.preferences.additionalContext ? `- Additional Context: ${context.preferences.additionalContext}` : ''}

    Guidelines:
    - Write in a sophisticated yet accessible style suitable for a major contemporary art gallery or museum
    - Focus on both formal analysis and conceptual interpretation
    - Consider historical and cultural context when relevant
    - Use precise, evocative language
    - Maintain professional art world vocabulary while avoiding unnecessary jargon
    
    You are specifically helping with the artwork's ${context.field}.`;

    const messages: Message[] = [{ role: 'system', content: baseSystemPrompt }];

    // If user provided input, add it as a specific request
    if (userInput) {
      messages.push({
        role: 'user',
        content: userInput
      });
    } else {
      // If no user input, add a default request for gallery-style description
      messages.push({
        role: 'user',
        content:
          'Please write a comprehensive description of this artwork suitable for a gallery wall text or museum catalog entry.'
      });
    }

    return await streamingCompletion(messages, {
      temperature: 0.7,
      maxTokens: 800
    });
  } catch (error) {
    console.error('Artwork AI error:', error);
    return new Response('Error processing AI request', { status: 500 });
  }
}
