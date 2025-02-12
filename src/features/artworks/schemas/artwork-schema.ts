import * as z from 'zod';
import { ArtworkStatus } from '../types';

export const artworkSchema = z.object({
  // General Tab
  title: z.string().min(1, 'Title is required'),
  year: z.number().nullable(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['available', 'sold', 'reserved', 'not_for_sale'] as const),

  // Financial Tab
  retailPrice: z.number().optional(),
  productionCosts: z
    .object({
      materials: z.array(
        z.object({
          materialId: z.string(),
          quantity: z.number(),
          cost: z.number()
        })
      ),
      totalCost: z.number()
    })
    .optional(),

  // Provenance Tab
  provenance: z
    .object({
      previousOwner: z.string().optional(),
      acquisitionMethod: z.string().optional(),
      dateAcquired: z.date().optional(),
      exhibitionHistory: z.array(z.string()).optional()
    })
    .optional(),

  // Images Tab
  mainImage: z
    .object({
      id: z.string(),
      url: z.string(),
      alt: z.string().optional()
    })
    .optional(),
  secondaryImages: z
    .array(
      z.object({
        id: z.string(),
        url: z.string(),
        alt: z.string().optional(),
        position: z.number()
      })
    )
    .optional()
});

export type ArtworkFormValues = z.infer<typeof artworkSchema>;
