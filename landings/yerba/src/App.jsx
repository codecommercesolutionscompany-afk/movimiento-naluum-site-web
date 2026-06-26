import React, { useEffect } from 'react';
import yerbaData from './data/yerba.json';
import Hero from './components/Hero.jsx';
import Origin from './components/Origin.jsx';
import Gallery from './components/Gallery.jsx';
import Differentials from './components/Differentials.jsx';
import Testimonials from './components/Testimonials.jsx';
import Process from './components/Process.jsx';
import Pricing from './components/Pricing.jsx';
import FAQ from './components/FAQ.jsx';
import CTA from './components/CTA.jsx';
import { captureYerbaUtmParams } from './utils/whatsapp.js';

function App() {
  const data = yerbaData[0];

  useEffect(() => {
    captureYerbaUtmParams();
  }, []);

  return (
    <div className="yerba-page">
      <Hero data={data} />
      <Origin data={data} />
      <Differentials data={data} />
      <Gallery data={data} />
      <Process data={data} />
      <Pricing data={data} />
      <Testimonials data={data} />
      <FAQ data={data} />
      <CTA data={data} />
    </div>
  );
}

export default App;
