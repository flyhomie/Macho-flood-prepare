import { SafeZone } from '../types';

/**
 * Calculates Haversine distance in meters between two lat/lng coordinates
 */
export function getHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculates initial compass bearing in degrees (0 - 360) from point A to point B
 */
export function getBearingDegrees(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return Math.round(bearing);
}

/**
 * Converts degree bearing into 8-point or 16-point cardinal string
 */
export function getCardinalDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Formats distance in meters or km
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Estimated evacuation walk time (assuming avg 3.5 km/h in moderate conditions or wading)
 */
export function getEstimatedWalkTimeMinutes(meters: number, waterDepthCm: number = 0): number {
  let speedKmH = 4.0;
  if (waterDepthCm > 30) speedKmH = 1.8;
  else if (waterDepthCm > 10) speedKmH = 2.8;

  const hours = (meters / 1000) / speedKmH;
  return Math.max(1, Math.round(hours * 60));
}

/**
 * Find nearest safe zone sorted by distance
 */
export function findNearestSafeZones(
  userLat: number,
  userLng: number,
  zones: SafeZone[]
): (SafeZone & { distanceMeters: number; bearing: number; cardinal: string })[] {
  return zones
    .map((zone) => {
      const distanceMeters = getHaversineDistanceMeters(userLat, userLng, zone.lat, zone.lng);
      const bearing = getBearingDegrees(userLat, userLng, zone.lat, zone.lng);
      const cardinal = getCardinalDirection(bearing);
      return {
        ...zone,
        distanceMeters,
        bearing,
        cardinal,
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

export const REGIONAL_CENTROIDS = {
  KE: { name: 'Kenya (Nairobi / Tana Basin)', lat: -1.286389, lng: 36.817223, zoom: 7 },
  TZ: { name: 'Tanzania (Dar / Rufiji Basin)', lat: -6.792354, lng: 39.208328, zoom: 7 },
  UG: { name: 'Uganda (Kampala / Lake Victoria)', lat: 0.347596, lng: 32.58252, zoom: 8 },
  ET: { name: 'Ethiopia (Addis Ababa / Awash)', lat: 9.02497, lng: 38.74689, zoom: 7 },
};
