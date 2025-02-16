'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter
} from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2, Check, X, RotateCcw } from 'lucide-react';
import { useArtworkAI } from '../hooks/use-artwork-ai';
import { type Artwork } from '../types';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface ArtworkDescriptionAIDialogProps {
  artwork: Partial<Artwork>;
  onGenerate: (content: string) => void;
}

export function ArtworkDescriptionAIDialog({
  artwork,
  onGenerate
}: ArtworkDescriptionAIDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showActions, setShowActions] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const {
    generate,
    completion,
    isLoading,
    error,
    preferences,
    setPreferences
  } = useArtworkAI({
    artwork,
    field: 'description',
    onComplete: () => {
      setShowActions(true);
    }
  });

  const handleGenerate = async () => {
    try {
      await generate(userInput);
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const handleAccept = () => {
    onGenerate(completion);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setUserInput('');
    setShowActions(false);
  };

  const GenerateButton = (
    <Button variant='outline' size='sm' className='gap-2'>
      <Wand2 className='h-4 w-4' />
      Generate with AI
    </Button>
  );

  const Content = (
    <div className='space-y-4 py-4'>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label>Tone</Label>
          <Select
            value={preferences.tone}
            onValueChange={(value) =>
              setPreferences({ ...preferences, tone: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='academic'>Academic</SelectItem>
              <SelectItem value='poetic'>Poetic</SelectItem>
              <SelectItem value='conversational'>Conversational</SelectItem>
              <SelectItem value='formal'>Formal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-2'>
          <Label>Length</Label>
          <Select
            value={preferences.length}
            onValueChange={(value) =>
              setPreferences({ ...preferences, length: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='brief'>Brief (50-100 words)</SelectItem>
              <SelectItem value='standard'>Standard (150-200 words)</SelectItem>
              <SelectItem value='detailed'>Detailed (300-400 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Additional Context (Optional)</Label>
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Use this area to add any instructions for the AI such as the meaning behind the piece, inspiration, bullet points, or simply a rough version of the description...'
          rows={3}
        />
      </div>

      {completion && (
        <div className='space-y-2'>
          <Label>Generated Description</Label>
          <div className='rounded-md border p-4'>
            <p className='whitespace-pre-wrap'>{completion}</p>
          </div>
        </div>
      )}

      <div className='mt-6'>
        {!showActions ? (
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className='w-full gap-2'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className='h-4 w-4' />
                Generate
              </>
            )}
          </Button>
        ) : (
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Button
              variant='outline'
              onClick={() => {
                setShowActions(false);
                handleGenerate();
              }}
              className='w-full sm:w-auto'
            >
              <RotateCcw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
            <Button
              variant='outline'
              onClick={handleClose}
              className='w-full sm:w-auto'
            >
              <X className='mr-2 h-4 w-4' />
              Discard
            </Button>
            <Button onClick={handleAccept} className='w-full sm:w-auto'>
              <Check className='mr-2 h-4 w-4' />
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isDesktop) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>{GenerateButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Generate Description with AI</DrawerTitle>
          </DrawerHeader>
          {Content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{GenerateButton}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Generate Description with AI</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  );
}
