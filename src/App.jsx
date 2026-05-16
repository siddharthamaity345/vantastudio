import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ===== SVG ICONS ===== */
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MotionIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#94FFE5" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="12" stroke="#94FFE5" strokeWidth="1.5" strokeDasharray="4 4"/>
    <circle cx="24" cy="24" r="4" fill="#94FFE5"/>
  </svg>
);

const StrategyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 40L24 8L40 40H8Z" stroke="#FF6B35" strokeWidth="1.5"/>
    <circle cx="24" cy="28" r="4" fill="#FF6B35"/>
  </svg>
);

const CraftIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="8" width="32" height="32" rx="4" stroke="#7B4FD4" strokeWidth="1.5"/>
    <line x1="8" y1="24" x2="40" y2="24" stroke="#7B4FD4" strokeWidth="1.5"/>
    <line x1="24" y1="8" x2="24" y2="40" stroke="#7B4FD4" strokeWidth="1.5"/>
  </svg>
);

/* ===== LENIS ===== */
const useLenis = () => {
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => lenis.destroy();
  }, []);
  return lenisRef;
};

/* ===== AUDIO ===== */
const useAudio = () => {
  const [muted, setMuted] = useState(() => localStorage.getItem('vanta-muted') === 'true');
  const audioCtxRef = useRef(null);
  const droneRef = useRef(null);
  const startedRef = useRef(false);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playTone = useCallback((freq, type = 'sine', duration = 0.15, volume = 0.08) => {
    if (muted) return;
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [muted]);

  const playHover = useCallback((index) => {
    const freqs = [330, 440, 550, 660];
    playTone(freqs[index % freqs.length], 'sine', 0.1, 0.05);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(880, 'sine', 0.12, 0.1);
    setTimeout(() => playTone(1100, 'sine', 0.08, 0.06), 50);
  }, [playTone]);

  const playTrailSound = useCallback(() => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [muted]);

  const startDrone = useCallback(() => {
    if (muted || droneRef.current || startedRef.current) return;
    try {
      const ctx = initAudio();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(82.5, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 3);
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      droneRef.current = { osc1, osc2, gain };
      startedRef.current = true;
    } catch (e) {}
  }, [muted]);

  const stopDrone = useCallback(() => {
    if (droneRef.current) {
      try {
        const { osc1, osc2, gain } = droneRef.current;
        const ctx = audioCtxRef.current;
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
        osc1.stop(ctx.currentTime + 1);
        osc2.stop(ctx.currentTime + 1);
      } catch (e) {}
      droneRef.current = null;
      startedRef.current = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('vanta-muted', next);
    if (next) stopDrone();
    else startDrone();
  }, [muted, startDrone, stopDrone]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!muted && !startedRef.current) startDrone();
    };
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('scroll', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [muted, startDrone]);

  return { muted, toggleMute, playHover, playClick, playTrailSound };
};

/* ===== TEXT SCRAMBLE ===== */
const useTextScramble = () => {
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const scramble = useCallback((element, finalText) => {
    let frame = 0;
    const length = finalText.length;
    const update = () => {
      let output = '';
      for (let i = 0; i < length; i++) {
        if (i < frame / 3) output += finalText[i];
        else output += chars[Math.floor(Math.random() * chars.length)];
      }
      element.textContent = output;
      frame++;
      if (frame / 3 < length) requestAnimationFrame(update);
      else element.textContent = finalText;
    };
    update();
  }, []);
  return scramble;
};

/* ===== CUSTOM CURSOR ===== */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onOver = (e) => {
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn, .philosophy-card, .capability-card, .testimonial-card, .impact-number')) {
        cursorRef.current?.classList.add('hovering');
      }
      if (e.target.closest('p, h1, h2, h3, h4, span, .manifesto-word')) {
        cursorRef.current?.classList.add('text-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn, .philosophy-card, .capability-card, .testimonial-card, .impact-number')) {
        cursorRef.current?.classList.remove('hovering');
      }
      if (e.target.closest('p, h1, h2, h3, h4, span, .manifesto-word')) {
        cursorRef.current?.classList.remove('text-hover');
      }
    };
    
    const onDown = () => cursorRef.current?.classList.add('clicking');
    const onUp = () => cursorRef.current?.classList.remove('clicking');

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

