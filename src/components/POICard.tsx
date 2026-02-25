import { useState } from 'react';
import { Clock, MapPin, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { type ItineraryItemResponse } from '@/lib/api';

interface POICardProps {
  item: ItineraryItemResponse;
  showTravel: boolean;
}

const categoryColors: Record<string, string> = {
  attraction: 'bg-blue-500',
  food: 'bg-orange-500',
  accommodation: 'bg-purple-500',
  cafe: 'bg-amber-500',
  shopping: 'bg-pink-500',
};

const categoryLabels: Record<string, string> = {
  attraction: 'Tham quan',
  food: 'Ăn uống',
  accommodation: 'Nghỉ ngơi',
  cafe: 'Cafe',
  shopping: 'Mua sắm',
};

function getCategoryColor(categories: string[]): string {
  for (const cat of categories) {
    if (categoryColors[cat]) return categoryColors[cat];
  }
  return 'bg-gray-400';
}

function getCategoryLabel(categories: string[]): string {
  for (const cat of categories) {
    if (categoryLabels[cat]) return categoryLabels[cat];
  }
  return categories[0] ?? 'Điểm đến';
}

function formatTime(timeStr: string): string {
  // "09:00:00" → "09:00"
  return timeStr.slice(0, 5);
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export default function POICard({ item, showTravel }: POICardProps) {
  const [showTips, setShowTips] = useState(false);
  const { poi } = item;
  const hasTips = poi.tips && poi.tips.length > 0;
  const hasWarnings = poi.warnings && poi.warnings.length > 0;

  return (
    <div className="relative">
      {/* Travel segment */}
      {showTravel && item.travel_time_from_prev_minutes != null && (
        <div className="flex items-center gap-2 py-3 pl-5">
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-600">
            <span>↓</span>
            <span>🚗</span>
            <span>{formatDuration(item.travel_time_from_prev_minutes)}</span>
            {item.distance_from_prev_km != null && (
              <>
                <span>·</span>
                <span>{formatDistance(item.distance_from_prev_km)}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {hasWarnings && poi.warnings.map((w, i) => (
        <div key={i} className="mb-2 ml-5 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">⚠️ {w}</p>
        </div>
      ))}

      {/* POI Card */}
      <div className="flex gap-3">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(poi.categories)} mt-2`}></div>
          <div className="w-px flex-1 bg-gray-200 min-h-[20px]"></div>
        </div>

        {/* Card content */}
        <div className="flex-1 pb-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-emerald-700">
                    {formatTime(item.visit_time)}
                  </span>
                  {item.match_score >= 0.85 && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Must-try
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1">{poi.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {getCategoryLabel(poi.categories)}
                  </span>
                  {item.duration_minutes > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(item.duration_minutes)}
                    </span>
                  )}
                  {poi.google_rating != null && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {poi.google_rating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {item.notes && (
              <p className="text-sm text-gray-700 mb-2 italic">{item.notes}</p>
            )}

            {/* Tips toggle */}
            {hasTips && (
              <div className="mt-3">
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700"
                >
                  {showTips ? (
                    <>
                      Thu gọn <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Xem local tips <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>

                {showTips && (
                  <div className="mt-2 space-y-1">
                    {poi.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50 p-2 rounded">
                        <span className="text-emerald-600">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
