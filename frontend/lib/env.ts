import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_DIRECTUS_URL: z.string().url(),
  DIRECTUS_INTERNAL_URL: z.string().url().optional(),
  DIRECTUS_TOKEN: z.string().min(10),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  RESEND_API_KEY: z.string().startsWith('re_'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Geçersiz environment değişkenleri:\n', parsed.error.flatten().fieldErrors);
  throw new Error('Environment değişkenleri eksik veya yanlış. Lütfen .env.local dosyasını kontrol edin.');
}

export const env = parsed.data;
