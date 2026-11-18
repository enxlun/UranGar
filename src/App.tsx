import { useEffect, useState } from 'react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { useApp, type DemoTarget } from './state';
import type { Route } from './types';
import { BERRY } from './assets';
import { NOTES } from './screens/notes';
import { AppIcon, Wordmark } from './components/ui';
import { CustomerTabBar, MasterTabBar } from './components/TabBar';
import { Onboarding } from './screens/customer/Onboarding';
import { Login, Otp } from './screens/customer/Login';
import { Home } from './screens/customer/Home';
import { Request } from './screens/customer/Request';
import { Masters } from './screens/customer/Masters';
import { MasterProfile } from './screens/customer/MasterProfile';
import { Matching } from './screens/customer/Matching';
import { Tracking } from './screens/customer/Tracking';
import { Chat } from './screens/customer/Chat';
import { Shop } from './screens/customer/Shop';
import { Cart } from './screens/customer/Cart';
import { Checkout } from './screens/customer/Checkout';
import { Paid } from './screens/customer/Paid';
import { Rating } from './screens/customer/Rating';
import { Orders } from './screens/customer/Orders';
import { Profile } from './screens/customer/Profile';
import { Notifications } from './screens/customer/Notifications';
import { MasterHome } from './screens/master/MasterHome';
import { MasterJob } from './screens/master/MasterJob';
import { MasterShop } from './screens/master/MasterShop';
import { MasterDone } from './screens/master/MasterDone';
import { Earnings } from './screens/master/Earnings';
import { MasterSelf } from './screens/master/MasterSelf';

function renderCustomer(r: Route, tab: string) {
  switch (r.name) {
    case 'onboarding': return <Onboarding />;
    case 'login': return <Login />;
    case 'otp': return <Otp phone={r.phone} />;
    case 'request': return <Request />;
    case 'masters': return <Masters />;
    case 'master': return <MasterProfile masterId={r.masterId} selectable={r.selectable} />;
    case 'matching': return <Matching />;
    case 'tracking': return <Tracking />;
    case 'chat': return <Chat />;
    case 'shop': return <Shop fromOrder={r.fromOrder} />;
    case 'cart': return <Cart />;
    case 'checkout': return <Checkout materialsOnly={r.materialsOnly} />;
    case 'paid': return <Paid materialsOnly={r.materialsOnly} amount={r.amount} />;
    case 'rating': return <Rating />;
    case 'notifications': return <Notifications />;
    default:
      return (
        <div className={`screen static${tab === 'profile' ? ' grouped' : ''}`}>
          {tab === 'home' && <Home />}
          {tab === 'orders' && <Orders />}
          {tab === 'materials' && <Shop embedded />}
          {tab === 'profile' && <Profile />}
          <CustomerTabBar />
        </div>
      );
  }
}

function renderMaster(r: Route, tab: string) {
  switch (r.name) {
    case 'm-job': return <MasterJob />;
    case 'm-shop': return <MasterShop />;
    case 'm-done': return <MasterDone />;
    default:
      return (
        <div className={`screen static${tab === 'jobs' ? ' full' : ''}${tab === 'profile' ? ' grouped' : ''}`}>
          {tab === 'jobs' && <MasterHome />}
          {tab === 'earnings' && <Earnings />}
          {tab === 'profile' && <MasterSelf />}
          <MasterTabBar />
        </div>
      );
  }
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function useScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const f = () => setScale(Math.min(1, (window.innerHeight - 32) / 868));
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return scale;
}

function Phone() {
  const { mode, stack, tab, mStack, mTab, toast } = useApp();
  const clock = useClock();
  const top = mode === 'customer' ? stack[stack.length - 1] : mStack[mStack.length - 1];
  const key = mode === 'customer' ? `c${stack.length}-${top.name}` : `m${mStack.length}-${top.name}`;

  return (
    <div className="phone">
      <div className="phone-screen">
        <div key={key} style={{ position: 'absolute', inset: 0 }}>
          {mode === 'customer' ? renderCustomer(top, tab) : renderMaster(top, mTab)}
        </div>
        <div className="island" />
        <div className="statusbar">
          <span>{clock}</span>
          <span className="statusbar-r">
            <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" /></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.3 10.3 0 0 0 8 .6C5.3.6 2.8 1.6.9 3.4L2 4.6c1.6-1.5 3.7-2.4 6-2.4Zm0 3.3c1.4 0 2.7.5 3.7 1.4l1.1-1.2A7 7 0 0 0 8 3.9a7 7 0 0 0-4.8 1.8l1.1 1.2c1-.9 2.3-1.4 3.7-1.4Zm0 3.3c-.6 0-1.1.2-1.5.6L8 11l1.5-1.6c-.4-.4-.9-.6-1.5-.6Z" fill="currentColor" /></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="currentColor" opacity="0.5" /></svg>
          </span>
        </div>
        {toast && (
          <div className="banner" key={toast.title + (toast.body ?? '')}>
            <div className="banner-icon"><AppIcon size={36} radius={9} /></div>
            <div className="grow">
              <div className="row between"><span className="t-foot w6">УранГар</span><span className="t-cap c3">одоо</span></div>
              <div className="t-sub w6 mt2">{toast.title}</div>
              {toast.body && <div className="t-sub c2">{toast.body}</div>}
            </div>
          </div>
        )}
        <div className="home-ind" />
      </div>
    </div>
  );
}

