import { MousePointerClick, Truck, Users, Calendar } from 'lucide-react';

const benefits = [
  {
    number: "01",
    icon: MousePointerClick,
    title: "Reserva sencilla",
    description: "Proceso 100% en línea, rápido y sin papeleo innecesario."
  },
  {
    number: "02",
    icon: Truck,
    title: "Entrega conveniente",
    description: "Llevamos el vehículo donde lo necesites, cuando lo necesites."
  },
  {
    number: "03",
    icon: Users,
    title: "Atención humana",
    description: "Soporte personalizado antes, durante y después de tu alquiler."
  },
  {
    number: "04",
    icon: Calendar,
    title: "Para cada ocasión",
    description: "Desde un día de diligencias hasta proyectos de semanas."
  }
];

export default function Benefits() {
  return (
    <section className="py-20 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Beneficios <span className="text-brand-red">Clave</span>
          </h2>
          <p className="text-xl text-gray-400">
            Lo que nos hace diferentes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-red/30 transition-colors">
                  <Icon className="h-10 w-10 text-brand-red" />
                </div>
                <div className="text-brand-red text-sm font-bold mb-2">{benefit.number}</div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}