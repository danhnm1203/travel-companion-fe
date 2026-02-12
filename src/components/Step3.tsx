import { ArrowLeft } from 'lucide-react';
import { vibeOptions } from '@/data/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface Step3Props {
  selected: string[];
  onSelect: (value: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function Step3({ selected, onSelect, onBack, onNext }: Step3Props) {
  const toggleVibe = (value: string) => {
    if (selected.includes(value)) {
      onSelect(selected.filter(v => v !== value));
    } else {
      onSelect([...selected, value]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 w-[60%] transition-all duration-300"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Bước 3/5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-32">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            Trải nghiệm kiểu gì?
          </h2>
          <p className="text-gray-600 text-sm">
            Chọn bao nhiêu cũng được, mình sắp xếp hết!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {vibeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleVibe(option.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-2 justify-center ${
                selected.includes(option.value)
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="font-semibold text-base">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Warning for too many selections */}
        <AnimatePresence>
          {selected.length >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl"
            >
              <p className="text-xs text-amber-800 text-center">
                Chọn nhiều vibe thì lịch trình sẽ đa dạng hơn, nhưng mỗi trải nghiệm sẽ ngắn hơn xíu nha 😊
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed button at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            selected.length > 0
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