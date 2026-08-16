export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/584129706050"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#1da851] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all z-50 animate-pulse-glow"
      style={{ animationName: 'pulse-green' }}
      aria-label="Contactar por WhatsApp"
    >
      <span className="material-symbols-outlined fill-icon text-3xl">chat</span>
    </a>
  );
}