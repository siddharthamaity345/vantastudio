import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ===== SVG ICONS ===== */
const BrandIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="28" r="26" stroke="#94FFE5" strokeWidth="2"/>
    <path d="M18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="28" cy="28" r="6" fill="#94FFE5"/>
    <path d="M28 34V42" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 40L28 42L34 40" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MotionIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="48" height="32" rx="4" stroke="#94FFE5" strokeWidth="2"/>
    <path d="M22 24L32 28L22 32V24Z" fill="#94FFE5"/>
    <circle cx="42" cy="28" r="3" fill="#94FFE5" opacity="0.5"/>
    <path d="M8 44L12 48M48 44L44 48" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WebIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="44" height="40" rx="4" stroke="#94FFE5" strokeWidth="2"/>
    <line x1="6" y1="18" x2="50" y2="18" stroke="#94FFE5" strokeWidth="2"/>
    <circle cx="14" cy="13" r="2" fill="#94FFE5"/>
    <circle cx="22" cy="13" r="2" fill="#94FFE5" opacity="0.5"/>
    <circle cx="30" cy="13" r="2" fill="#94FFE5" opacity="0.3"/>
    <rect x="14" y="26" width="12" height="16" rx="2" stroke="#94FFE5" strokeWidth="1.5"/>
    <rect x="30" y="26" width="12" height="8" rx="2" stroke="#94FFE5" strokeWidth="1.5"/>
    <line x1="30" y1="40" x2="42" y2="40" stroke="#94FFE5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CampaignIcon = () => (
  <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28C8 16.9543 16.9543 8 28 8C39.0457 8 48 16.9543 48 28" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M48 28L44 20L40 28" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="28" cy="28" r="8" stroke="#94FFE5" strokeWidth="2"/>
    <path d="M28 24V28L31 31" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 44L24 40L28 44L32 40L36 44" stroke="#94FFE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 8L36 24L52 28L36 32L32 48L28 32L12 28L28 24L32 8Z" fill="#94FFE5"/>
    <circle cx="32" cy="28" r="4" fill="#050F0D"/>
  </svg>
);

const FlameIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 12C32 12 20 24 20 36C20 44 25 52 32 52C39 52 44 44 44 36C44 24 32 12 32 12Z" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 20C32 20 26 28 26 36C26 40 28 44 32 44" stroke="#FF6B35" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CrownIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 48L16 20L24 28L32 16L40 28L48 20L52 48H12Z" stroke="#7B4FD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="16" cy="20" r="3" fill="#7B4FD4"/>
    <circle cx="32" cy="16" r="3" fill="#7B4FD4"/>
    <circle cx="48" cy="20" r="3" fill="#7B4FD4"/>
    <line x1="20" y1="40" x2="44" y2="40" stroke="#7B4FD4" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

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

