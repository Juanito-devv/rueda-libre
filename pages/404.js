import Link from 'next/link';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';

export default function Custom404() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Header />

      <main className="py-section-gap">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <span className="material-symbols-outlined text-primary text-8xl block mb-8">explore_off</span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6">
            Página <span className="gradient-text">no encontrada</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto mb-12">
            El enlace que seguiste no existe o fue movido. Vuelve al inicio o explora nuestra flota.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              href="/"
              className="gold-btn font-label-bold text-label-bold px-10 py-5 rounded-full tracking-widest text-xs font-black"
            >
              IR AL INICIO
            </Link>
            <Link
              href="/catalog"
              className="glass-panel text-white px-10 py-5 rounded-full hover:bg-white/10 transition-colors border border-white/20 font-label-bold text-label-bold tracking-widest text-xs font-black"
            >
              VER CATÁLOGO
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}