import Image, { ImageProps } from 'next/image';
import { getAssetUrl } from '@/lib/directus';

interface DirectusImageProps extends Omit<ImageProps, 'src'> {
  fileId: string | null | undefined;
}

export default function DirectusImage({ fileId, alt, ...props }: DirectusImageProps) {
  if (!fileId) return null;
  return <Image src={getAssetUrl(fileId)} alt={alt} {...props} />;
}
