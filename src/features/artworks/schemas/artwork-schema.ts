import { z } from 'zod';
import {
  ArtworkStatus,
  type Image,
  type Provenance,
  type ProductionCosts,
  type SecondaryImage
} from '@/types/artwork';

// Define the image schema to match the database structure and type definition
const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Please enter a valid URL'),
  alt: z.string().nullable(),
  name: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
  position: z.number().optional()
});

// Secondary image schema with required id and position
const secondaryImageSchema = imageSchema.extend({
  id: z.string(),
  position: z.number().int().nonnegative()
});

// Material schema for validating material inputs
const materialSchema = z.object({
  materialId: z.string(),
  quantity: z.number().positive('Quantity must be positive'),
  cost: z.number().nonnegative('Cost cannot be negative'),
  name: z.string().optional()
});

// Production costs schema
const productionCostsSchema = z.object({
  materials: z.array(materialSchema),
  totalCost: z.number().nonnegative('Total cost cannot be negative')
});

// Provenance schema
const provenanceSchema = z.object({
  previousOwner: z.string().optional(),
  acquisitionMethod: z.string().optional(),
  dateAcquired: z.date().optional(),
  exhibitionHistory: z.array(z.string()).optional()
});

// Main artwork schema
export const artworkFormSchema = z.object({
  // General Tab
  title: z.string().min(1, 'Title is required'),
  year: z.number().int().nullable().default(new Date().getFullYear()),
  medium: z.string().nullable().default(null),
  width: z.number().positive('Width must be positive').nullable().default(null),
  height: z
    .number()
    .positive('Height must be positive')
    .nullable()
    .default(null),
  depth: z.number().positive('Depth must be positive').nullable().default(null),
  dimensions: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  status: z
    .enum(['available', 'sold', 'reserved', 'not_for_sale'] as const)
    .default('available'),

  // Financial Tab
  retailPrice: z.number().nonnegative('Price cannot be negative').optional(),
  productionCosts: productionCostsSchema.optional(),

  // Provenance Tab
  provenance: provenanceSchema.optional(),

  // Images Tab
  mainImage: imageSchema.nullable().default(null),
  secondaryImages: z.array(secondaryImageSchema).optional().default([])
});

export type ArtworkFormValues = z.infer<typeof artworkFormSchema>;

// Helper function to convert form values to create artwork data
export function formValuesToCreateData(
  formValues: ArtworkFormValues,
  artistId: string,
  mainImageId?: string | null
) {
  console.log('Converting form values to create data:', formValues);

  return {
    title: formValues.title,
    year: formValues.year,
    medium: formValues.medium,
    dimensions: formValues.dimensions,
    width: formValues.width,
    height: formValues.height,
    depth: formValues.depth,
    status: formValues.status,
    mainImageId: mainImageId,
    artistId,
    description: formValues.description
  };
}
