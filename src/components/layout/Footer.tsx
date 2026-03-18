'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import Button from '@/components/ui/Button';

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('navigation');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<{
    email?: string | null;
    phone?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    linkedinUrl?: string | null;
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      href: settings?.facebookUrl || '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: settings?.instagramUrl || '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: settings?.linkedinUrl || '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-luxury text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 marble-effect-dark" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full filter blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-400/5 rounded-full filter blur-[120px]" />

      {/* CTA Section - Luxury */}
      <div className="relative border-b border-primary-500/10">
        <div className="container-premium section-padding-sm">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center justify-between gap-10"
          >
            <motion.div variants={staggerItem} className="text-center lg:text-left">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-shadow">
                {t('ctaTitle') || 'Ready to Start Your Project?'}
              </h2>
              <p className="text-secondary-300/80 max-w-xl text-lg">
                {t('ctaDescription') || 'Let\'s create something extraordinary together. Contact us to discuss your architectural vision.'}
              </p>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="gold"
                  className="shadow-luxury-gold hover:shadow-gold-glow-intense transition-shadow duration-500 px-8"
                  rightIcon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  }
                >
                  {navT('contact')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-premium py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {/* Logo and Description */}
          <motion.div variants={staggerItem} className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span className="text-2xl font-bold tracking-tight">
                URBAN<span className="text-primary-400">SPACE</span>
              </span>
            </Link>
            <p className="text-secondary-400 text-sm leading-relaxed mb-6">
              {t('description') || 'Architectural studio specializing in modern architectural and urban solutions.'}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-secondary-400 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 hover:shadow-gold-glow transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
              {navT('projects')}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/projects', label: t('allProjects') || 'All Projects' },
                { href: '/projects/architecture', label: navT('architecture') },
                { href: '/projects/urban', label: navT('urban') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Studio Links */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
              {navT('studio')}
            </h3>
            <ul className="space-y-3">
              {[
                { href: '/studio', label: navT('about') },
                { href: '/studio/team', label: navT('team') },
                { href: '/studio/partners', label: navT('partners') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-primary-400 text-sm transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-primary-500 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={staggerItem}>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-400 mb-5 flex items-center gap-2">
              <span className="w-6 h-px bg-gradient-to-r from-primary-500/50 to-transparent" />
              {t('newsletter.title') || 'Newsletter'}
            </h3>
            <p className="text-secondary-400 text-sm mb-4 leading-relaxed">
              {t('newsletter.description') || 'Subscribe to receive updates on new projects and news.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-primary-400/20 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder') || 'Enter your email'}
                  className="relative w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.07] transition-all duration-300"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="gold"
                className="w-full shadow-gold-glow hover:shadow-gold-glow-intense transition-shadow duration-300"
                disabled={isSubscribed}
              >
                {isSubscribed ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('subscribed') || 'Subscribed!'}
                  </span>
                ) : (
                  t('newsletter.button') || 'Subscribe'
                )}
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3 text-secondary-400 text-sm">
              <a href={`mailto:${settings?.email || 'info@urbanspace.ge'}`} className="flex items-center gap-3 group hover:text-primary-400 transition-colors duration-300">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors duration-300">
                  <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                {settings?.email || 'info@urbanspace.ge'}
              </a>
              <a href={`tel:${(settings?.phone || '+995XXXXXXXXX').replace(/\s/g, '')}`} className="flex items-center gap-3 group hover:text-primary-400 transition-colors duration-300">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-primary-500/20 transition-colors duration-300">
                  <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                {settings?.phone || '+995 XXX XXX XXX'}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-500/10 relative">
        {/* Gradient line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-400">
            <p className="flex items-center gap-2">
              <span className="text-primary-500/60">&copy;</span> {currentYear} <span className="text-white font-medium">URBAN</span><span className="text-primary-400 font-medium">SPACE</span>. {t('rights')}.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-primary-400 transition-colors duration-300">
                {t('privacy') || 'Privacy Policy'}
              </Link>
              <span className="w-1 h-1 rounded-full bg-primary-500/30" />
              <Link href="#" className="hover:text-primary-400 transition-colors duration-300">
                {t('terms') || 'Terms of Service'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