/* ===== LENIS SMOOTH SCROLL ===== */
const useLenis = () => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

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

  const playTone = useCallback((freq, type = 'sine', duration = 0.15, volume = 0.1) => {
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
    const freqs = [220, 330, 440, 550];
    playTone(freqs[index % freqs.length], 'sine', 0.12, 0.06);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 'sine', 0.15, 0.12);
  }, [playTone]);

  const startDrone = useCallback(() => {
    if (muted || droneRef.current || startedRef.current) return;
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      droneRef.current = { osc, gain };
      startedRef.current = true;
    } catch (e) {}
  }, [muted]);

  const stopDrone = useCallback(() => {
    if (droneRef.current) {
      try {
        const { osc, gain } = droneRef.current;
        const ctx = audioCtxRef.current;
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {}
      droneRef.current = null;
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

  return { muted, toggleMute, playHover, playClick };
};

/* ===== TEXT SCRAMBLE HOOK ===== */
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

  useEffect(() => {
    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onOver = (e) => {
      if (e.target.closest('a, button, .service-card, .pricing-card, .magnetic-btn')) {
        cursorRef.current?.classList.add('hovering');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .service-card, .pricing-card, .magnetic-btn')) {
        cursorRef.current?.classList.remove('hovering');
      }
    };

    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

/* ===== MAGNETIC BUTTON ===== */
const MagneticButton = ({ children, className, onClick, style }) => {
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
    bounds.current = btnRef.current.getBoundingClientRect();
  };

  return (
    <button
      ref={btnRef}
      className={className}
      onClick={onClick}
      style={{ ...style, transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </button>
  );
};

/* ===== CURSOR IMAGE TRAIL ===== */
const CursorTrail = ({ active }) => {
  const [items, setItems] = useState([]);
  const idCounter = useRef(0);
  const lastAdd = useRef(0);

  const images = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => `https://picsum.photos/300/400?random=${i + 50}`)
  , []);

  useEffect(() => {
    const onMove = (e) => {
      if (!active) return;
      const now = performance.now();
      if (now - lastAdd.current < 80) return;
      lastAdd.current = now;

      const id = idCounter.current++;
      const img = images[id % images.length];

      setItems(prev => {
        const next = [...prev, { id, x: e.clientX, y: e.clientY, img }];
        return next.length > 8 ? next.slice(-8) : next;
      });

      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, 800);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [images, active]);

  return (
    <div className="cursor-trail">
      {items.map(item => (
        <div
          key={item.id}
          className="trail-image"
          style={{
            left: item.x,
            top: item.y,
            backgroundImage: `url(${item.img})`,
          }}
        />
      ))}
    </div>
  );
};

/* ===== FLOATING STICKER ===== */
const Sticker = ({ type, color, size, top, left, delay = 0 }) => {
  const shapes = {
    star: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    diamond: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 2L22 12L12 22L2 12Z"/>
      </svg>
    ),
    cross: (
      <svg viewBox="0 0 24 24" fill={color} width={size} height={size}>
        <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  };

  return (
    <div className="sticker" style={{ top, left, animationDelay: `${delay}s` }}>
      {shapes[type] || shapes.circle}
    </div>
  );
};

/* ===== NAVBAR ===== */
const Navbar = ({ audio, lenisRef }) => {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

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

    const sections = ['hero', 'noboring', 'services', 'pricing', 'contact'];
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
    >
      {label}
    </a>
  );

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-item logo font-display">VANTA STUDIO</div>
        <div className={`nav-item nav-links ${mobileOpen ? 'open' : ''}`}>
          {navLink('hero', 'Work')}
          {navLink('noboring', 'Studio')}
          {navLink('contact', 'Contact')}
          <button className="sound-toggle" onClick={audio.toggleMute}>
            {audio.muted ? 'Sounds OFF' : 'Sounds ON'}
          </button>
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <MagneticButton className="nav-item magnetic-btn" onClick={() => scrollTo('contact')}>
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
      <div className="hero-bg" />
      <div className="container hero-container">
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
          We build digital experiences that stop people mid-scroll.
        </p>
      </div>
    </section>
  );
};

/* ===== NO BORING BRANDS ===== */
const NoBoringBrands = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.no-boring-word', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="noboring" ref={sectionRef} className="no-boring">
      <Sticker type="star" color="#94FFE5" size={40} top="10%" left="85%" delay={0} />
      <Sticker type="circle" color="#FF6B35" size={24} top="70%" left="10%" delay={1} />
      <Sticker type="diamond" color="#7B4FD4" size={32} top="30%" left="5%" delay={2} />
      <Sticker type="cross" color="#94FFE5" size={28} top="80%" left="80%" delay={1.5} />
      <div className="container">
        <h2 className="font-display" style={{ fontSize: '8vw', lineHeight: 0.9 }}>
          <span className="no-boring-word" style={{ display: 'inline-block', marginRight: '0.12em' }}>NO</span>
          <span className="no-boring-word" style={{ display: 'inline-block', marginRight: '0.12em' }}>BORING</span>
          <br />
          <span className="no-boring-word" style={{ display: 'inline-block' }}>BRANDS.</span>
        </h2>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '480px', marginTop: '2rem' }}>
          We think every brand has an unforgettable version of itself. We find it.
        </p>
      </div>
    </section>
  );
};

