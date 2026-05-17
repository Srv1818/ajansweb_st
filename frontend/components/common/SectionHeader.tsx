import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  center = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 md:mb-16', center && 'text-center')}>
      <h2
        className={cn(
          'text-4xl md:text-5xl font-black tracking-tight leading-tight',
          light ? 'text-white' : 'text-slate-900'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-4 text-lg max-w-2xl leading-relaxed',
            center && 'mx-auto',
            light ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
