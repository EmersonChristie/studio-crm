export type ArtworkStatus = 'available' | 'sold' | 'reserved';

export interface Artist {
  id: string;
  name: string;
}

export interface ArtworkImage {
  url: string;
  alt?: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: Artist;
  mainImage?: ArtworkImage;
  status: ArtworkStatus;
  price: number;
  medium?: string;
  dimensions?: {
    width: number;
    height: number;
    unit: 'in' | 'cm';
  };
  year?: number;
  images?: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
