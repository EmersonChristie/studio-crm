import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { artworks, users, images } from '@/lib/db/schema';
import {
  createApiRoute,
  parseQuery,
  successResponse,
  validateBody
} from '@/lib/api/api-handler';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { AppError, createUnauthorizedError } from '@/lib/utils/error-handler';
import { z } from 'zod';
import { artworkFormSchema } from '@/features/artworks/schemas/artwork-schema';
import { revalidateTag } from 'next/cache';

// Schema for query parameters
const artworksQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.enum(['available', 'sold', 'reserved', 'not_for_sale']).optional()
});

// Schema for creating artworks
const createArtworkSchema = artworkFormSchema.pick({
  title: true,
  year: true,
  medium: true,
  dimensions: true,
  width: true,
  height: true,
  depth: true,
  status: true,
  description: true
});

export const GET = createApiRoute({
  GET: async (req) => {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      throw createUnauthorizedError();
    }

    // Parse and validate query parameters
    const {
      page = 1,
      limit = 10,
      search,
      status
    } = parseQuery(req, artworksQuerySchema);

    // Since we've provided defaults in the schema and here, these are always numbers
    const offset = (page - 1) * limit;

    // Build the where clause
    const whereClause = [];

    if (search) {
      whereClause.push(ilike(artworks.title, `%${search}%`));
    }

    if (status) {
      whereClause.push(eq(artworks.status, status));
    }

    // Get artworks and total count
    const [artworksData, totalCount] = await Promise.all([
      db
        .select({
          id: artworks.id,
          title: artworks.title,
          year: artworks.year,
          dimensions: artworks.dimensions,
          price: sql<number>`CAST(${artworks.retailPrice} AS decimal)`,
          status: artworks.status,
          mainImageId: artworks.mainImageId,
          artist: {
            id: users.id,
            name: users.name
          },
          mainImage: {
            url: images.url,
            alt: images.alt
          }
        })
        .from(artworks)
        .leftJoin(users, eq(artworks.artistId, users.id))
        .leftJoin(images, eq(artworks.mainImageId, images.id))
        .where(and(...whereClause))
        .limit(Number(limit))
        .offset(offset),

      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(artworks)
        .where(and(...whereClause))
        .then((res) => res[0].count)
    ]);

    // Return the response
    return successResponse({
      artworks: artworksData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  },

  POST: async (req) => {
    // Authenticate the user
    const session = await auth();
    if (!session?.user?.id) {
      throw createUnauthorizedError();
    }

    // Validate the request body
    const data = await validateBody(req, createArtworkSchema);

    try {
      // Perform the insert manually to avoid type issues
      // First, collect the values
      const title = data.title;
      const artistId = session.user.id;
      const year = data.year;
      const medium = data.medium;
      const dimensions = data.dimensions;
      const width = data.width;
      const height = data.height;
      const depth = data.depth;
      const status = data.status;
      const description = data.description;

      // Create a new artwork in the database
      const newArtwork = await db
        .select()
        .from(artworks)
        .where(
          eq(
            artworks.id,
            sql`(
              INSERT INTO artworks (
                title, artist_id, year, medium, dimensions, 
                width, height, depth, status, description
              ) 
              VALUES (
                ${title}, ${artistId}, ${year}, ${medium}, ${dimensions},
                ${width}, ${height}, ${depth}, ${status}, ${description}
              )
              RETURNING id
            )`
          )
        );

      // Fetch the newly created artwork
      const createdArtwork = newArtwork[0];

      // Revalidate cache
      revalidateTag('artworks');

      // Return the response
      return successResponse(
        {
          artwork: createdArtwork
        },
        201
      );
    } catch (error) {
      console.error('Error creating artwork:', error);
      throw new AppError('Failed to create artwork', 500);
    }
  }
});
