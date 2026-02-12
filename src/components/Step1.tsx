import { ArrowLeft } from 'lucide-react';
import { durationOptions } from '@/data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface Step1Props {
  selected?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step1({ selected, onSelect, onBack, onNext }: Step1Props) {
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 w-[20%] transition-all duration-300"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Bước 1/5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-32">
        <h2 className="text-3xl font-bold text-center mb-12">
          Đi mấy ngày nè?
        </h2>

        <div className="space-y-3">
          {durationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`w-full p-4 rounded-2xl border-2 transition-all ${
                selected === option.value
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">{option.label}</span>
                {option.popular && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                    Phổ biến nhất
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Micro-copy with animation */}
        <AnimatePresence>
          {selected && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-emerald-700 mt-6 font-medium"
            >
              Nice! Mình sắp xếp lịch trình vừa đủ cho bạn 👌
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed button at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={onNext}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selected
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
