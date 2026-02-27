"use client";

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import Landing from '@/components/Landing';
import Step1 from '@/components/Step1';
import Step2 from '@/components/Step2';
import Step3 from '@/components/Step3';
import Step4 from '@/components/Step4';
import Step5 from '@/components/Step5';
import LoadingScreen from '@/components/LoadingScreen';
import Itinerary from '@/components/Itinerary';
import {
  generateItinerary,
  type GenerateItineraryRequest,
  type ItineraryResponse,
} from '@/lib/api';
import { durationToNumDays, budgetAmountMap } from '@/data/mockData';

export interface TripSelections {
  duration?: string;
  companion?: string;
  vibes: string[];
  budget?: string;
}

export type Screen = 'landing' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'loading' | 'itinerary';

// Hardcoded IDs for Ha Giang (per the approved plan)
const DESTINATION_ID = 'e300b4bc-43ae-43e3-8d59-83fadc28c464';
const DEPARTURE_PROVINCE_ID = '2c316d27-f305-424a-9388-1aeba497e7a8';

// Extracted outside component to avoid recreating on every render
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0
  })
};

const slideTransition = {
  x: { type: 'spring' as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 }
};

export default function TripWizard() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<TripSelections>({
    vibes: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const navigateTo = useCallback((screen: Screen, dir = 1) => {
    setDirection(dir);
    setCurrentScreen(screen);
  }, []);

  const updateSelection = useCallback(<K extends keyof TripSelections>(
    key: K,
    value: TripSelections[K]
  ) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCreateItinerary = useCallback(async () => {
    navigateTo('loading');
    setIsGenerating(true);

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const request: GenerateItineraryRequest = {
      destination_id: DESTINATION_ID,
      departure_province_id: DEPARTURE_PROVINCE_ID,
      num_days: durationToNumDays[selections.duration ?? '3d2n'] ?? 3,
      start_date: today,
      budget_amount: budgetAmountMap[selections.budget ?? 'comfortable'] ?? 6_000_000,
      pace: 'moderate',
      companion_codes: selections.companion ? [selections.companion] : [],
      vibe_codes: selections.vibes,
      keep_same_accommodation: false,
    };

    try {
      const result = await generateItinerary(request);
      setIsGenerating(false);
      router.push(`/itinerary/${result.id}`);
    } catch (err) {
      setIsGenerating(false);
      navigateTo('step5', -1);
      toast.error('Không tạo được lịch trình 😢', {
        description: err instanceof Error ? err.message : 'Vui lòng thử lại sau',
      });
    }
  }, [selections, navigateTo]);

  // Stable callbacks for navigation — avoids recreating arrow functions each render
  const goToStep1 = useCallback(() => navigateTo('step1'), [navigateTo]);
  const goToLandingBack = useCallback(() => navigateTo('landing', -1), [navigateTo]);
  const goToStep2 = useCallback(() => navigateTo('step2'), [navigateTo]);
  const goToStep1Back = useCallback(() => navigateTo('step1', -1), [navigateTo]);
  const goToStep3 = useCallback(() => navigateTo('step3'), [navigateTo]);
  const goToStep2Back = useCallback(() => navigateTo('step2', -1), [navigateTo]);
  const goToStep4 = useCallback(() => navigateTo('step4'), [navigateTo]);
  const goToStep3Back = useCallback(() => navigateTo('step3', -1), [navigateTo]);
  const goToStep5 = useCallback(() => navigateTo('step5'), [navigateTo]);
  const goToStep4Back = useCallback(() => navigateTo('step4', -1), [navigateTo]);
  const goToStep5Back = useCallback(() => navigateTo('step5', -1), [navigateTo]);
  const handleEditStep = useCallback((step: string) => navigateTo(step as Screen, -1), [navigateTo]);

  const selectDuration = useCallback((v: string) => updateSelection('duration', v), [updateSelection]);
  const selectCompanion = useCallback((v: string) => updateSelection('companion', v), [updateSelection]);
  const selectVibes = useCallback((v: string[]) => updateSelection('vibes', v), [updateSelection]);
  const selectBudget = useCallback((v: string) => updateSelection('budget', v), [updateSelection]);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <Landing onStart={goToStep1} />;
      case 'step1':
        return (
          <Step1
            selected={selections.duration}
            onSelect={selectDuration}
            onBack={goToLandingBack}
            onNext={goToStep2}
          />
        );
      case 'step2':
        return (
          <Step2
            selected={selections.companion}
            onSelect={selectCompanion}
            onBack={goToStep1Back}
            onNext={goToStep3}
          />
        );
      case 'step3':
        return (
          <Step3
            selected={selections.vibes}
            onSelect={selectVibes}
            onBack={goToStep2Back}
            onNext={goToStep4}
          />
        );
      case 'step4':
        return (
          <Step4
            selected={selections.budget}
            onSelect={selectBudget}
            onBack={goToStep3Back}
            onNext={goToStep5}
          />
        );
      case 'step5':
        return (
          <Step5
            selections={selections}
            onBack={goToStep4Back}
            onEdit={handleEditStep}
            onCreate={handleCreateItinerary}
          />
        );
      case 'loading':
        return <LoadingScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-white relative overflow-hidden shadow-xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentScreen}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="absolute inset-0"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Toaster />
    </div>
  );
}