/* ===== MAGNETIC BUTTON ===== */
const MagneticButton = ({ children, className, onClick, style, href }) => {
  const btnRef = useRef(null);
  const bounds = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current || !bounds.current) return;
    const { left, top, width, height } = bounds.current;
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    btnRef.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)';
  };

  const handleMouseEnter = () => {
    bounds.current = btnRef.current?.getBoundingClientRect();
  };
  
  const handleClick = (e) => {
    const button = btnRef.current;
    if (button) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    onClick?.(e);
  };

  const Tag = href ? 'a' : 'button';
  
  return (
    <Tag
      ref={btnRef}
      className={`magnetic-btn ${className || ''}`}
      onClick={handleClick}
      style={{ ...style, transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      href={href}
    >
      <span>{children}</span>
    </Tag>
  );
};

/* ===== CURSOR TRAIL ===== */
const CursorTrail = ({ active, audio }) => {
  const [items, setItems] = useState([]);
  const idCounter = useRef(0);
  const lastAdd = useRef(0);
  const lastSound = useRef(0);

  const colors = useMemo(() => [
    '#94FFE5', '#FF6B35', '#7B4FD4', '#94FFE5', '#FF6B35', '#7B4FD4', '#FFFFFF', '#94FFE5'
  ], []);

  useEffect(() => {
    const onMove = (e) => {
      if (!active) return;
      const now = performance.now();
      if (now - lastAdd.current < 50) return;
      lastAdd.current = now;

      const id = idCounter.current++;
      const color = colors[id % colors.length];
      const size = 4 + Math.random() * 8;

      setItems(prev => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY, color, size }];
        return next.length > 15 ? next.slice(-15) : next;
      });

      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, 600);

      if (now - lastSound.current > 150) {
        lastSound.current = now;
        audio?.playTrailSound();
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [active, colors, audio]);

  return (
    <div className="cursor-trail">
      {items.map(item => (
        <div
          key={item.id}
          className="trail-particle"
          style={{
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            background: item.color,
            animation: 'trailPulse 0.6s ease-out forwards',
          }}
        />
      ))}
    </div>
  );
};

/* ===== TEXT REVEAL ===== */
const TextReveal = ({ children, as: Component = 'div', className, delay = 0 }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const ctx = gsap.context(() => {
      gsap.from(el, {
        yPercent: 100,
        duration: 0.8,
        ease: 'power3.out',
        delay,
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });
    return () => ctx.revert();
  }, [delay]);
  
  return (
    <Component className={`text-reveal ${className || ''}`}>
      <span className="text-reveal-inner" ref={ref}>
        {children}
      </span>
    </Component>
  );
};

/* ===== HERO CANVAS - PARTICLE FIELD ===== */
const HeroCanvas = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particleCount = 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.7 ? '#94FFE5' : Math.random() > 0.5 ? '#FF6B35' : '#7B4FD4'
    }));

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 15, 13, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.5;
          p.vy -= (dy / dist) * force * 0.5;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        particlesRef.current.slice(i + 1).forEach(p2 => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#94FFE5';
            ctx.globalAlpha = (1 - d / 100) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" />;
};

