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
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1757.3000842348376!2d44.78490122817231!3d41.70716989309655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440cd0b535a2ff%3A0x12f50b2773dbf022!2s5%20Niko%20Nikoladze%20St%2C%20T'bilisi%200108!5e0!3m2!1sen!2sge!4v1776150329366!5m2!1sen!2sge`;

  return (
    <div className="w-full h-full overflow-hidden" style={{ filter: 'saturate(0.3) brightness(1.02) contrast(0.9) sepia(0.15) hue-rotate(190deg)' }}>
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
