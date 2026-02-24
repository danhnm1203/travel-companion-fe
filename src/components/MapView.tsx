import { DayItinerary, POI } from '@/data/mockData';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  day: DayItinerary;
}

const typeColors: Record<string, string> = {
  sightseeing: '#3b82f6',
  food: '#f97316',
  accommodation: '#a855f7',
  rest: '#9ca3af'
};

const typeLabels: Record<string, string> = {
  sightseeing: 'Tham quan',
  food: 'Ăn uống',
  accommodation: 'Nghỉ ngơi',
  rest: 'Di chuyển'
};

// Helper function to get area name from POI
const getAreaName = (poi: POI): string => {
  const name = poi.name.toLowerCase();
  
  if (name.includes('hà giang') || poi.lat < 23.0) {
    return 'TP. Hà Giang';
  } else if (name.includes('quản bạ') || (poi.lat >= 23.0 && poi.lat < 23.15)) {
    return 'Quản Bạ, Hà Giang';
  } else if (name.includes('đồng văn') || name.includes('nhà vương') || (poi.lat >= 23.25 && poi.lat < 23.29 && poi.lng < 105.37)) {
    return 'Đồng Văn, Hà Giang';
  } else if (name.includes('mã pí lèng') || name.includes('nho quế') || (poi.lat >= 23.25 && poi.lat < 23.27 && poi.lng >= 105.4)) {
    return 'Mèo Vạc, Hà Giang';
  } else if (name.includes('mèo vạc') || (poi.lat >= 23.15 && poi.lat < 23.20)) {
    return 'Mèo Vạc, Hà Giang';
  } else if (name.includes('lũng cú') || name.includes('lô lô') || poi.lat >= 23.3) {
    return 'Lũng Cú, Hà Giang';
  } else if (name.includes('sủng là')) {
    return 'Yên Minh, Hà Giang';
  }
  
  return 'Hà Giang';
};

export default function MapView({ day }: MapViewProps) {
  // Calculate center point
  const positions = day.pois.map(poi => ({ ...poi }));
  const centerLat = positions.reduce((sum, pos) => sum + pos.lat, 0) / positions.length;
  const centerLng = positions.reduce((sum, pos) => sum + pos.lng, 0) / positions.length;

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
              Lộ trình Ngày {day.day}
            </div>
          </div>
        </div>

        {/* Location list */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 px-2">Các điểm trên lộ trình</h3>
          {day.pois.filter(poi => poi.type !== 'rest').map((poi, index) => (
            <div
              key={poi.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{ backgroundColor: typeColors[poi.type] }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{poi.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {getAreaName(poi)}
                        </span>
                        <span>·</span>
                        <span>{poi.time}</span>
                        {poi.duration && (
                          <>
                            <span>·</span>
                            <span>{poi.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded whitespace-nowrap flex-shrink-0"
                      style={{ 
                        backgroundColor: `${typeColors[poi.type]}20`,
                        color: typeColors[poi.type]
                      }}
                    >
                      {typeLabels[poi.type]}
                    </span>
                  </div>
                  {poi.mustTry && (
                    <div className="mb-2">
                      <span className="inline-flex items-center text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-medium">
                        ⭐ Must-try
                      </span>
                    </div>
                  )}
                  {poi.tips && poi.tips.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {poi.tips.map((tip, i) => (
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
          ))}
        </div>

        {/* Route info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-4">
          <div className="flex items-center gap-2 text-emerald-800">
            <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
            <span className="text-sm font-medium">
              Tổng quãng đường: {day.summary.totalDistance} · Thời gian di chuyển: {day.summary.totalTravelTime}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
