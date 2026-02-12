export interface POI {
  id: string;
  time: string;
  name: string;
  duration?: string;
  type: 'sightseeing' | 'food' | 'accommodation' | 'rest';
  mustTry?: boolean;
  tags?: string[];
  tips?: string[];
  lat: number;
  lng: number;
  travelFromPrevious?: {
    duration: string;
    distance: string;
    warning?: string;
  };
}

export interface DayItinerary {
  day: number;
  title: string;
  pois: POI[];
  summary: {
    totalDistance: string;
    totalTravelTime: string;
    stops: number;
    estimatedCost: string;
  };
}

export const mockItinerary3Days: DayItinerary[] = [
  {
    day: 1,
    title: "TP. Hà Giang → Quản Bạ",
    pois: [
      {
        id: "d1-1",
        time: "07:00",
        name: "Xuất phát từ TP. Hà Giang",
        type: "rest",
        lat: 22.8233,
        lng: 104.9784,
      },
      {
        id: "d1-2",
        time: "08:30",
        name: "Cổng trời Quản Bạ",
        duration: "1 giờ",
        type: "sightseeing",
        mustTry: true,
        tags: ["Adventure", "Aesthetic"],
        tips: [
          "Đến trước 8h tránh sương",
          "Góc phải đường chụp đẹp nhất"
        ],
        lat: 23.0711,
        lng: 104.9919,
        travelFromPrevious: {
          duration: "1.5 giờ",
          distance: "43 km"
        }
      },
      {
        id: "d1-3",
        time: "10:00",
        name: "Núi đôi Quản Bạ",
        duration: "45 phút",
        type: "sightseeing",
        tags: ["Aesthetic"],
        tips: [
          "Cafe đối diện view chuẩn",
          "Sáng sớm ít mây"
        ],
        lat: 23.0804,
        lng: 104.9931,
        travelFromPrevious: {
          duration: "15 phút",
          distance: "2 km"
        }
      },
      {
        id: "d1-4",
        time: "12:00",
        name: "Quán Lý Trường - Ăn trưa",
        duration: "1 giờ",
        type: "food",
        tags: ["Foodie"],
        tips: [
          "Phở chua đặc sản",
          "Quán nhỏ ngon nhất phố"
        ],
        lat: 23.0850,
        lng: 105.0000,
        travelFromPrevious: {
          duration: "20 phút",
          distance: "5 km"
        }
      },
      {
        id: "d1-5",
        time: "14:00",
        name: "Thung lũng Sủng Là",
        duration: "1.5 giờ",
        type: "sightseeing",
        tags: ["Healing", "Aesthetic"],
        tips: [
          "Đường hoa tam giác mạch T10-11",
          "Đi bộ vào làng đẹp hơn"
        ],
        lat: 23.1547,
        lng: 105.1256,
        travelFromPrevious: {
          duration: "1 giờ",
          distance: "25 km"
        }
      },
      {
        id: "d1-6",
        time: "16:30",
        name: "Check-in homestay Quản Bạ",
        type: "accommodation",
        lat: 23.1200,
        lng: 105.1100,
        travelFromPrevious: {
          duration: "30 phút",
          distance: "12 km"
        }
      },
      {
        id: "d1-7",
        time: "18:30",
        name: "Ăn tối tại homestay",
        type: "food",
        lat: 23.1200,
        lng: 105.1100,
      }
    ],
    summary: {
      totalDistance: "87 km",
      totalTravelTime: "3.5 giờ",
      stops: 7,
      estimatedCost: "500k"
    }
  },
  {
    day: 2,
    title: "Quản Bạ → Đồng Văn → Mèo Vạc",
    pois: [
      {
        id: "d2-1",
        time: "07:00",
        name: "Xuất phát từ Quản Bạ",
        type: "rest",
        lat: 23.1200,
        lng: 105.1100,
      },
      {
        id: "d2-2",
        time: "08:30",
        name: "Phố cổ Đồng Văn",
        duration: "1.5 giờ",
        type: "sightseeing",
        tags: ["Culture", "Aesthetic"],
        tips: [
          "Cafe tầng 2 view chợ",
          "CN có chợ phiên"
        ],
        lat: 23.2767,
        lng: 105.3622,
        travelFromPrevious: {
          duration: "1.5 giờ",
          distance: "55 km"
        }
      },
      {
        id: "d2-3",
        time: "10:30",
        name: "Dinh thự nhà Vương",
        duration: "1 giờ",
        type: "sightseeing",
        mustTry: true,
        tags: ["Culture"],
        tips: [
          "Thuê guide 50k nghe chuyện hay",
          "Chụp đẹp ở sân trong"
        ],
        lat: 23.2831,
        lng: 105.3597,
        travelFromPrevious: {
          duration: "10 phút",
          distance: "2 km"
        }
      },
      {
        id: "d2-4",
        time: "12:00",
        name: "Phở Đồng Văn - Ăn trưa",
        duration: "1 giờ",
        type: "food",
        tags: ["Foodie"],
        tips: [
          "Phở gà bản địa",
          "Quán đầu chợ ngon nhất"
        ],
        lat: 23.2770,
        lng: 105.3630,
        travelFromPrevious: {
          duration: "10 phút",
          distance: "1 km"
        }
      },
      {
        id: "d2-5",
        time: "13:30",
        name: "Đèo Mã Pí Lèng",
        duration: "1.5 giờ",
        type: "sightseeing",
        mustTry: true,
        tags: ["Adventure", "Aesthetic"],
        tips: [
          "Panorama cafe view sông Nho Quế",
          "Chiều ít xe hơn sáng"
        ],
        lat: 23.2614,
        lng: 105.4125,
        travelFromPrevious: {
          duration: "30 phút",
          distance: "20 km",
          warning: "Đường đèo cua gấp, lái xe cẩn thận"
        }
      },
      {
        id: "d2-6",
        time: "15:30",
        name: "Sông Nho Quế viewpoint",
        duration: "45 phút",
        type: "sightseeing",
        tags: ["Aesthetic", "Healing"],
        tips: [
          "Thuyền 150k/người nếu có time",
          "View đẹp nhất từ trên đèo"
        ],
        lat: 23.2589,
        lng: 105.4203,
        travelFromPrevious: {
          duration: "15 phút",
          distance: "3 km"
        }
      },
      {
        id: "d2-7",
        time: "17:00",
        name: "Check-in khách sạn Mèo Vạc",
        type: "accommodation",
        lat: 23.1644,
        lng: 105.4053,
        travelFromPrevious: {
          duration: "1 giờ",
          distance: "30 km"
        }
      },
      {
        id: "d2-8",
        time: "19:00",
        name: "Ăn tối tại Mèo Vạc",
        type: "food",
        lat: 23.1644,
        lng: 105.4053,
      }
    ],
    summary: {
      totalDistance: "111 km",
      totalTravelTime: "4 giờ",
      stops: 8,
      estimatedCost: "600k"
    }
  },
  {
    day: 3,
    title: "Mèo Vạc → Lũng Cú → Về TP. Hà Giang",
    pois: [
      {
        id: "d3-1",
        time: "07:00",
        name: "Xuất phát từ Mèo Vạc",
        type: "rest",
        lat: 23.1644,
        lng: 105.4053,
      },
      {
        id: "d3-2",
        time: "09:00",
        name: "Cột cờ Lũng Cú",
        duration: "1 giờ",
        type: "sightseeing",
        mustTry: true,
        tags: ["Culture", "Adventure"],
        tips: [
          "269 bậc thang, đi giày thể thao",
          "Sáng sớm thấy cả bên kia biên giới"
        ],
        lat: 23.3647,
        lng: 105.3168,
        travelFromPrevious: {
          duration: "1.5 giờ",
          distance: "45 km"
        }
      },
      {
        id: "d3-3",
        time: "10:30",
        name: "Làng Lô Lô Chải",
        duration: "1 giờ",
        type: "sightseeing",
        tags: ["Culture"],
        tips: [
          "Nhà trình tường đặc trưng Lô Lô",
          "Xin phép trước khi chụp"
        ],
        lat: 23.3589,
        lng: 105.3201,
        travelFromPrevious: {
          duration: "15 phút",
          distance: "3 km"
        }
      },
      {
        id: "d3-4",
        time: "12:00",
        name: "Ăn trưa tại Lũng Cú",
        duration: "1 giờ",
        type: "food",
        tags: ["Foodie"],
        tips: [
          "Thắng cố + mèn mén phải thử",
          "Quán ngã ba đông nhưng ngon"
        ],
        lat: 23.3650,
        lng: 105.3170,
        travelFromPrevious: {
          duration: "10 phút",
          distance: "1 km"
        }
      },
      {
        id: "d3-5",
        time: "13:30",
        name: "Về TP. Hà Giang",
        type: "rest",
        lat: 22.8233,
        lng: 104.9784,
        travelFromPrevious: {
          duration: "3.5 giờ",
          distance: "95 km"
        }
      },
      {
        id: "d3-6",
        time: "17:00",
        name: "Đến TP. Hà Giang",
        type: "rest",
        lat: 22.8233,
        lng: 104.9784,
      }
    ],
    summary: {
      totalDistance: "144 km",
      totalTravelTime: "5.5 giờ",
      stops: 6,
      estimatedCost: "400k"
    }
  }
];

