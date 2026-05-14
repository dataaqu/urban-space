'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Phone, Mail } from 'lucide-react';

const MinimalMap = dynamic(() => import('./MinimalMap'), { ssr: false });

interface ContactInfo {
  title: string;
  intro: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  mapLat: number | null;
  mapLng: number | null;
  formCta: string;
  formPlaceholder: string;
  formSubmit: string;
  formSending: string;
  formSuccess: string;
  formError: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  tagline: string;
}

export default function ContactPageClient({
  locale: _locale,
  info,
}: {
  locale: string;
  info: ContactInfo;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-background text-foreground">
      <main className="px-8 pt-12 pb-20 mx-auto max-w-[820px] md:px-10 md:pt-16 lg:max-w-[1400px]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-32 xl:gap-40 lg:items-start">
          {/* LEFT COLUMN */}
          <div>
            {/* INTRO */}
            <section className="mb-12 md:mb-16">
              <h1
                className="text-[29px] md:text-[45px] font-light tracking-[0.04em] leading-none"
                style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
              >
                {info.title}
              </h1>
              <p className="mt-5 md:mt-6 text-[15px] md:text-[17px] font-light text-foreground/70 max-w-[520px]">
                {info.intro}
              </p>
            </section>

            {/* MAP — mobile/tablet only (desktop renders it on the right) */}
            <section className="mb-8 lg:hidden h-[300px]">
              <MinimalMap lat={info.mapLat ?? undefined} lng={info.mapLng ?? undefined} />
            </section>

            {/* CONTACT INFO */}
            <section className="mb-12 mt-10 flex flex-col items-center gap-8 lg:items-start">
              <div className="flex flex-col items-center gap-6 lg:items-start">
                <div className="flex items-center gap-3 text-sm md:text-base font-light opacity-90">
                  <MapPin size={16} strokeWidth={1.25} className="shrink-0" />
                  <span>{info.address}</span>
                </div>
                <a
                  href={`tel:${info.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm md:text-base font-light hover:opacity-70 transition-opacity"
                >
                  <Phone size={16} strokeWidth={1.25} />
                  {info.phone}
                </a>
                <a
                  href={`mailto:${info.email}`}
                  className="flex items-center gap-3 text-sm md:text-base font-light hover:opacity-70 transition-opacity"
                >
                  <Mail size={16} strokeWidth={1.25} />
                  {info.email}
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                {info.facebook && (
                  <a
                    href={info.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex items-center gap-2 text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-foreground/30 pb-1"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    Facebook
                  </a>
                )}
                {info.instagram && (
                  <a
                    href={info.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex items-center gap-2 text-sm font-light tracking-[0.2em] uppercase hover:opacity-70 transition-opacity border-b border-foreground/30 pb-1"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                    Instagram
                  </a>
                )}
              </div>
            </section>

            {/* START A PROJECT FORM */}
            <section className="pt-8 border-t border-foreground/15">
              <h2
                className="mb-5 text-[18px] md:text-[22px] font-light tracking-[0.04em]"
                style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
              >
                {info.formCta}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={info.namePlaceholder}
                    className="w-full border border-black/10 bg-white/60 px-4 py-3 text-[14px] outline-none placeholder:text-[#8A8A8A] focus:border-black/30"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={info.emailPlaceholder}
                    className="w-full border border-black/10 bg-white/60 px-4 py-3 text-[14px] outline-none placeholder:text-[#8A8A8A] focus:border-black/30"
                  />
                </div>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={info.formPlaceholder}
                  className="w-full resize-none border border-black/10 bg-white/60 px-4 py-3 text-[14px] outline-none placeholder:text-[#8A8A8A] focus:border-black/30"
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full border border-black/20 px-5 py-3 text-[12px] uppercase tracking-[0.22em] transition hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? info.formSending : info.formSubmit}
                </button>
                {status === 'sent' && (
                  <p className="text-[13px] text-green-700">{info.formSuccess}</p>
                )}
                {status === 'error' && (
                  <p className="text-[13px] text-red-700">{info.formError}</p>
                )}
              </form>
            </section>
          </div>

          {/* RIGHT COLUMN — enlarged map, desktop only */}
          <aside className="hidden lg:block lg:h-full lg:self-stretch lg:min-h-[520px]">
            <div className="h-full w-full overflow-hidden">
              <MinimalMap lat={info.mapLat ?? undefined} lng={info.mapLng ?? undefined} />
            </div>
          </aside>
        </div>

        {/* IN-PAGE FOOTER */}
        <footer className="mt-20 pt-10 border-t border-foreground/15 text-center space-y-2">
          <p
            className="text-[20px] md:text-[24px] font-light tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif' }}
          >
            Urban Space
          </p>
          <p className="text-[12px] md:text-[13px] font-light tracking-[0.18em] uppercase text-foreground/60">
            {info.tagline}
          </p>
          <p className="text-[11px] md:text-[12px] font-light tracking-[0.14em] uppercase text-foreground/40">
            © 2026 Urban Space
          </p>
        </footer>
      </main>
    </div>
  );
}
