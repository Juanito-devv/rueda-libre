import { useState } from 'react';

export default function Foto({ path, token }) {
  const [url, setUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  if (!loaded && path) {
    setLoaded(true);
    fetch(`/api/admin/fotos?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => { if (d.url) setUrl(d.url); })
      .catch(() => {});
  }

  if (!path || !url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <img src={url} alt="documento" className="h-24 w-24 object-cover rounded-lg border border-white/10" />
    </a>
  );
}