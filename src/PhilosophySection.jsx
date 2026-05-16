import { useEffect, useRef, useState } from 'react';

export default function PhilosophySection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef(null);

  const cards = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      title: 'Motion First',
      desc: "We don't add animation as an afterthought. Motion is the foundation of every decision we make.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Strategy Driven',
      desc: 'Every animation serves a purpose. We move pixels with intent, not just for show.',
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      title: 'Obsessive Craft',
      desc: 'We ship when it\'s perfect, not when it\'s done. 60fps. Zero jank. Pixel-perfect.',
    },
  ];

  // Play subtle hover sound
  const playHoverSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio not supported, silently fail
    }
  };

  // 3D tilt on hover
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03) translateZ(20px)`;
  };

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)';
  };

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.philosophy-card');
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              }, i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
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
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 5vw, 6rem)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Ambient floating orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
          opacity: 0.04,
          filter: 'blur(80px)',
          animation: 'float 15s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
          opacity: 0.03,
          filter: 'blur(60px)',
          animation: 'float-delayed 18s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
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
            Philosophy
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
            marginBottom: '0.75rem',
          }}
        >
          Three beliefs that guide{' '}
          <span
            style={{
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            every project
          </span>
        </h2>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            marginBottom: 'clamp(3rem, 5vw, 4rem)',
            maxWidth: '500px',
          }}
        >
          Principles we refuse to compromise on. This is what separates craft from slop.
        </p>

        {/* Sound enable hint */}
        <button
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (!soundEnabled && !audioCtxRef.current) {
              audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
          }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: soundEnabled ? 'var(--accent-yellow)' : 'var(--text-muted)',
            background: 'transparent',
            border: `1px solid ${soundEnabled ? 'var(--accent-yellow)' : 'var(--border)'}`,
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            transition: 'all 0.3s ease',
          }}
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Enable Sound'}
        </button>

        {/* Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2rem)',
          }}
        >
          {cards.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="philosophy-card"
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              onMouseEnter={playHoverSound}
              style={{
                opacity: 0,
                transform: 'translateY(40px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                padding: 'clamp(2rem, 3vw, 2.5rem)',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                background: 'var(--gradient-card)',
                backdropFilter: 'blur(20px)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {/* Hover glow overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '24px',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }}
                className="card-glow"
                onMouseEnter={(e) => {
                  e.target.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0';
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--gradient-hero)',
                  color: '#ffffff',
                  marginBottom: '1.5rem',
                  boxShadow: 'var(--glow-blue)',
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)',
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                }}
              >
                {card.desc}
              </p>

              {/* Bottom accent */}
              <div
                style={{
                  marginTop: '1.5rem',
                  width: '32px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'var(--gradient-hero)',
                  opacity: 0.5,
                  transition: 'width 0.4s ease, opacity 0.4s ease',
                }}
                className="card-accent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Inject hover styles for accent expansion */}
      <style>{`
        .philosophy-card:hover .card-accent {
          width: 60px !important;
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
}