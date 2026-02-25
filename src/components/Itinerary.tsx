import { useState } from 'react';
import { Share2, Bookmark, ThumbsUp, ThumbsDown, RefreshCw, Smartphone, Bed } from 'lucide-react';
import { toast } from 'sonner';
import { type ItineraryResponse } from '@/lib/api';
import POICard from './POICard';
import MapView from './MapView';

interface ItineraryProps {
  itinerary: ItineraryResponse;
  onCreateNew: () => void;
}

type ViewMode = 'list' | 'map';

function formatCurrency(vnd: number): string {
  if (vnd >= 1_000_000) return `${(vnd / 1_000_000).toFixed(1)}tr`;
  if (vnd >= 1_000) return `${(vnd / 1_000).toFixed(0)}k`;
  return `${vnd}đ`;
}

export default function Itinerary({ itinerary, onCreateNew }: ItineraryProps) {
  const [activeDay, setActiveDay] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [feedbackGiven, setFeedbackGiven] = useState<'good' | 'bad' | null>(null);
  const [showFeedbackOptions, setShowFeedbackOptions] = useState(false);

  const currentDay = itinerary.days[activeDay];
  const totalPois = itinerary.days.reduce((sum, d) => sum + d.items.length, 0);
  const totalFood = itinerary.days.reduce(
    (sum, d) => sum + d.items.filter(item => item.poi.categories.includes('food')).length,
    0
  );

  const handleShare = () => {
    toast.success('Đã copy link!', {
      description: 'Link lịch trình đã được sao chép vào clipboard'
    });
  };

  const handleSave = () => {
    toast.info('Tính năng đang phát triển!', {
      description: 'Chức năng lưu lịch trình sẽ có trong phiên bản tiếp theo'
    });
  };

  const handleFeedback = (type: 'good' | 'bad') => {
    setFeedbackGiven(type);
    if (type === 'good') {
      toast.success('Cảm ơn nha! Chúc đi vui 🎉');
    } else {
      setShowFeedbackOptions(true);
    }
  };

  const handleFeedbackOption = (option: string) => {
    toast.success('Noted! Mình sẽ cải thiện 🙏');
    setShowFeedbackOptions(false);
  };

  const handleOfflineApp = () => {
    toast.info('App đang phát triển, follow mình nha!');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 space-y-3">
        {/* Title row with action buttons */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight mb-0.5">{itinerary.title}</h1>
            <p className="text-xs text-gray-600">
              {itinerary.num_days} ngày · {totalPois} điểm đến · {totalFood} quán ăn
            </p>
          </div>
          <div className="flex items-center gap-2">
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

        {/* View toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Lịch trình
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🗺️ Bản đồ
          </button>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2">
          {itinerary.days.map((day, index) => (
            <button
              key={day.day_number}
              onClick={() => setActiveDay(index)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeDay === index
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Ngày {day.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Content area - scrollable */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <div className="px-6 py-4">
            {/* Day title */}
            <h2 className="text-lg font-bold mb-4">{currentDay.theme}</h2>

            {/* POI timeline */}
            <div className="space-y-0">
              {currentDay.items.map((item, index) => (
                <POICard
                  key={item.poi.id}
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
                  <span className="capitalize">{currentDay.accommodation.budget_level}</span>
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

            {/* Footer actions - only show on last day's list view */}
            {activeDay === itinerary.days.length - 1 && (
              <div className="mt-8 space-y-6 pb-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Lịch trình xong rồi nè! 🎉</h3>
                  <p className="text-sm text-gray-600">
                    Tổng quãng đường: {itinerary.total_distance_km.toFixed(1)} km
                  </p>
                </div>

                {/* Share/Save buttons */}
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

                {/* Feedback */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <p className="font-semibold mb-3 text-center">Lịch trình ổn không bạn?</p>
                  
                  {!feedbackGiven && (
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleFeedback('good')}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-medium transition-colors"
                      >
                        <ThumbsUp className="w-5 h-5" />
                        Ổn đó
                      </button>
                      <button
                        onClick={() => handleFeedback('bad')}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
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

                {/* Offline app */}
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl p-5 text-center">
                  <p className="font-semibold mb-2">📱 Muốn dùng offline khi đi?</p>
                  <button
                    onClick={handleOfflineApp}
                    className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                  >
                    Tải app (Coming soon)
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            <MapView day={currentDay} />
          </div>
        )}
      </div>
    </div>
  );
}