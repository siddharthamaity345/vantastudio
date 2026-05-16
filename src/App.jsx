import { useState, useEffect, useRef } from 'react';
import HeroSection from './HeroSection';
import ManifestoSection from './ManifestoSection';
import StudioSection from './StudioSection';
import ProcessSection from './ProcessSection';
import PhilosophySection from './PhilosophySection';
import MarqueeSection from './MarqueeSection';

// If you still have old sections you haven't replaced yet, keep importing them:
// import Capabilities from './Capabilities';
// import CTA from './CTA';
// import Footer from './Footer';
// etc.

function App() {
  const [dark, setDark] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef(null);

  // Toggle dark mode class on <html>
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  // Initialize audio context on first user interaction
  const enableAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setSoundOn(true);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-primary)',
        transition: 'background 0.6s ease',
        minHeight: '100vh',
      }}
    >
      {/* ===== GLOBAL TOGGLES ===== */}

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="theme-toggle"
        aria-label="Toggle dark mode"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '6.5rem',
          zIndex: 9999,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          border: '1px solid var(--border-strong)',
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15) rotate(20deg)';
          e.currentTarget.style.borderColor = 'var(--accent-yellow)';
          e.currentTarget.style.boxShadow = 'var(--glow-yellow)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.borderColor = 'var(--border-strong)';
          e.currentTarget.style.boxShadow = 'var(--shadow)';
        }}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Sound Toggle */}
      <button
        onClick={() => {
          if (!soundOn) enableAudio();
          else setSoundOn(false);
        }}
        className="sound-toggle"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          padding: '0.6rem 1.2rem',
          borderRadius: '999px',
          border: `1px solid ${soundOn ? 'var(--accent-yellow)' : 'var(--border-strong)'}`,
          background: 'var(--surface)',
          backdropFilter: 'blur(12px)',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: soundOn ? 'var(--accent-yellow)' : 'var(--text-muted)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: soundOn ? 'var(--glow-yellow)' : 'var(--shadow)',
        }}
        onMouseEnter={(e) => {
          if (!soundOn) {
            e.currentTarget.style.borderColor = 'var(--accent-blue)';
            e.currentTarget.style.color = 'var(--accent-blue)';
          }
        }}
        onMouseLeave={(e) => {
          if (!soundOn) {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }
        }}
      >
        {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
      </button>

      {/* ===== SECTIONS ===== */}

      <HeroSection />

      <div
        className="section-transition"
        style={{
          height: '1px',
          background: 'var(--gradient-hero)',
          opacity: 0.15,
          margin: 0,
          border: 'none',
        }}
      />

      <ManifestoSection />

      <div
        className="section-transition"
        style={{
          height: '1px',
          background: 'var(--gradient-hero)',
          opacity: 0.15,
          margin: 0,
          border: 'none',
        }}
      />

      <StudioSection />

      <div
        className="section-transition"
        style={{
          height: '1px',
          background: 'var(--gradient-hero)',
          opacity: 0.15,
          margin: 0,
          border: 'none',
        }}
      />

      <ProcessSection />

      <div
        className="section-transition"
        style={{
          height: '1px',
          background: 'var(--gradient-hero)',
          opacity: 0.15,
          margin: 0,
          border: 'none',
        }}
      />

      <PhilosophySection />

      <div
        className="section-transition"
        style={{
          height: '1px',
          background: 'var(--gradient-hero)',
          opacity: 0.15,
          margin: 0,
          border: 'none',
        }}
      />

      <MarqueeSection />

      {/* ===== OLD SECTIONS (keep until you replace them) ===== */}
      {/* 
      <div className="section-transition" style={{height:'1px', background:'var(--gradient-hero)', opacity:0.15, margin:0, border:'none'}} />
      <Capabilities />
      
      <div className="section-transition" style={{height:'1px', background:'var(--gradient-hero)', opacity:0.15, margin:0, border:'none'}} />
      <CTA audio={audioCtxRef.current} />
      
      <div className="section-transition" style={{height:'1px', background:'var(--gradient-hero)', opacity:0.15, margin:0, border:'none'}} />
      <Footer />
      */}
    </div>
  );
}

export default App;