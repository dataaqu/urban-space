// Render at request time so live DB content shows on first load (Railway
// can't reach the internal DB at build time, baking an empty snapshot).
export const dynamic = 'force-dynamic';

import { getLocale, getTranslations } from 'next-intl/server';
import { getContentMap } from '@/lib/content';
import { pageMetadata, type Locale } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const [nav, studio] = await Promise.all([
    getTranslations({ locale, namespace: 'navigation' }),
    getTranslations({ locale, namespace: 'studio' }),
  ]);
  return pageMetadata({
    locale: locale as Locale,
    path: '/studio',
    title: nav('studio'),
    description: studio('description'),
  });
}

export default async function StudioPage() {
  const locale = await getLocale();
  const content = await getContentMap('studio');

  // Empty content is intentional (admin left it blank) — render nothing, never
  // a hardcoded fallback. Each element/column/section below is gated on having
  // real content so blanks collapse instead of showing stale defaults.
  const text = (key: string) => content[key]?.[locale as 'ka' | 'en']?.trim() || '';

  // Split a multi-paragraph field into paragraphs on blank lines.
  const paragraphs = (key: string) => {
    const val = text(key);
    return val
      ? val.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
      : [];
  };

  const aboutTitle = text('about.title');
  const aboutParas = paragraphs('about.description');
  const hasAbout = Boolean(aboutTitle) || aboutParas.length > 0;

  // Each of the three columns is now a single free-form text block. Blank lines
  // split it into paragraphs; single line breaks inside a paragraph are kept
  // (whitespace-pre-line) so pasted lists render line-by-line.
  const columns = [
    { title: text('expertise.title'), paras: paragraphs('expertise.body') },
    { title: text('principles.title'), paras: paragraphs('principles.body') },
    { title: text('team.title'), paras: paragraphs('team.body') },
  ].filter((c) => c.title || c.paras.length > 0);

  const hasSecondSection = columns.length > 0;

  return (
    <div className="bg-white">
      {/* About Section */}
      {hasAbout && (
        <section className="px-8 md:px-[80px] xl:px-[100px] 2xl:px-[140px] pt-12 xl:pt-16 2xl:pt-20 pb-16 xl:pb-20 2xl:pb-24">
          <div className="mx-auto max-w-[1500px] grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-16 2xl:gap-20 items-start">
            <div>
              {aboutTitle && (
                <h2 className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl font-medium text-[#0A0A0A] mb-8 xl:mb-10 2xl:mb-12">
                  {aboutTitle}
                </h2>
              )}
              {aboutParas.length > 0 && (
                <div className="space-y-5 xl:space-y-6 2xl:space-y-7 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] leading-relaxed">
                  {aboutParas.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Reserved space for the About photo (to be added later). */}
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-neutral-100" />
          </div>
        </section>
      )}

      {/* Three free-form columns (heading + one big text each) */}
      {hasSecondSection && (
        <section className="px-8 md:px-[80px] xl:px-[100px] 2xl:px-[140px] pt-6 xl:pt-8 2xl:pt-10 pb-16 xl:pb-20 2xl:pb-24">
          <div className="mx-auto max-w-[1500px] grid grid-cols-1 md:grid-cols-3 gap-12 xl:gap-16 2xl:gap-20">
            {columns.map((col, ci) => (
              <div key={ci}>
                {col.title && (
                  <h3 className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-medium text-[#0A0A0A] mb-6 xl:mb-8 2xl:mb-10">
                    {col.title}
                  </h3>
                )}
                {col.paras.length > 0 && (
                  <div className="space-y-5 xl:space-y-6 text-[15px] xl:text-[17px] 2xl:text-[19px] text-[#333] leading-relaxed">
                    {col.paras.map((para, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