export const durationOptions = [
  { value: "2d1n", label: "2 ngày 1 đêm", popular: false },
  { value: "3d2n", label: "3 ngày 2 đêm", popular: true },
  { value: "4d3n", label: "4 ngày 3 đêm", popular: false },
  { value: "5d4n", label: "5 ngày 4 đêm", popular: false },
];

export const companionOptions = [
  { 
    value: "solo", 
    emoji: "🧑", 
    label: "Solo", 
    subtitle: "Một mình khám phá",
    message: "Tự do là chính! Mình gợi ý lịch trình thoải mái cho bạn 🎒"
  },
  { 
    value: "couple", 
    emoji: "💑", 
    label: "Couple", 
    subtitle: "Đi cùng người yêu",
    message: "Mình biết mấy chỗ view đẹp lắm cho hai bạn 💕"
  },
  { 
    value: "friends", 
    emoji: "👫", 
    label: "Friends", 
    subtitle: "Đi với hội bạn",
    message: "Đi đông vui ghê! Mình ưu tiên chỗ vui và quán ăn group nha 🎉"
  },
  { 
    value: "family", 
    emoji: "👨‍👩‍👧", 
    label: "Family", 
    subtitle: "Đi cùng gia đình",
    message: "Mình sẽ chọn đường an toàn, đi thoải mái cho cả nhà 🏡"
  },
];

