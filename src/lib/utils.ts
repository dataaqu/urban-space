import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const localizedField = `${field}${locale.charAt(0).toUpperCase()}${locale.slice(1)}`;
  return (item[localizedField] as string) || (item[`${field}En`] as string) || '';
}

export function formatArea(area: number | null | undefined): string {
  if (!area) return '';
  return area.toLocaleString();
}
