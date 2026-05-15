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
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return lenisRef;
};

/* ===== AUDIO SYSTEM ===== */
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
    // Ethereal trail sound - very subtle
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
      osc2.frequency.setValueAtTime(82.5, ctx.currentTime); // Perfect fifth
      
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
    if (next) {
      stopDrone();
    } else {
      startDrone();
    }
  }, [muted, startDrone, stopDrone]);

  useEffect(() => {
    const handleInteraction = () => {
      if (!muted && !startedRef.current) {
        startDrone();
      }
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
        if (i < frame / 3) {
          output += finalText[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      element.textContent = output;
      frame++;
      if (frame / 3 < length) {
        requestAnimationFrame(update);
      } else {
        element.textContent = finalText;
      }
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
  const [isHoveringText, setIsHoveringText] = useState(false);

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
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn')) {
        cursorRef.current?.classList.add('hovering');
      }
      if (e.target.closest('p, h1, h2, h3, h4, span')) {
        setIsHoveringText(true);
        cursorRef.current?.classList.add('text-hover');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn')) {
        cursorRef.current?.classList.remove('hovering');
      }
      if (e.target.closest('p, h1, h2, h3, h4, span')) {
        setIsHoveringText(false);
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
    if (btnRef.current) {
      btnRef.current.style.transform = 'translate(0, 0)';
    }
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

/* ===== CURSOR TRAIL WITH SFX ===== */
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

      // Play trail sound every 150ms max
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

    // Create particles
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
      ctx.fillStyle = 'rgba(5, 15, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx -= (dx / dist) * force * 0.5;
          p.vy -= (dy / dist) * force * 0.5;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Draw connections
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#94FFE5';
            ctx.globalAlpha = (1 - d / 100) * 0.15;
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

/* ===== WORK CANVAS - ANIMATED SHAPES ===== */
const WorkCanvas = ({ index }) => {
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

    const configs = [
      // Project 1: Flowing lines
      {
        draw: (time) => {
          ctx.fillStyle = 'rgba(6, 38, 41, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height / 2);
            for (let x = 0; x < canvas.width; x += 5) {
              const y = canvas.height / 2 + 
                Math.sin(x * 0.01 + time * 0.002 + i * 0.5) * 50 +
                Math.sin(x * 0.02 + time * 0.003 + i) * 30;
              ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `rgba(148, 255, 229, ${0.3 - i * 0.05})`;
            ctx.lineWidth = 2 - i * 0.3;
            ctx.stroke();
          }
        }
      },
      // Project 2: Orbiting circles
      {
        draw: (time) => {
          ctx.fillStyle = 'rgba(6, 38, 41, 0.08)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          for (let i = 0; i < 8; i++) {
            const angle = (time * 0.001 + i * Math.PI / 4);
            const radius = 50 + i * 20;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 3 + i, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? '#FF6B35' : '#7B4FD4';
            ctx.globalAlpha = 0.6;
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      },
      // Project 3: Grid waves
      {
        draw: (time) => {
          ctx.fillStyle = 'rgba(6, 38, 41, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const cols = 10;
          const rows = 10;
          const cellW = canvas.width / cols;
          const cellH = canvas.height / rows;
          
          for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
              const x = i * cellW + cellW / 2;
              const y = j * cellH + cellH / 2;
              const dist = Math.sqrt((x - canvas.width/2)**2 + (y - canvas.height/2)**2);
              const wave = Math.sin(dist * 0.05 - time * 0.003) * 0.5 + 0.5;
              
              ctx.beginPath();
              ctx.arc(x, y, 2 + wave * 4, 0, Math.PI * 2);
              ctx.fillStyle = '#94FFE5';
              ctx.globalAlpha = wave * 0.5;
              ctx.fill();
            }
          }
          ctx.globalAlpha = 1;
        }
      },
      // Project 4: Spiral
      {
        draw: (time) => {
          ctx.fillStyle = 'rgba(6, 38, 41, 0.06)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          
          ctx.beginPath();
          for (let i = 0; i < 200; i++) {
            const angle = i * 0.1 + time * 0.001;
            const radius = i * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = '#FF6B35';
          ctx.lineWidth = 1.5;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    ];

    const config = configs[index % configs.length];

    const animate = (time) => {
      config.draw(time);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [index]);

  return <canvas ref={canvasRef} className="work-canvas" />;
};

/* ===== NO BORING CANVAS ===== */
const NoBoringCanvas = () => {
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
        size: 30 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: ['#94FFE5', '#FF6B35', '#7B4FD4'][i % 3],
        type: ['circle', 'square', 'triangle'][i % 3]
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(6, 38, 41, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        // Bounce
        if (shape.x < 0 || shape.x > canvas.width) shape.vx *= -1;
        if (shape.y < 0 || shape.y > canvas.height) shape.vy *= -1;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        
        ctx.beginPath();
        if (shape.type === 'circle') {
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
        } else if (shape.type === 'square') {
          ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
        } else {
          ctx.moveTo(0, -shape.size / 2);
          ctx.lineTo(shape.size / 2, shape.size / 2);
          ctx.lineTo(-shape.size / 2, shape.size / 2);
          ctx.closePath();
        }
        
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
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

  return <canvas ref={canvasRef} className="no-boring-canvas" />;
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

    const sections = ['hero', 'noboring', 'work', 'services', 'contact'];
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
          {navLink('work', 'Work')}
          {navLink('noboring', 'Studio')}
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
        <div className="hero-eyebrow">Digital Experience Studio</div>
        <h1 className="font-display hero-headline">
          <span className="hero-line">
            <span className="hero-word hero-bold">YOUR</span>
            <span className="hero-word hero-bold">BRAND</span>
          </span>
          <span className="hero-line">
            <span className="hero-word hero-thin">DESERVES</span>
            <span className="hero-word hero-thin">TO</span>
            <span className="hero-word hero-thin">BE</span>
          </span>
          <span className="hero-line">
            <span className="hero-word hero-bold">UNFORGETTABLE</span>
          </span>
        </h1>
        <p className="hero-subtitle text-muted">
          We build digital experiences that stop people mid-scroll. Motion-first design for brands that want to stand out.
        </p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <span className="hero-meta-label">Founded</span>
            <span className="hero-meta-value">2024</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Projects</span>
            <span className="hero-meta-value">120+</span>
          </div>
          <div className="hero-meta-item">
            <span className="hero-meta-label">Awards</span>
            <span className="hero-meta-value">14</span>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ===== NO BORING BRANDS ===== */
const NoBoringBrands = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.no-boring-canvas', {
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
      gsap.from('.no-boring-content > *', {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="noboring" ref={sectionRef} className="no-boring">
      <div className="container no-boring-layout">
        <div className="no-boring-visual">
          <NoBoringCanvas />
        </div>
        <div className="no-boring-content">
          <TextReveal as="h2" className="font-display">
            NO BORING BRANDS.
          </TextReveal>
          <p>
            We think every brand has an unforgettable version of itself. We find it through motion, design, and relentless attention to detail.
          </p>
        </div>
      </div>
    </section>
  );
};

/* ===== SELECTED WORK ===== */
const SelectedWork = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-item', {
        y: 60,
        opacity: 0,
        duration: 0.9,
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

  const projects = [
    { title: 'Nike Campaign', category: 'Brand Identity' },
    { title: 'Spotify Motion', category: 'Motion Design' },
    { title: 'Apple Web Experience', category: 'Web Design' },
    { title: 'Adidas Launch', category: 'Campaign' },
  ];

  return (
    <section id="work" ref={sectionRef} className="selected-work">
      <div className="container">
        <div className="work-header">
          <TextReveal as="h2" className="font-display">
            SELECTED WORK
          </TextReveal>
          <MagneticButton className="cta-btn-outline" style={{ width: 'auto', marginTop: 0 }}>
            <span>View All</span> <ArrowIcon />
          </MagneticButton>
        </div>
        <div className="work-grid">
          {projects.map((project, i) => (
            <div key={i} className="work-item">
              <WorkCanvas index={i} />
              <div className="work-item-overlay">
                <div className="work-item-category">{project.category}</div>
                <div className="work-item-title">{project.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== SERVICES ===== */
const Services = ({ audio }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.service-row', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
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

  const services = [
    { num: '01', name: 'Brand Identity', desc: 'Logos, systems, and guidelines that scale across every touchpoint.' },
    { num: '02', name: 'Motion Design', desc: 'Animation that adds life to every interaction and transition.' },
    { num: '03', name: 'Web Experiences', desc: 'Sites that perform and convert with editorial precision.' },
    { num: '04', name: 'Campaign Direction', desc: 'Creative strategy from concept to launch, no shortcuts.' },
  ];

  return (
    <section id="services" ref={sectionRef} className="services">
      <div className="container">
        <div className="services-header">
          <TextReveal as="h2" className="font-display">
            WHAT WE DO
          </TextReveal>
          <p>Four disciplines. One obsession: making your brand impossible to ignore.</p>
        </div>
        <div className="services-list">
          {services.map((s, i) => (
            <div
              key={s.num}
              className="service-row"
              onMouseEnter={() => audio.playHover(i)}
            >
              <div className="service-row-number">{s.num}</div>
              <div className="service-row-title font-display">{s.name}</div>
              <div className="service-row-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== VALUES MARQUEE ===== */
const ValuesMarquee = () => {
  const text = "BOLD · HONEST · OBSESSIVE · FAST · CREATIVE · FEARLESS · ";
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
          READY TO BUILD SOMETHING UNFORGETTABLE?
        </TextReveal>
        <p>
          Book a call with our team. No decks. No fluff. Just a real conversation about what we can build together.
        </p>
        <MagneticButton
          style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}
          onClick={audio.playClick}
        >
          <span>Book a Call</span>
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
        <p className="footer-tagline">Motion-first digital experiences for brands that refuse to be boring.</p>
      </div>
      <div className="footer-col">
        <h4>Navigation</h4>
        <a href="#work">Work</a>
        <a href="#noboring">Studio</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="footer-col">
        <h4>Social</h4>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
      <div className="footer-col">
        <h4>Connect</h4>
        <a href="mailto:hello@vanta.studio">hello@vanta.studio</a>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2025 Vanta Studio. All rights reserved.</span>
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
      <NoBoringBrands />
      <div className="section-transition" />
      <SelectedWork />
      <div className="section-transition" />
      <Services audio={audio} />
      <ValuesMarquee />
      <CTA audio={audio} />
      <Footer />
    </div>
  );
}

export default App;