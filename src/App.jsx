import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const pointsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w, h;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize trail points
    const maxPoints = 40;
    for (let i = 0; i < maxPoints; i++) {
      pointsRef.current.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: 0,
        vy: 0,
        life: 1 - i / maxPoints,
      });
    }

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      
      const points = pointsRef.current;
      const mouse = mouseRef.current;

      // Lead point follows mouse with lag
      points[0].x += (mouse.x - points[0].x) * 0.25;
      points[0].y += (mouse.y - points[0].y) * 0.25;

      // Rest follow previous point
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        curr.x += (prev.x - curr.x) * 0.3;
        curr.y += (prev.y - curr.y) * 0.3;
      }

      // Draw trail
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const alpha = 1 - i / points.length;
        const width = (1 - i / points.length) * 6;

        // Blue to yellow gradient along trail
        const gradient = ctx.createLinearGradient(curr.x, curr.y, next.x, next.y);
        gradient.addColorStop(0, `rgba(37, 99, 235, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(234, 179, 8, ${alpha * 0.4})`);

        ctx.beginPath();
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Glow dots at each point
        ctx.beginPath();
        ctx.arc(curr.x, curr.y, width * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${alpha * 0.3})`;
        ctx.fill();
      }

      // Head glow
      const head = points[0];
      const headGrad = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 30);
      headGrad.addColorStop(0, 'rgba(37, 99, 235, 0.4)');
      headGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
      ctx.beginPath();
      ctx.arc(head.x, head.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = headGrad;
      ctx.fill();

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 'clamp(2rem, 5vw, 6rem)',
        overflow: 'hidden',
        background: 'var(--bg-primary)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Cursor Trail Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Subtle background gradient orb */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'var(--gradient-hero)',
          opacity: 0.06,
          filter: 'blur(80px)',
          zIndex: 0,
          animation: 'pulse-glow 8s ease-in-out infinite',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: '900px' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '2px',
              background: 'var(--gradient-hero)',
              borderRadius: '2px',
            }}
          />
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            The Obsessive Motion Lab
          </span>
        </div>

        {/* Main Headline — Inter, sized properly, NOT oversized */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}
        >
          We build{' '}
          <span
            style={{
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            digital experiences
          </span>{' '}
          that move.
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            marginBottom: '2.5rem',
          }}
        >
          Award-winning frontend for tech startups and fintech. Every pixel
          animated. Every interaction considered. Nothing boring.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href="#contact"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              padding: '1rem 2rem',
              borderRadius: '999px',
              background: 'var(--gradient-hero)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: 'var(--glow-blue)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = 'var(--glow-yellow)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'var(--glow-blue)';
            }}
          >
            Start a Project
            <span style={{ fontSize: '1.1em' }}>→</span>
          </a>

          <a
            href="#work"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.02em',
              padding: '1rem 2rem',
              borderRadius: '999px',
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-strong)',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--accent-blue)';
              e.target.style.color = 'var(--accent-blue)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border-strong)';
              e.target.style.color = 'var(--text-secondary)';
            }}
          >
            View Work
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 3,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'var(--gradient-hero)',
            opacity: 0.5,
            animation: 'float 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}