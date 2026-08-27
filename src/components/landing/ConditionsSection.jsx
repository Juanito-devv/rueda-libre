export default function ConditionsSection() {
  return (
    <section className="py-section-gap relative" id="condiciones">
      <div className="absolute inset-0 bg-surface-container-low/40 -z-10"></div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-headline-xl text-headline-xl mb-6">
            Condiciones y <span className="gradient-text">Garantías</span>
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant text-lg uppercase tracking-widest">
            Requisitos claros, sin letra pequeña
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel rounded-3xl p-10 border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-2xl text-white font-black">Garantías</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-5 bg-surface/50 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">Mayor de 30 años</p>
                    <p className="text-on-surface-variant text-sm">Garantía estándar</p>
                  </div>
                </div>
                <span className="text-primary font-bold text-sm">$500</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-5 bg-surface/50 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-orange/10 text-accent-orange">
                    <span className="material-symbols-outlined text-xl">person_off</span>
                  </div>
                  <div>
                    <p className="text-white font-bold">Menor de 30 años</p>
                    <p className="text-on-surface-variant text-sm">Garantía especial</p>
                  </div>
                </div>
                <span className="text-accent-orange font-bold text-sm">$1000</span>
              </div>
            </div>

            <p className="font-body-md text-on-surface-variant mt-6 text-sm">
              La garantía se define según la edad del conductor principal.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-10 border border-primary/20 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-primary to-accent-orange rounded-full blur-3xl opacity-15"></div>

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent-orange flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-surface text-3xl">local_shipping</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-2xl text-white font-black">Tarifas de ejemplo</h3>
            </div>

            <div className="bg-surface/50 border border-white/10 rounded-2xl p-6 mb-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold text-lg">Camioneta Pick-Up 4x4</p>
                    <p className="text-on-surface-variant text-sm">Ideal para trabajo pesado</p>
                  </div>
                  <p className="text-primary font-display-lg text-3xl font-black">$85<span className="text-xs font-label-bold text-on-surface-variant uppercase tracking-widest ml-1"> / día</span></p>
                </div>
                <div className="h-px bg-white/5"></div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-bold text-lg">SUV Familiar</p>
                    <p className="text-on-surface-variant text-sm">Espacio para toda la familia</p>
                  </div>
                  <p className="text-accent-orange font-display-lg text-3xl font-black">$65<span className="text-xs font-label-bold text-on-surface-variant uppercase tracking-widest ml-1"> / día</span></p>
                </div>
              </div>
              <div className="space-y-3 mt-6 pt-5 border-t border-white/5">
                <div className="flex items-center gap-3 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-primary text-lg">route</span>
                  <span>Incluye hasta <span className="text-white font-bold">300 km</span></span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-body-md">
                  <span className="material-symbols-outlined text-accent-orange text-lg">speed</span>
                  <span>Kilometraje adicional se cobra por separado</span>
                </div>
              </div>
            </div>

            <p className="font-body-md text-on-surface-variant relative z-10 text-sm">
              Tarifas por vehículo y condiciones finales según el vehículo seleccionado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}