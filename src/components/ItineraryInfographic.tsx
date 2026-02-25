'use client';

import { useRef, useState, useCallback } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { type ItineraryResponse, type DayResponse, type ItineraryItemResponse } from '@/lib/api';
import { getCategoryEmoji } from '@/data/categories';

interface ItineraryInfographicProps {
  itinerary: ItineraryResponse;
  onClose: () => void;
}

function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

function getTimeOfDay(timeStr: string): 'morning' | 'afternoon' | 'evening' {
  const hour = parseInt(timeStr.slice(0, 2), 10);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

const timeOfDayLabels = {
  morning: { label: 'Buổi sáng', emoji: '🌅', color: '#f59e0b' },
  afternoon: { label: 'Buổi chiều', emoji: '☀️', color: '#ea580c' },
  evening: { label: 'Buổi tối', emoji: '🌙', color: '#7c3aed' },
};

function groupByTimeOfDay(items: ItineraryItemResponse[]) {
  const groups: Record<string, ItineraryItemResponse[]> = {
    morning: [],
    afternoon: [],
    evening: [],
  };
  items.forEach(item => {
    const tod = getTimeOfDay(item.visit_time);
    groups[tod].push(item);
  });
  return groups;
}

// The main accent color matching the template
const ACCENT = '#059669';
const BG_CREAM = '#f0fdf4';
const BG_WHITE = '#ffffff';

export default function ItineraryInfographic({ itinerary, onClose }: ItineraryInfographicProps) {
  const infographicRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!infographicRef.current) return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const canvas = await html2canvas(infographicRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: BG_CREAM,
        width: 430,
        windowWidth: 430,
      });

      const link = document.createElement('a');
      link.download = `${itinerary.title.replace(/\s+/g, '_')}_infographic.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate infographic:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [itinerary.title]);

  const totalPois = itinerary.days.reduce((sum, d) => sum + d.items.length, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-[460px] w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-lg">Infographic lịch trình</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable preview */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* ─── Infographic content ─── */}
          <div
            ref={infographicRef}
            style={{
              width: 430,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundColor: BG_CREAM,
            }}
          >
            {/* ═══ Cover Section ═══ */}
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              {/* Decorative top */}
              <div style={{ fontSize: 14, color: ACCENT, fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>
                ✦ LỊCH TRÌNH CHI TIẾT ✦
              </div>

              {/* Title */}
              <h1 style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#1a1a1a',
                lineHeight: 1.3,
                marginBottom: 16,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}>
                {itinerary.title}
              </h1>

              {/* Destination badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 16px',
                backgroundColor: ACCENT,
                color: 'white',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600,
              }}>
                📍 {itinerary.destination_name}
              </div>

              {/* Trip stats row */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                marginTop: 20,
                fontSize: 13,
                color: '#666',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: ACCENT }}>{itinerary.num_days}</div>
                  <div>ngày</div>
                </div>
                <div style={{ width: 1, backgroundColor: '#ddd' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: ACCENT }}>{totalPois}</div>
                  <div>điểm đến</div>
                </div>
                <div style={{ width: 1, backgroundColor: '#ddd' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: ACCENT }}>{itinerary.total_distance_km.toFixed(0)}</div>
                  <div>km</div>
                </div>
              </div>
            </div>

            {/* ═══ Trip Overview — Zigzag Route ═══ */}
            <div style={{
              padding: '24px 20px',
              backgroundColor: BG_WHITE,
              position: 'relative',
            }}>
              {/* Section title */}
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 10, color: ACCENT, letterSpacing: 2, marginBottom: 4 }}>🧭</div>
                <h2 style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#1a1a1a',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                }}>
                  Tổng quan hành trình
                </h2>
              </div>

              {/* Route visualization */}
              <div style={{ position: 'relative', paddingBottom: 10 }}>
                {/* Vertical center dashed line (SVG for html2canvas compatibility) */}
                <svg
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 0,
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: '100%',
                    overflow: 'visible',
                  }}
                >
                  <line
                    x1="2" y1="0" x2="2" y2="100%"
                    stroke={ACCENT}
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    opacity={0.4}
                  />
                </svg>

                {/* Start badge */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: 20,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 18px',
                    backgroundColor: ACCENT,
                    color: 'white',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontStyle: 'italic',
                  }}>
                    Bắt đầu
                  </span>
                </div>

                {/* Day stops — zigzag */}
                {itinerary.days.map((day, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <div
                      key={day.day_number}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 16,
                        position: 'relative',
                        zIndex: 1,
                        flexDirection: isLeft ? 'row' : 'row-reverse',
                      }}
                    >
                      {/* Day content side */}
                      <div style={{
                        width: '42%',
                        textAlign: isLeft ? 'right' : 'left',
                        paddingRight: isLeft ? 12 : 0,
                        paddingLeft: isLeft ? 0 : 12,
                      }}>
                        <div style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: '#1a1a1a',
                          fontFamily: 'Georgia, "Times New Roman", serif',
                          fontStyle: 'italic',
                        }}>
                          Ngày {day.day_number}
                        </div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                          {day.theme}
                        </div>
                        <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
                          {day.items.length} điểm · {day.distance_km.toFixed(0)} km
                        </div>
                      </div>

                      {/* Center circle */}
                      <div style={{
                        width: '16%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: ACCENT,
                          border: '3px solid white',
                          boxShadow: `0 0 0 2px ${ACCENT}40`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 800,
                          fontSize: 16,
                        }}>
                          {day.day_number}
                        </div>
                      </div>

                      {/* Dashed connector line (horizontal) */}
                      <div style={{
                        width: '42%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isLeft ? 'flex-start' : 'flex-end',
                      }}>
                        <svg width="80" height="4" style={{ overflow: 'visible' }}>
                          <line
                            x1="0" y1="2" x2="80" y2="2"
                            stroke={ACCENT}
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            opacity={0.5}
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}

                {/* Finish badge */}
                <div style={{
                  textAlign: 'center',
                  marginTop: 8,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 16px',
                    backgroundColor: ACCENT,
                    color: 'white',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontStyle: 'italic',
                  }}>
                    Kết thúc
                  </span>
                </div>
              </div>
            </div>

            {/* ═══ Daily Schedules ═══ */}
            {itinerary.days.map((day, dayIndex) => {
              const timeGroups = groupByTimeOfDay(day.items);

              return (
                <div key={day.day_number}>
                  {/* Day header */}
                  <div style={{
                    backgroundColor: ACCENT,
                    padding: '14px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 16,
                        color: ACCENT,
                      }}>
                        {day.day_number}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>
                          Ngày {day.day_number}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                          {day.theme}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
                      {day.distance_km.toFixed(0)} km · {day.items.length} điểm
                    </div>
                  </div>

                  {/* Schedule content */}
                  <div style={{ padding: '16px 24px', backgroundColor: BG_WHITE }}>
                    {(['morning', 'afternoon', 'evening'] as const).map(period => {
                      const items = timeGroups[period];
                      if (items.length === 0) return null;
                      const info = timeOfDayLabels[period];

                      return (
                        <div key={period} style={{ marginBottom: 16 }}>
                          {/* Period header */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginBottom: 10,
                            paddingBottom: 6,
                            borderBottom: `2px solid ${ACCENT}20`,
                          }}>
                            <span style={{ fontSize: 16 }}>{info.emoji}</span>
                            <span style={{
                              fontWeight: 700,
                              fontSize: 14,
                              color: '#333',
                              fontFamily: 'Georgia, "Times New Roman", serif',
                              fontStyle: 'italic',
                            }}>
                              {info.label}
                            </span>
                          </div>

                          {/* POI entries */}
                          {items.map((item) => (
                            <div key={item.poi.id} style={{
                              display: 'flex',
                              gap: 10,
                              marginBottom: 8,
                              paddingLeft: 4,
                            }}>
                              {/* Time */}
                              <div style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: ACCENT,
                                minWidth: 42,
                                flexShrink: 0,
                                paddingTop: 1,
                              }}>
                                {formatTime(item.visit_time)}
                              </div>
                              {/* Content */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: '#1a1a1a',
                                  lineHeight: 1.3,
                                }}>
                                  {getCategoryEmoji(item.poi.categories)} {item.poi.name}
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 8,
                                  fontSize: 11,
                                  color: '#888',
                                  marginTop: 2,
                                }}>
                                  {item.duration_minutes > 0 && (
                                    <span>⏱ {item.duration_minutes} phút</span>
                                  )}
                                  {item.poi.google_rating != null && (
                                    <span>⭐ {item.poi.google_rating.toFixed(1)}</span>
                                  )}
                                </div>
                                {/* First tip */}
                                {item.poi.tips?.[0] && (
                                  <div style={{
                                    fontSize: 11,
                                    color: '#666',
                                    fontStyle: 'italic',
                                    marginTop: 3,
                                    paddingLeft: 2,
                                  }}>
                                    💡 {item.poi.tips[0]}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}

                    {/* Accommodation */}
                    {day.accommodation && (
                      <div style={{
                        marginTop: 8,
                        padding: '10px 14px',
                        backgroundColor: BG_CREAM,
                        borderRadius: 10,
                        border: `1px solid ${ACCENT}30`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 14 }}>🏨</span>
                          <span style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: ACCENT,
                            fontFamily: 'Georgia, "Times New Roman", serif',
                            fontStyle: 'italic',
                          }}>
                            Chỗ nghỉ
                          </span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                          {day.accommodation.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#888', marginTop: 2, display: 'flex', gap: 8 }}>
                          {day.accommodation.google_rating != null && (
                            <span>⭐ {day.accommodation.google_rating.toFixed(1)}</span>
                          )}
                          <span className="capitalize">{day.accommodation.budget_level}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ═══ Footer ═══ */}
            <div style={{
              padding: '20px 24px',
              textAlign: 'center',
              backgroundColor: BG_CREAM,
              borderTop: `2px solid ${ACCENT}30`,
            }}>
              <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                Tạo bởi
              </div>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: ACCENT,
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}>
                ✦ Travel Companion ✦
              </div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </div>
            </div>
          </div>
          {/* ─── End infographic ─── */}
        </div>

        {/* Download button */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full py-3 text-white rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            style={{ backgroundColor: ACCENT }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tạo ảnh...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Tải infographic
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
