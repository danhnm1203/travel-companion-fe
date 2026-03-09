import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type DayResponse } from '@/lib/api';
import { getCategoryLabel, getCategoryColor } from '@/data/categories';

interface InlineMapViewProps {
  days: DayResponse[];
  activeDay: number;
}

const dayColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#ec4899'];

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

async function fetchRoadRoute(items: DayResponse['items']): Promise<[number, number][]> {
  if (items.length < 2) return items.map(i => [i.poi.latitude, i.poi.longitude]);
  const coords = items.map(i => `${i.poi.longitude},${i.poi.latitude}`).join(';');
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
    );
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]) {
      return data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );
    }
  } catch {}
  return items.map(i => [i.poi.latitude, i.poi.longitude]);
}

function injectMarkerStyles() {
  if (document.getElementById('poi-marker-styles')) return;
  const style = document.createElement('style');
  style.id = 'poi-marker-styles';
  style.textContent = `
    .poi-marker-wrap {
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      transform-origin: center center;
    }
    .poi-marker-wrap:hover {
      transform: scale(1.25) !important;
      z-index: 1000 !important;
    }
  `;
  document.head.appendChild(style);
}

function buildIcon(num: number, color: string): L.DivIcon {
  const html = `
    <div class="poi-marker-wrap" style="
      width:22px;height:22px;border-radius:4px;
      border:2px solid ${color};
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      background-color:${color};
      cursor:pointer;
      display:flex;align-items:center;justify-content:center;
    ">
      <span style="color:white;font-weight:bold;font-size:10px;">${num}</span>
    </div>
  `;
  return L.divIcon({ html, className: '', iconSize: [22, 22], iconAnchor: [11, 11] });
}

export default function InlineMapView({ days, activeDay }: InlineMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    injectMarkerStyles();

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.eachLayer(layer => {
      if (!(layer instanceof L.TileLayer)) map.removeLayer(layer);
    });

    const visibleDays = activeDay === -1
      ? days.map((day, i) => ({ day, dayIndex: i }))
      : [{ day: days[activeDay], dayIndex: activeDay }].filter(x => x.day);

    const allCoords: [number, number][] = [];
    let poiCounter = 0;

    visibleDays.forEach(({ day, dayIndex }) => {
      const color = dayColors[dayIndex % dayColors.length];

      day.items.forEach(item => {
        poiCounter++;
        const num = poiCounter;
        const lat = item.poi.latitude;
        const lng = item.poi.longitude;
        allCoords.push([lat, lng]);

        const marker = L.marker([lat, lng], { icon: buildIcon(num, color) }).addTo(map);

        const catColor = getCategoryColor(item.poi.categories);
        marker.bindPopup(`
          <div style="min-width:160px;">
            <p style="font-weight:bold;margin-bottom:2px;font-size:13px;">${item.poi.name}</p>
            <p style="font-size:12px;color:#666;margin:2px 0;">${formatTime(item.visit_time)}</p>
            <span style="font-size:11px;background:${catColor}20;color:${catColor};padding:2px 6px;border-radius:4px;font-weight:500;">
              ${getCategoryLabel(item.poi.categories)}
            </span>
          </div>
        `);
      });
    });

    if (allCoords.length > 0) {
      map.fitBounds(L.latLngBounds(allCoords), { padding: [40, 40] });
    }

    visibleDays.forEach(async ({ day, dayIndex }) => {
      const color = dayColors[dayIndex % dayColors.length];
      const routeCoords = await fetchRoadRoute(day.items);
      if (mapRef.current) {
        L.polyline(routeCoords, { color, weight: 4, opacity: 0.85 }).addTo(mapRef.current);
      }
    });
  }, [days, activeDay]);

  return <div ref={containerRef} className="w-full h-56" />;
}
