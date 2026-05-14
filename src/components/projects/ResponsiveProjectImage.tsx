'use client';

import Image, { type ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src'> & {
  src: string;
  mobileSrc?: string | null;
};

export default function ResponsiveProjectImage({
  src,
  mobileSrc,
  className,
  alt,
  ...rest
}: Props) {
  if (!mobileSrc) {
    return <Image src={src} alt={alt} className={className} {...rest} />;
  }

  const cn = (extra: string) =>
    [extra, className].filter(Boolean).join(' ');

  return (
    <>
      <Image src={mobileSrc} alt={alt} className={cn('md:hidden')} {...rest} />
      <Image src={src} alt={alt} className={cn('hidden md:block')} {...rest} />
    </>
  );
}