export const vibeOptions = [
  { value: "healing", emoji: "🧘", label: "Healing" },
  { value: "adventure", emoji: "🏔️", label: "Adventure" },
  { value: "aesthetic", emoji: "📸", label: "Aesthetic" },
  { value: "foodie", emoji: "🍜", label: "Foodie" },
  { value: "culture", emoji: "🏛️", label: "Culture" },
  { value: "fun", emoji: "🎉", label: "Fun" },
];

export const budgetOptions = [
  { 
    value: "budget", 
    emoji: "🎒", 
    title: "Tiết kiệm",
    range: "Dưới 1.5tr/người",
    description: "Homestay, ăn local",
    message: "Hà Giang rẻ mà đẹp lắm, mình biết nhiều chỗ ngon bổ rẻ! 😋"
  },
  { 
    value: "comfortable", 
    emoji: "💼", 
    title: "Thoải mái",
    range: "1.5-3tr/người",
    description: "Khách sạn, đa dạng ăn uống",
    message: "Ổn rồi! Đủ để trải nghiệm thoải mái 👌"
  },
  { 
    value: "luxury", 
    emoji: "✨", 
    title: "Thoải mái chi",
    range: "3tr+/người",
    description: "Resort, trải nghiệm xịn",
    message: "Xịn đó! Mình sẽ gợi ý mấy chỗ chất lượng nhất ✨"
  },
];

export const loadingMessages = [
  "Đang tìm quán phở ngon nhất Đồng Văn... 🍜",
  "Check đường đèo Mã Pí Lèng... 🛣️",
  "Hỏi thăm mấy anh local chỗ view đẹp... 📸",
  "Sắp xếp lịch trình hợp lý nhất... 🗓️",
  "Tìm homestay view thung lũng... 🏡",
  "Gần xong rồi nè... ✨"
];