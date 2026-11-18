import { ClipboardList, House, ShoppingBag, User, Wallet, Wrench } from 'lucide-react';
import { useApp } from '../state';
import type { CustomerTab, MasterTab } from '../types';

export function CustomerTabBar() {
  const { tab, setTab, cart, order } = useApp();
  const items: { id: CustomerTab; label: string; icon: typeof House; count?: number }[] = [
    { id: 'home', label: 'Нүүр', icon: House },
    { id: 'orders', label: 'Захиалга', icon: ClipboardList, count: order ? 1 : 0 },
    { id: 'materials', label: 'Дэлгүүр', icon: ShoppingBag, count: cart.reduce((s, c) => s + c.qty, 0) },
    { id: 'profile', label: 'Миний', icon: User },
  ];
  return (
    <nav className="tabbar">
      {items.map(({ id, label, icon: Icon, count }) => (
        <button key={id} className={`tab${tab === id ? ' on' : ''}`} onClick={() => setTab(id)}>
          <Icon size={25} strokeWidth={tab === id ? 2.1 : 1.7} />
          {label}
          {!!count && <span className="badge-n">{count}</span>}
        </button>
      ))}
    </nav>
  );
}

export function MasterTabBar() {
  const { mTab, setMTab } = useApp();
  const items: { id: MasterTab; label: string; icon: typeof House }[] = [
    { id: 'jobs', label: 'Ажил', icon: Wrench },
    { id: 'earnings', label: 'Орлого', icon: Wallet },
    { id: 'profile', label: 'Профайл', icon: User },
  ];
  return (
    <nav className="tabbar">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`tab${mTab === id ? ' on' : ''}`} onClick={() => setMTab(id)}>
          <Icon size={25} strokeWidth={mTab === id ? 2.1 : 1.7} />
          {label}
        </button>
      ))}
    </nav>
  );
}
