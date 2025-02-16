'use client';

import { AIToolbar } from '@/features/ai-assist/components/ai-toolbar';
import { Wand2, MessageSquare } from 'lucide-react';
import { type Artwork } from '../types';

interface ArtworkDescriptionAIProps {
  artwork: Partial<Artwork>;
  onGenerate: (content: string) => void;
}

export function ArtworkDescriptionAI({
  artwork,
  onGenerate
}: ArtworkDescriptionAIProps) {
  // Custom suggestions specific to artwork descriptions
  const suggestions = [
    {
      icon: MessageSquare,
      label: 'Generate description',
      prompt: `Generate a detailed description for an artwork titled "${artwork.title}" 
        ${artwork.medium ? `made with ${artwork.medium}` : ''} 
        ${artwork.year ? `in ${artwork.year}` : ''}`
    },
    {
      icon: Wand2,
      label: 'Technical details',
      prompt: `Generate technical details about the artwork's medium and construction`
    },
    {
      icon: Wand2,
      label: 'Artistic statement',
      prompt:
        "Generate an artistic statement about the work's meaning and inspiration"
    }
  ];

  return (
    <AIToolbar
      context={artwork}
      onGenerate={onGenerate}
      suggestions={suggestions}
    />
  );
}
