// Single source of truth for deciding whether a stored media URL is a video.
// Video is only allowed in the IMAGE_ONLY page layout; we detect it by file
// extension so no extra DB column / migration is needed (the URL lives in the
// existing image1 field).
export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(url);
}
