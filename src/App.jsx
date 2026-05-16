import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
// Keep all your other imports exactly as they were before
// (Don't delete anything you already had)

function App() {
  const [dark, setDark] = useState(false);

  // Toggle dark mode class on <html> tag
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Dark Mode Toggle Button */}
      <button
        onClick={() => setDark(!dark)}
        className="theme-toggle"
        aria-label="Toggle dark mode"
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Sound Toggle (placeholder for now) */}
      <button className="sound-toggle">
        Sound Off
      </button>

      {/* Your sections */}
      <HeroSection />
      
      {/* Put all your other sections back here in order */}
      {/* Example: */}
      {/* <Manifesto /> */}
      {/* <Studio /> */}
      {/* <Process /> */}
      {/* <Philosophy /> */}
      {/* <Capabilities /> */}
      {/* <FeaturedProject /> */}
      {/* <Impact /> */}
      {/* <Testimonials /> */}
      {/* <ValuesMarquee /> */}
      {/* <CTA /> */}
      {/* <Footer /> */}
    </div>
  );
}

export default App;