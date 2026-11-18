import { useMemo, useState } from 'react';
import { BadgeCheck, ChevronLeft } from 'lucide-react';
import { useApp } from '../../state';
import { HOME_POS, MASTERS, fmt, getCategory, getService, priceLabel, travelFeeFor } from '../../data';
import { Avatar } from '../../components/ui';
import { MapView } from '../../components/MapView';

export function Masters() {
  const { pop, push, draft, startOrder } = useApp();
  const cat = getCategory(draft.categoryId);
  const svc = getService(cat.id, draft.serviceId);
  const [sort, setSort] = useState<'near' | 'rating'>('near');

  const list = useMemo(() => {
    const matched = MASTERS.filter((m) => m.categoryIds.includes(cat.id));
    const base = matched.length ? matched : MASTERS;
    return [...base].sort((a, b) => (sort === 'near' ? a.distanceKm - b.distanceKm : b.rating - a.rating));
  }, [cat.id, sort]);
  const [sel, setSel] = useState(list[0].id);
  const chosen = list.find((m) => m.id === sel) ?? list[0];

  return (
    <div className="screen full">
      <MapView
        height={350}
        focus={[200, 250]}
        markers={[
          { id: 'me', kind: 'me', pos: HOME_POS },
          ...list.map((m) => ({
            id: m.id, kind: 'master' as const, pos: m.pos, initials: m.initials, color: m.color,
            selected: m.id === chosen.id, tag: m.id === chosen.id ? `${m.etaMin} мин` : undefined, onClick: () => setSel(m.id),
          })),
        ]}
      >
        <button className="floating-btn" style={{ position: 'absolute', top: 'calc(var(--sb) + 4px)', left: 14 }} onClick={pop} aria-label="Буцах">
          <ChevronLeft size={24} strokeWidth={2.2} />
        </button>
      </MapView>

      <div className="map-sheet grow col" style={{ minHeight: 0 }}>
        <div className="grab mt8" style={{ marginBottom: 6 }} />
        <div className="pad">
          <h1 className="t-title3">Ойролцоох мастерууд</h1>
          <p className="t-foot c3">{cat.name} · {svc.name}</p>
        </div>
        <div className="hscroll mt12">
          <button className={`chip${sort === 'near' ? ' on' : ''}`} onClick={() => setSort('near')}>Хамгийн ойр</button>
          <button className={`chip${sort === 'rating' ? ' on' : ''}`} onClick={() => setSort('rating')}>Өндөр үнэлгээтэй</button>
          <button className="chip">Шалгагдсан</button>
        </div>
        <div className="scroll mt8">
          {list.map((m) => {
            const on = m.id === chosen.id;
            return (
              <div key={m.id} className="cell tall" style={{ ['--inset' as string]: '76px', background: on ? '#FFF7F1' : undefined, cursor: 'pointer' }} onClick={() => setSel(m.id)}>
                <button onClick={(e) => { e.stopPropagation(); push({ name: 'master', masterId: m.id, selectable: true }); }} aria-label="Профайл">
                  <Avatar initials={m.initials} color={m.color} size={48} />
                </button>
                <div className="grow">
                  <div className="row g4 t-callout w6">{m.short}<BadgeCheck size={16} color="var(--leaf)" /></div>
                  <div className="t-foot c2 num">★ {m.rating} ({m.reviews}) · {m.jobs} ажил</div>
                  <button className="t-foot cb w5" onClick={(e) => { e.stopPropagation(); push({ name: 'master', masterId: m.id, selectable: true }); }}>Профайл харах</button>
                </div>
                <div className="col" style={{ alignItems: 'flex-end' }}>
                  <span className="t-head num">{m.etaMin} мин</span>
                  <span className="t-cap c3 num">{fmt(travelFeeFor(m.distanceKm))}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bottom-bar">
          <button className="btn btn-brand btn-block" onClick={() => { startOrder(chosen.id); push({ name: 'matching' }); }}>
            Дуудах · {chosen.short}
          </button>
          <p className="t-cap c3 center mt8 num">Замын зардал {fmt(travelFeeFor(chosen.distanceKm))} · Ажлын хөлс {priceLabel(svc)}</p>
        </div>
      </div>
    </div>
  );
}
