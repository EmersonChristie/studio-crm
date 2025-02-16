import { Anthropic } from '@ai-sdk/anthropic';
import { StreamingTextResponse } from 'ai';

// Initialize Anthropic client
const anthropic = new Anthropic(process.env.ANTHROPIC_API_KEY!);

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function streamingCompletion(
  messages: Message[],
  options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  }
) {
  try {
    const response = await anthropic.messages.create({
      model: options?.model ?? 'claude-3-sonnet-20240229',
      max_tokens: options?.maxTokens ?? 1024,
      temperature: options?.temperature ?? 0.7,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content
      })),
      stream: true
    });

    // Return a StreamingTextResponse, which can be consumed by the client
    return new StreamingTextResponse(response);
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

// Base service for handling AI completions
// - Sets up Anthropic client
// - Handles streaming responses
// - Provides type for messages
