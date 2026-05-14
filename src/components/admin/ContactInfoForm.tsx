'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button, Card, Input, useToast } from './ui';
import { parseMapCoords } from '@/lib/map-coords';

interface ContactInfoData {
  phone: string | null;
  email: string | null;
  addressKa: string | null;
  addressEn: string | null;
  facebook: string | null;
  instagram: string | null;
  mapLat: number | null;
  mapLng: number | null;
}

interface ContactContentData {
  titleKa: string;
  titleEn: string;
  subtitleKa: string;
  subtitleEn: string;
}

export default function ContactInfoForm({
  initial,
  content,
}: {
  initial: ContactInfoData;
  content: ContactContentData;
}) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [mapPaste, setMapPaste] = useState('');
  const [mapPasteError, setMapPasteError] = useState<string | null>(null);
  const [form, setForm] = useState({
    phone: initial.phone ?? '',
    email: initial.email ?? '',
    addressKa: initial.addressKa ?? '',
    addressEn: initial.addressEn ?? '',
    facebook: initial.facebook ?? '',
    instagram: initial.instagram ?? '',
    mapLat: initial.mapLat?.toString() ?? '',
    mapLng: initial.mapLng?.toString() ?? '',
    titleKa: content.titleKa,
    titleEn: content.titleEn,
    subtitleKa: content.subtitleKa,
    subtitleEn: content.subtitleEn,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleMapPaste = (value: string) => {
    setMapPaste(value);
    if (!value.trim()) {
      setMapPasteError(null);
      return;
    }
    const coords = parseMapCoords(value);
    if (coords) {
      setForm((prev) => ({
        ...prev,
        mapLat: coords.lat.toString(),
        mapLng: coords.lng.toString(),
      }));
      setMapPasteError(null);
    } else {
      setMapPasteError('კოორდინატები ვერ ამოვიცანი. გამოიყენე "lat,lng" ან Google Maps URL.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contentItems = [
        { section: 'contact', key: 'title', valueKa: form.titleKa, valueEn: form.titleEn },
        { section: 'contact', key: 'subtitle', valueKa: form.subtitleKa, valueEn: form.subtitleEn },
      ];
      const [infoRes, contentRes] = await Promise.all([
        fetch('/api/admin/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: form.phone,
            email: form.email,
            addressKa: form.addressKa,
            addressEn: form.addressEn,
            facebook: form.facebook,
            instagram: form.instagram,
            mapLat: form.mapLat,
            mapLng: form.mapLng,
          }),
        }),
        fetch('/api/admin/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: contentItems }),
        }),
      ]);
      if (infoRes.ok && contentRes.ok) {
        toast.success('კონტაქტის ინფო შენახულია');
        router.refresh();
      } else {
        toast.error('შენახვა ვერ მოხერხდა');
      }
    } catch {
      toast.error('შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <Card padded>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-900">გვერდის ტექსტი</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            სათაური და ქვესათაური Contact გვერდის თავზე.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="სათაური (ქართ.)"
            name="titleKa"
            value={form.titleKa}
            onChange={handleChange}
            placeholder="კონტაქტი"
          />
          <Input
            label="სათაური (ინგ.)"
            name="titleEn"
            value={form.titleEn}
            onChange={handleChange}
            placeholder="Contact"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="ქვესათაური (ქართ.)"
            name="subtitleKa"
            value={form.subtitleKa}
            onChange={handleChange}
            placeholder="ჩვენ ღია ვართ თანამშრომლობისთვის."
          />
          <Input
            label="ქვესათაური (ინგ.)"
            name="subtitleEn"
            value={form.subtitleEn}
            onChange={handleChange}
            placeholder="We are open for collaboration."
          />
        </div>
      </Card>

      <Card padded>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-900">საკონტაქტო ინფორმაცია</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            ეს მონაცემები გამოჩნდება საიტის Contact გვერდზე.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="ტელეფონი"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+995 32 2 22 22 22"
          />
          <Input
            label="ელ-ფოსტა"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="info@urbanspace.ge"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="მისამართი (ქართ.)"
            name="addressKa"
            value={form.addressKa}
            onChange={handleChange}
            placeholder="თბილისი, ვაჟა-ფშაველას გამზ. 25"
          />
          <Input
            label="მისამართი (ინგ.)"
            name="addressEn"
            value={form.addressEn}
            onChange={handleChange}
            placeholder="Tbilisi, Vazha-Pshavela Ave. 25"
          />
        </div>
      </Card>

      <Card padded>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-900">სოციალური ბმულები</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Facebook URL"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
          <Input
            label="Instagram URL"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
        </div>
      </Card>

      <Card padded>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-dark-900">რუკის პინი</h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            ჩასვი Google Maps-ის URL ან &quot;lat,lng&quot; ფორმატით — Latitude/Longitude ავტომატურად შეივსება.
          </p>
        </div>

        <div className="mb-5">
          <Input
            label="Google Maps URL / კოორდინატები"
            name="mapPaste"
            value={mapPaste}
            onChange={(e) => handleMapPaste(e.target.value)}
            placeholder="https://www.google.com/maps/... ან 41.7151,44.8271"
          />
          {mapPasteError && (
            <p className="mt-1.5 text-xs text-red-600">{mapPasteError}</p>
          )}
          {!mapPasteError && mapPaste && (
            <p className="mt-1.5 text-xs text-green-600">
              ✓ კოორდინატები განახლდა
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            label="Latitude"
            name="mapLat"
            type="number"
            step="any"
            value={form.mapLat}
            onChange={handleChange}
            placeholder="41.7151"
          />
          <Input
            label="Longitude"
            name="mapLng"
            type="number"
            step="any"
            value={form.mapLng}
            onChange={handleChange}
            placeholder="44.8271"
          />
        </div>
      </Card>

      <div className="flex items-center gap-2 pt-2">
        <Button type="submit" loading={loading} leftIcon={<Save className="h-4 w-4" />}>
          შენახვა
        </Button>
      </div>
    </form>
  );
}
