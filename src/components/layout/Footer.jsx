import { Car, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-8 w-8 text-brand-red" />
              <span className="text-xl font-bold text-white">
                Rueda<span className="text-brand-red">Libre</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Muévete con confianza. Tu mejor opción para alquilar vehículos por día.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <div className="flex flex-col gap-2">
              <Link href="/catalog" className="text-gray-400 hover:text-brand-red">Catálogo</Link>
              <Link href="/#how-it-works" className="text-gray-400 hover:text-brand-red">Cómo Funciona</Link>
              <Link href="/#contact" className="text-gray-400 hover:text-brand-red">Contacto</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-brand-red" />
                <span>+58 412-3456789</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 text-brand-red" />
                <span>info@ruedalibre.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-brand-red" />
                <span>Caracas, Venezuela</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Rueda Libre. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}