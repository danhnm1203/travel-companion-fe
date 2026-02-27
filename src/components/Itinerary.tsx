import { useState, useMemo, useCallback } from 'react';
import { Share2, Bookmark, ThumbsUp, ThumbsDown, RefreshCw, Bed, MapPin, ExternalLink, Image } from 'lucide-react';
import { toast } from 'sonner';
import { type ItineraryResponse } from '@/lib/api';
import POICard from './POICard';
import dynamic from 'next/dynamic';

// Lazy-load heavy components
const InlineMapView = dynamic(() => import('./InlineMapView'), {
  ssr: false,
  loading: () => <div className="w-full h-56 bg-gray-100 animate-pulse" />,
});

const ItineraryInfographic = dynamic(() => import('./ItineraryInfographic'), {
  ssr: false,
});

interface ItineraryProps {
  itinerary: ItineraryResponse;
  onCreateNew: () => void;
}

function formatCurrency(vnd: number): string {
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(1)}tr`;
  if (vnd >= 1_000) return `${(vnd / 1_000).toFixed(0)}k`;
  return `${vnd}đ`;
}

/** Build a Google Maps Directions URL with multiple stops */
function buildGoogleMapsRouteUrl(items: { poi: { latitude: number; longitude: number } }[]): string {
  if (items.length === 0) return '#';
  // Format: /dir/lat1,lng1/lat2,lng2/.../latN,lngN
  const coords = items.map(item => `${item.poi.latitude},${item.poi.longitude}`);
  return `https://www.google.com/maps/dir/${coords.join('/')}`;
}

