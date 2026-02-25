/** Vietnamese labels for POI categories */
export const categoryLabels: Record<string, string> = {
    attraction: 'Tham quan',
    food: 'Ăn uống',
    restaurant: 'Ăn uống',
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    accommodation: 'Nghỉ ngơi',
    cafe: 'Cafe',
    shopping: 'Mua sắm',
};

/** Emoji for each POI category */
export const categoryEmojis: Record<string, string> = {
    attraction: '🏛',
    food: '🍜',
    restaurant: '🍜',
    breakfast: '🥐',
    lunch: '🍜',
    dinner: '🍽',
    accommodation: '🏨',
    cafe: '☕',
    shopping: '🛒',
};

/** Tailwind color classes for POI categories */
export const categoryColors: Record<string, { bg: string; border: string }> = {
    attraction: { bg: 'bg-blue-500', border: 'border-l-blue-500' },
    food: { bg: 'bg-orange-500', border: 'border-l-orange-500' },
    restaurant: { bg: 'bg-orange-500', border: 'border-l-orange-500' },
    breakfast: { bg: 'bg-amber-500', border: 'border-l-amber-500' },
    lunch: { bg: 'bg-orange-500', border: 'border-l-orange-500' },
    dinner: { bg: 'bg-red-500', border: 'border-l-red-500' },
    accommodation: { bg: 'bg-purple-500', border: 'border-l-purple-500' },
    cafe: { bg: 'bg-amber-500', border: 'border-l-amber-500' },
    shopping: { bg: 'bg-pink-500', border: 'border-l-pink-500' },
};

/** Hex color for each category (used in map markers) */
export const categoryHexColors: Record<string, string> = {
    attraction: '#3b82f6',
    food: '#f97316',
    restaurant: '#f97316',
    breakfast: '#f59e0b',
    lunch: '#f97316',
    dinner: '#ef4444',
    accommodation: '#a855f7',
    cafe: '#f59e0b',
    shopping: '#ec4899',
};

/** Vietnamese translation of notes (meal types) */
export const notesMap: Record<string, string> = {
    breakfast: '🥐 Bữa sáng',
    lunch: '🍜 Bữa trưa',
    dinner: '🍽 Bữa tối',
};

/** Helper: get label for a categories array */
export function getCategoryLabel(categories: string[]): string {
    for (const cat of categories) {
        if (categoryLabels[cat]) return categoryLabels[cat];
    }
    return categories[0] ?? 'Điểm đến';
}

/** Helper: get emoji for a categories array */
export function getCategoryEmoji(categories: string[]): string {
    for (const cat of categories) {
        if (categoryEmojis[cat]) return categoryEmojis[cat];
    }
    return '📍';
}

/** Helper: get Tailwind color classes for a categories array */
export function getCategoryStyle(categories: string[]): { bg: string; border: string } {
    for (const cat of categories) {
        if (categoryColors[cat]) return categoryColors[cat];
    }
    return { bg: 'bg-gray-400', border: 'border-l-gray-400' };
}

/** Helper: get hex color for a categories array */
export function getCategoryColor(categories: string[]): string {
    for (const cat of categories) {
        if (categoryHexColors[cat]) return categoryHexColors[cat];
    }
    return '#9ca3af';
}

/** Helper: translate notes */
export function translateNotes(notes: string): string {
    return notesMap[notes.toLowerCase()] || notes;
}
