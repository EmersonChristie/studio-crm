import { z } from 'zod';
import { type ArtworkStatus } from '../types';

// Define the image schema to match the database structure
const imageSchema = z.object({
  url: z.string(),
  alt: z.string().nullable(),
  name: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional()
});

export const artworkSchema = z.object({
  // General Tab
  title: z.string().min(1, 'Title is required'),
  year: z.number().nullable(),
  medium: z.string().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  depth: z.number().nullable(),
  dimensions: z.string().nullable(),
  description: z.string().nullable(),
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
  mainImage: imageSchema.nullable(),
  secondaryImages: z
    .array(
      imageSchema.extend({
        id: z.string(),
        position: z.number()
      })
    )
    .optional()
});

export type ArtworkFormValues = z.infer<typeof artworkSchema>;
