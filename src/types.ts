import type { LucideIcon } from 'lucide-react';

export type Mode = 'customer' | 'master';

export interface Category {
  id: string;
  name: string;
  short: string;
  icon: LucideIcon;
  desc: string;
  /** Ажлын хөлсний эхлэх үнэ (₮) */
  basePrice: number;
  tint: string;
  fg: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  dur: string;
  /** Нэгжийн үнэтэй бол (м² гэх мэт) */
  unit?: string;
  /** Урьдчилсан тооцоонд авах хэмжээ */
  qty?: number;
  /** Олон сар үргэлжлэх ажил (хувааж төлөх боломжтой) */
  long?: boolean;
}

export interface Master {
  id: string;
  name: string;
  short: string;
  initials: string;
  categoryIds: string[];
  skills: string[];
  rating: number;
  reviews: number;
  jobs: number;
  years: number;
  distanceKm: number;
  etaMin: number;
  verified: boolean;
  color: string;
  bio: string;
  /** Газрын зураг дээрх байрлал (0–100 %) */
  pos: [number, number];
}

export interface Review {
  id: string;
  masterId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export type Tier = 'eco' | 'pro';

export interface MaterialOption {
  price: number;
  life: string;
  note: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  group: string;
  eco: MaterialOption;
  pro: MaterialOption;
}

export interface CartItem {
  materialId: string;
  tier: Tier;
  qty: number;
}

export type OrderStatus =
  | 'searching'
  | 'accepted'
  | 'enroute'
  | 'arrived'
  | 'working'
  | 'done'
  | 'paid'
  | 'rated';

export type MaterialsStatus = 'none' | 'requested' | 'ordered' | 'delivered';

export interface Order {
  id: string;
  categoryId: string;
  masterId: string;
  description: string;
  urgency: 'now' | 'scheduled';
  address: string;
  status: OrderStatus;
  travelFee: number;
  laborFee: number;
  materials: CartItem[];
  materialsStatus: MaterialsStatus;
  date: string;
  rating?: number;
  /** Төлбөрийг хэдэн хувааж төлөх (1 = нэг дор) */
  plan?: number;
  /** Хэдэн хэсгийг төлсөн */
  paidParts?: number;
}

export interface Draft {
  categoryId: string;
  serviceId: string;
  plan: number;
  description: string;
  urgency: 'now' | 'scheduled';
  slot: string;
  photos: number;
  address: string;
}

export type CustomerTab = 'home' | 'orders' | 'materials' | 'profile';
export type MasterTab = 'jobs' | 'earnings' | 'profile';

export type Route =
  | { name: 'onboarding' }
  | { name: 'login' }
  | { name: 'otp'; phone: string }
  | { name: 'tabs' }
  | { name: 'request'; categoryId: string }
  | { name: 'masters' }
  | { name: 'master'; masterId: string; selectable: boolean }
  | { name: 'matching' }
  | { name: 'tracking' }
  | { name: 'chat' }
  | { name: 'shop'; fromOrder: boolean }
  | { name: 'cart' }
  | { name: 'checkout'; materialsOnly: boolean }
  | { name: 'paid'; materialsOnly: boolean; amount: number }
  | { name: 'rating' }
  | { name: 'notifications' }
  | { name: 'm-tabs' }
  | { name: 'm-job' }
  | { name: 'm-shop' }
  | { name: 'm-done' };

export type RouteName = Route['name'];
