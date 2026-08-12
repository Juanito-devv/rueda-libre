import Link from 'next/link';

export default function CTASection() {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-brand-charcoal to-brand-darkred">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Tu próximo destino <span className="text-brand-red">empieza aquí</span>
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          ¿Listo para moverte? Contáctanos ahora y coordina tu vehículo en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/584123456789" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary text-center text-lg"
          >
            📱 Reservar por WhatsApp
          </a>
          <Link href="/catalog" className="bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all text-center border border-white/20">
            Ver Catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}