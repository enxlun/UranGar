import { useEffect, useRef, useState } from 'react';
import { ChevronRight, MapPin, Navigation, Power } from 'lucide-react';
import { useApp } from '../../state';
import { fmt, split } from '../../data';
import { Avatar, Sheet } from '../../components/ui';
import { MapView, roadRoute } from '../../components/MapView';
import { JOB, ME } from './jobData';

function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const end = useRef(onEnd);
  end.current = onEnd;
  useEffect(() => {
    if (left <= 0) { end.current(); return; }
    const t = window.setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);
  return (
    <div className="progress" style={{ height: 5, background: 'var(--fill-2)' }}>
      <i style={{ width: `${(left / seconds) * 100}%`, transition: 'width 1s linear' }} />
    </div>
  );
}

export function MasterHome() {
  const { ms, updateMs, mPush, showToast, setMTab } = useApp();
  const income = split(JOB.travelFee + ms.laborFee).master;

  useEffect(() => {
    if (!ms.online || ms.incoming || ms.jobActive) return;
    const t = window.setTimeout(() => updateMs({ incoming: true }), 2500);
    return () => window.clearTimeout(t);
  }, [ms.online, ms.incoming, ms.jobActive, updateMs]);

  const accept = () => {
    updateMs({ incoming: false, jobActive: true, jobStep: 0, materialsSent: false, laborFee: 50000 });
    mPush({ name: 'm-job' });
  };

  return (
    <div className="grow col" style={{ position: 'relative', minHeight: 0 }}>
      <MapView
        height={760}
        focus={[ME.pos[0] + 60, ME.pos[1] + 150]}
        route={ms.incoming ? roadRoute(JOB.from, JOB.to) : undefined}
        markers={[
          { id: 'me', kind: 'master', pos: ME.pos, initials: ME.initials, color: ME.color, selected: true },
          ...(ms.incoming ? [{ id: 'dest', kind: 'dest' as const, pos: JOB.to, tag: `${JOB.distanceKm} км` }] : []),
        ]}
        inCanvas={ms.online && !ms.incoming && !ms.jobActive ? (
          <span style={{ position: 'absolute', left: ME.pos[0], top: ME.pos[1], width: 0, height: 0 }}>
            {[0, 1].map((d) => <span key={d} style={{ position: 'absolute', width: 140, height: 140, left: -70, top: -70, borderRadius: '50%', background: 'rgba(52,168,83,0.2)', animation: `pulse 2.4s ${d * 1.2}s infinite` }} />)}
          </span>
        ) : undefined}
      >
      </MapView>

      {/* Дээд хэсэг */}
      <div className="row between" style={{ position: 'absolute', top: 'calc(var(--sb) + 4px)', left: 14, right: 14, zIndex: 6 }}>
        <button className="floating-btn" style={{ width: 44, height: 44, borderRadius: 22, padding: 0, overflow: 'hidden' }} onClick={() => setMTab('profile')} aria-label="Профайл">
          <Avatar initials={ME.initials} color={ME.color} size={44} />
        </button>
        <button className="card row g6" style={{ height: 44, padding: '0 16px', borderRadius: 22 }} onClick={() => setMTab('earnings')}>
          <span className="t-cap c3">Өнөөдөр</span>
          <span className="t-head num">{fmt(ms.todayEarned)}</span>
        </button>
        <span style={{ width: 44 }} />
      </div>

      {/* Доод хэсэг */}
      <div className="map-sheet" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px 16px' }}>
        {ms.jobActive ? (
          <button className="row g12" style={{ width: '100%' }} onClick={() => mPush({ name: 'm-job' })}>
            <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center' }}><Navigation size={20} /></span>
            <div className="grow">
              <div className="t-head">Идэвхтэй ажил · {JOB.category}</div>
              <div className="t-foot c3 ellipsis">{JOB.customer} · {JOB.address}</div>
            </div>
            <ChevronRight size={20} className="c3" />
          </button>
        ) : ms.online ? (
          <>
            <div className="row g12">
              <div className="spinner" />
              <div className="grow">
                <div className="t-head">Дуудлага хайж байна</div>
                <div className="t-foot c3">Баянзүрх, Сүхбаатар дүүрэг</div>
              </div>
              <button className="btn btn-grey btn-s" onClick={() => updateMs({ online: false })}>Офлайн</button>
            </div>
            <div className="row mt16" style={{ justifyContent: 'space-around' }}>
              {[{ v: String(ms.jobsToday), l: 'Ажил' }, { v: '96%', l: 'Хүлээн авалт' }, { v: ME.rating.toFixed(1), l: 'Үнэлгээ' }].map((x) => (
                <div key={x.l} className="col" style={{ alignItems: 'center' }}>
                  <span className="t-head num">{x.v}</span>
                  <span className="t-cap c3">{x.l}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="col" style={{ alignItems: 'center' }}>
            <button
              onClick={() => updateMs({ online: true, incoming: false })}
              style={{ width: 84, height: 84, borderRadius: 42, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 8px var(--brand-tint)', marginTop: -50 }}
              aria-label="Онлайн болох"
            >
              <Power size={34} strokeWidth={2.4} />
            </button>
            <div className="t-head mt16">Та офлайн байна</div>
            <div className="t-foot c3 mt2">Дуудлага авахын тулд онлайн болно уу</div>
          </div>
        )}
      </div>

      {ms.incoming && (
        <Sheet>
          <Countdown seconds={30} onEnd={() => { updateMs({ incoming: false }); showToast('Дуудлагын хугацаа дууслаа'); }} />
          <div className="row between mt16">
            <div>
              <div className="t-foot c3">Шинэ дуудлага · {JOB.category}</div>
              <div className="t-large num mt2" style={{ color: 'var(--leaf)' }}>{fmt(income)}</div>
              <div className="t-foot c2">таны орлого (79%)</div>
            </div>
            <div className="col" style={{ alignItems: 'flex-end' }}>
              <span className="t-head num">{JOB.etaMin} мин</span>
              <span className="t-foot c3">{JOB.distanceKm} км</span>
            </div>
          </div>
          <div className="hair mt16" />
          <div className="row g12 mt12">
            <Avatar initials={JOB.customerInitials} color="#15181F" size={40} />
            <div className="grow">
              <div className="t-callout w6">{JOB.customer} <span className="c3 w5">· ★ 4.9</span></div>
              <div className="row g4 t-foot c3"><MapPin size={13} />{JOB.address}</div>
            </div>
          </div>
          <p className="t-callout mt12">{JOB.description}</p>
          <div className="row g8 mt12">
            <div className="photo" style={{ width: 64, height: 64 }} />
            <div className="photo b" style={{ width: 64, height: 64 }} />
          </div>
          <div className="row g12 mt20">
            <button className="btn btn-grey" style={{ flex: 1 }} onClick={() => { updateMs({ incoming: false }); showToast('Дуудлагаас татгалзлаа'); }}>Татгалзах</button>
            <button className="btn btn-brand" style={{ flex: 2 }} onClick={accept}>Хүлээж авах</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
