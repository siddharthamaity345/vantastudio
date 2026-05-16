import { useEffect, useRef } from 'react';

export default function ManifestoSection() {
  const sectionRef = useRef(null);

  const lines = [
    'In a world of static websites',
    'and forgotten brands,',
    'we choose motion.',
    '',
    'We choose obsession.',
    'We choose to build experiences',
    'that stop people mid-scroll',
    'and make them feel something.',
    '',
    'This is not design as decoration.',
    'This is design as weapon.',
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.manifesto-line');
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(2rem, 5vw, 6rem)',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vw',
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
          opacity: 0.03,
          filter: 'blur(120px)',
          zIndex: 0,
          animation: 'pulse-glow 10s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '1px',
              background: 'var(--gradient-hero)',
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            Manifesto
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          {lines.map((line, i) =>
            line === '' ? (
              <div key={i} style={{ height: '1.5rem' }} />
            ) : (
              <div
                key={i}
                className="manifesto-line"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: i === 2 || i === 4 ? 700 : 400,
                  fontSize:
                    i === 2 || i === 4
                      ? 'clamp(1.8rem, 4vw, 3rem)'
                      : 'clamp(1.3rem, 3vw, 2.2rem)',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  color:
                    i === 2 || i === 4
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                {i === 10 ? (
                  <>
                    This is not design as decoration.{' '}
                    <span
                      style={{
                        background: 'var(--gradient-hero)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: 700,
                      }}
                    >
                      This is design as weapon.
                    </span>
                  </>
                ) : (
                  line
                )}
              </div>
            )
          )}
        </div>

        <div
          style={{
            marginTop: '4rem',
            width: '60px',
            height: '3px',
            borderRadius: '2px',
            background: 'var(--gradient-hero)',
            opacity: 0.6,
          }}
        />
      </div>
    </section>
  );
}