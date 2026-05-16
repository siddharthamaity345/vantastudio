import { useEffect, useRef } from 'react';

export default function MarqueeSection() {
  const sectionRef = useRef(null);

  const words = [
    'OBSESSIVE',
    'CRAFT',
    'MOTION',
    'STRATEGY',
    'FEARLESS',
    'BOLD',
    'DESIGN',
    'WEAPON',
    'PIXEL',
    'PERFECT',
  ];

  // Duplicate words for seamless loop
  const trackContent = [...words, ...words, ...words].join(' · ');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('marquee-active');
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
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Background gradient wash */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '60%',
          background: 'var(--gradient-hero)',
          opacity: 0.03,
          filter: 'blur(100px)',
          zIndex: 0,
        }}
      />

      {/* 3D Perspective Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* ROW 1: Large Gradient Text — Slow Left */}
        <div
          className="marquee-row marquee-active"
          style={{
            transform: 'rotateX(8deg) translateZ(40px)',
            marginBottom: '1.5rem',
            opacity: 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          <div
            className="marquee-track marquee-left-slow"
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                paddingRight: '2rem',
                background: 'var(--gradient-hero)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient-shift 6s ease infinite',
              }}
            >
              {trackContent + ' · ' + trackContent}
            </span>
          </div>
        </div>

        {/* ROW 2: Outlined Stroke Text — Fast Right */}
        <div
          className="marquee-row marquee-active"
          style={{
            transform: 'rotateX(4deg) translateZ(20px)',
            marginBottom: '1.5rem',
            opacity: 0,
            transition: 'opacity 1.2s ease 0.2s',
          }}
        >
          <div
            className="marquee-track marquee-right-fast"
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                paddingRight: '2rem',
                WebkitTextStroke: '1.5px var(--accent-blue)',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                opacity: 0.6,
              }}
            >
              {trackContent + ' · ' + trackContent}
            </span>
          </div>
        </div>

        {/* ROW 3: Solid Ghost Text — Medium Left */}
        <div
          className="marquee-row marquee-active"
          style={{
            transform: 'rotateX(0deg) translateZ(0px)',
            opacity: 0,
            transition: 'opacity 1.2s ease 0.4s',
          }}
        >
          <div
            className="marquee-track marquee-left-medium"
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                paddingRight: '2rem',
                color: 'var(--text-muted)',
                opacity: 0.15,
              }}
            >
              {trackContent + ' · ' + trackContent}
            </span>
          </div>
        </div>
      </div>

      {/* Inline keyframes for marquee speeds */}
      <style>{`
        .marquee-active {
          opacity: 1 !important;
        }
        
        .marquee-left-slow {
          animation: marquee-left 40s linear infinite !important;
        }
        
        .marquee-right-fast {
          animation: marquee-right 18s linear infinite !important;
        }
        
        .marquee-left-medium {
          animation: marquee-left 28s linear infinite !important;
        }

        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}