const CUSTOMER_STEPS: { t: DemoTarget; l: string }[] = [
  { t: 'onboarding', l: 'Нээх, нэвтрэх' },
  { t: 'home', l: 'Нүүр хуудас' },
  { t: 'request', l: 'Ажил захиалах' },
  { t: 'masters', l: 'Мастер сонгох' },
  { t: 'tracking', l: 'Мастер замдаа' },
  { t: 'materials-request', l: 'Материалын хүсэлт' },
  { t: 'shop', l: 'Явуулын дэлгүүр' },
  { t: 'checkout', l: 'QPay төлбөр' },
  { t: 'installment', l: 'Хувааж төлөх (2–3 сар)' },
  { t: 'rating', l: 'Үнэлгээ' },
];
const MASTER_STEPS: { t: DemoTarget; l: string }[] = [
  { t: 'm-home', l: 'Онлайн болох' },
  { t: 'm-incoming', l: 'Шинэ дуудлага' },
  { t: 'm-job', l: 'Ажил гүйцэтгэх' },
  { t: 'm-earnings', l: 'Орлого' },
];

function Panel() {
  const { mode, setMode, jump, resetAll, stack, order, advanceOrder } = useApp();
  const onTracking = mode === 'customer' && stack[stack.length - 1].name === 'tracking' && !!order;
  return (
    <aside className="panel">
      <div className="panel-brand"><AppIcon size={40} /><Wordmark size={24} /></div>
      <p className="panel-sub">Барилга, засварын мастер дуудах аппын прототип. Чацаргана баг.</p>
      <div className="panel-seg">
        <button className={mode === 'customer' ? 'on' : ''} onClick={() => setMode('customer')}>Хэрэглэгч</button>
        <button className={mode === 'master' ? 'on' : ''} onClick={() => setMode('master')}>Мастер</button>
      </div>
      <div>
        <div className="panel-h">Хэрэглэгчийн апп</div>
        <div className="panel-list">
          {CUSTOMER_STEPS.map((s, i) => (
            <button key={s.t} className="panel-item" onClick={() => jump(s.t)}><span>{i + 1}</span>{s.l}</button>
          ))}
        </div>
      </div>
      <div>
        <div className="panel-h">Мастерын апп</div>
        <div className="panel-list">
          {MASTER_STEPS.map((s, i) => (
            <button key={s.t} className="panel-item" onClick={() => jump(s.t)}><span>{CUSTOMER_STEPS.length + i + 1}</span>{s.l}</button>
          ))}
        </div>
      </div>
      {onTracking && <button className="panel-next" onClick={advanceOrder}>Дараагийн төлөв <ChevronRight size={16} /></button>}
      <button className="panel-reset" onClick={resetAll}><RotateCcw size={14} /> Эхнээс нь</button>
    </aside>
  );
}

function Note() {
  const { mode, stack, tab, mStack, mTab } = useApp();
  const top = mode === 'customer' ? stack[stack.length - 1] : mStack[mStack.length - 1];
  const key = top.name === 'tabs' ? `tab:${tab}` : top.name === 'm-tabs' ? `m-tab:${mTab}` : top.name;
  const note = NOTES[key];
  return (
    <div className="note">
      <div className="note-k">{mode === 'customer' ? 'Хэрэглэгчийн апп' : 'Мастерын апп'}</div>
      {note && (
        <>
          <div className="note-t">{note.title}</div>
          <p className="note-p">{note.text}</p>
        </>
      )}
      <img src={BERRY.sprig} alt="" className="note-berry" />
    </div>
  );
}

export default function App() {
  const scale = useScale();
  return (
    <div className="stage">
      <Panel />
      <div className="phone-wrap" style={{ ['--s' as string]: scale }}>
        <Phone />
      </div>
      <Note />
    </div>
  );
}