/* ===== STUDIO CANVAS - FLOATING GEOMETRIC SHAPES ===== */
const StudioCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const shapes = [];
    const shapeCount = 6;
    
    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 40 + Math.random() * 80,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        color: ['#94FFE5', '#FF6B35', '#7B4FD4', '#FFD700'][i % 4],
        type: ['circle', 'square', 'triangle', 'hexagon'][i % 4],
        opacity: 0.15 + Math.random() * 0.25
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 38, 41, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.globalAlpha = shape.opacity;
        
        ctx.beginPath();
        if (shape.type === 'circle') {
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        } else if (shape.type === 'square') {
          ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
        } else {
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = (shape.size / 2) * Math.cos(angle);
            const y = (shape.size / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
        }
        
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        ctx.fillStyle = shape.color;
        ctx.globalAlpha = shape.opacity * 0.3;
        ctx.fill();
        
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="studio-canvas" />;
};

/* ===== FEATURED CANVAS - DATA FLOW VISUALIZATION ===== */
const FeaturedCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = [];
    const nodeCount = 10;
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 4 + Math.random() * 6,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    const dataPackets = [];

    const animate = (time) => {
      ctx.fillStyle = 'rgba(10, 31, 28, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const pulse = Math.sin(time * 0.002 + node.pulsePhase) * 0.5 + 0.5;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = '#94FFE5';
        ctx.globalAlpha = 0.6 + pulse * 0.4;
        ctx.fill();

        nodes.slice(i + 1).forEach(other => {
          const d = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = '#94FFE5';
            ctx.globalAlpha = (1 - d / 150) * 0.2;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      if (Math.random() < 0.03) {
        const from = nodes[Math.floor(Math.random() * nodes.length)];
        const to = nodes[Math.floor(Math.random() * nodes.length)];
        if (from !== to) {
          dataPackets.push({
            from,
            to,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02
          });
        }
      }

      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i];
        packet.progress += packet.speed;
        
        if (packet.progress >= 1) {
          dataPackets.splice(i, 1);
          continue;
        }

        const x = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
        const y = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FF6B35';
        ctx.globalAlpha = 1 - packet.progress;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="featured-canvas" />;
};

/* ===== NAVBAR ===== */
const Navbar = ({ audio, lenisRef }) => {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const scramble = useTextScramble();

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80 });
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll);

    const sections = ['hero', 'manifesto', 'studio', 'process', 'philosophy', 'capabilities', 'featured', 'impact', 'testimonials', 'contact'];
    sections.forEach(id => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  const navLink = (id, label) => (
    <a
      href={`#${id}`}
      className={activeSection === id ? 'active' : ''}
      onClick={(e) => { e.preventDefault(); scrollTo(id); }}
      onMouseEnter={(e) => scramble(e.target, label)}
    >
      {label}
    </a>
  );

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-item logo font-display">
          <span className="logo-glitch" data-text="VANTA STUDIO">VANTA STUDIO</span>
        </div>
        <div className={`nav-item nav-links ${mobileOpen ? 'open' : ''}`}>
          {navLink('studio', 'Studio')}
          {navLink('process', 'Process')}
          {navLink('capabilities', 'Work')}
          {navLink('contact', 'Contact')}
          <button className="sound-toggle" onClick={audio.toggleMute}>
            {audio.muted ? 'Sound Off' : 'Sound On'}
          </button>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MagneticButton className="nav-item" onClick={() => scrollTo('contact')}>
          Start a Project
        </MagneticButton>
      </div>
    </nav>
  );
};

