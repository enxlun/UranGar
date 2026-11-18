import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CATEGORIES, canSplit, getMaster, getService, MASTER_REQUEST, PAST_ORDERS, serviceLabor, travelFeeFor, USER } from './data';
import type { CartItem, CustomerTab, Draft, MasterTab, Mode, Order, Route, Tier } from './types';

export interface MasterState {
  online: boolean;
  incoming: boolean;
  jobActive: boolean;
  jobStep: number;
  materialsSent: boolean;
  laborFee: number;
  todayEarned: number;
  jobsToday: number;
}

export interface Toast {
  title: string;
  body?: string;
}

export type DemoTarget =
  | 'onboarding'
  | 'home'
  | 'request'
  | 'masters'
  | 'tracking'
  | 'materials-request'
  | 'shop'
  | 'checkout'
  | 'installment'
  | 'rating'
  | 'm-home'
  | 'm-incoming'
  | 'm-job'
  | 'm-earnings';

interface AppCtx {
  mode: Mode;
  setMode: (m: Mode) => void;

  stack: Route[];
  push: (r: Route) => void;
  pop: () => void;
  replace: (r: Route) => void;
  resetTo: (rs: Route[]) => void;
  tab: CustomerTab;
  setTab: (t: CustomerTab) => void;

  draft: Draft;
  updateDraft: (p: Partial<Draft>) => void;
  order: Order | null;
  startOrder: (masterId: string) => void;
  updateOrder: (p: Partial<Order>) => void;
  advanceOrder: () => void;
  finishOrder: (rating: number) => void;
  payInstallment: (orderId: string) => void;
  clearOrder: () => void;
  pastOrders: Order[];

  points: number;
  setPoints: (n: number) => void;

  cart: CartItem[];
  addToCart: (materialId: string, tier: Tier, qty?: number) => void;
  setQty: (materialId: string, tier: Tier, qty: number) => void;
  switchTier: (materialId: string, from: Tier) => void;
  clearCart: () => void;
  loadMasterRequest: () => void;

  mStack: Route[];
  mPush: (r: Route) => void;
  mPop: () => void;
  mResetTo: (rs: Route[]) => void;
  mTab: MasterTab;
  setMTab: (t: MasterTab) => void;
  ms: MasterState;
  updateMs: (p: Partial<MasterState>) => void;

  toast: Toast | null;
  showToast: (title: string, body?: string) => void;

  jump: (t: DemoTarget) => void;
  resetAll: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

const freshDraft = (): Draft => ({
  categoryId: 'plumbing',
  serviceId: 'leak',
  plan: 1,
  description: '',
  urgency: 'now',
  slot: 'Өнөөдөр 18:00–20:00',
  photos: 0,
  address: USER.address,
});

const freshMaster = (): MasterState => ({
  online: false,
  incoming: false,
  jobActive: false,
  jobStep: 0,
  materialsSent: false,
  laborFee: 50000,
  todayEarned: 63200,
  jobsToday: 2,
});

const START_POINTS = 6850;
let orderSeq = 2107;

function makeOrder(draft: Draft, masterId: string): Order {
  const m = getMaster(masterId);
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId) ?? CATEGORIES[0];
  const svc = getService(cat.id, draft.serviceId);
  orderSeq += 1;
  return {
    id: `UG-${orderSeq}`,
    categoryId: cat.id,
    masterId,
    description: draft.description ? `${svc.name}. ${draft.description}` : svc.name,
    urgency: draft.urgency,
    address: draft.address,
    status: 'searching',
    travelFee: travelFeeFor(m.distanceKm),
    laborFee: serviceLabor(svc),
    materials: [],
    materialsStatus: 'none',
    date: '2026.11.17',
    plan: canSplit(serviceLabor(svc), svc.long) ? draft.plan : 1,
    paidParts: 0,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('customer');
  const [stack, setStack] = useState<Route[]>([{ name: 'onboarding' }]);
  const [tab, setTab] = useState<CustomerTab>('home');
  const [draft, setDraft] = useState<Draft>(freshDraft);
  const [order, setOrder] = useState<Order | null>(null);
  const [pastOrders, setPastOrders] = useState<Order[]>(PAST_ORDERS);
  const [points, setPoints] = useState(START_POINTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mStack, setMStack] = useState<Route[]>([{ name: 'm-tabs' }]);
  const [mTab, setMTab] = useState<MasterTab>('jobs');
  const [ms, setMs] = useState<MasterState>(freshMaster);
  const [toast, setToast] = useState<Toast | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = useCallback((title: string, body?: string) => {
    setToast({ title, body });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const push = useCallback((r: Route) => setStack((s) => [...s, r]), []);
  const pop = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const replace = useCallback((r: Route) => setStack((s) => [...s.slice(0, -1), r]), []);
  const resetTo = useCallback((rs: Route[]) => setStack(rs), []);

  const mPush = useCallback((r: Route) => setMStack((s) => [...s, r]), []);
  const mPop = useCallback(() => setMStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), []);
  const mResetTo = useCallback((rs: Route[]) => setMStack(rs), []);

  const updateDraft = useCallback((p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p })), []);
  const updateOrder = useCallback((p: Partial<Order>) => setOrder((o) => (o ? { ...o, ...p } : o)), []);
  const updateMs = useCallback((p: Partial<MasterState>) => setMs((s) => ({ ...s, ...p })), []);
  const clearOrder = useCallback(() => setOrder(null), []);

