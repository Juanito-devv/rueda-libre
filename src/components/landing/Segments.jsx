import { User, Building2, CheckCircle } from 'lucide-react';

export default function Segments() {
  return (
    <section className="py-20 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿A quién <span className="text-brand-red">ayudamos</span>?
          </h2>
          <p className="text-xl text-gray-400">
            Soluciones de movilidad para cada necesidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Particulares */}
          <div className="card p-8 border-brand-red/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
                <User className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold text-white">Particulares</h3>
            </div>
            <div className="space-y-4">
              {['Viajes y disfrute', 'Diligencias personales', 'Reemplazo temporal'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-brand-red flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Empresas */}
          <div className="card p-8 border-brand-red/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
                <Building2 className="h-8 w-8 text-brand-red" />
              </div>
              <h3 className="text-2xl font-bold text-white">Empresas</h3>
            </div>
            <div className="space-y-4">
              {['Traslados de equipos', 'Proyectos y obras', 'Flota de apoyo'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-brand-red flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}