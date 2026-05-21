import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().min(10).max(2000),
  website: z.string().optional(), // honeypot
});

const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const ip = 
  req.headers.get('cf-connecting-ip') ?? 
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 
  'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Çok fazla istek gönderildi. 1 saat sonra tekrar deneyin.' },
      { status: 429 }
    );
  }

  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Geçersiz form verisi.', details: result.error.flatten() },
      { status: 400 }
    );
  }

  // Honeypot: bot doldurduysa sessizce 200 dön
  if (result.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, message } = result.data;
  const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim();

  const contactEmail = process.env.CONTACT_EMAIL;
if (!contactEmail) {
  return NextResponse.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 });
}

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: contactEmail,
      subject: `Yeni İletişim Formu — ${name}`,
      html: `
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
        <p><strong>Mesaj:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
    });
  } catch {
    return NextResponse.json({ error: 'E-posta gönderilemedi.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
