import {
  Droplets,
  Zap,
  PaintRoller,
  Grid3x3,
  Hammer,
  DoorOpen,
  Flame,
  Wrench,
} from 'lucide-react';
import type { CartItem, Category, Master, Material, Order, Review, Service } from './types';

/* ------------------------------------------------------------------ */
/*  Демо өгөгдөл. Бүх нэр, үнэ, үнэлгээ нь прототипт зориулсан жишээ.   */
/* ------------------------------------------------------------------ */

export const USER = {
  name: 'Номин',
  fullName: 'Номин Батбаяр',
  phone: '9911 2345',
  address: 'БЗД, 26-р хороо, 85-р байр, 42 тоот',
  addressShort: '85-р байр, 26-р хороо',
};

export const CATEGORIES: Category[] = [
  { id: 'plumbing', name: 'Сантехник', short: 'Сантехник', icon: Droplets, desc: 'Ус алдалт, холигч, хоолой, суултуур', basePrice: 45000, tint: '#E6F0FA', fg: '#2F6CA3' },
  { id: 'electric', name: 'Цахилгаан', short: 'Цахилгаан', icon: Zap, desc: 'Залгуур, унтраалга, гэрэл, утас татах', basePrice: 40000, tint: '#FDF3DC', fg: '#9A6B00' },
  { id: 'paint', name: 'Будаг, засал', short: 'Будаг', icon: PaintRoller, desc: 'Хана будах, шпаклёвка, обой', basePrice: 60000, tint: '#FBE9E4', fg: '#B0452B' },
  { id: 'tile', name: 'Плита, хавтан', short: 'Плита', icon: Grid3x3, desc: 'Угаалгын өрөө, гал тогоо, шал', basePrice: 70000, tint: '#E8F1E6', fg: '#4C7A47' },
  { id: 'carpentry', name: 'Мужаан', short: 'Мужаан', icon: Hammer, desc: 'Тавилга угсрах, тавиур, шал', basePrice: 50000, tint: '#F4ECE3', fg: '#8A5A2B' },
  { id: 'doors', name: 'Цонх, хаалга', short: 'Цонх, хаалга', icon: DoorOpen, desc: 'Цоож, нугас, битүүмжлэл', basePrice: 55000, tint: '#EEEAF7', fg: '#6A4F94' },
  { id: 'heating', name: 'Халаалт', short: 'Халаалт', icon: Flame, desc: 'Радиатор, халаалтын шугам', basePrice: 50000, tint: '#FDE8E1', fg: '#C2410C' },
  { id: 'other', name: 'Бусад засвар', short: 'Бусад', icon: Wrench, desc: 'Жижиг засвар, угсралт', basePrice: 35000, tint: '#EEEEF1', fg: '#4B4F59' },
];

export const MASTERS: Master[] = [
  {
    id: 'm1', name: 'Бат-Эрдэнэ Ганболд', short: 'Бат-Эрдэнэ Г.', initials: 'БЭ',
    categoryIds: ['plumbing', 'heating', 'other'], skills: ['Сантехник', 'Халаалт', 'Ус алдалт'],
    rating: 4.9, reviews: 128, jobs: 312, years: 9, distanceKm: 1.2, etaMin: 12, verified: true, color: '#C2500A',
    bio: '9 жил сантехник, халаалтын чиглэлээр ажилласан. Ажлаа цэвэрхэн, хугацаандаа хийнэ.',
    pos: [112, 196],
  },
  {
    id: 'm4', name: 'Тэмүүлэн Нямдорж', short: 'Тэмүүлэн Н.', initials: 'ТН',
    categoryIds: ['tile', 'plumbing'], skills: ['Плита', 'Сантехник', 'Угаалгын өрөө'],
    rating: 4.7, reviews: 64, jobs: 140, years: 5, distanceKm: 0.8, etaMin: 9, verified: true, color: '#2F6CA3',
    bio: 'Угаалгын өрөө, гал тогооны иж бүрэн засвар. Плита, сантехникийг нэг дор.',
    pos: [266, 214],
  },
  {
    id: 'm6', name: 'Мөнх-Очир Пүрэв', short: 'Мөнх-Очир П.', initials: 'МО',
    categoryIds: ['plumbing', 'electric'], skills: ['Сантехник', 'Цахилгаан'],
    rating: 4.6, reviews: 41, jobs: 75, years: 3, distanceKm: 1.9, etaMin: 17, verified: true, color: '#4C7A47',
    bio: 'Залуу, хурдан шуурхай. Жижиг засварыг тэр өдөрт нь.',
    pos: [96, 300],
  },
  {
    id: 'm2', name: 'Ганбаатар Дорж', short: 'Ганбаатар Д.', initials: 'ГД',
    categoryIds: ['electric', 'other'], skills: ['Цахилгаан', 'Гэрэлтүүлэг'],
    rating: 4.8, reviews: 96, jobs: 204, years: 7, distanceKm: 2.0, etaMin: 18, verified: true, color: '#8A6D12',
    bio: 'Мэргэжлийн цахилгаанчин. Аюулгүй ажиллагааны гэрчилгээтэй.',
    pos: [318, 120],
  },
  {
    id: 'm3', name: 'Энхтуяа Батсүх', short: 'Энхтуяа Б.', initials: 'ЭБ',
    categoryIds: ['paint', 'other'], skills: ['Будаг', 'Шпаклёвка', 'Обой'],
    rating: 4.9, reviews: 151, jobs: 280, years: 11, distanceKm: 2.6, etaMin: 22, verified: true, color: '#A23E6A',
    bio: 'Засал чимэглэлийн 11 жилийн туршлагатай. Өнгө сонголтод зөвлөнө.',
    pos: [330, 398],
  },
  {
    id: 'm5', name: 'Отгонбаяр Сүх', short: 'Отгонбаяр С.', initials: 'ОС',
    categoryIds: ['carpentry', 'doors'], skills: ['Мужаан', 'Цонх, хаалга'],
    rating: 4.8, reviews: 88, jobs: 196, years: 8, distanceKm: 3.1, etaMin: 25, verified: true, color: '#6A4F94',
    bio: 'Тавилга угсралт, хаалга цонхны засвар. Багаж хэрэгсэл бүрэн.',
    pos: [52, 110],
  },
];

