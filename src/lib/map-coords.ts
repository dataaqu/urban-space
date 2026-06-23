export function parseMapCoords(
  input: string | null | undefined
): { lat: number; lng: number } | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Bare "lat,lng" — the whole input is just the pair.
  const csv = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (csv) {
    return { lat: parseFloat(csv[1]), lng: parseFloat(csv[2]) };
  }

  // Place pin from a resolved Google Maps URL/body: `!3d<lat>!4d<lng>`.
  // Preferred over `@` because it's the exact marker, not the viewport center.
  const placeShare = trimmed.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placeShare) {
    return { lat: parseFloat(placeShare[1]), lng: parseFloat(placeShare[2]) };
  }

  // Viewport center from the address-bar URL: `@lat,lng`.
  const atCoord = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atCoord) {
    return { lat: parseFloat(atCoord[1]), lng: parseFloat(atCoord[2]) };
  }

  // Query params: `?q=`, `&ll=`, `&sll=`, `&center=` → `lat,lng`.
  const param = trimmed.match(
    /[?&](?:q|ll|sll|center|daddr|saddr)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/
  );
  if (param) {
    return { lat: parseFloat(param[1]), lng: parseFloat(param[2]) };
  }

  return null;
}
