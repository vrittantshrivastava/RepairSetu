/**
 * Step 2: OSRM Road Routing Service for RepairSetu Map
 * 
 * Uses public OSRM driving service to calculate real road-network routes.
 * Coordinates order for OSRM URL: {longitude},{latitude};{longitude},{latitude}
 */

export interface OsrmGeometry {
  type: 'LineString';
  coordinates: [number, number][];
}

export interface OsrmRouteResult {
  geometry: OsrmGeometry;
  distanceMeters: number;
  durationSeconds: number;
  formattedDistance: string;
  formattedDuration: string;
}

/**
 * Format duration from seconds to human-readable string (e.g., "12 min", "1 hr 10 min")
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return '1 min';
  }
  const totalMinutes = Math.round(seconds / 60);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Format distance from meters to km (e.g., "4.2 km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Fetch real driving route from OSRM public routing API
 * @param startLat User latitude
 * @param startLng User longitude
 * @param endLat Repairer latitude
 * @param endLng Repairer longitude
 */
export async function fetchOsrmDrivingRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<OsrmRouteResult> {
  // Validate coordinates
  if (
    typeof startLat !== 'number' ||
    typeof startLng !== 'number' ||
    typeof endLat !== 'number' ||
    typeof endLng !== 'number' ||
    isNaN(startLat) ||
    isNaN(startLng) ||
    isNaN(endLat) ||
    isNaN(endLng)
  ) {
    throw new Error('Invalid coordinates provided for routing.');
  }

  // OSRM expects: /route/v1/driving/{lon1},{lat1};{lon2},{lat2}?overview=full&geometries=geojson
  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM server returned status ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(data.message || 'No driving route found between locations.');
    }

    const primaryRoute = data.routes[0];
    const distanceMeters = primaryRoute.distance;
    const durationSeconds = primaryRoute.duration;
    const geometry: OsrmGeometry = primaryRoute.geometry;

    return {
      geometry,
      distanceMeters,
      durationSeconds,
      formattedDistance: formatDistance(distanceMeters),
      formattedDuration: formatDuration(durationSeconds),
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Routing request timed out. Please try again.');
    }
    throw error;
  }
}
