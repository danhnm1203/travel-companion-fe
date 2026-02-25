import { MapPin } from 'lucide-react';
import { type DayResponse, type ItineraryItemResponse } from '@/lib/api';

interface MapViewProps {
  day: DayResponse;
}

const categoryColors: Record<string, string> = {
  attraction: '#3b82f6',
  food: '#f97316',
  accommodation: '#a855f7',
  cafe: '#f59e0b',
  shopping: '#ec4899',
};

const categoryLabels: Record<string, string> = {
  attraction: 'Tham quan',
  food: 'Ăn uống',
  accommodation: 'Nghỉ ngơi',
  cafe: 'Cafe',
  shopping: 'Mua sắm',
};

function getCatColor(categories: string[]): string {
  for (const cat of categories) {
    if (categoryColors[cat]) return categoryColors[cat];
  }
  return '#9ca3af';
}

function getCatLabel(categories: string[]): string {
  for (const cat of categories) {
    if (categoryLabels[cat]) return categoryLabels[cat];
  }
  return categories[0] ?? 'Điểm đến';
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export default function MapView({ day }: MapViewProps) {
  // Calculate center from all items' POIs
  const allPois = day.items.map(item => item.poi);
  const centerLat = allPois.reduce((sum, p) => sum + p.latitude, 0) / (allPois.length || 1);
  const centerLng = allPois.reduce((sum, p) => sum + p.longitude, 0) / (allPois.length || 1);

  return (
    <div className="h-full w-full bg-gray-50 overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* Map placeholder */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div
            className="w-full h-80 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center relative"
            style={{
              backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/${centerLng},${centerLat},9,0/400x320@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600">
              Lộ trình Ngày {day.day_number}
            </div>
          </div>
        </div>

        {/* Location list */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 px-2">Các điểm trên lộ trình</h3>
          {day.items.map((item, index) => {
            const color = getCatColor(item.poi.categories);
            return (
              <div
                key={item.poi.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.poi.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.poi.latitude.toFixed(3)}, {item.poi.longitude.toFixed(3)}
                          </span>
                          <span>·</span>
                          <span>{formatTime(item.visit_time)}</span>
                          {item.duration_minutes > 0 && (
                            <>
                              <span>·</span>
                              <span>{formatDuration(item.duration_minutes)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color
                        }}
                      >
                        {getCatLabel(item.poi.categories)}
                      </span>
                    </div>
                    {item.match_score >= 0.85 && (
                      <div className="mb-2">
                        <span className="inline-flex items-center text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-medium">
                          ⭐ Must-try
                        </span>
                      </div>
                    )}
                    {item.poi.tips && item.poi.tips.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {item.poi.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-emerald-50 p-2 rounded">
                            <span className="text-emerald-600">💡</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Route info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm font-medium">
              Tổng quãng đường: {day.distance_km.toFixed(1)} km
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
