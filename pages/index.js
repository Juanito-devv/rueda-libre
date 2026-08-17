import Header from '../src/components/layout/Header';
import HeroSection from '../src/components/landing/HeroSection';
import ValueProps from '../src/components/landing/ValueProps';
import FleetPreview from '../src/components/landing/FleetPreview';
import Benefits from '../src/components/landing/Benefits';
import StarlinkSection from '../src/components/landing/StarlinkSection';
import Segments from '../src/components/landing/Segments';
import HowItWorks from '../src/components/landing/HowItWorks';
import CTASection from '../src/components/landing/CTASection';
import Footer from '../src/components/layout/Footer';
import WhatsAppButton from '../src/components/layout/WhatsAppButton';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="bg-orb w-96 h-96 bg-primary/10 top-0 left-0 animate-float"></div>
      <div className="bg-orb w-96 h-96 bg-accent-orange/10 bottom-0 right-0 animate-float-delayed"></div>
      <div className="bg-orb w-64 h-64 bg-error/10 top-1/2 left-1/4 animate-float"></div>

      <Header />
      <main>
        <HeroSection />
        <ValueProps />
        <FleetPreview />
        <Benefits />
        <StarlinkSection />
        <Segments />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}