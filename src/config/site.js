export const SITE = {
  name: 'GuzfalC.A',
  tagline: 'Muévete con Confianza',
  description:
    'GuzfalC.A. Alquiler de vehículos por día en Punto Fijo, Venezuela. A empresas y particulares, tu mejor opción para avanzar.',
  whatsappNumber: '584129706050',
  whatsappDisplay: '+58 412-9706050',
  email: 'guzfalca1@gmail.com',
  location: 'Punto Fijo, Venezuela',
  deliveryCity: 'Punto Fijo',
  // Dominio público de producción. Si el dominio cambia, se edita solo esta línea.
  baseUrl: 'https://www.guzfalca.com',
  instagramHandle: 'guzfalc.a',
  instagramUrl: 'https://www.instagram.com/guzfalc.a?stkn=MWRpeHpyYWd1ZDNvMw==',

  // Garantías según edad del conductor (USD)
  guarantees: {
    over30: 500,
    under30: 1000,
  },

  // Política de kilometraje
  mileage: {
    includedKm: 300,
    extraKmPrice: null, // POR CONFIRMAR (USD por km adicional)
  },

  // Tarifas de ejemplo de la landing (deben coincidir con src/data/vehicles.js)
  exampleTariffs: [
    { label: 'Camioneta Pick-Up 4x4', subtitle: 'Ideal para trabajo pesado', dailyRate: 85, highlight: true },
    { label: 'SUV Familiar', subtitle: 'Espacio para toda la familia', dailyRate: 65, highlight: false },
  ],
};