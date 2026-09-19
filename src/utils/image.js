export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function compressImage(file, { maxDim = 1600, quality = 0.72 } = {}) {
  const original = await fileToBase64(file);
  const img = await loadImage(`data:${file.type};base64,${original}`);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const out = canvas.toDataURL('image/jpeg', quality);
  const data = out.split(',')[1];
  const bytes = Math.round((data.length * 3) / 4);
  const baseName = (file.name || 'foto').replace(/\.[^.]+$/, '') || 'foto';
  return { name: `${baseName}.jpg`, type: 'image/jpeg', data, bytes };
}