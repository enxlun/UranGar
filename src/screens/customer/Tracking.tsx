import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, CircleCheck, CircleHelp, MessageCircle, Phone, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { HOME_POS, MASTER_REQUEST, TIER_LABEL, TRUCK, cartTotal, fmt, getMaster, getMaterial } from '../../data';
import { Avatar, Rating, Row } from '../../components/ui';
import { MapView, pointAlong, roadRoute } from '../../components/MapView';
import type { OrderStatus } from '../../types';

const STEP: Record<OrderStatus, number> = { searching: 0, accepted: 0, enroute: 1, arrived: 2, working: 2, done: 3, paid: 4, rated: 4 };
const STEP_LABELS = ['Баталгаажсан', 'Замдаа', 'Ажил', 'Дууссан'];

function useProgress(active: boolean, ms: number, onDone: () => void) {
  const [p, setP] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      setP(k);
      if (k < 1) raf = requestAnimationFrame(tick);
      else done.current();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, ms]);
  return active ? p : 0;
}

export function Tracking() {
  const { order, updateOrder, pop, push, loadMasterRequest, showToast } = useApp();
  const status = order?.status ?? 'accepted';
  const mat = order?.materialsStatus ?? 'none';
  const m = getMaster(order?.masterId ?? 'm1');
  const route = roadRoute(m.pos, HOME_POS);
  const truckRoute = roadRoute(TRUCK.pos, HOME_POS);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pMaster = useProgress(status === 'enroute', 9000, () => updateOrder({ status: 'arrived' }));
  const pTruck = useProgress(status === 'working' && mat === 'ordered', 8000, () => {
    updateOrder({ materialsStatus: 'delivered' });
    showToast('Материал хүргэгдлээ', `${TRUCK.name} материалыг мастерт хүлээлгэн өглөө.`);
  });

  const hasOrder = !!order;
  useEffect(() => {
    if (!hasOrder) return;
    let t: number | undefined;
    if (status === 'searching') t = window.setTimeout(() => updateOrder({ status: 'accepted' }), 800);
    else if (status === 'accepted') t = window.setTimeout(() => updateOrder({ status: 'enroute' }), 1800);
    else if (status === 'arrived') t = window.setTimeout(() => updateOrder({ status: 'working' }), 2500);
    else if (status === 'working' && mat === 'none') t = window.setTimeout(() => {
      updateOrder({ materialsStatus: 'requested' });
      showToast(`${m.short} материал хүсэж байна`, '3 бараа · явуулын машинаас 12 минутад');
    }, 3500);
    else if (status === 'working' && mat === 'delivered') t = window.setTimeout(() => {
      updateOrder({ status: 'done' });
      showToast('Ажил дууслаа', 'Шалгаад төлбөрөө төлнө үү.');
    }, 5000);
    return () => window.clearTimeout(t);
  }, [hasOrder, status, mat, updateOrder, showToast, m.short]);

  useEffect(() => {
    if (status === 'done' || mat === 'requested') scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [status, mat]);

  if (!order) {
    return (
      <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p className="t-body c2">Идэвхтэй захиалга алга.</p>
        <button className="btn btn-grey mt16" onClick={pop}>Буцах</button>
      </div>
    );
  }

  const openShop = () => { loadMasterRequest(); push({ name: 'shop', fromOrder: true }); };
  const masterPos = status === 'enroute' ? pointAlong(route, pMaster) : status === 'accepted' ? m.pos : [HOME_POS[0] - 22, HOME_POS[1] - 10] as [number, number];
  const eta = status === 'enroute' ? Math.max(1, Math.ceil(m.etaMin * (1 - pMaster))) : m.etaMin;
  const truckPos = mat === 'ordered' ? pointAlong(truckRoute, pTruck) : TRUCK.pos;
  const truckEta = Math.max(1, Math.ceil(TRUCK.etaMin * (1 - pTruck)));
  const step = STEP[status];

  const title =
    status === 'accepted' ? 'Мастер бэлдэж байна' :
    status === 'enroute' ? `${eta} минутад ирнэ` :
    status === 'arrived' ? 'Мастер ирлээ' :
    status === 'working' ? (mat === 'ordered' ? 'Материал ирж байна' : 'Ажил хийгдэж байна') :
    'Ажил дууслаа';
  const sub =
    status === 'accepted' ? 'Багаж хэрэгслээ бэлдээд гарна' :
    status === 'enroute' ? `${m.short} тан руу явж байна` :
    status === 'arrived' ? 'Хаалгаа нээнэ үү' :
    status === 'working' ? (mat === 'ordered' ? `${TRUCK.name} ${truckEta} минутад хүргэнэ` : 'Ажил дуусмагц мэдэгдэнэ') :
    'Ажлаа шалгаад төлбөрөө төлнө үү';

  return (
    <div className="screen full static">
      <MapView
        height={400}
        focus={status === 'enroute' ? [(masterPos[0] + HOME_POS[0]) / 2, (masterPos[1] + HOME_POS[1]) / 2 + 30] : [HOME_POS[0], HOME_POS[1] + 40]}
        route={status === 'accepted' || status === 'enroute' ? route : mat === 'ordered' ? truckRoute : undefined}
        markers={[
          { id: 'me', kind: 'me', pos: HOME_POS },
          ...(status === 'working' && (mat === 'ordered' || mat === 'requested')
            ? [{ id: 'truck', kind: 'truck' as const, pos: truckPos, tag: mat === 'ordered' ? `${truckEta} мин` : undefined }]
            : []),
          { id: m.id, kind: 'master' as const, pos: masterPos, initials: m.initials, color: m.color, selected: true, tag: status === 'enroute' ? `${eta} мин` : undefined },
        ]}
      >
        <button className="floating-btn" style={{ position: 'absolute', top: 'calc(var(--sb) + 4px)', left: 14 }} onClick={pop} aria-label="Буцах">
          <ChevronLeft size={24} strokeWidth={2.2} />
        </button>
      </MapView>

      <div ref={scrollRef} className="map-sheet scroll" style={{ paddingBottom: 'calc(var(--hi) + 16px)' }}>
        <div className="grab mt8" />
        <div className="pad">
          <h1 className="t-title">{title}</h1>
          <p className="t-callout c2 mt4">{sub}</p>
          <div className="steps-bar mt16">
            {[0, 1, 2, 3].map((i) => <i key={i} className={i < step ? 'done' : i === step ? 'now' : ''} />)}
          </div>
          <div className="steps-bar mt6">
            {STEP_LABELS.map((l, i) => <span key={l} className="t-cap" style={{ color: i <= step ? 'var(--text-2)' : 'var(--placeholder)', fontWeight: i === step ? 600 : 400 }}>{l}</span>)}
          </div>
        </div>

        <div className="pad row g12 mt20">
          <Avatar initials={m.initials} color={m.color} size={50} />
          <div className="grow">
            <div className="t-head">{m.short}</div>
            <div className="t-foot c2"><Rating value={m.rating} count={m.reviews} size={12} /></div>
          </div>
          <button className="round-btn" onClick={() => push({ name: 'chat' })} aria-label="Чат"><MessageCircle size={21} strokeWidth={1.9} /></button>
          <button className="round-btn" onClick={() => showToast(`${m.short} руу залгаж байна…`)} aria-label="Залгах"><Phone size={20} strokeWidth={1.9} /></button>
        </div>

        {status === 'working' && mat === 'requested' && (
          <div className="pad mt20">
            <div className="pop" style={{ background: '#FFF4EC', borderRadius: 16, padding: 16 }}>
              <div className="t-head">Мастер материал хүсэж байна</div>
              <div className="mt8">
                {MASTER_REQUEST.map((it) => (
                  <div key={it.materialId} className="row between t-sub" style={{ padding: '4px 0' }}>
                    <span>{getMaterial(it.materialId).name} <span className="c3">× {it.qty}</span></span>
                    <span className="c3">{TIER_LABEL[it.tier]}</span>
                  </div>
                ))}
              </div>
              <div className="row between mt12">
                <span className="t-sub c2">Ойролцоогоор <b className="num" style={{ color: 'var(--text)' }}>{fmt(cartTotal(MASTER_REQUEST))}</b></span>
                <button className="btn btn-brand btn-s" onClick={openShop}>Харах</button>
              </div>
            </div>
          </div>
        )}

        {status === 'working' && mat === 'ordered' && (
          <div className="pad mt20">
            <div className="row g12" style={{ background: 'var(--fill)', borderRadius: 16, padding: 14 }}>
              <div className="pin-truck" style={{ transform: 'none', border: 0 }}><Truck size={18} /></div>
              <div className="grow">
                <div className="t-callout w6">{TRUCK.name} замдаа</div>
                <div className="progress mt8" style={{ background: '#DCDCE2' }}><i style={{ width: `${pTruck * 100}%`, transition: 'none' }} /></div>
              </div>
              <span className="t-head num">{truckEta} мин</span>
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="pad mt20">
            <div className="pop" style={{ background: 'var(--leaf-tint)', borderRadius: 16, padding: 16 }}>
              <div className="row g8 t-head"><CircleCheck size={20} color="var(--leaf)" /> {(order.plan ?? 1) > 1 ? '1-р сарын ажил дууслаа' : 'Ажил амжилттай дууслаа'}</div>
              {(order.plan ?? 1) > 1 && <p className="t-sub c2 mt4">Та {order.plan} хувааж төлөхөөр сонгосон. Өнөөдөр эхний хэсгийг төлнө.</p>}
              <button className="btn btn-brand btn-block mt12" onClick={() => push({ name: 'checkout', materialsOnly: false })}>{(order.plan ?? 1) > 1 ? '1-р төлбөр төлөх' : 'Төлбөр төлөх'}</button>
            </div>
          </div>
        )}

        <div className="band mt20" />
        <div className="pad mt16">
          <div className="t-head">Захиалга #{order.id}</div>
          <p className="t-sub c2 mt4">{order.description}</p>
          <p className="t-sub c3 mt2">{order.address}</p>
          <div className="mt12">
            <Row k="Замын зардал" v={fmt(order.travelFee)} />
            <Row k="Ажлын хөлс" v={`${fmt(order.laborFee)}-с`} />
            <Row k="Материал" v={order.materials.length ? fmt(cartTotal(order.materials)) : '—'} muted={!order.materials.length} />
          </div>
        </div>
        <div className="pad mt16">
          <button className="row g8 t-sub c2"><CircleHelp size={18} /> Тусламж хэрэгтэй юу?</button>
        </div>
      </div>
    </div>
  );
}
