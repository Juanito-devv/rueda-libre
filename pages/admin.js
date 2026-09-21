import { useState, useEffect } from 'react';
import Header from '../src/components/layout/Header';
import Footer from '../src/components/layout/Footer';
import { supabaseClient } from '../src/lib/supabaseClient';
import ReservasTab from '../src/components/admin/ReservasTab';
import VehiculosTab from '../src/components/admin/VehiculosTab';
import CalendarioTab from '../src/components/admin/CalendarioTab';
import DashboardTab from '../src/components/admin/DashboardTab';
import PagosTab from '../src/components/admin/PagosTab';

const inputClass = "w-full bg-surface/50 border border-white/10 rounded-xl py-3 px-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none font-body-md backdrop-blur-sm placeholder:text-on-surface-variant/50";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('reservas');

  useEffect(() => {
    let on = true;
    supabaseClient()
      .auth.getSession()
      .then(({ data }) => {
        if (on && data.session) {
          setSession(data.session);
          fetch('/api/admin/reservas?estado=pendiente', {
            headers: { Authorization: `Bearer ${data.session.access_token}` },
          })
            .then((r) => r.json())
            .then((d) => {
              if (on && d && d.rol) setRole(d.rol);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { data, error: err } = await supabaseClient().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err || !data.session) {
      setError(err?.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
      return;
    }
    setSession(data.session);
  };

  const handleLogout = async () => {
    await supabaseClient().auth.signOut();
    setSession(null);
    setRole(null);
  };

  const tabs = [
    { id: 'reservas', name: 'Reservas', adminOnly: false },
    { id: 'calendario', name: 'Calendario', adminOnly: false },
    { id: 'pagos', name: 'Datos de pago', adminOnly: true },
    { id: 'flota', name: 'Flota', adminOnly: true },
    { id: 'dashboard', name: 'Dashboard', adminOnly: true },
  ];

  const visibleTabs = tabs.filter((t) => !t.adminOnly || role === 'admin');

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-section-gap">
        <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-12">
            <h1 className="font-headline-xl text-headline-xl mb-3">
              Panel de <span className="gradient-text">Gestión</span>
            </h1>
            <p className="text-on-surface-variant text-lg uppercase tracking-widest text-sm">
              {role === 'admin' ? 'Reservas · Calendario · Datos de pago · Flota · Dashboard' : 'Reservas · Calendario'}
            </p>
          </div>

          {!session ? (
            <div className="max-w-md mx-auto glass-panel-luxury rounded-3xl p-8 md:p-10 border border-primary/20">
              <h2 className="font-headline-md text-headline-md text-white font-black mb-6">Iniciar sesión</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo del personal"
                  required
                />
                <input
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
                {error && <p className="text-error text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full gold-btn font-label-bold text-label-bold px-6 py-4 rounded-xl tracking-widest font-black disabled:opacity-50"
                >
                  {busy ? 'Entrando…' : 'Entrar'}
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex flex-wrap gap-3">
                  {visibleTabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`px-6 py-2.5 rounded-full font-label-bold text-label-bold text-sm tracking-widest transition-all ${
                        tab === t.id
                          ? 'bg-gradient-to-r from-primary to-accent-orange text-surface shadow-lg'
                          : 'bg-surface/50 border border-white/10 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="gold-btn px-6 py-2.5 rounded-full font-label-bold text-label-bold text-sm tracking-widest font-black"
                >
                  Cerrar sesión
                </button>
              </div>

              {tab === 'reservas' && <ReservasTab token={session.access_token} onRole={(r) => setRole(r)} />}
              {tab === 'calendario' && <CalendarioTab token={session.access_token} onRole={(r) => setRole(r)} />}
              {tab === 'pagos' && <PagosTab token={session.access_token} isAdmin={role === 'admin'} />}
              {tab === 'flota' && <VehiculosTab token={session.access_token} isAdmin={role === 'admin'} />}
              {tab === 'dashboard' && <DashboardTab token={session.access_token} onRole={(r) => setRole(r)} />}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}