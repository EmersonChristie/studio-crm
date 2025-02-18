export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'not_for_sale';

export type Artwork = {
  id: string;
  title: string;
  year: number | null;
  dimensions: string | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  price: number | null;
  status: ArtworkStatus;
  mainImageId: string | null;
  description: string | null;
  artist: {
    id: string;
    name: string | null;
  } | null;
  mainImage: {
    url: string;
    alt: string | null;
  } | null;
  medium?: string;
};
