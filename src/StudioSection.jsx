import { useEffect, useRef } from 'react';

export default function StudioSection() {
  const mockupRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) rotateX(0deg)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (mockupRef.current) observer.observe(mockupRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 5vw, 6rem)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
          opacity: 0.04,
          filter: 'blur(100px)',
          zIndex: 0,
          animation: 'pulse-glow 12s ease-in-out infinite',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'center',
        }}
      >
        {/* LEFT: Animated Mini-SaaS Mockup */}
        <div
          ref={mockupRef}
          style={{
            opacity: 0,
            transform: 'translateY(40px) rotateX(8deg)',
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            perspective: '1200px',
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'var(--shadow), 0 20px 60px -20px rgba(37,99,235,0.15)',
              animation: 'float 10s ease-in-out infinite',
            }}
          >
            {/* Browser Chrome */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(255,255,255,0.4)',
              }}
            >
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#ef4444',
                }}
              />
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#eab308',
                }}
              />
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: '22px',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  marginLeft: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 10px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  vantastudio.com
                </span>
              </div>
            </div>

            {/* Mock Content */}
            <div
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                minHeight: '320px',
              }}
            >
              {/* Mock Nav */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  VANTA STUDIO
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Studio', 'Work', 'Contact'].map((item) => (
                    <div
                      key={item}
                      style={{
                        width: '40px',
                        height: '8px',
                        borderRadius: '4px',
                        background: 'var(--border)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mock Hero Card */}
              <div
                style={{
                  borderRadius: '12px',
                  padding: '20px',
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--gradient-hero)',
                    opacity: 0.15,
                    filter: 'blur(20px)',
                    animation: 'pulse-glow 4s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  Digital Experiences That Move
                </div>
                <div
                  style={{
                    width: '70%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'var(--border)',
                    marginBottom: '6px',
                  }}
                />
                <div
                  style={{
                    width: '50%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'var(--border)',
                  }}
                />
              </div>

              {/* Mock Stats Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                }}
              >
                {[
                  { num: '01', label: 'Project' },
                  { num: '100%', label: 'Obsession' },
                  { num: '∞', label: 'Ambition' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: '10px',
                      padding: '14px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      textAlign: 'center',
                      animation: `float ${6 + i * 2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        background: 'var(--gradient-hero)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        marginTop: '4px',
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mock Scrolling Cards */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  overflow: 'hidden',
                  maskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                  WebkitMaskImage:
                    'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    animation: 'marquee 12s linear infinite',
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        flexShrink: 0,
                        width: '80px',
                        height: '50px',
                        borderRadius: '8px',
                        background:
                          i % 2 === 0
                            ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(234,179,8,0.1))'
                            : 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reflection/shadow under mockup */}
          <div
            style={{
              position: 'absolute',
              bottom: '-30px',
              left: '10%',
              width: '80%',
              height: '20px',
              borderRadius: '50%',
              background: 'var(--gradient-hero)',
              opacity: 0.08,
              filter: 'blur(20px)',
            }}
          />
        </div>

        {/* RIGHT: Text Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '1.5rem',
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
              The Studio
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Motion-first digital{' '}
            <span
              style={{
                background: 'var(--gradient-hero)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              experience lab
            </span>
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem',
              maxWidth: '480px',
            }}
          >
            We don't do templates. We don't do "good enough." We build bespoke,
            award-level frontend for tech and fintech brands that want to stand
            out in a sea of sameness.
          </p>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '2.5rem',
              maxWidth: '480px',
            }}
          >
            Every project starts with a question: "What would this look like if
            it moved?" Then we obsess until the answer is unforgettable.
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
            }}
          >
            {[
              { num: '01', label: 'Project' },
              { num: '100%', label: 'Obsession' },
              { num: '∞', label: 'Ambition' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    background: 'var(--gradient-hero)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem',
                  }}
                >
                  {stat.num}
                </div>
                <div
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}