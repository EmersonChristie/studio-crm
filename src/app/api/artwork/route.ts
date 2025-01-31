import { artworkService } from '@/lib/services/artwork.service';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('q') || undefined;
  const status = searchParams.get('status') || undefined;

  try {
    const data = await artworkService.getArtworks({
      page,
      limit,
      search,
      status: status as any
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
