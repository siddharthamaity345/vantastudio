import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

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
    } catch (e) {
      // Audio context not allowed yet
    }
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
      if (e.target.closest('a, button, .service-card, .pricing-card, .cta-btn')) {
        cursorRef.current?.classList.add('hovering');
      }
    };
    const onOut = (e) => {
      if (e.target.closest('a, button, .service-card, .pricing-card, .cta-btn')) {
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

/* ===== CURSOR IMAGE TRAIL ===== */
const CursorTrail = () => {
  const [items, setItems] = useState([]);
  const idCounter = useRef(0);
  const lastAdd = useRef(0);

  const images = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => `https://picsum.photos/300/400?random=${i + 50}`)
  , []);

  useEffect(() => {
    const onMove = (e) => {
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
  }, [images]);

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
const Navbar = ({ audio }) => {
  const navRef = useRef(null);

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

  return (
    <nav ref={navRef} className="navbar">
      <div className="nav-container">
        <div className="nav-item logo font-display">VANTA STUDIO</div>
        <div className="nav-item nav-links">
          <a href="#work">Work</a>
          <a href="#studio">Studio</a>
          <a href="#contact">Contact</a>
          <button className="sound-toggle" onClick={audio.toggleMute}>
            {audio.muted ? 'Sounds OFF' : 'Sounds ON'}
          </button>
        </div>
        <button className="nav-item cta-btn">Start a Project</button>
      </div>
    </nav>
  );
};

/* ===== HERO ===== */
const Hero = () => {
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
    <section id="hero" ref={heroRef} className="hero">
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
    { name: 'Brand Identity', desc: 'Logos, systems, and guidelines that scale.' },
    { name: 'Motion Design', desc: 'Animation that adds life to every interaction.' },
    { name: 'Web Experiences', desc: 'Sites that perform and convert beautifully.' },
    { name: 'Campaign Direction', desc: 'Creative strategy from concept to launch.' },
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
              <div className="card-icon" />
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
const Pricing = () => {
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

  return (
    <section id="pricing" ref={sectionRef} className="pricing">
      <div className="container">
        <h2 className="font-display" style={{ fontSize: '6vw', marginBottom: 'var(--space-lg)' }}>
          MEMBERSHIP
        </h2>
        <div className="pricing-grid">
          {[
            { name: 'Starter', price: 'Free', color: 'var(--accent-primary)', benefits: ['Brand audit', 'Strategy call', 'Community access'] },
            { name: 'Growth', price: '$2,500/mo', color: 'var(--accent-secondary)', benefits: ['Dedicated designer', 'Weekly sprints', 'Priority support'] },
            { name: 'Partner', price: 'Custom', color: 'var(--accent-tertiary)', benefits: ['Full team embed', 'Quarterly planning', 'White-glove delivery'] },
          ].map((tier) => (
            <div
              key={tier.name}
              className="pricing-card"
              style={{ border: `2px solid ${tier.color}` }}
            >
              <div className="tier-icon" style={{ background: tier.color }} />
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {tier.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {tier.price}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {tier.benefits.map(b => (
                  <li key={b} className="text-muted">• {b}</li>
                ))}
              </ul>
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
        <button
          className="cta-btn"
          style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}
          onClick={audio.playClick}
        >
          Book a Call
        </button>
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
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TW</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>IG</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>LI</span>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2025 Vanta Studio. All rights reserved.</span>
      <span>Built with Kimi K2.6</span>
    </div>
  </footer>
);

/* ===== APP ===== */
function App() {
  const audio = useAudio();

  return (
    <div className="app">
      <CustomCursor />
      <CursorTrail />
      <Navbar audio={audio} />
      <Hero />
      <NoBoringBrands />
      <Services audio={audio} />
      <Pricing />
      <ValuesMarquee />
      <CTA audio={audio} />
      <Footer />
    </div>
  );
}

export default App;