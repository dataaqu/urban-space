'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { TeamMember as TeamMemberType } from '@/types';

interface TeamMemberProps {
  member: TeamMemberType;
}

export default function TeamMember({ member }: TeamMemberProps) {
  const locale = useLocale();

  const name = locale === 'ka' ? member.nameKa : member.nameEn;
  const position = locale === 'ka' ? member.positionKa : member.positionEn;

  const placeholderImage = `https://placehold.co/400x400/1e293b/64748b?text=${encodeURIComponent(name.charAt(0))}`;
  const imageUrl = member.image || placeholderImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900">{name}</h3>
      <p className="text-sm text-secondary-500 mt-1">{position}</p>
    </motion.div>
  );
}
