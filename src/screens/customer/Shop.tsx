import { useState } from 'react';
import { Droplets, Grid3x3, Hammer, Minus, PaintBucket, Plug, Plus, Search, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { MATERIAL_GROUPS, MATERIALS, TIER_LABEL, TRUCK, cartTotal, fmt } from '../../data';
import { NavBar, Sheet } from '../../components/ui';
import type { Material, Tier } from '../../types';

export const GROUP_ICON: Record<string, typeof Droplets> = {
  'Сантехник': Droplets, 'Цахилгаан': Plug, 'Будаг, засал': PaintBucket, 'Плита': Grid3x3, 'Ерөнхий': Hammer,
};

function ProductSheet({ mat, onClose }: { mat: Material; onClose: () => void }) {
  const { addToCart, showToast } = useApp();
  const [tier, setTier] = useState<Tier>('pro');
  const [qty, setQty] = useState(1);
  const Icon = GROUP_ICON[mat.group] ?? Hammer;

  return (
    <Sheet onClose={onClose}>
      <div className="row g12">
        <span className="thumb" style={{ width: 64, height: 64 }}><Icon size={30} strokeWidth={1.6} /></span>
        <div className="grow">
          <h2 className="t-title3">{mat.name}</h2>
          <p className="t-foot c3">{mat.group} · 1 {mat.unit}</p>
        </div>
      </div>
      <div className="t-head mt20">Чанарын түвшин</div>
      <div className="col g8 mt8">
        {(['eco', 'pro'] as Tier[]).map((t) => (
          <button key={t} className="row g12" onClick={() => setTier(t)}
            style={{ padding: 14, borderRadius: 14, boxShadow: `inset 0 0 0 ${tier === t ? 2 : 1}px ${tier === t ? 'var(--brand)' : 'var(--sep)'}`, background: tier === t ? '#FFF8F3' : '#fff' }}>
            <span className={`radio${tier === t ? ' on' : ''}`} />
            <div className="grow">
              <div className="t-callout w6">{TIER_LABEL[t]}</div>
              <div className="t-foot c2 mt2">Эдлэх хугацаа {mat[t].life} · {mat[t].note}</div>
            </div>
            <span className="t-head num">{fmt(mat[t].price)}</span>
          </button>
        ))}
      </div>
      <div className="row g12 mt20">
        <div className="qty" style={{ height: 52, borderRadius: 14 }}>
          <button style={{ width: 44, height: 52 }} onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Хасах"><Minus size={18} /></button>
          <span>{qty}</span>
          <button style={{ width: 44, height: 52 }} onClick={() => setQty(qty + 1)} aria-label="Нэмэх"><Plus size={18} /></button>
        </div>
        <button className="btn btn-brand grow" onClick={() => { addToCart(mat.id, tier, qty); showToast('Сагсанд нэмэгдлээ', `${mat.name} × ${qty}`); onClose(); }}>
          Нэмэх · {fmt(mat[tier].price * qty)}
        </button>
      </div>
    </Sheet>
  );
}

export function Shop({ embedded, fromOrder }: { embedded?: boolean; fromOrder?: boolean }) {
  const { pop, push, cart, order } = useApp();
  const [group, setGroup] = useState('Бүгд');
  const [open, setOpen] = useState<Material | null>(null);
  const items = group === 'Бүгд' ? MATERIALS : MATERIALS.filter((m) => m.group === group);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  const body = (
    <>
      <div className="scroll" style={{ paddingBottom: count ? 90 : 16 }}>
        {embedded && <h1 className="t-large pad" style={{ paddingTop: 6 }}>Дэлгүүр</h1>}
        <div className="pad mt12">
          <div className="row g12" style={{ background: 'var(--fill)', borderRadius: 14, padding: '12px 14px' }}>
            <div className="pin-truck" style={{ transform: 'none', border: 0, width: 38, height: 38 }}><Truck size={19} /></div>
            <div className="grow">
              <div className="t-callout w6">{TRUCK.name}</div>
              <div className="t-foot c2">{TRUCK.distanceKm} км · ~{TRUCK.etaMin} минутад хүргэнэ</div>
            </div>
            <span className="pill pill-leaf">Нээлттэй</span>
          </div>
        </div>
        {fromOrder && order?.materialsStatus === 'requested' && (
          <p className="t-sub pad mt12" style={{ color: 'var(--brand-text)' }}>Мастерын хүссэн 3 бараа сагсанд орсон. Чанарын түвшинг сагсан дээрээ сольж болно.</p>
        )}
        <div className="pad mt12"><div className="search"><Search size={18} strokeWidth={2.2} /> Бараа хайх</div></div>
        <div className="hscroll mt12">
          {['Бүгд', ...MATERIAL_GROUPS].map((g) => (
            <button key={g} className={`chip${group === g ? ' on' : ''}`} onClick={() => setGroup(g)}>{g}</button>
          ))}
        </div>
        <div className="group plain mt8">
          {items.map((m) => {
            const Icon = GROUP_ICON[m.group] ?? Hammer;
            const n = cart.filter((c) => c.materialId === m.id).reduce((s, c) => s + c.qty, 0);
            return (
              <div key={m.id} className="cell tall" style={{ ['--inset' as string]: '84px', cursor: 'pointer' }} onClick={() => setOpen(m)}>
                <span className="thumb"><Icon size={26} strokeWidth={1.6} /></span>
                <div className="grow">
                  <div className="t-callout w5">{m.name}</div>
                  <div className="t-sub num mt2">{fmt(m.eco.price)} – {fmt(m.pro.price)}</div>
                  <div className="t-cap c3">2 чанарын сонголт{n ? ` · сагсанд ${n}` : ''}</div>
                </div>
                <span style={{ width: 32, height: 32, borderRadius: 16, background: n ? 'var(--brand)' : 'var(--fill)', color: n ? '#fff' : 'var(--text)', display: 'grid', placeItems: 'center' }}>
                  {n ? <span className="t-sub w7">{n}</span> : <Plus size={18} strokeWidth={2.4} />}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {count > 0 && (
        <button
          className="btn btn-dark"
          style={{ position: 'absolute', left: 16, right: 16, bottom: embedded ? 'calc(var(--hi) + 70px)' : 'calc(var(--hi) + 12px)', zIndex: 20, justifyContent: 'space-between', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
          onClick={() => push({ name: 'cart' })}
        >
          <span className="row g8"><span style={{ background: 'var(--brand)', borderRadius: 10, minWidth: 22, height: 22, display: 'grid', placeItems: 'center', fontSize: 13 }}>{count}</span>Сагс харах</span>
          <span className="num">{fmt(cartTotal(cart))}</span>
        </button>
      )}
      {open && <ProductSheet mat={open} onClose={() => setOpen(null)} />}
    </>
  );

  if (embedded) return body;
  return (
    <div className="screen">
      <NavBar title="Явуулын дэлгүүр" onBack={pop} />
      {body}
    </div>
  );
}
