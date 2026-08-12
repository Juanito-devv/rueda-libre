import { useState } from 'react';
import Header from '../src/components/layout/Header';
import HeroSection from '../src/components/landing/HeroSection';
import ValueProps from '../src/components/landing/ValueProps';
import FleetPreview from '../src/components/landing/FleetPreview';
import Benefits from '../src/components/landing/Benefits';
import Segments from '../src/components/landing/Segments';
import HowItWorks from '../src/components/landing/HowItWorks';
import CTASection from '../src/components/landing/CTASection';
import Footer from '../src/components/layout/Footer';
import WhatsAppButton from '../src/components/layout/WhatsAppButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      <Header />
      <main>
        <HeroSection />
        <ValueProps />
        <FleetPreview />
        <Benefits />
        <Segments />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}