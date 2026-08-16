const benefits = [
  { icon: 'touch_app', title: 'Reserva sencilla', description: 'Proceso 100% en línea, rápido y sin papeleo innecesario.' },
  { icon: 'local_shipping', title: 'Entrega conveniente', description: 'Llevamos el vehículo donde lo necesites, cuando lo necesites.' },
  { icon: 'support_agent', title: 'Atención humana', description: 'Soporte personalizado antes, durante y después de tu alquiler.' },
  { icon: 'event_available', title: 'Para cada ocasión', description: 'Desde un día de diligencias hasta proyectos de semanas.' },
];

export default function Benefits() {
  return (
    <section className="py-section-gap relative overflow-hidden">
      <div className="absolute right-0 top-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="text-center mb-24">
          <h2 className="font-headline-xl text-headline-xl mb-6">
            Beneficios <span className="gradient-text">Clave</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-lg uppercase tracking-widest">
            Lo que nos hace diferentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="absolute top-16 left-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block"></div>

          {benefits.map((benefit, index) => (
            <div key={index} className={`text-center relative z-10 group ${index % 2 === 1 ? 'mt-0 md:mt-12' : ''}`}>
              <div className="w-32 h-32 mx-auto glass-panel rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:border-primary/50 transition-all duration-500 shadow-xl group-hover:shadow-primary/20 relative">
                <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                <span className="material-symbols-outlined text-primary text-5xl z-10">{benefit.icon}</span>
              </div>
              <span className="text-primary font-label-bold text-label-bold text-sm block mb-4 tracking-widest">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="font-headline-md text-headline-md text-xl mb-4 text-white font-bold">{benefit.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}