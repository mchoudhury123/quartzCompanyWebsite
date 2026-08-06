// UK postcode → coordinates via postcodes.io (free, no API key, CORS-enabled).
// Used to place trade contacts on the map from their postcode.

export async function geocodePostcode(postcode) {
  const pc = (postcode || '').trim();
  if (!pc) return null;
  try {
    const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
    if (!res.ok) return null;
    const json = await res.json();
    const r = json?.result;
    if (r && typeof r.latitude === 'number' && typeof r.longitude === 'number') {
      return { latitude: r.latitude, longitude: r.longitude };
    }
    return null;
  } catch (_) {
    return null;
  }
}
