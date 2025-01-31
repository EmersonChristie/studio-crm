import { config } from 'dotenv';
import path from 'path';
// Load .env file - this must come before other imports
config({ path: '.env.local' });

console.log('Database URL:', process.env.DATABASE_URL);

// Only import other modules after environment variables are loaded
import { createId } from '@paralleldrive/cuid2';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  users,
  series,
  materials,
  artworkProductionCosts,
  provenance,
  images,
  artworks,
  artworkSecondaryImages,
  artworkMaterials,
  artworkListItems,
  artworkLists,
  accounts
} from '@/lib/db/schema';
import postgres from 'postgres';

// WARNING: Only use this in development!
async function clearAllTables() {
  await db.delete(artworkSecondaryImages);
  await db.delete(artworkMaterials);
  await db.delete(artworkListItems);
  await db.delete(artworkLists);
  await db.delete(artworks);
  await db.delete(images);
  await db.delete(provenance);
  await db.delete(artworkProductionCosts);
  await db.delete(materials);
  await db.delete(series);
  await db.delete(accounts);
  await db.delete(users);
  console.log('🧹 Cleared all tables');
}

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    await clearAllTables();

    // Create a test artist user
    const artistId = createId();
    await db.insert(users).values({
      id: artistId,
      name: 'Test Artist',
      email: 'artist@test.com',
      password: 'hashed_password_here',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created test user');

    // Create some series
    const seriesData = await db
      .insert(series)
      .values([
        {
          name: 'Nature Studies',
          description: 'A series exploring natural forms and patterns'
        },
        {
          name: 'Urban Landscapes',
          description: 'Contemporary city scenes in mixed media'
        }
      ])
      .returning();
    console.log('✅ Created series');

    // Create some materials
    const materialsData = await db
      .insert(materials)
      .values([
        {
          name: 'Oil Paint',
          unitPrice: '45.99',
          unitMeasurement: 'tube',
          supplier: 'Art Supplies Co'
        },
        {
          name: 'Canvas',
          unitPrice: '25.50',
          unitMeasurement: 'meter',
          supplier: 'Canvas World'
        },
        {
          name: 'Acrylic Paint',
          unitPrice: '32.99',
          unitMeasurement: 'bottle',
          supplier: 'Art Supplies Co'
        }
      ])
      .returning();
    console.log('✅ Created materials');

    // Create some production costs
    const productionCostsData = await db
      .insert(artworkProductionCosts)
      .values([
        { totalCost: '150.75' },
        { totalCost: '275.50' },
        { totalCost: '425.25' }
      ])
      .returning();
    console.log('✅ Created production costs');

    // Create some provenance records
    const provenanceData = await db
      .insert(provenance)
      .values([
        {
          previousOwner: 'Private Collection',
          acquisitionMethod: 'Direct Sale',
          dateAcquired: new Date('2023-01-15'),
          salePrice: '1200.00',
          exhibitionHistory: ['Local Gallery Show 2023', 'Art Fair 2023']
        }
      ])
      .returning();
    console.log('✅ Created provenance records');

    // Create some images
    const imagesData = await db
      .insert(images)
      .values([
        {
          url: 'https://picsum.photos/800/600',
          alt: 'Abstract painting with blue and gold elements',
          caption: 'Main view',
          width: 800,
          height: 600,
          size: 2500000,
          mimeType: 'image/jpeg',
          filename: 'artwork1-main.jpg',
          blurDataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
        },
        {
          url: 'https://picsum.photos/800/600?random=1',
          alt: 'Detail view of texture',
          caption: 'Texture detail',
          width: 800,
          height: 600,
          size: 1500000,
          mimeType: 'image/jpeg',
          filename: 'artwork1-detail1.jpg',
          blurDataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
        }
      ])
      .returning();
    console.log('✅ Created images');

    // Create some artworks
    const artworksData = await db
      .insert(artworks)
      .values([
        {
          title: 'Sunset Reflections',
          artistId: artistId,
          year: 2023,
          medium: 'Oil on Canvas',
          dimensions: '100x80cm',
          description: 'A vibrant sunset scene reflecting on calm waters',
          seriesId: seriesData[0].id,
          editionNumber: 1,
          editionTotal: 1,
          provenanceId: provenanceData[0].id,
          productionCostId: productionCostsData[0].id,
          retailPrice: '2500.00',
          status: 'available',
          location: 'Studio',
          mainImageId: imagesData[0].id
        },
        {
          title: 'Urban Motion',
          artistId: artistId,
          year: 2023,
          medium: 'Mixed Media',
          dimensions: '120x90cm',
          description: 'Dynamic city scene capturing urban energy',
          seriesId: seriesData[1].id,
          productionCostId: productionCostsData[1].id,
          retailPrice: '3200.00',
          status: 'available',
          location: 'Gallery',
          mainImageId: imagesData[1].id
        }
      ])
      .returning();
    console.log('✅ Created artworks');

    // Create artwork-material relationships
    await db.insert(artworkMaterials).values([
      {
        artworkId: artworksData[0].id,
        materialId: materialsData[0].id,
        quantity: '3.5'
      },
      {
        artworkId: artworksData[0].id,
        materialId: materialsData[1].id,
        quantity: '2'
      }
    ]);
    console.log('✅ Created artwork materials');

    // Create secondary images relationships
    await db.insert(artworkSecondaryImages).values([
      {
        artworkId: artworksData[0].id,
        imageId: imagesData[1].id,
        position: 1
      }
    ]);
    console.log('✅ Created artwork secondary images');

    console.log('✅ Database seeded successfully');
  } finally {
    // Close the database connection
    const sql = db.$client as postgres.Sql;
    await sql.end();
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
