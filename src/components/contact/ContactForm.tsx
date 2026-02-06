'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';

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
      phone: formData.get('phone'),
      message: formData.get('message'),
      cadastralCode: formData.get('cadastralCode'),
      buildingFunction: formData.get('buildingFunction'),
      area: formData.get('area'),
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label={t('name')}
          name="name"
          id="name"
          required
          placeholder={t('name')}
        />
        <Input
          label={t('email')}
          name="email"
          id="email"
          type="email"
          required
          placeholder={t('email')}
        />
      </div>

      <Input
        label={t('phone')}
        name="phone"
        id="phone"
        type="tel"
        placeholder={t('phone')}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label={t('cadastralCode')}
          name="cadastralCode"
          id="cadastralCode"
          placeholder={t('cadastralCode')}
        />
        <Input
          label={t('buildingFunction')}
          name="buildingFunction"
          id="buildingFunction"
          placeholder={t('buildingFunction')}
        />
        <Input
          label={t('area')}
          name="area"
          id="area"
          type="number"
          placeholder={t('area')}
        />
      </div>

      <Textarea
        label={t('message')}
        name="message"
        id="message"
        required
        rows={5}
        placeholder={t('message')}
      />

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

      <Button type="submit" isLoading={isSubmitting} size="lg">
        {t('submit')}
      </Button>
    </motion.form>
  );
}
