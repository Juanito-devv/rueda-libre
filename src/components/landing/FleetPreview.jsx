import { useState } from 'react';
import { vehicles } from '../../data/vehicles';
import Link from 'next/link';

const tabs = [
  { id: 'all', name: 'Todos' },
  { id: 'sedan', name: 'Eficientes' },
  { id: 'camioneta', name: 'Camionetas' },
  { id: 'suv', name: 'SUVs' },
];

export default function FleetPreview() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredVehicles = activeTab === 'all'
    ? vehicles.slice(0, 4)
    : vehicles.filter(v => v.category === activeTab).slice(0, 4);

  return (
    <section className="py-section-gap relative" id="fleet">
      <div className="absolute inset-0 bg-surface-container-low/50 skew-y-3 -z-10 transform origin-top-left"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <h2 className="font-headline-xl text-headline-xl mb-6">
          Flota <span className="gradient-text">Destacada</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-16 text-lg uppercase tracking-widest">
          Descubre nuestros vehículos más populares
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-full font-label-bold text-label-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg shadow-primary/20'
                  : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white hover:border-primary/50 backdrop-blur-sm'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {filteredVehicles.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/booking?id=${vehicle.id}`}
              className="glass-panel rounded-3xl overflow-hidden hover-lift group text-left flex flex-col border border-white/10 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none"></div>
              <div className="h-56 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={vehicle.image}
                  alt={vehicle.name}
                />
              </div>
              <div className="p-8 flex-1 flex flex-col justify-end relative z-20 -mt-16">
                <div>
                  <h3 className="font-headline-md text-headline-md text-2xl mb-2 text-white font-black drop-shadow-md">{vehicle.name}</h3>
                  <p className="font-body-md text-body-md text-sm text-primary uppercase tracking-widest mb-6 font-bold">{vehicle.type}</p>
                </div>
                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                  <p className="text-white font-display-lg text-3xl font-black">
                    ${vehicle.dailyRate}
                    <span className="text-xs font-label-bold text-on-surface-variant uppercase tracking-widest ml-1"> / día</span>
                  </p>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-surface transition-colors border border-white/10">
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/catalog"
          className="inline-block gold-btn text-surface font-label-bold text-label-bold px-12 py-5 rounded-full transition-all shadow-[0_0_20px_rgba(242,202,80,0.2)] hover:shadow-[0_0_30px_rgba(255,140,0,0.4)] tracking-widest font-black"
        >
          VER TODA LA FLOTA
        </Link>
      </div>
    </section>
  );
}