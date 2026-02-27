import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { type DayResponse } from '@/lib/api';
import { getCategoryLabel, getCategoryColor } from '@/data/categories';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InlineMapViewProps {
  days: DayResponse[];
  activeDay: number;
}

// Fix default icon issue with Leaflet + Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const dayColors = ['#3b82f6', '#f97316', '#10b981', '#a855f7', '#ec4899'];

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export default function InlineMapView({ days, activeDay }: InlineMapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const routeLinesRef = useRef<L.Polyline[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  const initializeMap = (container: HTMLDivElement) => {
    // Collect all POIs from all days
    const allDaysData = days.map((day, dayIndex) => ({
      day: dayIndex,
      items: day.items,
      color: dayColors[dayIndex % dayColors.length],
    }));

    // Calculate center point of all POIs
    const allItems = allDaysData.flatMap(d => d.items);
    if (allItems.length === 0) return null;

    const lats = allItems.map(item => item.poi.latitude);
    const lngs = allItems.map(item => item.poi.longitude);
    const centerLat = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
    const centerLng = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;

    // Create map
    const map = L.map(container).setView([centerLat, centerLng], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    const routeLines: L.Polyline[] = [];
    const markers: L.Marker[] = [];
    let poiCounter = 0;

    // Draw routes and markers for each day
    allDaysData.forEach(({ items, color }) => {
      if (items.length === 0) return;

      // Draw route polyline for this day
      const routeCoords: [number, number][] = items.map(item => [item.poi.latitude, item.poi.longitude]);
      const polyline = L.polyline(routeCoords, {
        color: color,
        weight: 3,
        opacity: 0.8,
        dashArray: '10, 5',
      }).addTo(map);
      routeLines.push(polyline);

      // Add markers for this day's POIs
      items.forEach((item) => {
        poiCounter++;

        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 14px;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              ${poiCounter}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([item.poi.latitude, item.poi.longitude], { icon: customIcon }).addTo(map);
        markers.push(marker);

        // Add popup with POI info
        const catColor = getCategoryColor(item.poi.categories);
        marker.bindPopup(`
          <div style="min-width: 180px;">
            <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${item.poi.name}</h3>
            <p style="font-size: 12px; color: #666; margin: 2px 0;">${formatTime(item.visit_time)}</p>
            <span style="font-size: 11px; background: ${catColor}20; color: ${catColor}; padding: 2px 6px; border-radius: 4px; font-weight: 500;">
              ${getCategoryLabel(item.poi.categories)}
            </span>
          </div>
        `);
      });
    });

    // Add legend
    const legend = new L.Control({ position: 'topright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'map-legend');
      div.style.cssText = 'background: white; padding: 8px 12px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); font-size: 12px;';
      div.innerHTML = days.map((day, index) => `
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: ${index < days.length - 1 ? '4px' : '0'};">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dayColors[index % dayColors.length]};"></div>
          <span style="font-weight: 500; color: #374151;">Ngày ${day.day_number}</span>
        </div>
      `).join('');
      return div;
    };
    legend.addTo(map);

    // Fit bounds to show all markers
    const allCoords: [number, number][] = allItems.map(item => [item.poi.latitude, item.poi.longitude]);
    const bounds = L.latLngBounds(allCoords);
    map.fitBounds(bounds, { padding: [50, 50] });

    // Store references
    // Store references
    routeLinesRef.current = routeLines;
    markersRef.current = markers;


    return map;
  };

  // Initialize main map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = initializeMap(mapContainerRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map when activeDay changes
  useEffect(() => {
    if (!mapRef.current) return;

    const allDaysData = days.map((day, dayIndex) => ({
      day: dayIndex,
      items: day.items,
    }));

    // Update opacity based on active day
    routeLinesRef.current.forEach((line, dayIndex) => {
      if (activeDay === -1) {
        line.setStyle({ opacity: 0.8 });
      } else {
        line.setStyle({ opacity: dayIndex === activeDay ? 0.9 : 0.3 });
      }
    });

    markersRef.current.forEach((marker, markerIndex) => {
      // Determine which day this marker belongs to
      let currentItemCount = 0;
      let markerDay = -1;
      for (let i = 0; i < allDaysData.length; i++) {
        if (markerIndex < currentItemCount + allDaysData[i].items.length) {
          markerDay = i;
          break;
        }
        currentItemCount += allDaysData[i].items.length;
      }

      const opacity = activeDay === -1 || markerDay === activeDay ? '1' : '0.4';
      const color = dayColors[markerDay % dayColors.length] || '#6b7280';
      const newIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            opacity: ${opacity};
          ">
            ${markerIndex + 1}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      marker.setIcon(newIcon);
    });

    // Zoom to fit active day or all days
    if (activeDay !== -1 && allDaysData[activeDay]) {
      const activeDayItems = allDaysData[activeDay].items;
      if (activeDayItems.length > 0) {
        const coords: [number, number][] = activeDayItems.map(item => [item.poi.latitude, item.poi.longitude]);
        const bounds = L.latLngBounds(coords);
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }
    } else {
      const allItems = allDaysData.flatMap(d => d.items);
      const coords: [number, number][] = allItems.map(item => [item.poi.latitude, item.poi.longitude]);
      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [activeDay]);


  return (
    <>
      {/* Inline map */}
      <div
        ref={mapContainerRef}
        className="w-full h-56"
      ></div>
    </>
  );
}
