import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './index.css';

/* ===== NAVBAR ===== */
const Navbar = () => {
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

/* ===== SECTION 2: NO BORING BRANDS ===== */
const NoBoringBrands = () => (
  <section id="noboring" className="no-boring">
    <div className="container">
      <h2 className="font-display" style={{ fontSize: '8vw' }}>
        NO BORING<br />BRANDS.
      </h2>
      <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '480px', marginTop: '2rem' }}>
        We think every brand has an unforgettable version of itself. We find it.
      </p>
    </div>
  </section>
);

/* ===== SECTION 3: SERVICES ===== */
const Services = () => (
  <section id="services" className="services">
    <div className="container">
      <h2 className="font-display" style={{ fontSize: '6vw', marginBottom: 'var(--space-lg)' }}>
        WHAT WE DO
      </h2>
      <div className="services-grid">
        {['Brand Identity', 'Motion Design', 'Web Experiences', 'Campaign Direction'].map((s) => (
          <div key={s} className="service-card">
            <div className="card-icon" />
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {s}
            </h3>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
              One-line description placeholder.
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ===== SECTION 4: PRICING ===== */
const Pricing = () => (
  <section id="pricing" className="pricing">
    <div className="container">
      <h2 className="font-display" style={{ fontSize: '6vw', marginBottom: 'var(--space-lg)' }}>
        MEMBERSHIP
      </h2>
      <div className="pricing-grid">
        {[
          { name: 'Starter', price: 'Free', color: 'var(--accent-primary)' },
          { name: 'Growth', price: '$2,500/mo', color: 'var(--accent-secondary)' },
          { name: 'Partner', price: 'Custom', color: 'var(--accent-tertiary)' },
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
              <li className="text-muted">• Benefit one</li>
              <li className="text-muted">• Benefit two</li>
              <li className="text-muted">• Benefit three</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ===== SECTION 5: VALUES MARQUEE ===== */
const ValuesMarquee = () => (
  <section className="marquee">
    <div className="marquee-track font-display">
      BOLD · HONEST · OBSESSIVE · FAST · CREATIVE · FEARLESS · BOLD · HONEST · OBSESSIVE · FAST · CREATIVE · FEARLESS ·
    </div>
  </section>
);

/* ===== SECTION 6: CTA ===== */
const CTA = () => (
  <section id="contact" className="cta">
    <div className="container">
      <h2 className="font-display" style={{ fontSize: '7vw', marginBottom: '1.5rem' }}>
        READY TO BUILD SOMETHING UNFORGETTABLE?
      </h2>
      <p className="text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Book a call with our team. No decks. No fluff. Just a real conversation.
      </p>
      <button className="cta-btn" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
        Book a Call
      </button>
    </div>
  </section>
);

/* ===== FOOTER ===== */
const Footer = () => (
  <footer>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="logo font-display" style={{ fontSize: '1.25rem' }}>
        VANTA STUDIO
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="#work">Work</a>
        <a href="#studio">Studio</a>
        <a href="#contact">Contact</a>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <span>TW</span>
        <span>IG</span>
        <span>LI</span>
      </div>
    </div>
    <div className="container footer-bottom">
      <span>© 2025 Vanta Studio. All rights reserved.</span>
      <span>Built with Kimi K2.6</span>
    </div>
  </footer>
);

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <NoBoringBrands />
      <Services />
      <Pricing />
      <ValuesMarquee />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;