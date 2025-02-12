'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  artworkSchema,
  type ArtworkFormValues
} from '../schemas/artwork-schema';
import { type Artwork } from '../types';

interface UseArtworkFormProps {
  mode: 'create' | 'edit';
  defaultValues?: Partial<ArtworkFormValues>;
}

export function useArtworkForm({ mode, defaultValues }: UseArtworkFormProps) {
  const form = useForm<ArtworkFormValues>({
    resolver: zodResolver(artworkSchema),
    defaultValues: defaultValues || {
      title: '',
      year: new Date().getFullYear(),
      medium: '',
      dimensions: '',
      description: '',
      status: 'available'
    }
  });

  return form;
}
