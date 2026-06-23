export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { lookup } from 'node:dns/promises';
import net from 'node:net';
import { authOptions } from '@/lib/auth';
import { parseMapCoords } from '@/lib/map-coords';

// Only legitimate Google Maps share / destination domains. Every hop in the
// redirect chain is re-validated against this, so the server can never be
// steered at an arbitrary host.
function isAllowedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'maps.app.goo.gl' || h === 'goo.gl') return true;
  // Covers maps.google.com, www.google.com, consent.google.com, regional TLDs
  // are intentionally NOT allowed — share links resolve to .google.com.
  return h === 'google.com' || h.endsWith('.google.com');
}

// Reject loopback / private (RFC1918) / link-local / ULA addresses so a
// (hypothetical) redirect to an internal IP can't reach internal services.
function isBlockedAddress(ip: string): boolean {
  if (net.isIP(ip) === 0) return true;
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isBlockedAddress(v.slice(7)); // ipv4-mapped
  if (v === '0.0.0.0' || v === '::' || v === '::1') return true;
  if (v.startsWith('127.') || v.startsWith('169.254.')) return true;
  if (v.startsWith('10.') || v.startsWith('192.168.')) return true;
  const m = v.match(/^172\.(\d+)\./);
  if (m && +m[1] >= 16 && +m[1] <= 31) return true;
  if (v.startsWith('fe80:') || v.startsWith('fc') || v.startsWith('fd')) return true;
  return false;
}

async function assertSafeUrl(raw: string): Promise<URL> {
  const u = new URL(raw); // throws on malformed input
  if (u.protocol !== 'https:') throw new Error('scheme not allowed');
  if (!isAllowedHost(u.hostname)) throw new Error('host not allowed');
  const addrs = await lookup(u.hostname, { all: true });
  if (addrs.some((a) => isBlockedAddress(a.address))) {
    throw new Error('resolves to a blocked address');
  }
  return u;
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Follow redirects manually, re-validating each hop's host before fetching.
async function resolveCoords(
  startUrl: string,
): Promise<{ lat: number; lng: number } | null> {
  let current = startUrl;
  for (let hop = 0; hop < 6; hop++) {
    const u = await assertSafeUrl(current);
    const res = await fetch(u.toString(), {
      redirect: 'manual',
      headers: { 'User-Agent': UA },
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) break;
      current = new URL(location, u).toString(); // resolve relative redirects
      continue;
    }

    // Final response — the URL usually carries `@lat,lng` or `!3d!4d`;
    // otherwise the place page embeds the pin in its HTML body.
    let coords = parseMapCoords(u.toString());
    if (!coords) coords = parseMapCoords(await res.text());
    return coords;
  }
  return null;
}

// Google "Share" links (maps.app.goo.gl / goo.gl/maps) carry no coordinates —
// they are redirects the browser can't follow (CORS). We resolve them here,
// constrained to Google domains only (see SSRF guards above).
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

    // Inline coordinates? No network request needed (and works for any host).
    const direct = parseMapCoords(url);
    if (direct) return NextResponse.json(direct);

    let coords: { lat: number; lng: number } | null = null;
    try {
      coords = await resolveCoords(url.trim());
    } catch {
      // Disallowed host/scheme/address or malformed URL — treat as unresolvable.
      return NextResponse.json(
        { error: 'Only Google Maps share links are supported' },
        { status: 400 },
      );
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
