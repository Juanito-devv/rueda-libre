import { Shield, Heart, DollarSign } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: "Confort",
    description: "Vehículo limpio, cómodo y preparado para que solo te preocupes por disfrutar el camino.",
    color: "from-red-500 to-red-700"
  },
  {
    icon: Shield,
    title: "Confianza",
    description: "Proceso transparente, soporte oportuno y unidades revisadas para tu tranquilidad.",
    color: "from-blue-500 to-blue-700"
  },
  {
    icon: DollarSign,
    title: "Accesibilidad",
    description: "Tarifas claras por día sin complicaciones. Lo que ves es lo que pagas.",
    color: "from-green-500 to-green-700"
  }
];

export default function ValueProps() {
  return (
    <section className="py-20 bg-brand-slate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestra <span className="text-brand-red">Propuesta</span>
          </h2>
          <p className="text-xl text-brand-gray">
            Tres pilares que definen nuestra forma de servirte
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative bg-brand-charcoal rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 border border-white/10 hover:border-brand-red/50"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-red/30 transition-colors">
                    <Icon className="h-8 w-8 text-brand-red" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-brand-gray leading-relaxed">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}