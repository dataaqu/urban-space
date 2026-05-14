export function parseMapCoords(
  input: string | null | undefined
): { lat: number; lng: number } | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  const csv = trimmed.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (csv) {
    return { lat: parseFloat(csv[1]), lng: parseFloat(csv[2]) };
  }

  const atCoord = trimmed.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atCoord) {
    return { lat: parseFloat(atCoord[1]), lng: parseFloat(atCoord[2]) };
  }

  const placeShare = trimmed.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (placeShare) {
    return { lat: parseFloat(placeShare[1]), lng: parseFloat(placeShare[2]) };
  }

  return null;
}
