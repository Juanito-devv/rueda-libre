import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function HeroSection() {
  const router = useRouter();
  const [clientType, setClientType] = useState('particular');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    router.push('/catalog');
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-orange/10 via-background to-background opacity-50"></div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-20 w-full flex flex-col md:flex-row items-center justify-between gap-stack-lg">
        <div className="w-full md:w-1/2 space-y-8 text-center md:text-left relative">
          <div className="absolute -left-10 -top-10 text-9xl font-black text-white/5 select-none -z-10">RL</div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg leading-none">
            Muévete con <br /><span className="gradient-text">confianza</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto md:mx-0 text-lg">
            A empresas y particulares, tu mejor opción para avanzar. Buen servicio, sin complicaciones. Tu próximo destino empieza aquí.
          </p>
          <div className="pt-6">
            <Link
              href="/catalog"
              className="font-label-bold text-label-bold gold-btn px-10 py-5 rounded-full transition-all duration-300 animate-pulse-glow text-sm tracking-widest font-black"
            >
              RESERVAR AHORA
            </Link>
          </div>
        </div>

        <div className="w-full md:w-5/12 glass-panel-luxury rounded-3xl p-10 shadow-2xl relative z-30 mt-12 md:mt-0 border border-primary/20">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-30"></div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex rounded-xl overflow-hidden bg-surface-dim/80 p-1 mb-8">
              <button
                type="button"
                onClick={() => setClientType('particular')}
                className={`flex-1 py-3.5 text-center font-label-bold text-label-bold rounded-lg shadow-lg transition-colors ${
                  clientType === 'particular'
                    ? 'bg-gradient-to-r from-primary to-accent-orange text-surface'
                    : 'bg-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                Particular
              </button>
              <button
                type="button"
                onClick={() => setClientType('empresa')}
                className={`flex-1 py-3.5 text-center font-label-bold text-label-bold rounded-lg transition-colors ${
                  clientType === 'empresa'
                    ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                    : 'bg-transparent text-on-surface-variant hover:text-white'
                }`}
              >
                Empresa
              </button>
            </div>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-accent-orange transition-colors">
                calendar_today
              </span>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm"
                placeholder="Fecha de inicio"
              />
            </div>

            <div className="relative group">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary group-focus-within:text-accent-orange transition-colors">
                calendar_month
              </span>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm"
                placeholder="Fecha de fin"
              />
            </div>

            <button
              type="submit"
              className="w-full font-label-bold text-label-bold gold-btn py-5 rounded-xl mt-6 transition-all duration-300 text-sm tracking-widest font-black shadow-[0_0_20px_rgba(242,202,80,0.3)] hover:shadow-[0_0_30px_rgba(255,140,0,0.5)]"
            >
              BUSCAR DISPONIBILIDAD
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}