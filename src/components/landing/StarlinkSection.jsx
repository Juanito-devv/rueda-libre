import Link from 'next/link';

const perks = [
  'Internet de alta velocidad en cualquier ruta',
  'Ideal para trabajo remoto y videollamadas',
  'Streaming, navegación y mapas en tiempo real',
  'Perfecto para viajes largos, eventos y logística',
];

export default function StarlinkSection() {
  return (
    <section className="py-section-gap relative overflow-hidden" id="starlink">
      <div className="absolute inset-0 bg-surface-container-lowest/60 -z-10"></div>
      <div className="absolute left-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-16 relative overflow-hidden border border-primary/20">
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-20"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-8">
                <span className="material-symbols-outlined text-primary text-base">star</span>
                <span className="font-label-bold text-label-bold text-primary tracking-widest text-xs">SERVICIO PREMIUM</span>
              </div>

              <h2 className="font-headline-xl text-[clamp(2rem,7vw,3.5rem)] leading-[1.15] tracking-[-0.02em] md:text-headline-xl mb-6">
                Conectividad <span className="gradient-text">Starlink</span>
              </h2>

              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 text-lg">
                Internet satelital de alta velocidad instalado en tu vehículo. Trabaja, transmite o navega desde cualquier ruta de Venezuela, incluso donde no hay señal.
              </p>

              <ul className="space-y-4 mb-10">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-on-surface font-body-md">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  href="/catalog"
                  className="gold-btn font-label-bold text-label-bold w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full tracking-widest text-xs font-black text-center shadow-[0_0_20px_rgba(242,202,80,0.2)]"
                >
                  RESERVAR CON STARLINK
                </Link>
                <span className="font-body-md text-on-surface-variant">
                  Disponible como servicio adicional · <span className="text-primary font-bold">+$30/día</span>
                </span>
              </div>
            </div>

            <div className="text-center hidden md:block">
              <div className="w-64 h-64 mx-auto glass-panel rounded-full flex items-center justify-center border border-primary/30 relative">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"></div>
                <span className="material-symbols-outlined text-primary text-7xl z-10">satellite_alt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}