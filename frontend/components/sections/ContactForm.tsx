'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'En az 2 karakter giriniz').max(100),
  email: z.string().email('Geçerli bir e-posta giriniz'),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, 'En az 10 karakter giriniz').max(2000),
});

type FormValues = z.infer<typeof schema>;

const contactInfo = [
  { icon: Mail, label: 'E-posta', value: 'info@ajans.com', href: 'mailto:info@ajans.com' },
  { icon: Phone, label: 'Telefon', value: '+90 212 000 00 00', href: 'tel:+902120000000' },
  { icon: MapPin, label: 'Adres', value: 'İstanbul, Türkiye', href: null },
];

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      reset();
    } else {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error ?? 'Bir hata oluştu.');
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500" strokeWidth={1.5} />
        <h3 className="text-2xl font-bold text-slate-900">Mesajınız İletildi!</h3>
        <p className="text-slate-500 max-w-sm">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* Left info panel */}
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Bize Ulaşın</h3>
          <p className="text-slate-500 leading-relaxed">
            Projeniz için ücretsiz danışmanlık alın. Size 24 saat içinde geri dönüş yapıyoruz.
          </p>
        </div>
        <div className="space-y-4">
          {contactInfo.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                {href ? (
                  <a href={href} className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-slate-700">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-3 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('name')}
              placeholder="Adınız Soyadınız"
              className={errors.name ? 'border-red-400 focus-visible:ring-red-400' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Telefon</label>
            <Input {...register('phone')} placeholder="+90 5xx xxx xx xx" type="tel" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            E-posta <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            placeholder="ornek@mail.com"
            type="email"
            className={errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Mesaj <span className="text-red-500">*</span>
          </label>
          <Textarea
            {...register('message')}
            placeholder="Projeniz hakkında kısa bir bilgi verin..."
            rows={5}
            className={`resize-none ${errors.message ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
          />
          {errors.message && (
            <p className="text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
        </button>
      </form>
    </div>
  );
}
