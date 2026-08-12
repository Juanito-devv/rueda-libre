import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Car } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-charcoal/95 backdrop-blur-sm border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-brand-red" />
            <span className="text-xl font-bold text-white">
              Rueda<span className="text-brand-red">Libre</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-white hover:text-brand-red transition-colors">
              Catálogo
            </Link>
            <Link href="/#how-it-works" className="text-white hover:text-brand-red transition-colors">
              Cómo Funciona
            </Link>
            <Link href="/catalog" className="btn-primary">
              Reservar Ahora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-4">
              <Link href="/catalog" className="text-white hover:text-brand-red transition-colors">
                Catálogo
              </Link>
              <Link href="/#how-it-works" className="text-white hover:text-brand-red transition-colors">
                Cómo Funciona
              </Link>
              <Link href="/catalog" className="btn-primary text-center">
                Reservar Ahora
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}