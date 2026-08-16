import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-20 bg-background max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
      <div className="col-span-1 md:col-span-2">
        <h4 className="font-headline-xl text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent-orange mb-6 tracking-tighter">
          RUEDA LIBRE
        </h4>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-sm leading-relaxed">
          Muévete con confianza. Tu mejor opción para alquilar vehículos por día.
        </p>
        <p className="font-label-bold text-xs text-on-surface-variant/40 tracking-widest">
          © 2024 RUEDA LIBRE. TODOS LOS DERECHOS RESERVADOS.
        </p>
      </div>

      <div>
        <h5 className="font-label-bold text-label-bold text-white mb-6 tracking-widest text-sm">ENLACES</h5>
        <ul className="space-y-4">
          <li>
            <Link href="/catalog" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group">
              <span className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
              Catálogo
            </Link>
          </li>
          <li>
            <Link href="/#how-it-works" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group">
              <span className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
              Cómo Funciona
            </Link>
          </li>
          <li>
            <Link href="/#contact" className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 group">
              <span className="w-2 h-2 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
              Contacto
            </Link>
          </li>
        </ul>
      </div>

      <div>
        <h5 className="font-label-bold text-label-bold text-white mb-6 tracking-widest text-sm">CONTACTO</h5>
        <ul className="space-y-5">
          <li className="flex items-center gap-4 text-on-surface-variant font-body-md text-body-md">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-sm">phone</span>
            </div>
            +58 412-9706050
          </li>
          <li className="flex items-center gap-4 text-on-surface-variant font-body-md text-body-md">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-sm">mail</span>
            </div>
            info@ruedalibre.com
          </li>
          <li className="flex items-center gap-4 text-on-surface-variant font-body-md text-body-md">
            <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-primary text-sm">location_on</span>
            </div>
            Caracas, Venezuela
          </li>
        </ul>
      </div>
    </footer>
  );
}