import { Check, ChevronLeft, MapPin, MessageCircle, Minus, Phone, Plus, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { fmt, split } from '../../data';
import { Avatar } from '../../components/ui';
import { MapView, roadRoute } from '../../components/MapView';
import { JOB } from './jobData';

const STEPS = [
  { t: 'Хэрэглэгч рүү явах', d: `${JOB.distanceKm} км · ~${JOB.etaMin} мин`, btn: 'Замд гарлаа' },
  { t: 'Хэрэглэгч дээр ирэх', d: 'Ирмэгц хэрэглэгчид мэдэгдэнэ', btn: 'Ирлээ' },
  { t: 'Үнэ илгээх', d: 'Ажлыг үзээд эцсийн үнээ батлуулна', btn: 'Үнэ илгээж, ажил эхлэх' },
  { t: 'Материал', d: 'Дутвал явуулын машинаас', btn: 'Материал захиалах' },
  { t: 'Ажил дуусгах', d: 'Хэрэглэгч QPay-ээр төлнө', btn: 'Ажил дууслаа' },
];

export function MasterJob() {
  const { ms, updateMs, mPop, mPush, showToast } = useApp();
  const step = ms.jobStep;
  const route = roadRoute(JOB.from, JOB.to);

  const next = () => {
    if (step === 3) return mPush({ name: 'm-shop' });
    if (step === 4) return mPush({ name: 'm-done' });
    if (step === 0) showToast('Хэрэглэгчид мэдэгдлээ', 'Номин Б. таныг замдаа гэдгийг харж байна.');
    if (step === 2) showToast('Хэрэглэгч үнийг зөвшөөрлөө', `Ажлын хөлс ${fmt(ms.laborFee)}`);
    updateMs({ jobStep: step + 1 });
  };

  return (
    <div className="screen full">
      <MapView
        height={330}
        focus={[(JOB.from[0] + JOB.to[0]) / 2, (JOB.from[1] + JOB.to[1]) / 2 + 20]}
        route={step <= 1 ? route : undefined}
        markers={[
          { id: 'dest', kind: 'dest', pos: JOB.to, tag: step <= 1 ? JOB.customer : undefined },
          { id: 'me', kind: 'master', pos: step <= 1 ? JOB.from : [JOB.to[0] - 22, JOB.to[1] - 10], initials: 'БЭ', color: '#C2500A', selected: true },
        ]}
      >
        <button className="floating-btn" style={{ position: 'absolute', top: 'calc(var(--sb) + 4px)', left: 14 }} onClick={mPop} aria-label="Буцах">
          <ChevronLeft size={24} strokeWidth={2.2} />
        </button>
      </MapView>

      <div className="map-sheet scroll">
        <div className="grab mt8" />
        <div className="pad">
          <div className="t-foot c3">Алхам {step + 1}/5 · #{JOB.id}</div>
          <h1 className="t-title mt2">{STEPS[step].t}</h1>
          <p className="t-callout c2 mt2">{STEPS[step].d}</p>
        </div>

        <div className="pad row g12 mt16">
          <Avatar initials={JOB.customerInitials} color="#15181F" size={46} />
          <div className="grow">
            <div className="t-head">{JOB.customer}</div>
            <div className="row g4 t-foot c3"><MapPin size={13} />{JOB.address}</div>
          </div>
          <button className="round-btn" onClick={() => showToast('Чат нээгдэнэ')} aria-label="Чат"><MessageCircle size={20} strokeWidth={1.9} /></button>
          <button className="round-btn" onClick={() => showToast('Залгаж байна…')} aria-label="Залгах"><Phone size={19} strokeWidth={1.9} /></button>
        </div>

        {step === 2 && (
          <div className="pad mt16">
            <div style={{ background: 'var(--fill)', borderRadius: 16, padding: 16 }}>
              <div className="t-foot c2 center">Ажлын хөлс</div>
              <div className="row between mt8">
                <button className="round-btn" style={{ background: '#fff' }} onClick={() => updateMs({ laborFee: Math.max(20000, ms.laborFee - 5000) })} aria-label="Хасах"><Minus size={18} /></button>
                <div className="t-large num">{fmt(ms.laborFee)}</div>
                <button className="round-btn" style={{ background: '#fff' }} onClick={() => updateMs({ laborFee: ms.laborFee + 5000 })} aria-label="Нэмэх"><Plus size={18} /></button>
              </div>
              <div className="t-foot c2 center mt8">Таны орлого: <b className="cl num">{fmt(split(JOB.travelFee + ms.laborFee).master)}</b></div>
            </div>
          </div>
        )}

        {ms.materialsSent && (
          <div className="pad mt16">
            <div className="row g12" style={{ background: 'var(--fill)', borderRadius: 14, padding: 12 }}>
              <Truck size={20} />
              <span className="t-sub grow">Материал захиалагдсан. Явуулын машин ~12 минутад ирнэ.</span>
            </div>
          </div>
        )}

        <div className="pad mt16">
          <div className="t-head">{JOB.category}</div>
          <p className="t-callout c2 mt4">{JOB.description}</p>
          <div className="row g8 mt12">
            <div className="photo" style={{ width: 60, height: 60 }} />
            <div className="photo b" style={{ width: 60, height: 60 }} />
          </div>
        </div>

        <div className="pad mt20 col g12" style={{ paddingBottom: 16 }}>
          {STEPS.map((s, i) => (
            <div key={s.t} className="row g12">
              <span style={{ width: 22, height: 22, borderRadius: 11, display: 'grid', placeItems: 'center', background: i < step ? 'var(--leaf)' : i === step ? 'var(--brand)' : 'var(--fill-2)', color: '#fff', flex: '0 0 auto' }}>
                {i < step ? <Check size={13} strokeWidth={3} /> : <span className="t-cap w7">{i + 1}</span>}
              </span>
              <span className="t-callout" style={{ color: i > step ? 'var(--text-3)' : undefined, fontWeight: i === step ? 600 : 400 }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-bar">
        <button className="btn btn-brand btn-block" onClick={next}>{STEPS[step].btn}</button>
        {step === 3 && <button className="btn btn-block mt4" style={{ height: 40, fontSize: 15, fontWeight: 500, color: 'var(--text-2)' }} onClick={() => updateMs({ jobStep: 4 })}>Материал хэрэггүй</button>}
      </div>
    </div>
  );
}
