import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Custom gift hampers & chocolate bouquets by Hamper Queen';

export default function OpengraphImage() {
  const gold = '#D4AF37';
  const cream = '#F3E5AB';
  const dark = '#141210';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(160deg, ${dark} 0%, #2A2318 55%, #141210 100%)`,
          color: cream,
          fontFamily: 'Georgia, "Times New Roman", serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          HAMPER{' '}
          <span style={{ color: gold, marginLeft: '0.35em' }}>QUEEN</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '28px',
            width: '720px',
          }}
        >
          <div style={{ flex: 1, height: 2, background: gold, opacity: 0.9 }} />
          <div
            style={{
              fontSize: 34,
              letterSpacing: '0.08em',
              width: '560px',
              textAlign: 'center',
              textTransform: 'uppercase',
              color: cream,
            }}
          >
            Custom Gift Hampers &amp; Chocolate Bouquets
          </div>
          <div style={{ flex: 1, height: 2, background: gold, opacity: 0.9 }} />
        </div>
        <div
          style={{
            marginTop: '26px',
            fontSize: 24,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: gold,
          }}
        >
          Luxury Gifting Atelier · Mumbai
        </div>
      </div>
    ),
    { ...size }
  );
}