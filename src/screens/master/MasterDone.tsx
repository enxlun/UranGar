import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { fmt, split } from '../../data';
import { Row } from '../../components/ui';
import { JOB } from './jobData';

export function MasterDone() {
  const { ms, updateMs, mResetTo, setMTab, showToast } = useApp();
  const [paid, setPaid] = useState(false);
  const base = JOB.travelFee + ms.laborFee;
  const s = split(base);

  useEffect(() => {
    const t = window.setTimeout(() => setPaid(true), 2400);
    return () => window.clearTimeout(t);
  }, []);

  const finish = () => {
    updateMs({ jobActive: false, jobStep: 0, materialsSent: false, todayEarned: ms.todayEarned + s.master, jobsToday: ms.jobsToday + 1 });
    setMTab('jobs');
    mResetTo([{ name: 'm-tabs' }]);
    showToast(`+${fmt(s.master)} орлого орлоо`, 'Даваа гараг бүр таны дансанд шилжинэ.');
  };

  return (
    <div className="screen static" style={{ animation: 'fade 300ms' }}>
      <div className="scroll pad" style={{ paddingTop: 20 }}>
        <div className="col" style={{ alignItems: 'center', textAlign: 'center' }}>
          {paid ? <img src={BERRY.branch} alt="" className="pop" style={{ width: 230 }} /> : <div style={{ height: 167, display: 'grid', placeItems: 'center' }}><div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} /></div>}
          <h1 className="t-title mt12">{paid ? 'Төлбөр орлоо' : 'Хэрэглэгч төлж байна…'}</h1>
          {paid ? (
            <>
              <div className="t-large num mt4" style={{ color: 'var(--leaf)' }}>+{fmt(s.master)}</div>
              <div className="row g4 mt8 pop">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={20} fill="var(--star)" strokeWidth={0} />)}
                <span className="t-sub c2" style={{ marginLeft: 6 }}>{JOB.customer} 5 од өглөө</span>
              </div>
            </>
          ) : (
            <p className="t-callout c2 mt8">QPay нэхэмжлэх хэрэглэгчид очсон.</p>
          )}
        </div>

        <div className="mt24" style={{ background: 'var(--fill)', borderRadius: 16, padding: 16 }}>
          <div className="t-head">Задаргаа</div>
          <div className="mt8">
            <Row k="Замын зардал" v={fmt(JOB.travelFee)} />
            <Row k="Ажлын хөлс" v={fmt(ms.laborFee)} />
          </div>
          <div className="split mt12">
            <i style={{ width: '79%', background: 'var(--leaf)' }} />
            <i style={{ width: '10%', background: 'var(--brand)' }} />
            <i style={{ width: '10%', background: '#9AA0AA' }} />
            <i style={{ width: '1%', background: '#C9CCD2' }} />
          </div>
          <div className="mt8">
            {[
              { c: 'var(--leaf)', l: 'Таны орлого · 79%', v: s.master, b: true },
              { c: 'var(--brand)', l: 'УранГар · 10%', v: s.company },
              { c: '#9AA0AA', l: 'НӨАТ · 10%', v: s.vat },
              { c: '#C9CCD2', l: 'QPay · 1%', v: s.qpay },
            ].map((x) => (
              <div key={x.l} className="row between t-sub" style={{ padding: '4px 0', fontWeight: x.b ? 700 : 400 }}>
                <span className="row g8"><span className="dotc" style={{ background: x.c }} />{x.l}</span>
                <span className="num">{fmt(x.v)}</span>
              </div>
            ))}
          </div>
          <p className="t-cap c3 mt8">Материалын төлбөр нийлүүлэгчид шууд очно.</p>
        </div>
      </div>
      <div className="bottom-bar clean">
        <button className="btn btn-brand btn-block" disabled={!paid} onClick={finish}>Дуусгах</button>
      </div>
    </div>
  );
}