export const REVIEWS: Review[] = [
  { id: 'r1', masterId: 'm1', author: 'Сарангэрэл', rating: 5, text: 'Ус алдаж байсныг 40 минутад зассан. Маш цэвэрхэн ажилласан.', date: '11.12' },
  { id: 'r2', masterId: 'm1', author: 'Бямбаа', rating: 5, text: 'Цагтаа ирсэн, үнээ урьдчилж хэлсэн. Дахин дуудна.', date: '11.05' },
  { id: 'r3', masterId: 'm1', author: 'Ариунаа', rating: 4, text: 'Сайн хийсэн, материалыг машинаас нь шууд авсан нь их хурдан байлаа.', date: '10.28' },
  { id: 'r4', masterId: 'm4', author: 'Ганзориг', rating: 5, text: 'Угаалгын өрөөний плитаг маш нямбай тавьсан.', date: '11.09' },
  { id: 'r5', masterId: 'm2', author: 'Мөнхзул', rating: 5, text: 'Залгуур, гэрлийг нэг дор хийчихлээ. Баярлалаа!', date: '11.02' },
  { id: 'r6', masterId: 'm3', author: 'Цэцэгээ', rating: 5, text: 'Өнгө сонгоход тусалсан, хана гоё болсон.', date: '10.18' },
  { id: 'r7', masterId: 'm5', author: 'Тэлмэн', rating: 5, text: 'Шүүгээ угсралтыг хурдан хийсэн.', date: '10.30' },
  { id: 'r8', masterId: 'm6', author: 'Дөлгөөн', rating: 4, text: 'Хурдан ирсэн, асуудлыг тайлбарлаж өгсөн.', date: '11.14' },
];

export const MATERIAL_GROUPS = ['Сантехник', 'Цахилгаан', 'Будаг, засал', 'Плита', 'Ерөнхий'];

