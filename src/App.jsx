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

  const startDrone = useCallback(() => {
    if (muted || droneRef.current || startedRef.current) return;
    try {
      const ctx = initAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2);
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

  return { muted, toggleMute, playHover, playClick };
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

/* ===== VELOCITY SKEW ===== */
const useVelocitySkew = () => {
  useEffect(() => {
    let lastScroll = window.scrollY;
    let currentSkew = 0;
    let rafId;
    
    const update = () => {
      const scrollY = window.scrollY;
      const velocity = scrollY - lastScroll;
      lastScroll = scrollY;
      
      const targetSkew = Math.max(-2, Math.min(2, velocity * 0.015));
      currentSkew += (targetSkew - currentSkew) * 0.08;
      
      const skewElements = document.querySelectorAll('.velocity-skew');
      skewElements.forEach(el => {
        el.style.transform = `skewY(${currentSkew}deg)`;
      });
      
      rafId = requestAnimationFrame(update);
    };
    
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);
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
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn')) {
        cursorRef.current?.classList.add('hovering');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .service-row, .work-item, .magnetic-btn')) {
        cursorRef.current?.classList.remove('hovering');
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

/* ===== CURSOR TRAIL ===== */
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

/* ===== PARTICLES ===== */
const Particles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 20}s`,
      duration: `${15 + Math.random() * 15}s`,
      size: `${1 + Math.random() * 2}px`
    }))
  , []);

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map(p => (
        <div 
          key={p.id} 
          className="particle" 
          style={{ 
            left: p.left, 
            top: p.top, 
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size
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
        <div className="nav-item logo font-display">VANTA STUDIO</div>
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
      <div className="hero-bg" />
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
      gsap.from('.no-boring-visual', {
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
      <Sticker type="star" color="#94FFE5" size={40} top="10%" left="85%" delay={0} />
      <Sticker type="circle" color="#FF6B35" size={24} top="70%" left="10%" delay={1} />
      <Sticker type="diamond" color="#7B4FD4" size={32} top="30%" left="5%" delay={2} />
      <Sticker type="cross" color="#94FFE5" size={28} top="80%" left="80%" delay={1.5} />
      <div className="container no-boring-layout">
        <div className="no-boring-visual">
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Abstract visual" loading="lazy" />
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
    { title: 'Nike Campaign', category: 'Brand Identity', img: 'https://picsum.photos/800/600?random=10' },
    { title: 'Spotify Motion', category: 'Motion Design', img: 'https://picsum.photos/800/600?random=11' },
    { title: 'Apple Web Experience', category: 'Web Design', img: 'https://picsum.photos/800/600?random=12' },
    { title: 'Adidas Launch', category: 'Campaign', img: 'https://picsum.photos/800/600?random=13' },
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
            <div key={i} className="work-item velocity-skew">
              <img src={project.img} alt={project.title} loading="lazy" />
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
              className="service-row velocity-skew"
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
      <Sticker type="star" color="#FF6B35" size={36} top="15%" left="15%" delay={0.5} />
      <Sticker type="circle" color="#94FFE5" size={20} top="75%" left="75%" delay={1} />
      <Sticker type="diamond" color="#7B4FD4" size={28} top="20%" left="80%" delay={2} />
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
  
  useVelocitySkew();

  return (
    <div className="app">
      <GrainOverlay />
      <Particles />
      <CustomCursor />
      <CursorTrail active={trailActive} />
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