const values = [
  {
    icon: 'favorite',
    title: 'Confort',
    description: 'Vehículo limpio, cómodo y preparado para que solo te preocupes por disfrutar el camino.',
    orbClass: 'bg-error/10 group-hover:bg-error/20',
    iconBoxClass: 'from-error/20 to-error/5 border-error/20',
    iconClass: 'text-error',
  },
  {
    icon: 'verified_user',
    title: 'Confianza',
    description: 'Proceso transparente, soporte oportuno y unidades revisadas para tu tranquilidad.',
    orbClass: 'bg-primary/10 group-hover:bg-primary/20',
    iconBoxClass: 'from-primary/20 to-primary/5 border-primary/30',
    iconClass: 'text-primary',
  },
  {
    icon: 'payments',
    title: 'Accesibilidad',
    description: 'Tarifas claras por día sin complicaciones. Lo que ves es lo que pagas.',
    orbClass: 'bg-tertiary/10 group-hover:bg-tertiary/20',
    iconBoxClass: 'from-tertiary/20 to-tertiary/5 border-tertiary/20',
    iconClass: 'text-tertiary',
  },
];

export default function ValueProps() {
  return (
    <section className="py-section-gap relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <h2 className="font-headline-xl text-headline-xl mb-6">
          Nuestra <span className="gradient-text">Propuesta</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-20 text-lg uppercase tracking-widest">
          Tres pilares que definen nuestra forma de servirte
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className={`glass-panel p-10 rounded-3xl hover-lift text-left border relative overflow-hidden group ${
                value.iconClass === 'text-primary'
                  ? 'border-primary/20 shadow-[0_0_30px_rgba(242,202,80,0.1)]'
                  : 'border-white/5'
              }`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl transition-colors ${value.orbClass}`}></div>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br border flex items-center justify-center mb-8 shadow-inner ${value.iconBoxClass}`}>
                <span className={`material-symbols-outlined text-4xl ${value.iconClass}`}>{value.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-4 text-on-surface font-black">{value.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}