/* ===== HORIZONTAL SCROLL SECTION ===== */
const HorizontalScroll = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const scrollWidth = track.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const projects = [
    { title: 'Nike Campaign', category: 'Brand Identity', img: 'https://picsum.photos/800/600?random=10' },
    { title: 'Spotify Motion', category: 'Motion Design', img: 'https://picsum.photos/800/600?random=11' },
    { title: 'Apple Web Experience', category: 'Web Design', img: 'https://picsum.photos/800/600?random=12' },
    { title: 'Adidas Launch', category: 'Campaign', img: 'https://picsum.photos/800/600?random=13' },
  ];

  return (
    <section ref={sectionRef} className="horizontal-section">
      <div className="horizontal-container">
        <div ref={trackRef} className="horizontal-track">
          <div style={{ flexShrink: 0, padding: '0 4rem', display: 'flex', alignItems: 'center' }}>
            <h2 className="font-display" style={{ fontSize: '6vw', whiteSpace: 'nowrap' }}>
              SELECTED WORK —
            </h2>
          </div>
          {projects.map((project, i) => (
            <div key={i} className="horizontal-card">
              <img src={project.img} alt={project.title} loading="lazy" />
              <div className="horizontal-card-content">
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{project.category}</p>
                <h3 className="font-display" style={{ fontSize: '2.5rem' }}>{project.title}</h3>
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
      gsap.from('.service-card', {
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

  const services = [
    { name: 'Brand Identity', desc: 'Logos, systems, and guidelines that scale.', icon: <BrandIcon /> },
    { name: 'Motion Design', desc: 'Animation that adds life to every interaction.', icon: <MotionIcon /> },
    { name: 'Web Experiences', desc: 'Sites that perform and convert beautifully.', icon: <WebIcon /> },
    { name: 'Campaign Direction', desc: 'Creative strategy from concept to launch.', icon: <CampaignIcon /> },
  ];

  return (
    <section id="services" ref={sectionRef} className="services">
      <div className="container">
        <h2 className="font-display" style={{ fontSize: '6vw', marginBottom: 'var(--space-lg)' }}>
          WHAT WE DO
        </h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div
              key={s.name}
              className="service-card"
              onMouseEnter={() => audio.playHover(i)}
            >
              <div className="card-icon">{s.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                {s.name}
              </h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ===== PRICING ===== */
const Pricing = ({ lenisRef }) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        y: 50,
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

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80 });
    }
  };

  const tiers = [
    { name: 'Starter', price: 'Free', color: 'var(--accent-primary)', icon: <SparkIcon />, benefits: ['Brand audit', 'Strategy call', 'Community access'], cta: 'Get Started', glow: 'rgba(148,255,229,0.1)' },
    { name: 'Growth', price: '$2,500/mo', color: 'var(--accent-secondary)', icon: <FlameIcon />, benefits: ['Dedicated designer', 'Weekly sprints', 'Priority support'], cta: 'Get Started', glow: 'rgba(255,107,53,0.1)' },
    { name: 'Partner', price: 'Custom', color: 'var(--accent-tertiary)', icon: <CrownIcon />, benefits: ['Full team embed', 'Quarterly planning', 'White-glove delivery'], cta: 'Contact Us', glow: 'rgba(123,79,212,0.1)' },
  ];

  return (
    <section id="pricing" ref={sectionRef} className="pricing">
      <div className="container">
        <h2 className="font-display" style={{ fontSize: '6vw', marginBottom: 'var(--space-lg)' }}>
          MEMBERSHIP
        </h2>
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="pricing-card"
              style={{ 
                border: `2px solid ${tier.color}`,
                '--card-glow': tier.glow 
              }}
            >
              <div className="tier-icon" style={{ color: tier.color }}>{tier.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {tier.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {tier.price}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {tier.benefits.map(b => (
                  <li key={b} className="text-muted">• {b}</li>
                ))}
              </ul>
              <MagneticButton className="cta-btn-outline" onClick={scrollToContact}>
                {tier.cta}
              </MagneticButton>
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
      <Sticker type="star" color="#FF6B35" size={36} top="15%" left="15%" delay={0.5} />
      <Sticker type="circle" color="#94FFE5" size={20} top="75%" left="75%" delay={1} />
      <Sticker type="diamond" color="#7B4FD4" size={28} top="20%" left="80%" delay={2} />
      <div className="container">
        <h2 className="font-display" style={{ fontSize: '7vw', marginBottom: '1.5rem' }}>
          READY TO BUILD SOMETHING UNFORGETTABLE?
        </h2>
        <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Book a call with our team. No decks. No fluff. Just a real conversation.
        </p>
        <MagneticButton
          className="magnetic-btn"
          style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}
          onClick={audio.playClick}
        >
          Book a Call
        </MagneticButton>
      </div>
    </section>
  );
};

/* ===== FOOTER ===== */
const Footer = () => (
  <footer>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div className="logo font-display" style={{ fontSize: '1.25rem' }}>
        VANTA STUDIO
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="#work">Work</a>
        <a href="#studio">Studio</a>
        <a href="#contact">Contact</a>
      </div>
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
    <div className="container footer-bottom">
      <span>© 2025 Vanta Studio. All rights reserved.</span>
      <span>Built with Kimi K2.6</span>
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
      <CursorTrail active={trailActive} />
      <Navbar audio={audio} lenisRef={lenisRef} />
      <Hero
        onMouseEnter={() => setTrailActive(true)}
        onMouseLeave={() => setTrailActive(false)}
      />
      <NoBoringBrands />
      <HorizontalScroll />
      <Services audio={audio} />
      <Pricing lenisRef={lenisRef} />
      <ValuesMarquee />
      <CTA audio={audio} />
      <Footer />
    </div>
  );
}

export default App;