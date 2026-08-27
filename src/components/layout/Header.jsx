import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#fleet', label: 'Flota' },
  { href: '/catalog', label: 'Servicios' },
  { href: '#how-it-works', label: 'Cómo Funciona' },
  { href: '#contact', label: 'Contacto' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all duration-300">
      <div className="max-w-container-max mx-auto flex justify-between items-center px-margin-mobile md:px-margin-desktop h-24">
        <Link
          href="/"
          className="font-display-lg-mobile md:text-3xl text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange tracking-tighter"
        >
          RUEDA LIBRE
        </Link>

        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest text-sm luxury-border pb-1"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <Link
            href="/catalog"
            className="hidden lg:block font-label-bold text-label-bold gold-btn px-8 py-3.5 rounded-full shadow-lg hover:shadow-primary/30 transition-all duration-300 text-xs tracking-widest font-black"
          >
            RESERVAR AHORA
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-primary"
            aria-label="Menú"
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-white/10 bg-background/95 backdrop-blur-2xl">
          <div className="px-margin-mobile py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors tracking-widest text-sm"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/catalog"
              onClick={() => setIsOpen(false)}
              className="font-label-bold text-label-bold gold-btn px-8 py-3.5 rounded-full text-center text-xs tracking-widest font-black"
            >
              RESERVAR AHORA
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}