import { X, MapPin, Map } from 'lucide-react';
import { type ItineraryItemResponse } from '@/lib/api';
import { getCategoryLabel, getCategoryEmoji } from '@/data/categories';

interface POIDetailSheetProps {
  item: ItineraryItemResponse;
  onClose: () => void;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
}

export default function POIDetailSheet({ item, onClose }: POIDetailSheetProps) {
  const { poi } = item;

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom sheet - fixed but constrained to mobile frame */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[430px] bg-white rounded-t-2xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">
        {/* Drag handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="pb-20">
            {/* SECTION A — Hero gradient */}
            <div className="relative">
              <div className="w-full h-[200px] bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center px-6">
                <h2 className="text-white text-2xl font-bold drop-shadow-lg text-center">
                  {poi.name}
                </h2>
              </div>
            </div>

            {/* SECTION B — Header Info */}
            <div className="px-5 pt-5">
              <h1 className="text-xl font-bold mb-2">{poi.name}</h1>

              {/* Category + must-visit badge */}
              <div className="flex items-center gap-1.5 mb-2 text-sm text-gray-700 flex-wrap">
                <span>
                  {getCategoryEmoji(poi.categories)} {getCategoryLabel(poi.categories)}
                </span>
                {poi.must_visit && (
                  <>
                    <span>·</span>
                    <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Must-try
                    </span>
                  </>
                )}
              </div>

              {/* Rating */}
              {poi.google_rating != null && (
                <div className="text-sm text-gray-600 mb-3">
                  ⭐ {poi.google_rating.toFixed(1)}
                  {poi.google_reviews_count != null && (
                    <span> ({poi.google_reviews_count.toLocaleString()} đánh giá)</span>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 mb-6">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${poi.latitude},${poi.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  Chỉ đường đến đây
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Map className="w-4 h-4" />
                  Mở trên Google Maps
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mx-5 mb-6"></div>

            {/* SECTION C — Practical Info */}
            <div className="px-5 mb-6">
              <h3 className="text-base font-bold mb-3">📋 Thông tin cần biết</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {item.duration_minutes > 0 && (
                  <div>
                    <div className="text-gray-600 mb-1">⏱ Nên dành</div>
                    <div className="font-medium">~{formatDuration(item.duration_minutes)}</div>
                  </div>
                )}
                {poi.google_rating != null && (
                  <div>
                    <div className="text-gray-600 mb-1">⭐ Đánh giá</div>
                    <div className="font-medium">
                      {poi.google_rating.toFixed(1)}
                      {poi.google_reviews_count != null && ` (${poi.google_reviews_count.toLocaleString()})`}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-600 mb-1">📍 Loại</div>
                  <div className="font-medium">{getCategoryLabel(poi.categories)}</div>
                </div>
                {item.notes && (
                  <div>
                    <div className="text-gray-600 mb-1">📝 Ghi chú</div>
                    <div className="font-medium">{item.notes}</div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION D — Warnings */}
            {poi.warnings && poi.warnings.length > 0 && (
              <div className="px-5 mb-6">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <h3 className="text-base font-bold mb-2 text-amber-900">⚠️ Lưu ý</h3>
                  <div className="space-y-2">
                    {poi.warnings.map((warning, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">
                        {warning}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION E — Local Tips */}
            {poi.tips && poi.tips.length > 0 && (
              <div className="px-5 mb-6">
                <h3 className="text-base font-bold mb-3">💡 Mẹo từ người đi trước</h3>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  {poi.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-emerald-600 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION F — Top Reviews */}
            {(() => {
              const validReviews = poi.top_reviews?.filter(
                (r) => r.content && r.content !== 'UNKNOWN'
              ) ?? [];
              if (validReviews.length === 0) return null;
              return (
                <div className="px-5 mb-6">
                  <h3 className="text-base font-bold mb-3">💬 Đánh giá nổi bật</h3>
                  <div className="space-y-3">
                    {validReviews.map((review, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-sm">
                            {'⭐'.repeat(Math.min(review.rating, 5))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {review.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </>
  );
}