export const MATERIALS: Material[] = [
  { id: 'faucet', name: 'Угаалтуурын ус холигч', unit: 'ш', group: 'Сантехник',
    eco: { price: 45000, life: '2–3 жил', note: 'Хятад үйлдвэр, хуванцар толгой' },
    pro: { price: 128000, life: '8–10 жил', note: 'Гууль их бие, керамик картриж' } },
  { id: 'ppr', name: 'PPR хоолой 20 мм, 4 м', unit: 'ш', group: 'Сантехник',
    eco: { price: 9500, life: '5–7 жил', note: 'PN16, стандарт' },
    pro: { price: 16000, life: '25+ жил', note: 'PN20, шилэн утас арматуртай' } },
  { id: 'hose', name: 'Уян холбогч шланк 60 см', unit: 'ш', group: 'Сантехник',
    eco: { price: 6000, life: '1–2 жил', note: 'Резин, ган сүлжээстэй' },
    pro: { price: 14500, life: '5+ жил', note: 'EPDM, зэвэрдэггүй ган' } },
  { id: 'siphon', name: 'Сифон (угаалтуурын)', unit: 'ш', group: 'Сантехник',
    eco: { price: 12000, life: '2–3 жил', note: 'Нимгэн хуванцар' },
    pro: { price: 29000, life: '8+ жил', note: 'Зузаан PP, үнэр хаагчтай' } },
  { id: 'socket', name: 'Залгуур (розетка)', unit: 'ш', group: 'Цахилгаан',
    eco: { price: 7500, life: '2–3 жил', note: '10А, газардуулгагүй' },
    pro: { price: 19000, life: '10+ жил', note: '16А, газардуулгатай, хамгаалалттай' } },
  { id: 'switch', name: 'Гэрлийн унтраалга', unit: 'ш', group: 'Цахилгаан',
    eco: { price: 6000, life: '2–3 жил', note: 'Нэг товчтой' },
    pro: { price: 16500, life: '10+ жил', note: 'Чимээгүй механизмтай' } },
  { id: 'cable', name: 'Кабель 2.5 мм², 10 м', unit: 'боодол', group: 'Цахилгаан',
    eco: { price: 18000, life: '10 жил', note: 'Хөнгөн цагаан судал' },
    pro: { price: 32000, life: '25+ жил', note: 'Цэвэр зэс судал' } },
  { id: 'led', name: 'LED чийдэн 12W', unit: 'ш', group: 'Цахилгаан',
    eco: { price: 4500, life: '1 жил', note: '8,000 цаг' },
    pro: { price: 11000, life: '4–5 жил', note: '25,000 цаг, анивчдаггүй' } },
  { id: 'paint', name: 'Ханын будаг 5 л', unit: 'сав', group: 'Будаг, засал',
    eco: { price: 38000, life: '2–3 жил', note: 'Усан суурьтай, бүдэг' },
    pro: { price: 92000, life: '8–10 жил', note: 'Угаагддаг, чийгэнд тэсвэртэй' } },
  { id: 'putty', name: 'Шпаклёвка 20 кг', unit: 'уут', group: 'Будаг, засал',
    eco: { price: 24000, life: '—', note: 'Ердийн, гипсэн' },
    pro: { price: 41000, life: '—', note: 'Нарийн ширхэгтэй, хагардаггүй' } },
  { id: 'roller', name: 'Будгийн булуу (ролик)', unit: 'ш', group: 'Будаг, засал',
    eco: { price: 8000, life: '1–2 удаа', note: 'Хөөсөн' },
    pro: { price: 19000, life: 'Олон удаа', note: 'Микрофибр, жигд түрхэнэ' } },
  { id: 'tileglue', name: 'Плитаны цавуу 25 кг', unit: 'уут', group: 'Плита',
    eco: { price: 17000, life: '5–7 жил', note: 'C1 ангилал' },
    pro: { price: 29000, life: '15+ жил', note: 'C2TE, чийгэнд тэсвэртэй' } },
  { id: 'grout', name: 'Заадасны чигжээс 2 кг', unit: 'уут', group: 'Плита',
    eco: { price: 9000, life: '3–4 жил', note: 'Цементэн' },
    pro: { price: 18000, life: '10+ жил', note: 'Мөөгөнцрийн эсрэг' } },
  { id: 'silicone', name: 'Силикон 280 мл', unit: 'ш', group: 'Плита',
    eco: { price: 6500, life: '1–2 жил', note: 'Ерөнхий зориулалт' },
    pro: { price: 14000, life: '5+ жил', note: 'Ариун цэврийн, мөөгөнцрийн эсрэг' } },
  { id: 'screws', name: 'Шураг, дюбель багц', unit: 'багц', group: 'Ерөнхий',
    eco: { price: 5000, life: '—', note: '100 ширхэг' },
    pro: { price: 12000, life: '—', note: '200 ширхэг, зэвэрдэггүй' } },
  { id: 'mortar', name: 'Цементэн хольц 25 кг', unit: 'уут', group: 'Ерөнхий',
    eco: { price: 12500, life: '—', note: 'M150' },
    pro: { price: 21000, life: '—', note: 'M300, хурдан хатдаг' } },
];

/**
 * Ангилал бүрийн үйлчилгээ, эхлэх үнэ.
 * Нэрсийг Unegui.mn-ийн «Барилгын бүх ажил» ангиллын зарын гарчгаас (хувь хүний мэдээлэлгүйгээр) авав:
 * «Дуудлагын сантехникийн засвар 50,000₮», «Ариун цэврийн өрөөний иж бүрэн засвар 20,000₮» (м² тутам гэж ойлгов),
 * «Дуудлагын цахилгаанчин», «Газардуулга хэмжилт», «Обой, эмульс хийнэ», «Паркет шахна», «Чулуу болон пилта шал өнгөлгөө».
 * Бусад үнэ нь демо тооцоо.
 */
