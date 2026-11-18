import { BadgeCheck, Bell, ChevronDown, ChevronRight, Search, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { CATEGORIES, MASTERS, SERVICES, TRUCK, USER, fmt, getCategory, getMaster, installmentSteps, installments, orderTotal, priceLabel } from '../../data';
import { Avatar, BerryCoin, Rating, SectionHeader } from '../../components/ui';
import type { OrderStatus } from '../../types';

const STATUS_SHORT: Record<OrderStatus, string> = {
  searching: 'Мастер хайж байна', accepted: 'Мастер бэлдэж байна', enroute: 'Мастер замдаа явж байна', arrived: 'Мастер ирлээ',
  working: 'Ажил хийгдэж байна', done: 'Төлбөр хүлээгдэж байна', paid: 'Төлөгдсөн', rated: 'Дууссан',
};
const STEP: Record<OrderStatus, number> = { searching: 0, accepted: 1, enroute: 1, arrived: 2, working: 2, done: 3, paid: 4, rated: 4 };

const POPULAR = [
  { cat: 'plumbing', svc: 'leak' },
  { cat: 'tile', svc: 'bath' },
  { cat: 'heating', svc: 'check' },
  { cat: 'paint', svc: 'full' },
];

export function Home() {
  const { push, setTab, order, updateDraft, points, pastOrders } = useApp();
  const due = pastOrders.find((o) => (o.plan ?? 1) > 1 && (o.paidParts ?? 0) < (o.plan ?? 1));
  const nearby = [...MASTERS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  const open = (categoryId: string, serviceId?: string) => {
    updateDraft({ categoryId, serviceId: serviceId ?? SERVICES[categoryId][0].id });
    push({ name: 'request', categoryId });
  };

  return (
    <div className="scroll">
      {/* Толгой */}
      <div className="pad row between" style={{ paddingTop: 4 }}>
        <button className="col" style={{ alignItems: 'flex-start' }}>
          <span className="t-cap c3">Хаяг</span>
          <span className="row g4 t-head">Гэр · {USER.addressShort}<ChevronDown size={18} strokeWidth={2.4} /></span>
        </button>
        <div className="row g4">
          <button className="row g6 pill pill-brand" style={{ height: 32, padding: '0 10px 0 8px', fontSize: 14 }} onClick={() => setTab('profile')}>
            <BerryCoin size={18} /> <span className="num">{points.toLocaleString('en-US')}</span>
          </button>
          <button className="nav-btn" onClick={() => push({ name: 'notifications' })} aria-label="Мэдэгдэл">
            <Bell size={23} strokeWidth={1.9} />
            <span className="dot" />
          </button>
        </div>
      </div>

      <div className="pad mt12">
        <button className="search" onClick={() => open('plumbing')}>
          <Search size={19} strokeWidth={2.2} />
          Юу засуулах вэ?
        </button>
      </div>

      {order && (
        <div className="pad mt16">
          <button className="card col g12" style={{ width: '100%', padding: 14 }} onClick={() => push({ name: 'tracking' })}>
            <div className="row g12" style={{ width: '100%' }}>
              <Avatar initials={getMaster(order.masterId).initials} color={getMaster(order.masterId).color} size={44} />
              <div className="grow">
                <div className="t-head">{STATUS_SHORT[order.status]}</div>
                <div className="t-foot c2">{getMaster(order.masterId).short} · {getCategory(order.categoryId).name}</div>
              </div>
              <ChevronRight size={20} className="c3" />
            </div>
            <div className="steps-bar" style={{ width: '100%' }}>
              {[0, 1, 2, 3].map((i) => <i key={i} className={i < STEP[order.status] ? 'done' : i === STEP[order.status] ? 'now' : ''} />)}
            </div>
          </button>
        </div>
      )}

      {due && (
        <div className="pad mt12">
          <button className="row g12" style={{ width: '100%', background: '#FFF4EC', borderRadius: 14, padding: '12px 14px' }} onClick={() => setTab('orders')}>
            <span className="t-sub grow">
              <b>Дараагийн төлбөр {installmentSteps(due.plan ?? 1)[due.paidParts ?? 0].due}</b>
              <span className="c2"> · {(due.paidParts ?? 0) + 1}/{due.plan} хэсэг</span>
            </span>
            <span className="t-sub w6 num">{fmt(installments(orderTotal(due), due.plan ?? 1)[due.paidParts ?? 0])}</span>
            <ChevronRight size={18} className="c3" />
          </button>
        </div>
      )}

      {/* Ангилал */}
      <div className="pad mt24" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px 6px' }}>
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.id} className="svc-tile" onClick={() => open(c.id)}>
              <span className="svc-icon" style={{ background: c.tint, color: c.fg }}>
                <Icon size={28} strokeWidth={1.8} />
              </span>
              {c.short}
            </button>
          );
        })}
      </div>

      {/* Сурталчилгаа */}
      <div className="hscroll mt32" style={{ gap: 12 }}>
        <button className="promo" style={{ background: '#FFEBDD' }} onClick={() => setTab('profile')}>
          <img src={BERRY.cluster} alt="" style={{ width: 210, right: -54, bottom: -34 }} />
          <div style={{ position: 'relative', maxWidth: 170 }}>
            <div className="row g6 t-foot w6 cb"><BerryCoin size={16} /> Чацаргана оноо</div>
            <div className="t-title3 mt6" style={{ fontSize: 19 }}>Захиалга бүрээс 1% буцаан авна</div>
          </div>
          <span className="t-foot w6" style={{ position: 'relative' }}>Дэлгэрэнгүй ›</span>
        </button>
        <button className="promo" style={{ background: '#1F2329', color: '#fff' }} onClick={() => open('heating', 'check')}>
          <img src={BERRY.sprig} alt="" style={{ width: 120, right: -6, bottom: -40, transform: 'rotate(-12deg)' }} />
          <div style={{ position: 'relative', maxWidth: 190 }}>
            <div className="t-foot w6" style={{ color: '#FFB27A' }}>Өвлийн бэлтгэл</div>
            <div className="t-title3 mt6" style={{ fontSize: 19 }}>Радиаторын үзлэг 35,000₮-с</div>
          </div>
          <span className="t-foot w6" style={{ position: 'relative', color: 'rgba(255,255,255,0.8)' }}>Хүйтрэхээс өмнө ›</span>
        </button>
        <button className="promo" style={{ background: '#E5EFE1' }} onClick={() => setTab('materials')}>
          <img src={BERRY.branch} alt="" style={{ width: 200, right: -60, bottom: -30, transform: 'scaleX(-1)' }} />
          <div style={{ position: 'relative', maxWidth: 180 }}>
            <div className="row g6 t-foot w6 cl"><Truck size={15} /> Явуулын машин</div>
            <div className="t-title3 mt6" style={{ fontSize: 19 }}>Материал {TRUCK.etaMin} минутад хаалган дээр</div>
          </div>
          <span className="t-foot w6" style={{ position: 'relative' }}>Дэлгүүр үзэх ›</span>
        </button>
        <span style={{ width: 4, flex: '0 0 auto' }} />
      </div>

      <SectionHeader title="Түгээмэл" />
      <div className="group plain">
        {POPULAR.map(({ cat, svc }) => {
          const c = getCategory(cat);
          const s = SERVICES[cat].find((x) => x.id === svc)!;
          const Icon = c.icon;
          return (
            <button key={svc} className="cell tall" style={{ ['--inset' as string]: '72px' }} onClick={() => open(cat, svc)}>
              <span className="thumb" style={{ width: 44, height: 44, borderRadius: 11, background: c.tint, color: c.fg }}><Icon size={22} strokeWidth={1.8} /></span>
              <div className="grow">
                <div className="t-callout w5">{s.name}</div>
                <div className="t-foot c3">{c.name} · {s.dur}</div>
              </div>
              <span className="t-sub w6 num nowrap">{priceLabel(s)}</span>
            </button>
          );
        })}
      </div>

      <SectionHeader title="Ойролцоох мастерууд" action="Бүгд" onAction={() => open('plumbing')} />
      <div className="group plain" style={{ marginBottom: 24 }}>
        {nearby.map((m) => (
          <button
            key={m.id}
            className="cell tall"
            style={{ ['--inset' as string]: '72px' }}
            onClick={() => {
              updateDraft({ categoryId: m.categoryIds[0], serviceId: SERVICES[m.categoryIds[0]][0].id });
              push({ name: 'master', masterId: m.id, selectable: true });
            }}
          >
            <Avatar initials={m.initials} color={m.color} size={44} />
            <div className="grow">
              <div className="row g4 t-callout w6">{m.short}<BadgeCheck size={16} color="var(--leaf)" /></div>
              <div className="t-foot c3 ellipsis">{m.skills.join(', ')}</div>
            </div>
            <div className="col" style={{ alignItems: 'flex-end' }}>
              <Rating value={m.rating} />
              <span className="t-cap c3 mt2">{m.distanceKm} км</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
