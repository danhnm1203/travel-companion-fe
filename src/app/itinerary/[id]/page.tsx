"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getItinerary, type ItineraryResponse } from '@/lib/api';
import Itinerary from '@/components/Itinerary';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchItinerary = async () => {
      try {
        const data = await getItinerary(id as string);
        setItinerary(data);
      } catch (err) {
        console.error('Failed to fetch itinerary:', err);
        toast.error('Không tìm thấy lịch trình 😢', {
          description: 'Vui lòng kiểm tra lại đường dẫn',
        });
        // Optional: redirect to home after a delay
        setTimeout(() => router.push('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy lịch trình</h1>
          <p className="text-gray-600">Bạn đang được chuyển hướng về trang chủ...</p>
          <Toaster />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative overflow-hidden shadow-xl">
        <Itinerary 
          itinerary={itinerary} 
          onCreateNew={() => router.push('/')} 
        />
      </div>
      <Toaster />
    </div>
  );
}
