import { useEffect, useState } from 'react';
import { BadgeCheck, Check } from 'lucide-react';
import { useApp } from '../../state';
import { HOME_POS, getMaster } from '../../data';
import { Avatar, Rating } from '../../components/ui';
import { MapView } from '../../components/MapView';

export function Matching() {
  const { order, replace, pop, updateOrder, clearOrder } = useApp();
  const [accepted, setAccepted] = useState(false);
  const [p, setP] = useState(0);
  const m = getMaster(order?.masterId ?? 'm1');

  useEffect(() => {
    const t0 = window.setTimeout(() => setP(1), 50);
    const t1 = window.setTimeout(() => setAccepted(true), 2600);
    const t2 = window.setTimeout(() => {
      updateOrder({ status: 'accepted' });
      replace({ name: 'tracking' });
    }, 3900);
    return () => [t0, t1, t2].forEach((t) => window.clearTimeout(t));
  }, [replace, updateOrder]);

  return (
    <div className="screen full static" style={{ animation: 'fade 250ms' }}>
      <MapView height={520} focus={HOME_POS} markers={[{ id: 'me', kind: 'me', pos: HOME_POS }, { id: m.id, kind: 'master', pos: m.pos, initials: m.initials, color: m.color, selected: accepted }]}
        inCanvas={!accepted ? (
          <div style={{ position: 'absolute', left: HOME_POS[0], top: HOME_POS[1], width: 0, height: 0 }}>
            {[0, 0.7, 1.4].map((d) => (
              <span key={d} style={{ position: 'absolute', width: 120, height: 120, left: -60, top: -60, borderRadius: '50%', background: 'rgba(232,98,12,0.18)', animation: `pulse 2.1s ${d}s infinite` }} />
            ))}
          </div>
        ) : undefined}>
      </MapView>
      <div className="map-sheet grow col" style={{ padding: '18px 16px calc(16px + var(--hi))' }}>
        <div className="row g12">
          {accepted ? (
            <span className="pop" style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--leaf)', color: '#fff', display: 'grid', placeItems: 'center' }}><Check size={17} strokeWidth={3} /></span>
          ) : (
            <div className="spinner" style={{ width: 24, height: 24 }} />
          )}
          <h1 className="t-title3">{accepted ? 'Мастер зөвшөөрлөө' : 'Мастерт хүсэлт илгээж байна'}</h1>
        </div>
        <div className="progress mt16"><i style={{ width: `${p * 100}%`, transition: 'width 3.6s linear' }} /></div>
        <div className="row g12 mt20">
          <Avatar initials={m.initials} color={m.color} size={48} />
          <div className="grow">
            <div className="row g4 t-callout w6">{m.short}<BadgeCheck size={16} color="var(--leaf)" /></div>
            <div className="t-foot c2"><Rating value={m.rating} count={m.reviews} size={12} /> · {m.distanceKm} км</div>
          </div>
        </div>
        <div className="grow" />
        {!accepted && (
          <button className="btn btn-grey btn-block" onClick={() => { clearOrder(); pop(); }}>Цуцлах</button>
        )}
      </div>
    </div>
  );
}