/* ===== HERO ===== */
const Hero = ({ onMouseEnter, onMouseLeave }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.6,
      });
      gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.2,
      });
      gsap.from('.hero-meta-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 1.5,
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <HeroCanvas />
      <div className="container hero-container">
        <div className="hero-eyebrow">The Obsessive Motion Lab</div>
        <h1 className="font-display hero-headline">
          <span className="hero-line">
            <span className="hero-word hero-bold">WE</span>
            <span className="hero-word hero-bold">BUILD</span>
          </span>
          <span className="hero-line">
            <span className="hero-word hero-thin">DIGITAL</span>
            <span className="hero-word hero-thin">EXPERIENCES</span>
          </span>
          <span className="hero-line">
            <span className="hero-word hero-bold">THAT</span>
            <span className="hero-word hero-bold">MOVE</span>
          </span>
        </h1>
        <p className="hero-subtitle text-muted">
          Award-winning frontend for tech startups and fintech. Every pixel animated. Every interaction considered. Nothing boring.
        </p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Founded</span>
            <span className="hero-meta-value">2024</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Focus</span>
            <span className="hero-meta-value">Motion</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Standard</span>
            <span className="hero-meta-value">#D</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===== MANIFESTO ===== */
const Manifesto = () => {
  const sectionRef = useRef(null);
  const [activeWords, setActiveWords] = useState(new Set());

  useEffect(() => {
    const words = document.querySelectorAll('.manifesto-word');
    
    const triggers = Array.from(words).map((word, i) => {
      return ScrollTrigger.create({
        trigger: word,
        start: 'top 80%',
        end: 'top 50%',
        onEnter: () => setActiveWords(prev => new Set([...prev, i])),
        onEnterBack: () => setActiveWords(prev => new Set([...prev, i])),
      });
    });

    return () => triggers.forEach(t => t.kill());
  }, []);

  const text = "In a world of static websites and forgotten brands, we choose motion. We choose obsession. We choose to build experiences that stop people mid-scroll and make them feel something. This is not design as decoration. This is design as weapon.";
  const words = text.split(' ');

  return (
    <section id="manifesto" ref={sectionRef} className="manifesto">
      <div className="container">
        <p className="manifesto-text font-display">
          {words.map((word, i) => (
            <span
              key={i}
              className={`manifesto-word ${activeWords.has(i) ? 'active' : ''}`}
              style={{ transitionDelay: `${(i % 5) * 0.1}s` }}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

/* ===== THE STUDIO ===== */
const Studio = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.studio-visual', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.studio-content > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.studio-stats',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="studio" ref={sectionRef} className="studio">
      <div className="container studio-layout">
        <div className="studio-visual">
          <StudioCanvas />
        </div>
        <div className="studio-content">
          <TextReveal as="h2" className="font-display">
            THE STUDIO
          </TextReveal>
          <p>
            Vanta Studio is a motion-first digital experience lab. We don't do templates. We don't do "good enough." We build bespoke, award-level frontend for tech and fintech brands that want to stand out in a sea of sameness.
          </p>
          <p>
            Every project starts with a question: "What would this look like if it moved?" Then we obsess until the answer is unforgettable.
          </p>
          <div className="studio-stats">
            <div className="stat-item">
              <span className="stat-number">01</span>
              <span className="stat-label">Project</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Obsession</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Ambition</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===== PROCESS ===== */
const Process = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: '01', title: 'Discover', desc: 'We immerse in your brand, your users, your competition. We find the gaps where motion can create meaning.' },
    { num: '02', title: 'Architect', desc: 'We design the experience structure — every scroll, every hover, every transition mapped to emotion.' },
    { num: '03', title: 'Animate', desc: 'We build. Canvas, WebGL, GSAP, shaders — whatever it takes to make it feel alive.' },
    { num: '04', title: 'Refine', desc: 'We polish until it hurts. 60fps or nothing. Every frame considered. Every pixel perfect.' },
  ];

  return (
    <section id="process" ref={sectionRef} className="process">
      <div className="container">
        <div className="process-header">
          <TextReveal as="h2" className="font-display">
            OUR PROCESS
          </TextReveal>
          <p>Four phases. Zero shortcuts. Maximum obsession.</p>
        </div>
        <div className="process-steps">
          {steps.map((step) => (
            <div key={step.num} className="process-step">
              <div className="process-step-number">{step.num}</div>
              <div className="process-step-content">
                <h3 className="font-display">{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== PHILOSOPHY ===== */
const Philosophy = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.philosophy-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const cards = [
    { icon: <MotionIcon />, title: 'Motion First', desc: 'We don\'t add animation as an afterthought. Motion is the foundation of every decision we make.' },
    { icon: <StrategyIcon />, title: 'Strategy Driven', desc: 'Every animation serves a purpose. We move pixels with intent, not just for show.' },
    { icon: <CraftIcon />, title: 'Obsessive Craft', desc: 'We ship when it\'s perfect, not when it\'s done. 60fps. Zero jank. Pixel-perfect.' },
  ];

  return (
    <section id="philosophy" ref={sectionRef} className="philosophy">
      <div className="container">
        <div className="process-header">
          <TextReveal as="h2" className="font-display">
            PHILOSOPHY
          </TextReveal>
          <p>Three beliefs that guide every project we take on.</p>
        </div>
        <div className="philosophy-grid">
          {cards.map((card, i) => (
            <div key={i} className="philosophy-card">
              <div className="philosophy-icon">{card.icon}</div>
              <h3 className="font-display">{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== CAPABILITIES ===== */
const Capabilities = ({ audio }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.capability-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const capabilities = [
    { title: 'Frontend Engineering', desc: 'React, WebGL, Canvas, GSAP — we build what others say is impossible.', tags: ['React', 'WebGL', 'GSAP', 'Canvas'] },
    { title: 'Motion Design', desc: 'Every interaction choreographed. Every transition meaningful. Nothing random.', tags: ['Animation', 'Micro-interactions', 'Scroll Effects'] },
    { title: '3D & WebGL', desc: 'Shaders, particles, 3D elements — when flat isn\'t enough.', tags: ['Three.js', 'Shaders', 'Particles'] },
    { title: 'Design Systems', desc: 'Scalable, animated component libraries that maintain soul at every size.', tags: ['Tokens', 'Components', 'Documentation'] },
  ];

  return (
    <section id="capabilities" ref={sectionRef} className="capabilities">
      <div className="container">
        <div className="capabilities-header">
          <TextReveal as="h2" className="font-display">
            CAPABILITIES
          </TextReveal>
          <p>What we do. What we obsess over. What we deliver.</p>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="capability-card"
              onMouseEnter={() => audio.playHover(i)}
            >
              <h3 className="font-display">{cap.title}</h3>
              <p>{cap.desc}</p>
              <div className="capability-tags">
                {cap.tags.map(tag => (
                  <span key={tag} className="capability-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== FEATURED PROJECT ===== */
const FeaturedProject = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.featured-showcase', {
        scale: 0.95,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
      gsap.from('.featured-info-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.featured-info',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="featured" ref={sectionRef} className="featured">
      <div className="container">
        <div className="featured-header">
          <TextReveal as="h2" className="font-display">
            FEATURED PROJECT
          </TextReveal>
          <p>Our first. Our finest. The standard we set for everything after.</p>
        </div>
        <div className="featured-showcase">
          <FeaturedCanvas />
        </div>
        <div className="featured-info">
          <div className="featured-info-item">
            <h4>Client</h4>
            <p>Vanta Studio — Self</p>
          </div>
          <div className="featured-info-item">
            <h4>Type</h4>
            <p>Digital Experience</p>
          </div>
          <div className="featured-info-item">
            <h4>Year</h4>
            <p>2024</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===== IMPACT ===== */
const Impact = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.impact-number', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const numbers = [
    { value: '01', label: 'Project', suffix: '' },
    { value: '100', label: 'Commits', suffix: '+' },
    { value: '60', label: 'FPS Target', suffix: '' },
    { value: '∞', label: 'Potential', suffix: '' },
  ];

  return (
    <section id="impact" ref={sectionRef} className="impact">
      <div className="container">
        <div className="impact-header">
          <TextReveal as="h2" className="font-display">
            THE IMPACT
          </TextReveal>
          <p>Numbers that matter. Standards we set.</p>
        </div>
        <div className="impact-numbers">
          {numbers.map((num, i) => (
            <div key={i} className="impact-number">
              <div className="impact-number-value">{num.value}{num.suffix}</div>
              <div className="impact-number-label">{num.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== TESTIMONIALS ===== */
const Testimonials = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const testimonials = [
    { quote: "Vanta doesn't just build websites. They build experiences that make you reconsider what digital can be.", name: "Future Client", role: "CEO, Tech Startup" },
    { quote: "The level of craft is unmatched. Every interaction feels intentional. Every animation tells a story.", name: "Future Client", role: "CMO, Fintech" },
    { quote: "We came for a website. We left with a competitive advantage. This is what motion design should be.", name: "Future Client", role: "Founder, SaaS" },
  ];

  return (
    <section id="testimonials" ref={sectionRef} className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <TextReveal as="h2" className="font-display">
            WHAT THEY'LL SAY
          </TextReveal>
          <p>Testimonials from our future clients. We're building toward these.</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== VALUES MARQUEE ===== */
const ValuesMarquee = () => {
  const text = "OBSESSIVE · CRAFT · MOTION · STRATEGY · FEARLESS · BOLD · ";
  const repeated = text.repeat(4);

  return (
    <section className="marquee">
      <div className="marquee-row marquee-left">
        <div className="marquee-content font-display">{repeated}</div>
        <div className="marquee-content font-display">{repeated}</div>
      </div>
      <div className="marquee-row marquee-right">
        <div className="marquee-content font-display">{repeated}</div>
        <div className="marquee-content font-display">{repeated}</div>
      </div>
    </section>
  );
};

/* ===== CTA ===== */
const CTA = ({ audio }) => {
  return (
    <section id="contact" className="cta">
      <div className="container">
        <TextReveal as="h2" className="font-display">
          READY TO MOVE DIFFERENT?
        </TextReveal>
        <p>
          We're taking on select projects for Q3 2024. If you're building something that deserves to be unforgettable, let's talk.
        </p>
        <MagneticButton
          style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
          onClick={audio.playClick}
        >
          <span>Start a Project</span>
        </MagneticButton>
      </div>
    </section>
  );
};

/* ===== FOOTER ===== */
const Footer = () => (
  <footer>
    <div className="container footer-grid">
      <div>
        <div className="footer-brand font-display">VANTA STUDIO</div>
        <p className="footer-tagline">The Obsessive Motion Lab for tech and fintech. Built different.</p>
      </div>
      <div className="footer-col">
        <h4>Navigate</h4>
        <a href="#studio">Studio</a>
        <a href="#process">Process</a>
        <a href="#capabilities">Work</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="footer-col">
        <h4>Connect</h4>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <div className="footer-col">
        <h4>Contact</h4>
        <a href="mailto:hello@vanta.studio">hello@vanta.studio</a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2024 Vanta Studio. All rights reserved.</span>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter">
          <TwitterIcon />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
          <InstagramIcon />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
      </div>
    </div>
  </footer>
);

/* ===== GRAIN OVERLAY ===== */
const GrainOverlay = () => (
  <div className="grain-overlay" aria-hidden="true" />
);

/* ===== APP ===== */
function App() {
  const audio = useAudio();
  const lenisRef = useLenis();
  const [trailActive, setTrailActive] = useState(false);

  return (
    <div className="app">
      <GrainOverlay />
      <CustomCursor />
      <CursorTrail active={trailActive} audio={audio} />
      <Navbar audio={audio} lenisRef={lenisRef} />
      <Hero
        onMouseEnter={() => setTrailActive(true)}
        onMouseLeave={() => setTrailActive(false)}
      />
      <div className="section-transition" />
      <Manifesto />
      <div className="section-transition" />
      <Studio />
      <div className="section-transition" />
      <Process />
      <div className="section-transition" />
      <Philosophy />
      <div className="section-transition" />
      <Capabilities audio={audio} />
      <div className="section-transition" />
      <FeaturedProject />
      <div className="section-transition" />
      <Impact />
      <div className="section-transition" />
      <Testimonials />
      <ValuesMarquee />
      <CTA audio={audio} />
      <Footer />
    </div>
  );
}

export default App;