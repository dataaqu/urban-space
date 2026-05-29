'use client';

import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  mobileSrc?: string | null;
  /** Breakpoint at which the desktop `src` replaces `mobileSrc`. Default 'md'. */
  switchAt?: 'md' | 'lg';
};

export default function ResponsiveProjectImage({
  src,
  mobileSrc,
  className,
  alt,
  switchAt = 'md',
  ...rest
}: Props) {
  if (!mobileSrc) {
    return <Image src={src} alt={alt} className={className} {...rest} />;
  }

  const cn = (extra: string) =>
    [extra, className].filter(Boolean).join(' ');

  const hideMobile = switchAt === 'lg' ? 'lg:hidden' : 'md:hidden';
  const showDesktop = switchAt === 'lg' ? 'hidden lg:block' : 'hidden md:block';

  return (
    <>
      <Image src={mobileSrc} alt={alt} className={cn(hideMobile)} {...rest} />
      <Image src={src} alt={alt} className={cn(showDesktop)} {...rest} />
    </>
  );
}
