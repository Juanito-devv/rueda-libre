import { Search, Phone, ThumbsUp } from 'lucide-react';

const steps = [
  {
    number: "1",
    icon: Search,
    title: "Elige",
    description: "Explora nuestra flota y selecciona el vehículo ideal para tu necesidad."
  },
  {
    number: "2",
    icon: Phone,
    title: "Coordina",
    description: "Confirma disponibilidad, fecha de entrega y lugar por WhatsApp."
  },
  {
    number: "3",
    icon: ThumbsUp,
    title: "Disfruta",
    description: "Recibe tu vehículo y muévete con total confianza y libertad."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cómo <span className="text-brand-red">Funciona</span>
          </h2>
          <p className="text-xl text-gray-400">
            En tres simples pasos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-brand-red/30"></div>
                )}
                
                <div className="w-24 h-24 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <Icon className="h-12 w-12 text-white" />
                </div>
                <div className="text-brand-red text-lg font-bold mb-2">Paso {step.number}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}