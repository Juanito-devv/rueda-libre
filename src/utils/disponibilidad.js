const POST_ENTREGA_HRS = 24;

function toDate(yyyymmdd) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(yyyymmdd || ''));
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12, 0, 0);
}

function addHours(d, hours) {
  return new Date(d.getTime() + hours * 60 * 60 * 1000);
}

function overlap(startA, endA, startB, endB) {
  return startA <= endB && startB <= endA;
}

export function isRangeFree(pickupDate, returnDate, occupiedRanges) {
  const s = toDate(pickupDate);
  const e = toDate(returnDate) || s;
  if (!s || !e) return false;
  const start = s.getTime();
  const end = e.getTime();
  return !(occupiedRanges || []).some((r) => {
    const rs = toDate(r.pickup_date);
    const re = toDate(r.return_date) || rs;
    if (!rs || !re) return false;
    const rsT = rs.getTime();
    const reT = addHours(re, POST_ENTREGA_HRS).getTime();
    return overlap(start, end, rsT, reT);
  });
}

export function occupiedByVehicle(rows) {
  const map = {};
  (rows || []).forEach((r) => {
    if (!r || !r.vehiculo || !r.pickup_date || !r.return_date) return;
    if (!map[r.vehiculo]) map[r.vehiculo] = [];
    map[r.vehiculo].push({ pickup_date: r.pickup_date, return_date: r.return_date });
  });
  return map;
}