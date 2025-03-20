// Define base types for consistent usage across the application

// Status enum used in multiple places
export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'not_for_sale';

// Base image type used in multiple places
export interface BaseImage {
  url: string;
  alt: string | null;
  name?: string;
  size?: number;
  type?: string;
}

// Extended image with metadata for secondary images
export interface SecondaryImage extends BaseImage {
  id: string;
  position: number;
}

// Image type that could be used in various contexts
export interface Image extends BaseImage {
  id?: string;
  position?: number;
}

// Material used in artwork
export interface ArtworkMaterial {
  materialId: string;
  quantity: number;
  cost: number;
  name?: string; // For display purposes
}

// Production costs
export interface ProductionCosts {
  materials: ArtworkMaterial[];
  totalCost: number;
}

// Provenance information
export interface Provenance {
  previousOwner?: string;
  acquisitionMethod?: string;
  dateAcquired?: Date;
  exhibitionHistory?: string[];
}

// Base Artwork entity as returned from the database
export interface Artwork {
  id: string;
  title: string;
  year: number | null;
  dimensions: string | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  price: number | null;
  retailPrice?: number | null;
  status: ArtworkStatus;
  mainImageId: string | null;
  description: string | null;
  artist: {
    id: string;
    name: string | null;
  } | null;
  mainImage: BaseImage | null;
  medium?: string | null;
  productionCosts?: ProductionCosts;
  provenance?: Provenance;
  secondaryImages?: Image[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Type for creating a new artwork (what's required vs optional)
export interface CreateArtworkData {
  title: string;
  year?: number | null;
  medium?: string | null;
  dimensions?: string | null;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  status: ArtworkStatus;
  mainImageId?: string | null;
  artistId: string;
  description?: string | null;
}

// Type for updating an existing artwork
export type UpdateArtworkData = Partial<CreateArtworkData>;

// Filters for querying artworks
export interface ArtworkFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: ArtworkStatus;
  artistId?: string;
}
