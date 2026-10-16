import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  Star, 
  Clock, 
  ArrowRight, 
  X, 
  Search, 
  RotateCcw, 
  Layers, 
  Box, 
  Compass,
  CheckCircle2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { NearbyRepairStore, UserLocation } from '../types';
import { fetchOsrmDrivingRoute } from '../services/osrmRouting';

export interface InteractiveRepairMapProps {
  userLocation: UserLocation;
  stores: NearbyRepairStore[];
  selectedStoreId: string | null;
  onSelectStore: (storeId: string) => void;
  onViewDetails?: (store: NearbyRepairStore) => void;
  onGetQuote?: (store: NearbyRepairStore) => void;
  onSearchThisArea?: (centerLat: number, centerLng: number) => void;
  isScanning?: boolean;
  routeTargetStore?: NearbyRepairStore | null;
  onClearRoute?: () => void;
  isTrackingMode?: boolean;
  trackingTitle?: string;
  trackingSubtitle?: string;
}

// Bhopal standard geographic coordinates
const BHOPAL_DEFAULT_CENTER = {
  latitude: 23.2599,
  longitude: 77.4126,
  zoom2D: 13,
  zoom3D: 15.2,
  pitch3D: 60,
  bearing3D: -18,
};

// 2D: Standard OpenStreetMap raster tiles (100% free, zero API key)
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

// 3D: OpenFreeMap vector tile style with building footprints and 3D height data (100% key-free, no Carto darkkey)
const VECTOR_3D_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

