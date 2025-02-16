'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronRight,
  Wand2,
  Check,
  X,
  RotateCcw,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArtworkAI } from '@/features/artworks/hooks/use-artwork-ai';
import { type Artwork } from '../types';
import { AIToolbarPreferences } from './ai-toolbar-preferences';

interface AIToolbarProps {
  // Context data that will be used for AI generation
  context?: Record<string, any>;
  // Callback when AI generates content
  onGenerate?: (content: string) => void;
  // Custom suggestions based on context
  suggestions?: Array<{
    icon: React.ElementType;
    label: string;
    prompt?: string;
  }>;
}

export function AIToolbar({
  context,
  onGenerate,
  suggestions: customSuggestions
}: AIToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    generate,
    completion,
    isLoading: isGenerating,
    error,
    preferences,
    setPreferences,
    stop
  } = useArtworkAI({
    artwork: context as Artwork,
    field: 'description',
    onComplete: onGenerate
  });

  // Default suggestions that can be overridden
  const defaultSuggestions = [
    { icon: MessageSquare, label: 'Explain this' },
    { icon: Wand2, label: 'Make longer' },
    { icon: Wand2, label: 'Make shorter' },
    { icon: Wand2, label: 'Fix spelling & grammar' },
    { icon: Wand2, label: 'Improve writing' }
  ];

  const suggestions = customSuggestions || defaultSuggestions;

  const actions = [
    { icon: Check, label: 'Accept', onClick: () => handleAccept() },
    { icon: X, label: 'Discard', onClick: () => handleDiscard() },
    { icon: RotateCcw, label: 'Try again', onClick: () => handleTryAgain() }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsLoading(true);
    try {
      await generate(inputValue);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onGenerate?.(inputValue);
    resetState();
  };

  const handleDiscard = () => {
    resetState();
  };

  const handleTryAgain = () => {
    setShowActions(false);
    // Keep the input but allow for a new generation
  };

  const resetState = () => {
    setInputValue('');
    setShowActions(false);
    setIsOpen(false);
  };

  return (
    <div className='relative w-full'>
      <form onSubmit={handleSubmit}>
        <Card
          className={cn(
            'mt-2 p-2 transition-all duration-200',
            isOpen && 'ring-2 ring-primary'
          )}
        >
          <div className='flex items-start gap-2'>
            <div className='relative min-w-0 flex-1'>
              <textarea
                className='max-h-[200px] w-full resize-none overflow-y-auto border-0 bg-transparent p-2 focus:outline-none disabled:opacity-50'
                placeholder='Ask AI to help, or just press send for a gallery-style description...'
                rows={Math.min(5, Math.max(1, inputValue.split('\n').length))}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => !inputValue && setIsOpen(false)}
                disabled={isLoading}
              />
            </div>
            <div className='flex gap-2'>
              <AIToolbarPreferences
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
              <Button
                type='submit'
                size='sm'
                className='mt-1 shrink-0'
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className='absolute flex w-full animate-fade-in items-center justify-center space-x-2 p-4 text-sm text-muted-foreground'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span>Generating...</span>
        </div>
      )}

      {/* Suggestions - Desktop */}
      {isOpen && !showActions && !isLoading && (
        <div className='absolute z-10 hidden w-full duration-200 animate-in slide-in-from-top-2 md:block'>
          <Card className='mt-2 p-2'>
            <div className='px-2 py-1 text-sm font-medium text-muted-foreground'>
              Suggestions
            </div>
            <div className='space-y-1'>
              {suggestions.map((item, index) => (
                <Button
                  key={item.label}
                  variant='ghost'
                  className='w-full justify-start gap-2 px-2 transition-colors duration-200'
                  onClick={() => {
                    setInputValue(item.prompt || item.label);
                    handleSubmit(new Event('submit') as any);
                  }}
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Suggestions - Mobile */}
      {isOpen && !showActions && !isLoading && (
        <div className='absolute left-0 right-0 z-10'>
          <div className='scrollbar-none mt-2 overflow-x-auto whitespace-nowrap bg-background p-2 duration-200 animate-in slide-in-from-left-2 md:hidden'>
            <div className='flex gap-2 px-0.5'>
              {suggestions.map((item, index) => (
                <Button
                  key={item.label}
                  variant='outline'
                  className='flex shrink-0 items-center gap-2 rounded-full border-primary transition-transform hover:scale-105'
                  onClick={() => {
                    setInputValue(item.prompt || item.label);
                    handleSubmit(new Event('submit') as any);
                  }}
                >
                  <item.icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions - Desktop */}
      {showActions && !isLoading && (
        <div className='absolute z-10 hidden w-full duration-200 animate-in slide-in-from-top-2 md:block'>
          <Card className='mt-2 p-2'>
            <div className='px-2 py-1 text-sm font-medium text-muted-foreground'>
              Actions
            </div>
            <div className='space-y-1'>
              {actions.map((action, index) => (
                <Button
                  key={action.label}
                  variant='ghost'
                  className='w-full justify-start gap-2 px-2 transition-colors duration-200'
                  onClick={action.onClick}
                >
                  <action.icon className='h-4 w-4' />
                  <span>{action.label}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Actions - Mobile */}
      {showActions && !isLoading && (
        <div className='mt-2 flex gap-2 duration-200 animate-in slide-in-from-bottom-2 md:hidden'>
          {actions.map((action, index) => (
            <Button
              key={action.label}
              variant='outline'
              className='flex flex-1 items-center justify-center gap-2 transition-transform hover:scale-105'
              onClick={action.onClick}
            >
              <action.icon className='h-4 w-4' />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
