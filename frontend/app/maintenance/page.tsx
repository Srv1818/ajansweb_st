import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bakım Çalışması',
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            fontSize: 28,
          }}
        >
          🔧
        </div>

        <h1
          style={{
            color: '#f8fafc',
            fontSize: '2rem',
            fontWeight: 700,
            margin: '0 0 1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Bakım Çalışması
        </h1>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '1rem',
            lineHeight: 1.7,
            margin: '0 0 2.5rem',
          }}
        >
          Sitenizi sizin için daha iyi hale getiriyoruz.
          <br />
          Kısa süre içinde geri döneceğiz.
        </p>

        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            margin: '0 auto',
            maxWidth: 200,
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              animation: 'progress 2s ease-in-out infinite',
            }}
          />
        </div>

        <style>{`
          @keyframes progress {
            0%   { width: 0%;   margin-left: 0; }
            50%  { width: 70%;  margin-left: 15%; }
            100% { width: 0%;   margin-left: 100%; }
          }
        `}</style>
      </div>
    </main>
  )
}
