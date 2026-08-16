import { useState } from 'react';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import { vehicles } from '../src/data/vehicles';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'sedan', name: 'Sedanes' },
  { id: 'suv', name: 'SUVs' },
  { id: 'camioneta', name: 'Camionetas' },
  { id: 'van', name: 'Vans' },
];

export default function Catalog() {
  const [category, setCategory] = useState('all');

  const filteredVehicles = vehicles.filter(v => category === 'all' || v.category === category);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      <main className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h1 className="font-headline-xl text-headline-xl mb-6">
              Nuestra <span className="gradient-text">Flota</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant text-lg uppercase tracking-widest">
              Encuentra el vehículo perfecto para ti
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-8 py-3 rounded-full font-label-bold text-label-bold transition-all ${
                  category === cat.id
                    ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg shadow-primary/20'
                    : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white hover:border-primary/50 backdrop-blur-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map(vehicle => (
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
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-end relative z-20 -mt-16">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-2xl mb-2 text-white font-black drop-shadow-md">{vehicle.name}</h3>
                    <p className="font-body-md text-body-md text-sm text-primary uppercase tracking-widest mb-4 font-bold">{vehicle.type}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-on-surface-variant font-body-md">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">settings</span>
                      {vehicle.transmission}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">local_gas_station</span>
                      {vehicle.fuel}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">group</span>
                      {vehicle.capacity} pasajeros
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-base">inventory_2</span>
                      {vehicle.cargo}
                    </span>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}