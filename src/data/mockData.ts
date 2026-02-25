// ── Mapping helpers for building the API request ─────────────────────────────

export const durationToNumDays: Record<string, number> = {
  "2d1n": 2,
  "3d2n": 3,
  "4d3n": 4,
  "5d4n": 5,
};

export const budgetAmountMap: Record<string, number> = {
  budget: 3_000_000,
  comfortable: 6_000_000,
  luxury: 10_000_000,
};

// ── Wizard option arrays ─────────────────────────────────────────────────────

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
    message: "Tự do là chính! Mình gợi ý lịch trình thoải mái cho bạn 🎒",
  },
  {
    value: "couple",
    emoji: "💑",
    label: "Couple",
    subtitle: "Đi cùng người yêu",
    message: "Mình biết mấy chỗ view đẹp lắm cho hai bạn 💕",
  },
  {
    value: "friends",
    emoji: "👫",
    label: "Friends",
    subtitle: "Đi với hội bạn",
    message: "Đi đông vui ghê! Mình ưu tiên chỗ vui và quán ăn group nha 🎉",
  },
  {
    value: "family",
    emoji: "👨‍👩‍👧",
    label: "Family",
    subtitle: "Đi cùng gia đình",
    message: "Mình sẽ chọn đường an toàn, đi thoải mái cho cả nhà 🏡",
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
    message: "Hà Giang rẻ mà đẹp lắm, mình biết nhiều chỗ ngon bổ rẻ! 😋",
  },
  {
    value: "comfortable",
    emoji: "💼",
    title: "Thoải mái",
    range: "1.5-3tr/người",
    description: "Khách sạn, đa dạng ăn uống",
    message: "Ổn rồi! Đủ để trải nghiệm thoải mái 👌",
  },
  {
    value: "luxury",
    emoji: "✨",
    title: "Thoải mái chi",
    range: "3tr+/người",
    description: "Resort, trải nghiệm xịn",
    message: "Xịn đó! Mình sẽ gợi ý mấy chỗ chất lượng nhất ✨",
  },
];

export const loadingMessages = [
  "Đang tìm quán phở ngon nhất Đồng Văn... 🍜",
  "Check đường đèo Mã Pí Lèng... 🛣️",
  "Hỏi thăm mấy anh local chỗ view đẹp... 📸",
  "Sắp xếp lịch trình hợp lý nhất... 🗓️",
  "Tìm homestay view thung lũng... 🏡",
  "Gần xong rồi nè... ✨",
];