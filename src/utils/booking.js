import { extras } from '../data/vehicles';

export function getBookingDays(pickupDate, returnDate) {
  if (!pickupDate || !returnDate) return 0;
  const start = new Date(`${pickupDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 0;
  return diff === 0 ? 1 : diff;
}

export function calculateBookingTotal(vehicle, booking, days) {
  const basePrice = vehicle.dailyRate * days;
  const extrasPrice = booking.selectedExtras.reduce((total, extraId) => {
    const extra = extras.find((e) => e.id === extraId);
    return total + (extra ? extra.price * days : 0);
  }, 0);
  return basePrice + extrasPrice;
}

export const segmentLabel = {
  particular: 'Particulares',
  empresa: 'Empresas',
  all: 'Particulares y Empresas',
};