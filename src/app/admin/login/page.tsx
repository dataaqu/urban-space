'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('არასწორი ელ-ფოსტა ან პაროლი');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('შეცდომა მოხდა. სცადეთ თავიდან.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-dark-900">
      {/* Background accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(212, 160, 39, 0.18) 0%, rgba(212, 160, 39, 0) 60%), radial-gradient(50% 40% at 20% 100%, rgba(212, 160, 39, 0.08) 0%, rgba(212, 160, 39, 0) 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,160,39,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,39,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(circle at center, black 0%, transparent 70%)',
        }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand mark */}
          <div className="mb-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600/15 ring-1 ring-primary-500/30 text-primary-400 mb-4">
              <span className="text-lg font-bold">U</span>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Urban Space
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              შედით ადმინ პანელში
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-300 mb-1.5"
                >
                  ელ-ფოსტა
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="admin@urbanspace.ge"
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-primary-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-300 mb-1.5"
                >
                  პაროლი
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-11 rounded-lg border border-white/10 bg-white/[0.04] pl-10 pr-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-primary-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                size="lg"
                className="w-full"
              >
                {loading ? 'შესვლა...' : 'შესვლა'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} Urban Space
          </p>
        </div>
      </div>
    </div>
  );
}
