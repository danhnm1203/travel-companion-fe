interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* Hero area with gradient - top 55% */}
      <div 
        className="relative h-[55%] flex items-end justify-center pb-8 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(16,185,129,0.8)), url('https://images.unsplash.com/photo-1761985747469-64dfba0906c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYSUyMGdpYW5nJTIwdmlldG5hbSUyMG1vdW50YWluJTIwbGFuZHNjYXBlJTIwc2NlbmljfGVufDF8fHx8MTc3MDgyNDYyMXww&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      >
        {/* Text overlay on lower half of hero */}
        <div className="text-center px-6 z-10">
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Lịch trình Hà Giang chi tiết đến từng giờ
          </h1>
          <p className="text-white/90 text-base">
            Chỉ cần 30 giây, mình lo hết — từ điểm đến, quán ăn đến local tips ít ai biết
          </p>
        </div>
      </div>

      {/* Bottom area - 45% white */}
      <div className="flex-1 bg-white px-6 pt-6 flex flex-col">
        <button
          onClick={onStart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg transition-colors"
        >
          Lên lịch trình ngay ✨
        </button>
        
        <p className="text-center text-sm text-gray-500 mt-3 mb-4">
          500+ lịch trình đã được tạo
        </p>

        {/* Feature highlights */}
        <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">⏰ Chi tiết từng giờ</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">💡 Local tips độc quyền</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1">⚡ Chỉ 30 giây</span>
        </div>
      </div>
    </div>
  );
}