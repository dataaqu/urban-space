export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseMapCoords } from '@/lib/map-coords';

// Google "Share" links (maps.app.goo.gl / goo.gl/maps) carry no coordinates —
// they are redirects. The browser can't follow them (CORS), so we resolve them
// here: follow the redirect, then parse the final URL (and, as a fallback, the
// page body, where place pages embed the pin as `!3d<lat>!4d<lng>`).
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Already has inline coordinates? No network needed.
    const direct = parseMapCoords(url);
    if (direct) return NextResponse.json(direct);

    const res = await fetch(url.trim(), {
      redirect: 'follow',
      headers: {
        // Some Google endpoints serve an interstitial without a browser UA.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      },
    });

    // The final URL after redirects usually contains `@lat,lng` or `!3d!4d`.
    let coords = parseMapCoords(res.url);

    // Fallback: scan the HTML body (place pages embed the pin in `!3d!4d`).
    if (!coords) {
      const body = await res.text();
      coords = parseMapCoords(body);
    }

    if (coords) return NextResponse.json(coords);

    return NextResponse.json(
      { error: 'Could not extract coordinates from link' },
      { status: 422 },
    );
  } catch (error) {
    console.error('Resolve map link error:', error);
    return NextResponse.json({ error: 'Failed to resolve link' }, { status: 500 });
  }
}
