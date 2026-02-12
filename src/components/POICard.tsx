import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';
import { POI } from '@/data/mockData';

interface POICardProps {
  poi: POI;
  showTravel: boolean;
}

const typeColors = {
  sightseeing: 'bg-blue-500',
  food: 'bg-orange-500',
  accommodation: 'bg-purple-500',
  rest: 'bg-gray-400'
};

const typeLabels = {
  sightseeing: 'Tham quan',
  food: 'Ăn uống',
  accommodation: 'Nghỉ ngơi',
  rest: 'Di chuyển'
};

export default function POICard({ poi, showTravel }: POICardProps) {
  const [showTips, setShowTips] = useState(false);
  const hasTips = poi.tips && poi.tips.length > 0;

  return (
    <div className="relative">
      {/* Travel segment */}
      {showTravel && poi.travelFromPrevious && (
        <div className="flex items-center gap-2 py-3 pl-5">
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex-1 flex items-center gap-2 text-sm text-gray-600">
            <span>↓</span>
            <span>🚗</span>
            <span>{poi.travelFromPrevious.duration}</span>
            <span>·</span>
            <span>{poi.travelFromPrevious.distance}</span>
          </div>
        </div>
      )}

      {/* Warning if exists */}
      {showTravel && poi.travelFromPrevious?.warning && (
        <div className="mb-2 ml-5 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">⚠️ {poi.travelFromPrevious.warning}</p>
        </div>
      )}

      {/* POI Card */}
      <div className="flex gap-3">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full ${typeColors[poi.type]} mt-2`}></div>
          <div className="w-px flex-1 bg-gray-200 min-h-[20px]"></div>
        </div>

        {/* Card content */}
        <div className="flex-1 pb-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-emerald-700">{poi.time}</span>
                  {poi.mustTry && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Must-try
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1">{poi.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">{typeLabels[poi.type]}</span>
                  {poi.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {poi.duration}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {poi.tags && poi.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {poi.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
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
                    {poi.tips?.map((tip, i) => (
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
