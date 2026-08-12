import { useState } from 'react';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import { vehicles } from '../src/data/vehicles';
import Link from 'next/link';
import Image from 'next/image';

export default function Catalog() {
  const [filters, setFilters] = useState({
    category: 'all',
    maxPrice: 100
  });

  const filteredVehicles = vehicles.filter(v => {
    if (filters.category !== 'all' && v.category !== filters.category) return false;
    if (v.dailyRate > filters.maxPrice) return false;
    return true;
  });

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'sedan', name: 'Sedanes' },
    { id: 'suv', name: 'SUVs' },
    { id: 'camioneta', name: 'Camionetas' },
    { id: 'van', name: 'Vans' },
  ];

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Nuestra <span className="text-brand-red">Flota</span>
            </h1>
            <p className="text-xl text-gray-400">
              Encuentra el vehículo perfecto para ti
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilters({ ...filters, category: cat.id })}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filters.category === cat.id
                    ? 'bg-brand-red text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Vehicles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(vehicle => (
              <Link href={`/booking?id=${vehicle.id}`} key={vehicle.id} className="card p-6 group cursor-pointer block">
                <div className="w-full h-48 rounded-xl mb-4 overflow-hidden">
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{vehicle.name}</h3>
                <p className="text-gray-400 mb-4">{vehicle.type}</p>
                <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-400">
                  <span>⚙️ {vehicle.transmission}</span>
                  <span>⛽ {vehicle.fuel}</span>
                  <span>👥 {vehicle.capacity} pasajeros</span>
                  <span>📦 {vehicle.cargo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-brand-red">${vehicle.dailyRate}</span>
                  <span className="text-gray-400">/ día</span>
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