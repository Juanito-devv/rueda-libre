import { useState } from 'react';
import { vehicles } from '../../data/vehicles';
import Link from 'next/link';

export default function FleetPreview() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredVehicles = activeTab === 'all' 
    ? vehicles.slice(0, 4) 
    : vehicles.filter(v => v.category === activeTab).slice(0, 4);

    const vehicleEmojis = {
  'camioneta': '🛻',
  'sedan': '🚗',
  'suv': '🚙', 
  'van': '🚐',
};

  const tabs = [
    { id: 'all', name: 'Todos' },
    { id: 'sedan', name: 'Eficientes' },
    { id: 'camioneta', name: 'Camionetas' },
    { id: 'suv', name: 'SUVs' },
  ];

  return (
    <section className="py-20 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Flota <span className="text-brand-red">Destacada</span>
          </h2>
          <p className="text-xl text-gray-400">
            Descubre nuestros vehículos más populares
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <Link href={`/booking?id=${vehicle.id}`} key={vehicle.id} className="card p-6 group cursor-pointer block">
              <div className="w-full h-40 bg-gradient-to-br from-brand-red/20 to-brand-darkred/20 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                {vehicle.category === 'camioneta' ? '🛻' : 
                 vehicle.category === 'sedan' ? '🚗' : 
                 vehicle.category === 'suv' ? '🚙' : '🚐'}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{vehicle.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{vehicle.type}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-brand-red">${vehicle.dailyRate}</span>
                <span className="text-gray-400 text-sm">/ día</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/catalog" className="btn-primary">
            Ver toda la flota
          </Link>
        </div>
      </div>
    </section>
  );
}