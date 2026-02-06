'use client';

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function GoogleMap({
  lat = 41.7151,
  lng = 44.8271,
  zoom = 15,
}: GoogleMapProps) {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2978.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDQyJzU0LjQiTiA0NMKwNDknMzcuNiJF!5e0!3m2!1sen!2sge!4v1234567890`;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps"
      />
    </div>
  );
}
