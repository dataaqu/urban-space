'use client';

interface MinimalMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function MinimalMap({
  lat = 41.7151,
  lng = 44.8271,
  zoom = 15,
}: MinimalMapProps) {
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
  return (
    <div className="relative z-0 isolate h-full min-h-[300px] overflow-hidden rounded-2xl border border-black/10">
      <iframe
        title="Map"
        src={src}
        className="h-full w-full min-h-[300px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
