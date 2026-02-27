// ── API Types ────────────────────────────────────────────────────────────────

export interface GenerateItineraryRequest {
    destination_id: string;
    departure_province_id: string;
    num_days: number;
    start_date: string; // YYYY-MM-DD
    budget_amount: number;
    pace?: "relaxed" | "moderate" | "packed";
    companion_codes?: string[];
    vibe_codes?: string[];
    keep_same_accommodation?: boolean;
}

export interface POIResponse {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    budget_level: string;
    avg_cost_vnd: number;
    google_rating: number | null;
    categories: string[];
    tips: string[];
    warnings: string[];
    google_reviews_count: number | null;
}

export interface AccommodationResponse {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    budget_level: string;
    avg_cost_vnd: number;
    google_rating: number | null;
    categories: string[];
    tips: string[];
    warnings: string[];
    google_reviews_count: number | null;
}

export interface ItineraryItemResponse {
    order_index: number;
    visit_time: string; // "HH:mm:ss"
    duration_minutes: number;
    match_score: number;
    notes: string | null;
    travel_time_from_prev_minutes: number | null;
    distance_from_prev_km: number | null;
    poi: POIResponse;
}

export interface DayResponse {
    day_number: number;
    date: string;
    theme: string;
    distance_km: number;
    accommodation: AccommodationResponse | null;
    items: ItineraryItemResponse[];
}

export interface ItineraryResponse {
    id: string;
    title: string;
    destination_name: string;
    departure_province_name: string;
    num_days: number;
    start_date: string;
    budget_amount: number;
    pace: string;
    total_distance_km: number;
    companions: string[];
    vibes: string[];
    days: DayResponse[];
}

// ── API Service ──────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_VERSION = "api/v1";

/** Internal helper for API requests */
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}/${API_VERSION}/${path}`;
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!res.ok) {
        const errorBody = await res.text().catch(() => "");
        throw new Error(
            `API error ${res.status}: ${errorBody || res.statusText}`
        );
    }

    return res.json() as Promise<T>;
}

export async function generateItinerary(
    req: GenerateItineraryRequest
): Promise<ItineraryResponse> {
    return apiFetch<ItineraryResponse>("itineraries/generate", {
        method: "POST",
        body: JSON.stringify(req),
    });
}

export async function getItinerary(
    id: string
): Promise<ItineraryResponse> {
    return apiFetch<ItineraryResponse>(`itineraries/${id}`);
}
