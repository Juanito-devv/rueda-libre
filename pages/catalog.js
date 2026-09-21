import { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import Link from 'next/link';
import { fetchVehicles, fetchActiveReservationRanges } from '../src/lib/vehicles';
import { isRangeFree } from '../src/utils/disponibilidad';

export async function getServerSideProps(ctx) {
  const { desde, hasta } = ctx.query;
  const validDate = (x) => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x);
  const hasRange = validDate(desde) && validDate(hasta);
  const [{ vehicles }, ranges] = await Promise.all([fetchVehicles(), fetchActiveReservationRanges()]);
  let unavailableIds = [];
  if (hasRange) {
    unavailableIds = vehicles
      .filter((v) => {
        const occupied = ranges.filter((r) => r.vehiculo === v.id).map((r) => ({ pickup_date: r.pickup_date.split('T')[0], return_date: r.return_date.split('T')[0] }));
        return !isRangeFree(desde, hasta, occupied);
      })
      .map((v) => v.id);
  }
  return {
    props: {
      vehicles,
      unavailableIds,
      desde: validDate(desde) ? desde : '',
      hasta: validDate(hasta) ? hasta : '',
    },
  };
}

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

export default function Catalog({ vehicles, unavailableIds = [], desde = '', hasta = '' }) {
  const router = useRouter();
  const [category, setCategory] = useState('all');
  const [segment, setSegment] = useState('all');
  const unavailableSet = unavailableIds.length ? new Set(unavailableIds) : null;

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
              {filteredVehicles.map(vehicle => {
                const blocked = unavailableSet ? unavailableSet.has(vehicle.id) : false;
                const card = (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none"></div>
                    <div className="h-56 overflow-hidden relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-100"
                        src={vehicle.image}
                        alt={vehicle.name}
                        loading="lazy"
                        decoding="async"
                      />
                      {blocked && (
                        <span className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur border border-accent-orange/60 text-accent-orange text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full">
                          Reservado en el rango
                        </span>
                      )}
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
                        <div
                          className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 ${
                            blocked ? 'opacity-40' : 'group-hover:bg-primary group-hover:text-surface transition-colors'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </div>
                      </div>

                      {blocked && (
                        <p className="mt-4 text-xs text-on-surface-variant/80 bg-black/40 rounded-xl px-3 py-2.5 border border-white/10">
                          No disponible del <span className="text-white font-bold">{desde}</span> al{' '}
                          <span className="text-white font-bold">{hasta}</span>. Consulta otras fechas o reserva por WhatsApp.
                        </p>
                      )}
                    </div>
                  </>
                );
                return blocked ? (
                  <div key={vehicle.id} className="glass-panel rounded-3xl overflow-hidden text-left flex flex-col border border-accent-orange/20 relative opacity-80">
                    {card}
                  </div>
                ) : (
                  <Link
                    key={vehicle.id}
                    href={`/booking?id=${vehicle.id}${desde ? `&desde=${encodeURIComponent(desde)}` : ''}${hasta ? `&hasta=${encodeURIComponent(hasta)}` : ''}`}
                    className="glass-panel rounded-3xl overflow-hidden hover-lift group text-left flex flex-col border border-white/10 relative"
                  >
                    {card}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}