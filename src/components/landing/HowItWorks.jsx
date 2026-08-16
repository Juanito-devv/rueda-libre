const steps = [
  {
    icon: 'search',
    title: 'Elige',
    description: 'Explora nuestra flota y selecciona el vehículo ideal para tu necesidad.',
    highlight: false,
    labelClass: 'text-primary',
  },
  {
    icon: 'chat',
    title: 'Coordina',
    description: 'Confirma disponibilidad, fecha de entrega y lugar por WhatsApp.',
    highlight: true,
    labelClass: 'text-primary',
  },
  {
    icon: 'directions_car',
    title: 'Disfruta',
    description: 'Recibe tu vehículo y muévete con total confianza y libertad.',
    highlight: false,
    labelClass: 'text-accent-orange',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-section-gap relative" id="how-it-works">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <h2 className="font-headline-xl text-headline-xl mb-6">
          Cómo <span className="gradient-text">Funciona</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-20 text-lg uppercase tracking-widest">
          En tres simples pasos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="absolute top-24 left-[10%] w-[80%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block z-0"></div>

          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative z-10 glass-panel p-10 rounded-3xl ${
                step.highlight
                  ? 'border-primary/20 md:mt-12 shadow-[0_0_30px_rgba(242,202,80,0.1)]'
                  : 'border-white/5 hover:border-primary/30 transition-colors'
              }`}
            >
              <div
                className={`w-24 h-24 mx-auto flex items-center justify-center mb-8 shadow-xl relative ${
                  step.highlight
                    ? 'bg-gradient-to-br from-primary to-accent-orange rounded-2xl shadow-lg shadow-primary/30'
                    : 'bg-gradient-to-br from-surface to-surface-bright border border-white/10 rounded-2xl'
                }`}
              >
                <div className={`absolute inset-0 blur-xl rounded-2xl -z-10 ${step.highlight ? '' : index === 0 ? 'bg-primary/20' : 'bg-accent-orange/20'}`}></div>
                <span className={`material-symbols-outlined text-4xl ${step.highlight ? 'text-surface fill-icon' : step.labelClass}`}>{step.icon}</span>
              </div>
              <span className={`font-label-bold text-label-bold text-sm block mb-4 tracking-widest ${step.labelClass}`}>
                PASO {index + 1}
              </span>
              <h3 className="font-headline-md text-headline-md text-2xl mb-4 text-white font-bold">{step.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}