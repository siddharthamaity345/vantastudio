import { useState, useEffect, useRef } from 'react';
import HeroSection from './HeroSection';
import ManifestoSection from './ManifestoSection';
import StudioSection from './StudioSection';
import ProcessSection from './ProcessSection';
import PhilosophySection from './PhilosophySection';
import MarqueeSection from './MarqueeSection';

function App() {
  const [dark, setDark] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const enableAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    setSoundOn(true);
  };

  const divider = (
    <div style={{ height: '1px', background: 'var(--gradient-hero)', opacity: 0.15, margin: 0, border: 'none' }} />
  );

  return (
    <div style={{ position: 'relative', background: 'var(--bg-primary)', transition: 'background 0.6s ease', minHeight: '100vh' }}>
      
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
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
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Sound Toggle */}
      <button
        onClick={() => { if (!soundOn) enableAudio(); else setSoundOn(false); }}
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
          WebkitBackdropFilter: 'blur(12px)',
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
      >
        {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
      </button>

      <HeroSection />
      {divider}
      <ManifestoSection />
      {divider}
      <StudioSection />
      {divider}
      <ProcessSection />
      {divider}
      <PhilosophySection />
      {divider}
      <MarqueeSection />
    </div>
  );
}

export default App;