export const SERVICES: Record<string, Service[]> = {
  plumbing: [
    { id: 'leak', name: 'Дуудлагын сантехник засвар', price: 50000, dur: '~1 цаг' },
    { id: 'faucet', name: 'Холигч солих, засах', price: 25000, dur: '30–60 мин' },
    { id: 'clog', name: 'Бөглөрөл арилгах', price: 30000, dur: '~1 цаг' },
    { id: 'toilet', name: 'Суултуур, ванн шинээр угсрах', price: 60000, dur: '2–3 цаг' },
    { id: 'pipe', name: 'Хоолой шинээр татах', price: 80000, dur: '2–4 цаг' },
  ],
  electric: [
    { id: 'call', name: 'Дуудлагын цахилгаанчин', price: 30000, dur: '~1 цаг' },
    { id: 'socket', name: 'Залгуур, унтраалга солих', price: 15000, dur: '~30 мин' },
    { id: 'montage', name: 'Цахилгааны монтаж (ил, далд)', price: 60000, dur: '2–3 цаг' },
    { id: 'ground', name: 'Газардуулга хэмжилт', price: 40000, dur: '~1 цаг' },
  ],
  paint: [
    { id: 'full', name: 'Орон сууцны иж бүрэн засал', price: 90000, unit: 'м²', qty: 45, dur: '2–3 сар', long: true },
    { id: 'emulsion', name: 'Эмульс хийх', price: 6000, unit: 'м²', qty: 30, dur: '1–2 өдөр' },
    { id: 'wallpaper', name: 'Обой наах', price: 5000, unit: 'м²', qty: 30, dur: '1 өдөр' },
    { id: 'patch', name: 'Шпаклёвка, хана засах', price: 50000, dur: '2–3 цаг' },
  ],
  tile: [
    { id: 'bath', name: 'Ариун цэврийн өрөөний иж бүрэн засвар', price: 20000, unit: 'м²', qty: 12, dur: '2–3 өдөр' },
    { id: 'stone', name: 'Чулуу, плита шал өнгөлгөө', price: 15000, unit: 'м²', qty: 12, dur: '1 өдөр' },
    { id: 'few', name: 'Хэдэн плита солих', price: 40000, dur: '2–3 цаг' },
  ],
  carpentry: [
    { id: 'furniture', name: 'Тавилга угсрах', price: 35000, dur: '1–2 цаг' },
    { id: 'parquet', name: 'Паркет шахах', price: 12000, unit: 'м²', qty: 20, dur: '1 өдөр' },
    { id: 'shelf', name: 'Тавиур, ТВ хананд суулгах', price: 25000, dur: '~1 цаг' },
  ],
  doors: [
    { id: 'lock', name: 'Цоож солих', price: 30000, dur: '~40 мин' },
    { id: 'adjust', name: 'Хаалга тохируулах', price: 25000, dur: '~40 мин' },
    { id: 'seal', name: 'Цонх битүүмжлэх', price: 40000, dur: '1–2 цаг' },
  ],
  heating: [
    { id: 'air', name: 'Радиаторын агаар гаргах', price: 20000, dur: '~30 мин' },
    { id: 'check', name: 'Өвлийн үзлэг', price: 35000, dur: '~1 цаг' },
    { id: 'replace', name: 'Радиатор солих', price: 70000, dur: '2–3 цаг' },
  ],
  other: [
    { id: 'hourly', name: 'Жижиг засвар (цагаар)', price: 30000, dur: '1 цаг' },
    { id: 'assembly', name: 'Угсралт, суурилуулалт', price: 35000, dur: '1–2 цаг' },
  ],
};

/* ------------------------- Хувааж төлөх ------------------------- */

/** Хувааж төлөх боломжтой эсэх: олон сарын ажил эсвэл 500,000₮-өөс дээш */
export const SPLIT_MIN = 500000;
export const canSplit = (total: number, long?: boolean) => !!long || total >= SPLIT_MIN;

/** Нийт дүнг n хэсэгт хуваана (100₮-өөр бүхэлтгэж, үлдэгдлийг сүүлийнхэд) */
export function installments(total: number, n: number): number[] {
  if (n <= 1) return [total];
  const part = Math.floor(total / n / 100) * 100;
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? total - part * (n - 1) : part));
}

