import Link from 'next/link';

export default function CTASection() {
  return (
    <section id="contact" className="py-32 relative overflow-hidden bg-surface-container-lowest border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-primary/10 to-accent-orange/5 rounded-full blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-8 leading-tight">
          Tu próximo destino <br /><span className="gradient-text">empieza aquí</span>
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-16 max-w-2xl mx-auto text-xl">
          ¿Listo para moverte? Contáctanos ahora y coordina tu vehículo en minutos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a
            href="https://wa.me/584129706050"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#1da851] text-white font-label-bold text-label-bold px-10 py-5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)] font-black tracking-widest w-full sm:w-auto animate-pulse-glow"
            style={{ animationName: 'pulse-green' }}
          >
            <span className="material-symbols-outlined text-2xl">chat</span>
            RESERVAR POR WHATSAPP
          </a>
          <Link
            href="/catalog"
            className="font-label-bold text-label-bold glass-panel text-white px-10 py-5 rounded-full hover:bg-white/10 transition-colors border border-white/20 font-black tracking-widest w-full sm:w-auto text-center"
          >
            VER CATÁLOGO
          </Link>
        </div>
      </div>
    </section>
  );
}