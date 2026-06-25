import type { Metadata } from 'next';

/**
 * Central SEO config + helpers. Every public page builds its metadata through
 * `pageMetadata()` so canonical URLs, hreflang alternates, Open Graph and
 * Twitter cards stay consistent across the ka/en locales.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://urbanspace.ge'
).replace(/\/$/, '');

export const SITE_NAME = 'URBAN SPACE';

export const LOCALES = ['ka', 'en'] as const;
export const DEFAULT_LOCALE = 'ka';

export type Locale = (typeof LOCALES)[number];

const OG_LOCALE: Record<Locale, string> = { ka: 'ka_GE', en: 'en_US' };

/** Normalize a page path to a leading-slash form ('' stays ''). */
function normalize(path: string): string {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/** Build `canonical` + `languages` (hreflang) for a locale-prefixed path. */
export function buildAlternates(locale: Locale, path = ''): Metadata['alternates'] {
  const clean = normalize(path);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`;

  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages,
  };
}

interface PageSeo {
  locale: Locale;
  /** Path after the locale prefix, e.g. '/studio' or '/projects/qobuleti'. '' = home. */
  path?: string;
  title: string;
  description?: string;
  /** Absolute image URLs for Open Graph / Twitter (e.g. a project's featuredImage). */
  images?: string[];
  /** When true the title is used verbatim (no "— URBAN SPACE" template suffix). */
  absoluteTitle?: boolean;
}

/** Build a full, locale-aware Metadata object for a public page. */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  images,
  absoluteTitle,
}: PageSeo): Metadata {
  const url = `${SITE_URL}/${locale}${normalize(path)}`;
  const ogImages = images?.filter(Boolean) ?? [];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      url,
      title,
      description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card: ogImages.length ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(ogImages.length ? { images: ogImages } : {}),
    },
  };
}