const DUE = ['Өнөөдөр', '2026.12.17', '2027.01.17'];
/** Төлбөр бүрийн хугацаа, ажлын шат */
export function installmentSteps(n: number) {
  const stage = n === 2 ? ['1-р сарын ажил', 'Ажил бүрэн дуусахад'] : n === 3 ? ['1-р сарын ажил', '2-р сарын ажил', 'Ажил бүрэн дуусахад'] : ['Ажил дууссаны дараа'];
  return stage.map((s, i) => ({ due: DUE[i], stage: s }));
}

/** «50,000₮-с» эсвэл «20,000₮/м²» */
export const priceLabel = (s: Service) => (s.unit ? `${fmt(s.price)}/${s.unit}` : `${fmt(s.price)}-с`);
/** Захиалгын урьдчилсан ажлын хөлс */
export const serviceLabor = (s: Service) => (s.unit ? s.price * (s.qty ?? 1) : s.price);

export const getService = (catId: string, id: string) =>
  (SERVICES[catId] ?? SERVICES.other).find((x) => x.id === id) ?? (SERVICES[catId] ?? SERVICES.other)[0];

/** Мастерын илгээсэн материалын хүсэлт (демо) */
export const MASTER_REQUEST: CartItem[] = [
  { materialId: 'faucet', tier: 'pro', qty: 1 },
  { materialId: 'hose', tier: 'pro', qty: 2 },
  { materialId: 'silicone', tier: 'eco', qty: 1 },
];

export const TRUCK = {
  name: 'Явуулын машин №3',
  district: 'Баянзүрх дүүрэг',
  distanceKm: 1.4,
  etaMin: 12,
  pos: [262, 436] as [number, number],
};

export const HOME_POS: [number, number] = [238, 300];

export const PAST_ORDERS: Order[] = [
  {
    id: 'UG-2041', categoryId: 'electric', masterId: 'm2', description: 'Гал тогооны 2 залгуур солих',
    urgency: 'now', address: USER.address, status: 'rated', travelFee: 8000, laborFee: 40000,
    materials: [{ materialId: 'socket', tier: 'pro', qty: 2 }], materialsStatus: 'delivered', date: '2026.11.02', rating: 5,
  },
  {
    id: 'UG-1987', categoryId: 'paint', masterId: 'm3', description: 'Унтлагын өрөөний хана будах',
    urgency: 'scheduled', address: USER.address, status: 'rated', travelFee: 9500, laborFee: 120000,
    materials: [{ materialId: 'paint', tier: 'pro', qty: 1 }, { materialId: 'roller', tier: 'pro', qty: 1 }], materialsStatus: 'delivered', date: '2026.10.18', rating: 5,
  },
];

/* ---------------------------- Туслах функц ---------------------------- */

export const fmt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n)) + '₮';

export const travelFeeFor = (km: number) => Math.round((3000 + km * 2500) / 500) * 500;

export const getMaster = (id: string) => MASTERS.find((m) => m.id === id) ?? MASTERS[0];
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[0];
export const getMaterial = (id: string) => MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];

export const itemPrice = (item: CartItem) => getMaterial(item.materialId)[item.tier].price * item.qty;
export const cartTotal = (items: CartItem[]) => items.reduce((s, i) => s + itemPrice(i), 0);

export const orderTotal = (o: Order) => o.travelFee + o.laborFee + cartTotal(o.materials);

/** Орлого хуваах задаргаа: мастер 79%, компани 10%, НӨАТ 10%, QPay 1% */
export const split = (total: number) => ({
  master: total * 0.79,
  company: total * 0.1,
  vat: total * 0.1,
  qpay: total * 0.01,
});

export const TIER_LABEL = { eco: 'Хэмнэлттэй', pro: 'Удаан эдэлгээтэй' } as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  searching: 'Мастер хайж байна',
  accepted: 'Мастер зөвшөөрсөн',
  enroute: 'Мастер замдаа',
  arrived: 'Мастер ирлээ',
  working: 'Ажил хийгдэж байна',
  done: 'Төлбөр хүлээгдэж байна',
  paid: 'Төлөгдсөн',
  rated: 'Дууссан',
};

/** Мастерын сүүлийн 7 хоногийн орлого (демо, 79%-ийн дараах дүн). Сүүлийнх нь өнөөдөр. */
export const WEEK_EARNINGS = [
  { d: 'Лх', v: 142200 },
  { d: 'Пү', v: 47400 },
  { d: 'Ба', v: 118500 },
  { d: 'Бя', v: 173800 },
  { d: 'Ня', v: 0 },
  { d: 'Да', v: 94800 },
  { d: 'Мя', v: 63200 },
];
