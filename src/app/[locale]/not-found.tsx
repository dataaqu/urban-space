import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Button from '@/components/ui/Button';

export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-secondary-200">404</h1>
        <h2 className="text-2xl font-semibold text-secondary-900 mt-4">
          {t('notFound')}
        </h2>
        <p className="text-secondary-600 mt-2 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link href="/">
          <Button>{t('back')}</Button>
        </Link>
      </div>
    </div>
  );
}
