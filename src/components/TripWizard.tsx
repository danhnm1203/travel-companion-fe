"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from '@/components/ui/sonner';
import Landing from '@/components/Landing';
import Step1 from '@/components/Step1';
import Step2 from '@/components/Step2';
import Step3 from '@/components/Step3';
import Step4 from '@/components/Step4';
import Step5 from '@/components/Step5';
import LoadingScreen from '@/components/LoadingScreen';
import Itinerary from '@/components/Itinerary';

export interface TripSelections {
  duration?: string;
  companion?: string;
  vibes: string[];
  budget?: string;
}

export type Screen = 'landing' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'loading' | 'itinerary';

export default function TripWizard() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [direction, setDirection] = useState(1);
  const [selections, setSelections] = useState<TripSelections>({
    vibes: []
  });

  const navigateTo = (screen: Screen, dir = 1) => {
    setDirection(dir);
    setCurrentScreen(screen);
  };

  const updateSelection = <K extends keyof TripSelections>(
    key: K,
    value: TripSelections[K]
  ) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  };

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

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <Landing onStart={() => navigateTo('step1')} />;
      case 'step1':
        return (
          <Step1
            selected={selections.duration}
            onSelect={(value) => updateSelection('duration', value)}
            onBack={() => navigateTo('landing', -1)}
            onNext={() => navigateTo('step2')}
          />
        );
      case 'step2':
        return (
          <Step2
            selected={selections.companion}
            onSelect={(value) => updateSelection('companion', value)}
            onBack={() => navigateTo('step1', -1)}
            onNext={() => navigateTo('step3')}
          />
        );
      case 'step3':
        return (
          <Step3
            selected={selections.vibes}
            onSelect={(value) => updateSelection('vibes', value)}
            onBack={() => navigateTo('step2', -1)}
            onNext={() => navigateTo('step4')}
          />
        );
      case 'step4':
        return (
          <Step4
            selected={selections.budget}
            onSelect={(value) => updateSelection('budget', value)}
            onBack={() => navigateTo('step3', -1)}
            onNext={() => navigateTo('step5')}
          />
        );
      case 'step5':
        return (
          <Step5
            selections={selections}
            onBack={() => navigateTo('step4', -1)}
            onEdit={(step) => navigateTo(step as Screen, -1)}
            onCreate={() => navigateTo('loading')}
          />
        );
      case 'loading':
        return <LoadingScreen onComplete={() => navigateTo('itinerary')} />;
      case 'itinerary':
        return (
          <Itinerary
            selections={selections}
            onCreateNew={() => navigateTo('step5', -1)}
          />
        );
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
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
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