export default function Itinerary({ itinerary, onCreateNew }: ItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [feedbackGiven, setFeedbackGiven] = useState<'good' | 'bad' | null>(null);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);
  const [showInfographic, setShowInfographic] = useState(false);

  const currentDay = itinerary.days[activeDay];
  
  // Sort items by order_index to ensure correct sequence
  const sortedItems = useMemo(() => {
    return [...currentDay.items].sort((a, b) => a.order_index - b.order_index);
  }, [currentDay.items]);

  // Memoize aggregated stats to avoid recalculating on every render
  const { totalPois, totalFood } = useMemo(() => ({
    totalPois: itinerary.days.reduce((sum, d) => sum + d.items.length, 0),
    totalFood: itinerary.days.reduce(
      (sum, d) => sum + d.items.filter(item => {
        const note = item.notes?.toLowerCase() || '';
        return note === 'breakfast' || note === 'lunch' || note === 'dinner';
      }).length,
      0
    ),
  }), [itinerary.days]);

  // Stable callback refs to prevent child re-renders
  const handleShare = useCallback(() => {
    toast.success('Đã copy link!', {
      description: 'Link lịch trình đã được sao chép vào clipboard'
    });
  }, []);

  const handleSave = useCallback(() => {
    toast.info('Tính năng đang phát triển!', {
      description: 'Chức năng lưu lịch trình sẽ có trong phiên bản tiếp theo'
    });
  }, []);

  const handleFeedback = useCallback((type: 'good' | 'bad') => {
    setFeedbackGiven(type);
    if (type === 'good') {
      toast.success('Cảm ơn nha! Chúc đi vui 🎉');
    } else {
      setShowFeedbackOptions(true);
    }
  }, []);

  const handleFeedbackOption = useCallback((_option: string) => {
    toast.success('Noted! Mình sẽ cải thiện 🙏');
    setShowFeedbackOptions(false);
  }, []);

  return (
    <>
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-3 space-y-3">
          {/* Title row with action buttons on same line */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-bold leading-tight">{itinerary.title}</h1>
              <p className="text-xs text-gray-600 mt-0.5">
                {itinerary.num_days} ngày · {totalPois} điểm đến · {totalFood} quán ăn
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Chia sẻ"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Lưu"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day tabs with stats */}
          <div className="flex gap-2">
            {itinerary.days.map((day, index) => {
              const poiCount = day.items.length;
              return (
                <button
                  key={day.day_number}
                  onClick={() => setActiveDay(index)}
                  className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                    activeDay === index
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <div>Ngày {day.day_number}</div>
                  <div className={`text-xs mt-0.5 ${
                    activeDay === index ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {day.distance_km.toFixed(0)}km · {poiCount} điểm
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Inline map */}
        <InlineMapView days={itinerary.days} activeDay={activeDay} />

        <div className="px-4 py-4">
          {/* Day title + Google Maps route button */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">{currentDay.theme}</h2>
            <a
              href={buildGoogleMapsRouteUrl(currentDay.items)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Mở lộ trình Ngày {currentDay.day_number} trong Google Maps
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* POI timeline */}
          <div className="space-y-0">
            {sortedItems.map((item, index) => (
              <POICard
                key={`day-${currentDay.day_number}-${item.order_index}-${item.poi.id}-${index}`}
                item={item}
                showTravel={index > 0}
              />
            ))}
          </div>

          {/* Accommodation card */}
          {currentDay.accommodation && (
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bed className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Chỗ nghỉ</h3>
              </div>
              <p className="font-medium text-gray-900">{currentDay.accommodation.name}</p>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                <span>💰 {formatCurrency(currentDay.accommodation.avg_cost_vnd)}</span>
                {currentDay.accommodation.google_rating && (
                  <span>⭐ {currentDay.accommodation.google_rating}</span>
                )}
              </div>
            </div>
          )}

          {/* Day summary */}
          <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Tổng kết Ngày {currentDay.day_number}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-600">Tổng quãng đường</div>
                <div className="font-semibold">{currentDay.distance_km.toFixed(1)} km</div>
              </div>
              <div>
                <div className="text-gray-600">Số điểm dừng</div>
                <div className="font-semibold">{currentDay.items.length} điểm</div>
              </div>
            </div>
          </div>

          {/* Footer actions - only show on last day */}
          {activeDay === itinerary.days.length - 1 && (
            <div className="mt-10 space-y-6 pb-6">
              {/* Separator */}
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Lịch trình xong rồi nè! 🎉</h3>
                  <p className="text-sm text-gray-600">
                    Tổng quãng đường: {itinerary.total_distance_km.toFixed(1)} km
                  </p>
                </div>
              </div>

              {/* Share/Save/Infographic buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  📤 Gửi cho nhóm coi
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  💾 Lưu lại
                </button>
              </div>

              <button
                onClick={() => setShowInfographic(true)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Image className="w-5 h-5" />
                Tạo Infographic lịch trình
              </button>

              {/* Feedback */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-semibold mb-3 text-center">Lịch trình ổn không bạn?</p>

                {!feedbackGiven && (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => handleFeedback('good')}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Ổn đó
                    </button>
                    <button
                      onClick={() => handleFeedback('bad')}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                    >
                      <ThumbsDown className="w-5 h-5" />
                      Chưa lắm
                    </button>
                  </div>
                )}

                {feedbackGiven === 'good' && (
                  <div className="text-center text-emerald-700 font-medium">
                    Cảm ơn nha! Chúc đi vui 🎉
                  </div>
                )}

                {showFeedbackOptions && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-2">Chỗ nào chưa ổn nè?</p>
                    <div className="flex flex-wrap gap-2">
                      {['Dày lịch quá', 'Thiếu chỗ ăn', 'Muốn thêm điểm', 'Khác'].map(option => (
                        <button
                          key={option}
                          onClick={() => handleFeedbackOption(option)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Create new */}
              <button
                onClick={onCreateNew}
                className="w-full py-3 bg-white border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Tạo lịch trình khác
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Infographic modal */}
    {showInfographic && (
      <ItineraryInfographic
        itinerary={itinerary}
        onClose={() => setShowInfographic(false)}
      />
    )}
    </>
  );
}