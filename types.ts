
export enum TravelTag {
  LANDSCAPE = '景觀派',
  FOODIE = '吃貨派',
  CULTURAL = '文青派',
  TRENDY = '嚐鮮派',
  BUDGET = '精算師',
  LUXURY = '土豪',
  SHOPPING = '購物狂'
}

export enum TransportPreference {
  DRIVING = '自駕',
  PUBLIC = '大眾運輸',
  MIXED = '混合'
}

export enum TravelFrequency {
  FIRST_TIME = '第一次 (經典線)',
  SECOND_TIME = '第二次 (深度線)',
  EXPERT = '老司機 (私房線)'
}

export interface UserDNA {
  tags: TravelTag[];
  frequency: TravelFrequency;
  transport: TransportPreference;
  startPoint?: string;
}

export interface Destination {
  id: string;
  name: string;
  type: TravelTag;
  description: string;
  isIndoor: boolean;
  rating: number;
  time: string; // e.g. "09:00 - 11:00"
  duration: number; // minutes
  cost: string;
  lat: number;
  lng: number;
  image: string;
}

export interface TripPlan {
  destination: string;
  startPoint: string;
  days: number;
  budget: number;
  itinerary: Destination[];
}