export const InteractiveRepairMap: React.FC<InteractiveRepairMapProps> = ({
  userLocation,
  stores,
  selectedStoreId,
  onSelectStore,
  onViewDetails,
  onGetQuote,
  onSearchThisArea,
  isScanning = false,
  routeTargetStore,
  onClearRoute,
  isTrackingMode = false,
  trackingTitle,
  trackingSubtitle,
}) => {
  // DOM container refs
  const leafletContainerRef = useRef<HTMLDivElement>(null);
  const maplibreContainerRef = useRef<HTMLDivElement>(null);

  // Map instance refs
  const leafletMapRef = useRef<L.Map | null>(null);
  const maplibreMapRef = useRef<maplibregl.Map | null>(null);

  // Marker refs for 2D (Leaflet)
  const leafletStoreMarkersRef = useRef<{ [id: string]: L.Marker }>({});
  const leafletUserMarkerRef = useRef<L.Marker | null>(null);
  const leafletRouteGroupRef = useRef<L.FeatureGroup | null>(null);

  // Marker refs for 3D (MapLibre)
  const maplibreStoreMarkersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const maplibreUserMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Active view mode: 2D Street or 3D City Perspective
  const [mapMode, setMapMode] = useState<'2d' | '3d'>('2d');
  const [maplibreLoaded, setMaplibreLoaded] = useState(false);
  const [maplibreError, setMaplibreError] = useState<string | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // 3D Camera attributes
  const [mapPitch, setMapPitch] = useState<number>(BHOPAL_DEFAULT_CENTER.pitch3D);
  const [mapBearing, setMapBearing] = useState<number>(BHOPAL_DEFAULT_CENTER.bearing3D);

  // Pan & search tracking
  const [hasMovedFromCenter, setHasMovedFromCenter] = useState(false);
  const [currentMapCenter, setCurrentMapCenter] = useState<{ lat: number; lng: number }>({
    lat: userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude,
    lng: userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude,
  });

  // OSRM Road Routing State
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState<{
    repairerName: string;
    distance: string;
    duration: string;
    repairerId: string;
  } | null>(null);

  // Active store selected for preview popup
  const activeStore = stores.find((s) => s.id === selectedStoreId) || null;

  // Clear road route across both 2D and 3D maps
  const handleClearRoute = useCallback(() => {
    // Clear 2D Leaflet route
    if (leafletRouteGroupRef.current) {
      leafletRouteGroupRef.current.clearLayers();
    }

    // Clear 3D MapLibre route
    const ml = maplibreMapRef.current;
    if (ml && maplibreLoaded) {
      try {
        if (ml.getLayer('osrm-route-line')) ml.removeLayer('osrm-route-line');
        if (ml.getLayer('osrm-route-casing')) ml.removeLayer('osrm-route-casing');
        if (ml.getSource('osrm-route-source')) ml.removeSource('osrm-route-source');
      } catch {
        // Safe ignore
      }
    }

    setActiveRouteInfo(null);
    setRouteError(null);
    onClearRoute?.();
  }, [maplibreLoaded, onClearRoute]);

  // Calculate and draw real road routing using OSRM on both active map renderers
  const handleCalculateRoute = useCallback(async (store: NearbyRepairStore) => {
    setRouteLoading(true);
    setRouteError(null);

    // Clean existing routes first
    if (leafletRouteGroupRef.current) {
      leafletRouteGroupRef.current.clearLayers();
    }

    const ml = maplibreMapRef.current;
    if (ml && maplibreLoaded) {
      try {
        if (ml.getLayer('osrm-route-line')) ml.removeLayer('osrm-route-line');
        if (ml.getLayer('osrm-route-casing')) ml.removeLayer('osrm-route-casing');
        if (ml.getSource('osrm-route-source')) ml.removeSource('osrm-route-source');
      } catch {
        // Safe ignore
      }
    }

    try {
      const originLat = userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude;
      const originLng = userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude;

      const result = await fetchOsrmDrivingRoute(
        originLat,
        originLng,
        store.latitude,
        store.longitude
      );

      // 1. Draw route on 2D Leaflet
      const latLngs: [number, number][] = result.geometry.coordinates.map(
        (coord: number[]) => [coord[1], coord[0]]
      );

      if (latLngs.length > 0 && leafletRouteGroupRef.current && leafletMapRef.current) {
        const routeCasing = L.polyline(latLngs, {
          color: '#1e1b4b',
          weight: 7,
          opacity: 0.75,
          lineJoin: 'round',
          lineCap: 'round',
        });

        const routeLine = L.polyline(latLngs, {
          color: '#4f46e5',
          weight: 4.5,
          opacity: 0.95,
          lineJoin: 'round',
          lineCap: 'round',
        });

        leafletRouteGroupRef.current.addLayer(routeCasing);
        leafletRouteGroupRef.current.addLayer(routeLine);

        if (mapMode === '2d') {
          leafletMapRef.current.fitBounds(routeLine.getBounds(), {
            padding: [50, 50],
            maxZoom: 15.5,
          });
        }
      }

      // 2. Draw route on 3D MapLibre
      if (ml && maplibreLoaded) {
        ml.addSource('osrm-route-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: result.geometry,
          },
        });

        ml.addLayer({
          id: 'osrm-route-casing',
          type: 'line',
          source: 'osrm-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#1e1b4b',
            'line-width': 7,
            'line-opacity': 0.8,
          },
        });

        ml.addLayer({
          id: 'osrm-route-line',
          type: 'line',
          source: 'osrm-route-source',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#4f46e5',
            'line-width': 4.5,
            'line-opacity': 0.95,
          },
        });

        if (mapMode === '3d') {
          const coords = result.geometry.coordinates;
          if (coords.length > 0) {
            let minLng = coords[0][0];
            let maxLng = coords[0][0];
            let minLat = coords[0][1];
            let maxLat = coords[0][1];

            coords.forEach((coord: number[]) => {
              if (coord[0] < minLng) minLng = coord[0];
              if (coord[0] > maxLng) maxLng = coord[0];
              if (coord[1] < minLat) minLat = coord[1];
              if (coord[1] > maxLat) maxLat = coord[1];
            });

            ml.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
              padding: { top: 70, bottom: 70, left: 70, right: 70 },
              maxZoom: 15.5,
              duration: 1000,
              pitch: 55,
            });
          }
        }
      }

      setActiveRouteInfo({
        repairerName: store.name,
        distance: result.formattedDistance,
        duration: result.formattedDuration,
        repairerId: store.id,
      });
    } catch {
      setRouteError('Unable to calculate driving route. Please try again.');
    } finally {
      setRouteLoading(false);
    }
  }, [userLocation, mapMode, maplibreLoaded]);

  // Watch routeTargetStore prop to trigger routing from card
  useEffect(() => {
    if (routeTargetStore) {
      handleCalculateRoute(routeTargetStore);
    }
  }, [routeTargetStore, handleCalculateRoute]);

  // =========================================================================
  // 1. INITIALIZE 2D LEAFLET MAP (OpenStreetMap Standard Tiles)
  // =========================================================================
  useEffect(() => {
    if (!leafletContainerRef.current) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    if ((leafletContainerRef.current as any)._leaflet_id) {
      (leafletContainerRef.current as any)._leaflet_id = null;
    }

    const initLat = userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude;
    const initLng = userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude;

    const map = L.map(leafletContainerRef.current, {
      center: [initLat, initLng],
      zoom: BHOPAL_DEFAULT_CENTER.zoom2D,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    const osmLayer = L.tileLayer(OSM_TILE_URL, {
      maxZoom: 19,
      attribution: OSM_ATTRIBUTION,
    });

    osmLayer.addTo(map);

    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution(OSM_ATTRIBUTION)
      .addTo(map);

    const routeGroup = L.featureGroup().addTo(map);
    leafletRouteGroupRef.current = routeGroup;

    leafletMapRef.current = map;

    map.on('moveend', () => {
      if (mapMode === '2d') {
        const center = map.getCenter();
        setCurrentMapCenter({ lat: center.lat, lng: center.lng });
        const latDiff = Math.abs(center.lat - BHOPAL_DEFAULT_CENTER.latitude);
        const lngDiff = Math.abs(center.lng - BHOPAL_DEFAULT_CENTER.longitude);
        if (latDiff > 0.015 || lngDiff > 0.015) {
          setHasMovedFromCenter(true);
        }
      }
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // =========================================================================
  // 2. INITIALIZE 3D MAPLIBRE GL JS MAP (Real Vector Tiles & 3D Extrusions)
  // =========================================================================
  useEffect(() => {
    if (!maplibreContainerRef.current) return;

    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGlSupported(false);
      return;
    }

    const initLat = userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude;
    const initLng = userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude;

    const ml = new maplibregl.Map({
      container: maplibreContainerRef.current,
      style: VECTOR_3D_STYLE_URL,
      center: [initLng, initLat],
      zoom: BHOPAL_DEFAULT_CENTER.zoom3D,
      pitch: BHOPAL_DEFAULT_CENTER.pitch3D,
      bearing: BHOPAL_DEFAULT_CENTER.bearing3D,
      maxPitch: 75,
      attributionControl: false,
    });

    maplibreMapRef.current = ml;

    ml.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    ml.on('load', () => {
      setMaplibreLoaded(true);

      // Enhance or add genuine 3D building fill-extrusion layer
      try {
        // If building-3d already exists in liberty style, update height to coalesce missing tags
        if (ml.getLayer('building-3d')) {
          ml.setPaintProperty('building-3d', 'fill-extrusion-height', [
            'interpolate',
            ['linear'],
            ['zoom'],
            13, 0,
            14.5, ['coalesce', ['get', 'render_height'], ['get', 'height'], ['*', ['get', 'levels'], 3.2], 14]
          ]);
          ml.setPaintProperty('building-3d', 'fill-extrusion-color', [
            'interpolate',
            ['linear'],
            ['coalesce', ['get', 'render_height'], ['get', 'height'], 14],
            0, '#e2e8f0',
            15, '#cbd5e1',
            30, '#94a3b8',
            60, '#64748b',
            100, '#475569'
          ]);
          ml.setPaintProperty('building-3d', 'fill-extrusion-opacity', 0.88);
          ml.setPaintProperty('building-3d', 'fill-extrusion-vertical-gradient', true);
        } else {
          // Find first label layer to position 3D buildings below street names
          const layers = ml.getStyle().layers || [];
          let labelLayerId: string | undefined;
          for (const layer of layers) {
            if (layer.type === 'symbol' && layer.layout && (layer.layout as any)['text-field']) {
              labelLayerId = layer.id;
              break;
            }
          }

          ml.addLayer(
            {
              id: 'repairsetu-3d-buildings',
              source: 'openmaptiles',
              'source-layer': 'building',
              type: 'fill-extrusion',
              minzoom: 13,
              paint: {
                'fill-extrusion-color': [
                  'interpolate',
                  ['linear'],
                  ['coalesce', ['get', 'render_height'], ['get', 'height'], 14],
                  0, '#e2e8f0',
                  15, '#cbd5e1',
                  30, '#94a3b8',
                  60, '#64748b',
                  100, '#475569'
                ],
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13, 0,
                  14.5, ['coalesce', ['get', 'render_height'], ['get', 'height'], ['*', ['get', 'levels'], 3.2], 15]
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13, 0,
                  14.5, ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0]
                ],
                'fill-extrusion-opacity': 0.88,
                'fill-extrusion-vertical-gradient': true,
              },
            },
            labelLayerId
          );
        }
      } catch (err) {
        console.warn('3D building extrusion setup notice:', err);
      }
    });

    ml.on('rotate', () => {
      setMapBearing(Math.round(ml.getBearing()));
    });

    ml.on('pitch', () => {
      setMapPitch(Math.round(ml.getPitch()));
    });

    ml.on('moveend', () => {
      if (mapMode === '3d') {
        const center = ml.getCenter();
        setCurrentMapCenter({ lat: center.lat, lng: center.lng });
        const latDiff = Math.abs(center.lat - BHOPAL_DEFAULT_CENTER.latitude);
        const lngDiff = Math.abs(center.lng - BHOPAL_DEFAULT_CENTER.longitude);
        if (latDiff > 0.015 || lngDiff > 0.015) {
          setHasMovedFromCenter(true);
        }
      }
    });

    ml.on('error', (e) => {
      if (e.error && String(e.error).includes('tiles.openfreemap')) {
        setMaplibreError('Vector tile connection error. You can switch back to 2D Street View anytime.');
      }
    });

    return () => {
      ml.remove();
      maplibreMapRef.current = null;
    };
  }, []);

  // =========================================================================
  // 3. SYNCHRONIZE MARKERS ON BOTH MAPS (2D Leaflet & 3D MapLibre)
  // =========================================================================

  // User Location Marker Sync
  useEffect(() => {
    const userLat = userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude;
    const userLng = userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude;

    // 1. Leaflet User Marker
    if (leafletMapRef.current) {
      if (leafletUserMarkerRef.current) {
        leafletUserMarkerRef.current.remove();
      }
      const userIcon = L.divIcon({
        className: 'custom-user-marker-icon',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <div style="position: relative; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(59, 130, 246, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="width: 18px; height: 18px; border-radius: 9999px; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(37,99,235,0.6); z-index: 10;"></div>
            </div>
            <div style="margin-top: 3px; padding: 2px 7px; border-radius: 9999px; background: #0f172a; color: #ffffff; font-size: 10px; font-weight: 700; font-family: monospace; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); z-index: 10;">
              📍 You are here
            </div>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [40, 9],
      });
      leafletUserMarkerRef.current = L.marker([userLat, userLng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(leafletMapRef.current);
    }

    // 2. MapLibre User Marker
    if (maplibreMapRef.current && maplibreLoaded) {
      if (maplibreUserMarkerRef.current) {
        maplibreUserMarkerRef.current.remove();
      }
      const el = document.createElement('div');
      el.className = 'custom-user-marker-3d';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.cursor = 'pointer';
      el.innerHTML = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background: rgba(59, 130, 246, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 18px; height: 18px; border-radius: 9999px; background: #2563eb; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(37,99,235,0.6); z-index: 10;"></div>
        </div>
        <div style="margin-top: 3px; padding: 2px 7px; border-radius: 9999px; background: #0f172a; color: #ffffff; font-size: 10px; font-weight: 700; font-family: monospace; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); z-index: 10;">
          📍 You are here
        </div>
      `;
      maplibreUserMarkerRef.current = new maplibregl.Marker({
        element: el,
        anchor: 'top',
      })
        .setLngLat([userLng, userLat])
        .addTo(maplibreMapRef.current);
    }
  }, [userLocation, maplibreLoaded]);

  // Store Markers Sync
  useEffect(() => {
    // 1. Leaflet Store Markers
    if (leafletMapRef.current) {
      Object.values(leafletStoreMarkersRef.current).forEach((marker) => marker.remove());
      leafletStoreMarkersRef.current = {};

      stores.forEach((store) => {
        const isSelected = selectedStoreId === store.id;
        const shortName = store.name.split(' ')[0];
        const bgColor = isSelected ? '#4338ca' : '#ffffff';
        const textColor = isSelected ? '#ffffff' : '#0f172a';
        const borderColor = isSelected ? '#6366f1' : '#cbd5e1';
        const badgeIconBg = isSelected ? '#4f46e5' : '#e0e7ff';
        const badgeIconColor = isSelected ? '#ffffff' : '#4338ca';
        const starColor = isSelected ? '#fde047' : '#d97706';

        const storeIcon = L.divIcon({
          className: `store-marker-icon-${store.id}`,
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'}; transition: transform 0.2s ease;">
              <div style="display: flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 12px; background: ${bgColor}; color: ${textColor}; border: 2px solid ${borderColor}; box-shadow: 0 6px 14px rgba(0,0,0,0.22); font-family: system-ui, sans-serif; white-space: nowrap;">
                <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 6px; background: ${badgeIconBg}; color: ${badgeIconColor}; font-size: 11px;">🔧</span>
                <span style="font-size: 11px; font-weight: 700;">${shortName}</span>
                <span style="display: flex; align-items: center; font-size: 10px; font-weight: 700; color: ${starColor};">★ ${store.rating}</span>
              </div>
              <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${bgColor}; margin-top: -1px;"></div>
            </div>
          `,
          iconSize: [110, 36],
          iconAnchor: [55, 36],
          popupAnchor: [0, -38],
        });

        const marker = L.marker([store.latitude, store.longitude], {
          icon: storeIcon,
          zIndexOffset: isSelected ? 800 : 200,
        });

        marker.on('click', () => {
          onSelectStore(store.id);
        });

        marker.addTo(leafletMapRef.current!);
        leafletStoreMarkersRef.current[store.id] = marker;
      });
    }

    // 2. MapLibre Store Markers
    if (maplibreMapRef.current && maplibreLoaded) {
      Object.values(maplibreStoreMarkersRef.current).forEach((marker) => marker.remove());
      maplibreStoreMarkersRef.current = {};

      stores.forEach((store) => {
        const isSelected = selectedStoreId === store.id;
        const shortName = store.name.split(' ')[0];
        const bgColor = isSelected ? '#4338ca' : '#ffffff';
        const textColor = isSelected ? '#ffffff' : '#0f172a';
        const borderColor = isSelected ? '#6366f1' : '#cbd5e1';
        const badgeIconBg = isSelected ? '#4f46e5' : '#e0e7ff';
        const badgeIconColor = isSelected ? '#ffffff' : '#4338ca';
        const starColor = isSelected ? '#fde047' : '#d97706';

        const el = document.createElement('div');
        el.className = `store-marker-3d-${store.id}`;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        el.style.cursor = 'pointer';
        el.style.transform = isSelected ? 'scale(1.15)' : 'scale(1)';
        el.style.transition = 'transform 0.2s ease';
        el.style.zIndex = isSelected ? '999' : '200';

        el.innerHTML = `
          <div style="display: flex; align-items: center; gap: 5px; padding: 4px 9px; border-radius: 12px; background: ${bgColor}; color: ${textColor}; border: 2px solid ${borderColor}; box-shadow: 0 6px 14px rgba(0,0,0,0.25); font-family: system-ui, sans-serif; white-space: nowrap;">
            <span style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 6px; background: ${badgeIconBg}; color: ${badgeIconColor}; font-size: 11px;">🔧</span>
            <span style="font-size: 11px; font-weight: 700;">${shortName}</span>
            <span style="display: flex; align-items: center; font-size: 10px; font-weight: 700; color: ${starColor};">★ ${store.rating}</span>
          </div>
          <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${bgColor}; margin-top: -1px;"></div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectStore(store.id);
        });

        const mlMarker = new maplibregl.Marker({
          element: el,
          anchor: 'bottom',
        })
          .setLngLat([store.longitude, store.latitude])
          .addTo(maplibreMapRef.current!);

        maplibreStoreMarkersRef.current[store.id] = mlMarker;
      });
    }
  }, [stores, selectedStoreId, onSelectStore, maplibreLoaded]);

  // Center & fly on selection
  useEffect(() => {
    if (!selectedStoreId) return;
    const store = stores.find((s) => s.id === selectedStoreId);
    if (!store) return;

    // Pan Leaflet
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo([store.latitude, store.longitude], Math.max(leafletMapRef.current.getZoom(), 14.5), {
        duration: 0.8,
      });
    }

    // Pan MapLibre in 3D perspective
    if (maplibreMapRef.current && maplibreLoaded) {
      maplibreMapRef.current.flyTo({
        center: [store.longitude, store.latitude],
        zoom: Math.max(maplibreMapRef.current.getZoom(), 15.5),
        pitch: BHOPAL_DEFAULT_CENTER.pitch3D,
        duration: 900,
        essential: true,
      });
    }
  }, [selectedStoreId, stores, maplibreLoaded]);

  // =========================================================================
  // 4. MODE TOGGLE HANDLER (Seamless Transition Between 2D and 3D)
  // =========================================================================
  const handleToggleMode = (mode: '2d' | '3d') => {
    setMapMode(mode);

    if (mode === '3d') {
      // Transitioning to 3D MapLibre
      setTimeout(() => {
        if (maplibreMapRef.current) {
          maplibreMapRef.current.resize();

          // Sync center from Leaflet
          if (leafletMapRef.current) {
            const center = leafletMapRef.current.getCenter();
            maplibreMapRef.current.flyTo({
              center: [center.lng, center.lat],
              zoom: BHOPAL_DEFAULT_CENTER.zoom3D,
              pitch: BHOPAL_DEFAULT_CENTER.pitch3D,
              bearing: BHOPAL_DEFAULT_CENTER.bearing3D,
              duration: 800,
            });
          }
        }
      }, 50);
    } else {
      // Transitioning to 2D Leaflet
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();

          // Sync center from MapLibre
          if (maplibreMapRef.current) {
            const center = maplibreMapRef.current.getCenter();
            leafletMapRef.current.flyTo([center.lat, center.lng], BHOPAL_DEFAULT_CENTER.zoom2D, {
              duration: 0.6,
            });
          }
        }
      }, 50);
    }
  };

  // Map Navigation Controls
  const handleZoomIn = () => {
    if (mapMode === '2d' && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    } else if (mapMode === '3d' && maplibreMapRef.current) {
      maplibreMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapMode === '2d' && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    } else if (mapMode === '3d' && maplibreMapRef.current) {
      maplibreMapRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    const targetLat = userLocation?.latitude || BHOPAL_DEFAULT_CENTER.latitude;
    const targetLng = userLocation?.longitude || BHOPAL_DEFAULT_CENTER.longitude;

    if (mapMode === '2d' && leafletMapRef.current) {
      leafletMapRef.current.flyTo([targetLat, targetLng], BHOPAL_DEFAULT_CENTER.zoom2D, {
        duration: 0.8,
      });
    } else if (mapMode === '3d' && maplibreMapRef.current) {
      maplibreMapRef.current.flyTo({
        center: [targetLng, targetLat],
        zoom: BHOPAL_DEFAULT_CENTER.zoom3D,
        pitch: BHOPAL_DEFAULT_CENTER.pitch3D,
        bearing: BHOPAL_DEFAULT_CENTER.bearing3D,
        duration: 900,
      });
    }
    setHasMovedFromCenter(false);
  };

  const handleResetNorth = () => {
    if (mapMode === '3d' && maplibreMapRef.current) {
      maplibreMapRef.current.easeTo({
        bearing: 0,
        pitch: BHOPAL_DEFAULT_CENTER.pitch3D,
        duration: 600,
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden select-none">
      {/* 2D LEAFLET DOM CONTAINER */}
      <div 
        ref={leafletContainerRef} 
        style={{ 
          display: mapMode === '2d' ? 'block' : 'none', 
          width: '100%', 
          height: '100%', 
          minHeight: '350px' 
        }} 
      />

      {/* 3D MAPLIBRE GL DOM CONTAINER */}
      <div 
        ref={maplibreContainerRef} 
        style={{ 
          display: mapMode === '3d' ? 'block' : 'none', 
          width: '100%', 
          height: '100%', 
          minHeight: '350px' 
        }} 
      />

      {/* WEBGL UNAVAILABLE NOTICE IF 3D HARDWARE IS LIMITED */}
      {!webGlSupported && mapMode === '3d' && (
        <div className="absolute inset-0 bg-slate-900/85 text-white z-50 flex items-center justify-center p-6 text-center pointer-events-auto">
          <div className="max-w-md bg-white text-slate-900 rounded-2xl p-6 shadow-2xl space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-bold text-base">WebGL 3D Acceleration Unavailable</h3>
            <p className="text-xs text-slate-600">
              Hardware-accelerated 3D WebGL is disabled in this browser window. Your 2D OpenStreetMap street map with repairer markers remains 100% functional.
            </p>
            <button
              onClick={() => handleToggleMode('2d')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
            >
              Switch to 2D Street View
            </button>
          </div>
        </div>
      )}

      {/* ERROR BANNER IF 3D VECTOR TILES FAIL */}
      {maplibreError && mapMode === '3d' && (
        <div className="absolute top-16 left-4 right-4 z-40 bg-amber-500/95 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center justify-between pointer-events-auto">
          <span>{maplibreError}</span>
          <button 
            onClick={() => handleToggleMode('2d')} 
            className="underline font-bold text-white hover:text-slate-100 ml-2"
          >
            Switch to 2D
          </button>
        </div>
      )}

      {/* ROUTE ERROR BANNER */}
      {routeError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl border border-rose-700 flex items-center gap-2 animate-in fade-in pointer-events-auto">
          <span>{routeError}</span>
          <button
            onClick={() => setRouteError(null)}
            className="ml-1 font-bold text-white hover:text-rose-200 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2D / 3D MODE TOGGLE (Top Left) */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-xl border border-slate-200 flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleToggleMode('2d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              mapMode === '2d'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Switch to 2D Street View (Standard OpenStreetMap)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2D Street (OSM)</span>
          </button>

          <button
            type="button"
            onClick={() => handleToggleMode('3d')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              mapMode === '3d'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Switch to 3D Perspective City View with Extruded Buildings"
          >
            <Box className="w-3.5 h-3.5 text-teal-300" />
            <span>3D City Perspective</span>
          </button>
        </div>

        {/* Dynamic 3D Camera Info Badge */}
        {mapMode === '3d' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tilt: {mapPitch}°</span>
            <span>·</span>
            <span>Rotation: {mapBearing}°</span>
          </div>
        )}
      </div>

      {/* COMPACT ROUTE INFORMATION CARD */}
      {activeRouteInfo && (
        <div className="absolute top-16 left-4 z-40 w-76 max-w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 shadow-2xl p-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase font-bold text-indigo-600 flex items-center gap-1">
                <Navigation className="w-3 h-3 text-indigo-600" />
                <span>Road Route (OSRM)</span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                {activeRouteInfo.repairerName}
              </h4>
            </div>
            <button
              onClick={handleClearRoute}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
              title="Clear road route"
              aria-label="Clear route"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Distance</span>
              <strong className="font-extrabold text-slate-900 text-sm font-mono">
                {activeRouteInfo.distance} away
              </strong>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Est. Drive Time</span>
              <strong className="font-bold text-indigo-700 text-xs flex items-center justify-end gap-1">
                <Clock className="w-3 h-3 text-indigo-600" />
                <span>Approx. {activeRouteInfo.duration} by road</span>
              </strong>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-400 font-mono">
              {mapMode === '3d' ? '3D Extruded Perspective' : '2D Street Map'}
            </span>
            <button
              type="button"
              onClick={handleClearRoute}
              className="px-3 py-1 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
            >
              Clear Route
            </button>
          </div>
        </div>
      )}

      {/* TOP FLOATING "SEARCH THIS AREA" BUTTON */}
      {hasMovedFromCenter && onSearchThisArea && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <button
            onClick={() => {
              onSearchThisArea(currentMapCenter.lat, currentMapCenter.lng);
              setHasMovedFromCenter(false);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-full shadow-xl border border-indigo-500 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search This Area</span>
          </button>
        </div>
      )}

      {/* SCANNING RADAR OVERLAY */}
      {isScanning && (
        <div className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] z-50 flex items-center justify-center pointer-events-auto transition-opacity">
          <div className="bg-white rounded-2xl px-6 py-4 shadow-2xl border border-slate-200 flex items-center gap-3.5 max-w-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span>Scanning Bhopal repairers…</span>
                <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">Bhopal</span>
              </div>
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                Filtering verified workshops by proximity & warranty
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT ON-MAP STORE PREVIEW CARD */}
      {activeStore && (
        <div 
          className="absolute bottom-4 left-4 right-4 sm:left-4 sm:right-auto sm:w-80 z-40 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Header: Store Name, Demo Badge, Close */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{activeStore.name}</h4>
                  <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                    Demo
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                  <span className="text-amber-600 font-bold flex items-center">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                    {activeStore.rating}
                  </span>
                  <span>({activeStore.reviewCount})</span>
                  <span>·</span>
                  <span className="text-indigo-600 font-bold">{activeStore.distanceKm} km</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectStore('')}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close store preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-slate-100 font-mono">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Turnaround</span>
                <span className="font-semibold text-slate-800">
                  {activeStore.estimatedHours < 24 ? `${activeStore.estimatedHours} hrs` : `${Math.round(activeStore.estimatedHours / 24)} days`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Warranty</span>
                <span className="font-semibold text-emerald-700">{activeStore.warrantyDays} Days</span>
              </div>
            </div>

            {/* Actions: View Details & View Route */}
            <div className="flex items-center gap-2 pt-1">
              {onViewDetails && (
                <button
                  type="button"
                  onClick={() => onViewDetails(activeStore)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition text-center"
                >
                  View Details
                </button>
              )}

              <button
                type="button"
                onClick={() => handleCalculateRoute(activeStore)}
                disabled={routeLoading}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${routeLoading ? 'animate-spin' : ''}`} />
                <span>{routeLoading ? 'Routing…' : 'View Route'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING MAP CONTROLS (Top Right) */}
      <div className="absolute top-4 right-4 z-40 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition flex items-center justify-center border-b border-slate-100 cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition flex items-center justify-center cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Recenter on Bhopal */}
        <button
          type="button"
          onClick={handleRecenter}
          className="p-2.5 bg-white/95 backdrop-blur-md text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-2xl shadow-xl border border-slate-200 transition flex items-center justify-center cursor-pointer"
          title="Reset View to Bhopal Center"
          aria-label="Recenter map"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Reset North / Compass in 3D Mode */}
        {mapMode === '3d' && (
          <button
            type="button"
            onClick={handleResetNorth}
            className="p-2.5 bg-white/95 backdrop-blur-md text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-2xl shadow-xl border border-slate-200 transition flex items-center justify-center cursor-pointer"
            title="Reset North Orientation"
            aria-label="Reset North"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
          </button>
        )}
      </div>
    </div>
  );
};
