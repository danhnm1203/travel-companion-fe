import { useState, memo } from 'react';
import { ChevronUp, Clock, Car } from 'lucide-react';
import { type ItineraryItemResponse } from '@/lib/api';

interface POICardProps {
  item: ItineraryItemResponse;
  showTravel: boolean;
}

const categoryColors: Record<string, { bg: string; border: string }> = {
  attraction: { bg: 'bg-blue-500', border: 'border-l-blue-500' },
  food: { bg: 'bg-orange-500', border: 'border-l-orange-500' },
  accommodation: { bg: 'bg-purple-500', border: 'border-l-purple-500' },
  cafe: { bg: 'bg-amber-500', border: 'border-l-amber-500' },
  shopping: { bg: 'bg-pink-500', border: 'border-l-pink-500' },
};

const categoryLabels: Record<string, string> = {
  attraction: 'Tham quan',
  food: 'Ăn uống',
  accommodation: 'Nghỉ ngơi',
  cafe: 'Cafe',
  shopping: 'Mua sắm',
};

function getCategoryStyle(categories: string[]): { bg: string; border: string } {
  for (const cat of categories) {
    if (categoryColors[cat]) return categoryColors[cat];
  }
  return { bg: 'bg-gray-400', border: 'border-l-gray-400' };
}

function getCategoryLabel(categories: string[]): string {
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

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

const POICard = memo(function POICard({ item, showTravel }: POICardProps) {
  const [showAllTips, setShowAllTips] = useState(false);
  const { poi } = item;
  const hasTips = poi.tips && poi.tips.length > 0;
  const hasWarnings = poi.warnings && poi.warnings.length > 0;
  const firstTip = poi.tips?.[0];
  const remainingTips = poi.tips?.slice(1) || [];
  const catStyle = getCategoryStyle(poi.categories);
  const isMustTry = item.match_score >= 0.85;

  return (
    <div className="relative">
      {/* Travel segment */}
      {showTravel && item.travel_time_from_prev_minutes != null && (
        <div className="flex items-center gap-2 py-3 pl-5">
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-600">
            <Car className="w-4 h-4" />
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
          <div className={`w-3 h-3 rounded-full ${catStyle.bg} mt-2`}></div>
          <div className="w-px flex-1 bg-gray-200 min-h-[20px]"></div>
        </div>

        {/* Card content */}
        <div className="flex-1 pb-4">
          <div className={`bg-white border-l-4 ${catStyle.border} border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow`}>

            {/* Line 1: Time + Badges */}
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-semibold text-emerald-700">{formatTime(item.visit_time)}</span>
              <div className="flex gap-1.5">
                {isMustTry && (
                  <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    Must-try
                  </span>
                )}
              </div>
            </div>

            {/* Line 2: POI Name */}
            <h3 className="font-bold text-lg mb-2">{poi.name}</h3>

            {/* Line 3: Rating */}
            {poi.google_rating != null && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                <span>⭐ {poi.google_rating.toFixed(1)}</span>
              </div>
            )}

            {/* Line 4: Duration + Travel Time */}
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
              {item.duration_minutes > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(item.duration_minutes)}
                </span>
              )}
              {showTravel && item.travel_time_from_prev_minutes != null && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5" />
                    {formatDuration(item.travel_time_from_prev_minutes)} từ điểm trước
                  </span>
                </>
              )}
            </div>

            {/* Line 5: Type Tag */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">
                {getCategoryLabel(poi.categories)}
              </span>
            </div>

            {/* Notes */}
            {item.notes && (
              <p className="text-sm text-gray-700 mb-2 italic">{item.notes}</p>
            )}

            {/* Line 6: Preview Tip */}
            {firstTip && (
              <div className="mb-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-600 text-base">💡</span>
                  <span className="flex-1">{firstTip}</span>
                </div>
              </div>
            )}

            {/* Line 7: "Xem thêm tips" toggle */}
            {remainingTips.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="text-sm text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700"
                >
                  {showAllTips ? (
                    <>
                      Thu gọn <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Xem thêm tips ▼
                    </>
                  )}
                </button>

                {showAllTips && (
                  <div className="mt-2 space-y-2">
                    {remainingTips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                        <span className="text-emerald-600">💡</span>
                        <span className="flex-1">{tip}</span>
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
});

export default POICard;
