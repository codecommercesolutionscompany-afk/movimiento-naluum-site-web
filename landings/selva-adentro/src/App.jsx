import { useEffect, useState } from 'react';
import SEOHelmet from './components/SEOHelmet.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import AffinityFilter from './components/AffinityFilter.jsx';
import SpecialSection from './components/SpecialSection.jsx';
import IncludesSection from './components/IncludesSection.jsx';
import MainLayout from './components/MainLayout.jsx';
import FormationSection from './components/FormationSection.jsx';
import FacilitatorsSection from './components/FacilitatorsSection.jsx';
import PlaceSection from './components/PlaceSection.jsx';
import InvestmentSection from './components/InvestmentSection.jsx';
import LodgingPaymentSection from './components/LodgingPaymentSection.jsx';
import FiltersSection from './components/FiltersSection.jsx';
import TestimonialsSection from './components/TestimonialsSection.jsx';
import FAQSection from './components/FAQSection.jsx';
import FinalCTA from './components/FinalCTA.jsx';
import { selvaAdentroContent } from './data/selvaAdentroContent.js';
import { pushEventPageContext } from './utils/whatsapp.js';

const App = () => {
  const [showDeferredContent, setShowDeferredContent] = useState(false);

  useEffect(() => {
    pushEventPageContext();
  }, []);

  useEffect(() => {
    const reveal = () => setShowDeferredContent(true);
    const timer = window.setTimeout(reveal, 4200);
    const events = ['scroll', 'pointerdown', 'keydown', 'touchstart'];

    events.forEach((eventName) =>
      window.addEventListener(eventName, reveal, { once: true, passive: true })
    );

    return () => {
      window.clearTimeout(timer);
      events.forEach((eventName) => window.removeEventListener(eventName, reveal));
    };
  }, []);

  return (
    <div className="sa-page">
      <SEOHelmet content={selvaAdentroContent.seo} />
      <Header content={selvaAdentroContent.header} />
      <Hero content={selvaAdentroContent.hero} assets={selvaAdentroContent.assets} />
      {showDeferredContent ? (
        <>
          <AffinityFilter content={selvaAdentroContent.affinity} />
          <SpecialSection content={selvaAdentroContent.special} assets={selvaAdentroContent.assets} />
          <IncludesSection content={selvaAdentroContent.includes} />
          <MainLayout content={selvaAdentroContent.mainLayout} pricing={selvaAdentroContent.pricing} />
          <FormationSection content={selvaAdentroContent.formation} />
          <FacilitatorsSection content={selvaAdentroContent.facilitators} />
          <PlaceSection content={selvaAdentroContent.place} assets={selvaAdentroContent.assets} />
          <InvestmentSection content={selvaAdentroContent.investment} pricing={selvaAdentroContent.pricing} />
          <LodgingPaymentSection content={selvaAdentroContent.lodgingPayment} />
          <FiltersSection content={selvaAdentroContent.filters} />
          <TestimonialsSection content={selvaAdentroContent.testimonials} />
          <FAQSection content={selvaAdentroContent.faq} />
          <FinalCTA content={selvaAdentroContent.finalCta} />
        </>
      ) : null}
    </div>
  );
};

export default App;
