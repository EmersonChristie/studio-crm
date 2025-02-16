'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { type Artwork } from '../types';

interface UseArtworkAIProps {
  artwork: Partial<Artwork>;
  field: 'description' | 'title' | 'statement';
  onComplete?: (content: string) => void;
}

type WritingTone = 'academic' | 'poetic' | 'conversational' | 'formal';
type WritingLength = 'brief' | 'standard' | 'detailed';

interface WritingPreferences {
  tone: WritingTone;
  length: WritingLength;
  additionalContext?: string;
}

export function useArtworkAI({
  artwork,
  field,
  onComplete
}: UseArtworkAIProps) {
  const [preferences, setPreferences] = useState<WritingPreferences>({
    tone: 'formal',
    length: 'standard'
  });

  const { complete, completion, isLoading, error, stop } = useCompletion({
    api: '/api/artwork-ai',
    onFinish: (result) => {
      onComplete?.(result);
    },
    onError: (error: Error) => {
      console.error('AI Completion Error:', error);
    }
  });

  const generatePrompt = (userInput?: string) => {
    const context = {
      title: artwork.title,
      medium: artwork.medium,
      year: artwork.year,
      dimensions: artwork.dimensions,
      imageUrl: artwork.mainImage?.url,
      preferences,
      field,
      userInput
    };

    return JSON.stringify({
      context,
      userInput
    });
  };

  const generate = async (userInput?: string) => {
    try {
      const prompt = generatePrompt(userInput);
      await complete(prompt);
    } catch (error) {
      console.error('Generation Error:', error);
      throw error;
    }
  };

  return {
    generate,
    completion,
    isLoading,
    error,
    preferences,
    setPreferences,
    stop
  };
}