  const startOrder = useCallback((masterId: string) => setOrder(makeOrder(draft, masterId)), [draft]);

  const finishOrder = useCallback(
    (rating: number) => {
      if (order) {
        const done: Order = { ...order, status: 'rated', rating };
        setPastOrders((p) => [done, ...p.filter((x) => x.id !== done.id)]);
      }
      setOrder(null);
    },
    [order],
  );

  const payInstallment = useCallback((orderId: string) => {
    setPastOrders((p) => p.map((o) => (o.id === orderId ? { ...o, paidParts: Math.min(o.plan ?? 1, (o.paidParts ?? 0) + 1) } : o)));
  }, []);

  const addToCart = useCallback((materialId: string, tier: Tier, qty = 1) => {
    setCart((c) => {
      const i = c.findIndex((x) => x.materialId === materialId && x.tier === tier);
      if (i >= 0) return c.map((x, j) => (j === i ? { ...x, qty: x.qty + qty } : x));
      return [...c, { materialId, tier, qty }];
    });
  }, []);

  const setQty = useCallback((materialId: string, tier: Tier, qty: number) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((x) => !(x.materialId === materialId && x.tier === tier))
        : c.map((x) => (x.materialId === materialId && x.tier === tier ? { ...x, qty } : x)),
    );
  }, []);

  const switchTier = useCallback((materialId: string, from: Tier) => {
    setCart((c) => {
      const src = c.find((x) => x.materialId === materialId && x.tier === from);
      if (!src) return c;
      const to: Tier = from === 'eco' ? 'pro' : 'eco';
      const twin = c.find((x) => x.materialId === materialId && x.tier === to);
      if (twin) return c.filter((x) => x !== src).map((x) => (x === twin ? { ...x, qty: x.qty + src.qty } : x));
      return c.map((x) => (x === src ? { ...x, tier: to } : x));
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const loadMasterRequest = useCallback(() => setCart(MASTER_REQUEST.map((x) => ({ ...x }))), []);

  /** Демо: захиалгыг дараагийн төлөвт шилжүүлнэ */
  const advanceOrder = useCallback(() => {
    if (!order) return;
    const s = order.status;
    const m = order.materialsStatus;
    if (s === 'searching') updateOrder({ status: 'accepted' });
    else if (s === 'accepted') updateOrder({ status: 'enroute' });
    else if (s === 'enroute') updateOrder({ status: 'arrived' });
    else if (s === 'arrived') updateOrder({ status: 'working' });
    else if (s === 'working' && m === 'none') updateOrder({ materialsStatus: 'requested' });
    else if (s === 'working' && m === 'requested') {
      setCart(MASTER_REQUEST.map((x) => ({ ...x })));
      setStack((st) => [...st, { name: 'shop', fromOrder: true }]);
    } else if (s === 'working' && m === 'ordered') updateOrder({ materialsStatus: 'delivered' });
    else if (s === 'working' && m === 'delivered') updateOrder({ status: 'done' });
    else if (s === 'done') setStack((st) => [...st, { name: 'checkout', materialsOnly: false }]);
  }, [order, updateOrder]);

  const resetAll = useCallback(() => {
    setMode('customer');
    setStack([{ name: 'onboarding' }]);
    setTab('home');
    setDraft(freshDraft());
    setOrder(null);
    setPastOrders(PAST_ORDERS);
    setPoints(START_POINTS);
    setCart([]);
    setMStack([{ name: 'm-tabs' }]);
    setMTab('jobs');
    setMs(freshMaster());
  }, []);

  const jump = useCallback((t: DemoTarget) => {
    const base = (): Order => makeOrder({ ...freshDraft(), serviceId: 'leak' }, 'm1');
    const tabs: Route = { name: 'tabs' };
    setMode(t.startsWith('m-') ? 'master' : 'customer');
    setToast(null);

    switch (t) {
      case 'onboarding':
        setStack([{ name: 'onboarding' }]);
        break;
      case 'home':
        setTab('home');
        setStack([tabs]);
        break;
      case 'request':
        setTab('home');
        setDraft(freshDraft());
        setStack([tabs, { name: 'request', categoryId: 'plumbing' }]);
        break;
      case 'masters':
        setTab('home');
        setDraft({ ...freshDraft(), serviceId: 'leak', description: 'Угаалтуурын доороос дусалж байна.', photos: 2 });
        setStack([tabs, { name: 'request', categoryId: 'plumbing' }, { name: 'masters' }]);
        break;
      case 'tracking':
        setTab('home');
        setOrder({ ...base(), status: 'enroute' });
        setStack([tabs, { name: 'tracking' }]);
        break;
      case 'materials-request':
        setTab('home');
        setOrder({ ...base(), status: 'working', materialsStatus: 'requested' });
        setStack([tabs, { name: 'tracking' }]);
        break;
      case 'shop':
        setTab('home');
        setOrder({ ...base(), status: 'working', materialsStatus: 'requested' });
        setCart(MASTER_REQUEST.map((x) => ({ ...x })));
        setStack([tabs, { name: 'tracking' }, { name: 'shop', fromOrder: true }]);
        break;
      case 'checkout':
        setTab('home');
        setOrder({ ...base(), status: 'done', materials: MASTER_REQUEST.map((x) => ({ ...x })), materialsStatus: 'delivered' });
        setStack([tabs, { name: 'tracking' }, { name: 'checkout', materialsOnly: false }]);
        break;
      case 'installment':
        setTab('home');
        setOrder({ ...makeOrder({ ...freshDraft(), categoryId: 'paint', serviceId: 'full', plan: 3 }, 'm3'), status: 'done', materialsStatus: 'none' });
        setStack([tabs, { name: 'tracking' }, { name: 'checkout', materialsOnly: false }]);
        break;
      case 'rating':
        setTab('home');
        setOrder({ ...base(), status: 'paid', materials: MASTER_REQUEST.map((x) => ({ ...x })), materialsStatus: 'delivered' });
        setStack([tabs, { name: 'rating' }]);
        break;
      case 'm-home':
        setMTab('jobs');
        setMs(freshMaster());
        setMStack([{ name: 'm-tabs' }]);
        break;
      case 'm-incoming':
        setMTab('jobs');
        setMs({ ...freshMaster(), online: true, incoming: true });
        setMStack([{ name: 'm-tabs' }]);
        break;
      case 'm-job':
        setMTab('jobs');
        setMs({ ...freshMaster(), online: true, jobActive: true, jobStep: 2 });
        setMStack([{ name: 'm-tabs' }, { name: 'm-job' }]);
        break;
      case 'm-earnings':
        setMTab('earnings');
        setMStack([{ name: 'm-tabs' }]);
        break;
    }
  }, []);

  const value = useMemo<AppCtx>(
    () => ({
      mode, setMode,
      stack, push, pop, replace, resetTo, tab, setTab,
      draft, updateDraft, order, startOrder, updateOrder, advanceOrder, finishOrder, payInstallment, clearOrder, pastOrders,
      points, setPoints,
      cart, addToCart, setQty, switchTier, clearCart, loadMasterRequest,
      mStack, mPush, mPop, mResetTo, mTab, setMTab, ms, updateMs,
      toast, showToast, jump, resetAll,
    }),
    [mode, stack, push, pop, replace, resetTo, tab, draft, updateDraft, order, startOrder, updateOrder, advanceOrder, finishOrder, payInstallment,
      clearOrder, pastOrders, points, cart, addToCart, setQty, switchTier, clearCart, loadMasterRequest, mStack, mPush, mPop,
      mResetTo, mTab, ms, updateMs, toast, showToast, jump, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside <AppProvider>');
  return c;
}
