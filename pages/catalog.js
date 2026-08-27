import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
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

const segments = [
  { id: 'all', name: 'Particulares y Empresas' },
  { id: 'particular', name: 'Particulares' },
  { id: 'empresa', name: 'Empresas' },
];

const segmentLabel = {
  particular: 'Particulares',
  empresa: 'Empresas',
};

export default function Catalog() {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [segment, setSegment] = useState('all');

  useEffect(() => {
    if (!router.isReady) return;
    const tipo = router.query.tipo;
    if (tipo === 'particular' || tipo === 'empresa') {
      setSegment(tipo);
    } else {
      setSegment('all');
    }
  }, [router.isReady, router.query.tipo]);

  const filteredVehicles = vehicles.filter(v => {
    const matchesCategory = category === 'all' || v.category === category;
    const matchesSegment = segment === 'all' || (v.segment || []).includes(segment);
    return matchesCategory && matchesSegment;
  });

  const searchFrom = router.query.desde;
  const searchTo = router.query.hasta;
  const hasSearch = searchFrom || searchTo;

  const clearFilters = () => {
    setCategory('all');
    setSegment('all');
    Router.replace('/catalog');
  };

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

          {hasSearch && (
            <div className="glass-panel rounded-2xl border border-primary/20 p-5 mb-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-on-surface-variant font-body-md">
                <span className="material-symbols-outlined text-primary">search</span>
                <span>
                  Disponibilidad consultada:
                  {searchFrom && <span className="text-white font-bold"> del {searchFrom}</span>}
                  {searchTo && <span className="text-white font-bold"> al {searchTo}</span>}
                  {segment !== 'all' && (
                    <span className="text-primary font-bold"> · para {segmentLabel[segment]}</span>
                  )}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="font-label-bold text-label-bold text-primary hover:text-white transition-colors tracking-widest text-xs uppercase"
              >
                Ver todos
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {segments.map(seg => (
              <button
                key={seg.id}
                onClick={() => setSegment(seg.id)}
                className={`px-8 py-3 rounded-full font-label-bold text-label-bold transition-all ${
                  segment === seg.id
                    ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg shadow-primary/20'
                    : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white hover:border-primary/50 backdrop-blur-sm'
                }`}
              >
                {seg.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-8 py-3 rounded-full font-label-bold text-label-bold transition-all ${
                  category === cat.id
                    ? 'bg-surface/50 border border-primary/60 text-white shadow-lg shadow-primary/10'
                    : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white hover:border-primary/50 backdrop-blur-sm'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-primary block mb-4">search_off</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                No encontramos vehículos con esos filtros.
              </p>
              <button
                onClick={clearFilters}
                className="inline-block gold-btn font-label-bold text-label-bold px-10 py-4 rounded-full tracking-widest text-xs font-black"
              >
                VER TODOS LOS VEHÍCULOS
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}