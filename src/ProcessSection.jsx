import { useEffect, useRef } from 'react';

export default function ProcessSection() {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  const steps = [
    {
      num: '01',
      title: 'Discover',
      desc: 'We immerse in your brand, your users, your competition. We find the gaps where motion can create meaning.',
    },
    {
      num: '02',
      title: 'Architect',
      desc: 'We design the experience structure — every scroll, every hover, every transition mapped to emotion.',
    },
    {
      num: '03',
      title: 'Animate',
      desc: 'We build. Canvas, WebGL, GSAP, shaders — whatever it takes to make it feel alive.',
    },
    {
      num: '04',
      title: 'Refine',
      desc: 'We polish until it hurts. 60fps or nothing. Every frame considered. Every pixel perfect.',
    },
  ];

  // Particle network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    const resize = () => {
      const parent = canvas.parentElement;
      w = canvas.width = parent.offsetWidth;
      h = canvas.height = parent.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = [];
    const nodeCount = 24;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.03;

        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.25;
            const grad = ctx.createLinearGradient(
              nodes[i].x,
              nodes[i].y,
              nodes[j].x,
              nodes[j].y
            );
            grad.addColorStop(0, `rgba(37, 99, 235, ${alpha})`);
            grad.addColorStop(1, `rgba(234, 179, 8, ${alpha})`);

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const glow = Math.sin(node.pulse) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          node.radius > 2
            ? `rgba(234, 179, 8, ${0.6 + glow * 0.4})`
            : `rgba(37, 99, 235, ${0.4 + glow * 0.4})`;
        ctx.fill();

        // Glow ring for larger nodes
        if (node.radius > 2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
          const ringGrad = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.radius * 4
          );
          ringGrad.addColorStop(
            0,
            `rgba(234, 179, 8, ${0.15 * glow})`
          );
          ringGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
          ctx.fillStyle = ringGrad;
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.process-step');
            items.forEach((item, i) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
              }, i * 200);
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
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Live particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
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
            Process
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
            marginBottom: 'clamp(4rem, 8vw, 6rem)',
          }}
        >
          How we{' '}
          <span
            style={{
              background: 'var(--gradient-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            build
          </span>
        </h2>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem, 5vw, 4rem)' }}>
          {steps.map((step, i) => (
            <div
              key={i}
              ref={(el) => (stepsRef.current[i] = el)}
              className="process-step"
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
                alignItems: 'start',
                opacity: 0,
                transform: 'translateX(-30px)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                paddingBottom: i < steps.length - 1 ? 'clamp(2rem, 4vw, 3rem)' : 0,
                borderBottom:
                  i < steps.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.04em',
                  background: 'var(--gradient-hero)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  opacity: 0.25,
                  minWidth: '80px',
                }}
              >
                {step.num}
              </div>

              {/* Content */}
              <div>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    maxWidth: '520px',
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}