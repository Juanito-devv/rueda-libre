const BCV_RATE_URL = 'https://ve.dolarapi.com/v1/dolares/oficial';

export async function fetchBcvRate() {
  try {
    const res = await fetch(BCV_RATE_URL);
    if (!res.ok) return null;
    const data = await res.json();
    const rate = Number(data.promedio);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

export function formatVes(value) {
  return `Bs. ${Number(value || 0).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}