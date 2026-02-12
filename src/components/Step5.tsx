import { ArrowLeft, Calendar, Users, Target, DollarSign, MapPin, ChevronRight } from 'lucide-react';
import { TripSelections } from '@/components/TripWizard';
import { durationOptions, companionOptions, vibeOptions, budgetOptions } from '@/data/mockData';

interface Step5Props {
  selections: TripSelections;
  onBack: () => void;
  onEdit: (step: string) => void;
  onCreate: () => void;
}

export default function Step5({ selections, onBack, onEdit, onCreate }: Step5Props) {
  const durationLabel = durationOptions.find(o => o.value === selections.duration)?.label;
  const companionLabel = companionOptions.find(o => o.value === selections.companion)?.label;
  const vibesLabel = selections.vibes
    .map(v => vibeOptions.find(vo => vo.value === v)?.label)
    .filter(Boolean)
    .join(', ');
  const budgetLabel = budgetOptions.find(o => o.value === selections.budget)?.title;

  const summaryRows = [
    { icon: Calendar, label: 'Thời gian', value: durationLabel, editStep: 'step1' },
    { icon: Users, label: 'Đi cùng', value: companionLabel, editStep: 'step2' },
    { icon: Target, label: 'Vibe', value: vibesLabel, editStep: 'step3' },
    { icon: DollarSign, label: 'Budget', value: budgetLabel, editStep: 'step4' },
    { icon: MapPin, label: 'Xuất phát', value: 'TP. Hà Giang', editStep: null },
  ];

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        {/* Progress bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 w-[100%] transition-all duration-300"></div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Bước 5/5</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-32">
        <h2 className="text-3xl font-bold text-center mb-3">
          Chuẩn hết rồi, tạo lịch trình nha! 🎒
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Kiểm tra lại thông tin nha bạn
        </p>

        {/* Summary card */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
          {summaryRows.map((row, index) => {
            const Icon = row.icon;
            const isEditable = row.editStep !== null;
            return (
              <button
                key={index}
                onClick={() => row.editStep && onEdit(row.editStep)}
                disabled={!isEditable}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  isEditable ? 'hover:bg-white cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">{row.label}</div>
                    <div className="font-semibold text-sm">{row.value}</div>
                  </div>
                </div>
                {isEditable && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button
          onClick={onCreate}
          className="w-full py-4 rounded-2xl font-semibold text-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
        >
          Tạo lịch trình cho mình! ✨
        </button>
      </div>
    </div>
  );
}