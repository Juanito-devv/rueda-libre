const segments = [
  {
    icon: 'person',
    iconClass: 'text-primary group-hover:border-primary/30',
    orbClass: 'bg-primary/5 group-hover:bg-primary/10',
    checkClass: 'bg-primary/10 text-primary',
    title: 'Particulares',
    items: ['Viajes y disfrute', 'Diligencias personales', 'Reemplazo temporal'],
  },
  {
    icon: 'business',
    iconClass: 'text-accent-orange group-hover:border-accent-orange/30',
    orbClass: 'bg-accent-orange/5 group-hover:bg-accent-orange/10',
    checkClass: 'bg-accent-orange/10 text-accent-orange',
    title: 'Empresas',
    items: ['Traslados de equipos', 'Proyectos y obras', 'Flota de apoyo'],
  },
];

export default function Segments() {
  return (
    <section className="py-section-gap relative">
      <div className="absolute inset-0 bg-surface-container-lowest/80 -z-10"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-headline-xl text-headline-xl mb-6">
            ¿A quién <span className="gradient-text">ayudamos</span>?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-lg uppercase tracking-widest">
            Soluciones de movilidad para cada necesidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {segments.map((segment, index) => (
            <div key={index} className="glass-panel p-12 rounded-3xl hover-lift border border-white/5 relative overflow-hidden group">
              <div className={`absolute -right-20 -bottom-20 w-64 h-64 rounded-full blur-3xl transition-all duration-700 ${segment.orbClass}`}></div>
              <div className="flex items-center space-x-6 mb-10 relative z-10">
                <div className={`w-20 h-20 rounded-2xl bg-surface border border-white/10 flex items-center justify-center shadow-lg transition-colors ${segment.iconClass}`}>
                  <span className={`material-symbols-outlined text-4xl ${segment.iconClass.includes('primary') ? 'text-primary' : 'text-accent-orange'}`}>{segment.icon}</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-3xl text-white font-black">{segment.title}</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                {segment.items.map((item, i) => (
                  <li key={i} className="flex items-center space-x-4 text-on-surface-variant text-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${segment.checkClass}`}>
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}