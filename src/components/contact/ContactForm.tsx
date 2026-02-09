'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm text-[#333333]">
          {t('name')}
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="w-full h-12 px-4 bg-white border border-[#DDDDDD] rounded focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm text-[#333333]">
          {t('email')}
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="w-full h-12 px-4 bg-white border border-[#DDDDDD] rounded focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm text-[#333333]">
          {t('message')}
        </label>
        <textarea
          name="message"
          id="message"
          required
          className="w-full h-[160px] p-4 bg-white border border-[#DDDDDD] rounded resize-none focus:outline-none focus:border-black transition-colors"
        />
      </div>

      {submitStatus === 'success' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-green-600 text-sm"
        >
          {t('success')}
        </motion.p>
      )}

      {submitStatus === 'error' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 text-sm"
        >
          {t('error')}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-[180px] h-12 bg-black text-white text-base font-medium rounded hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '...' : t('submit')}
      </button>
    </motion.form>
  );
}
