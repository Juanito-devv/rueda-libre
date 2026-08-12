import { useState } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function HeroSection() {
  const [clientType, setClientType] = useState('particular');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Redirigir al catálogo con los filtros
    window.location.href = `/catalog?type=${clientType}&pickup=${pickupDate}&return=${returnDate}&location=${location}`;
  };
  
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-charcoal via-slate-900 to-brand-darkred">
      {/* Overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] bg-repeat"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
            Muévete con <span className="text-brand-red">confianza</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-gray mb-4 animate-fade-in">
            A empresas y particulares, tu mejor opción para avanzar
          </p>
          <p className="text-lg text-brand-light/80 mb-8 animate-fade-in">
            Buen servicio, sin complicaciones
          </p>
          
          <button 
            onClick={() => window.location.href = '/catalog'}
            className="bg-brand-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-darkred transition-all transform hover:scale-105 shadow-2xl animate-fade-in"
          >
            Reservar por día
          </button>
        </div>
        
        {/* Quick Search Widget */}
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 animate-slide-up">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Client Type Selector */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setClientType('particular')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  clientType === 'particular'
                    ? 'bg-brand-red text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Users className="inline-block mr-2 h-5 w-5" />
                Particular
              </button>
              <button
                type="button"
                onClick={() => setClientType('empresa')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  clientType === 'empresa'
                    ? 'bg-brand-red text-white shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Users className="inline-block mr-2 h-5 w-5" />
                Empresa
              </button>
            </div>
            
            {/* Date and Location Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-red h-5 w-5" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Fecha de recogida"
                />
              </div>
              
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-red h-5 w-5" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Fecha de entrega"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-red h-5 w-5" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Ubicación o punto de entrega"
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-brand-red text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-darkred transition-all transform hover:scale-[1.02] mt-4"
            >
              Buscar disponibilidad
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}