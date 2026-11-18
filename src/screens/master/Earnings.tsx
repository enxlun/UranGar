import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../state';
import { WEEK_EARNINGS, fmt } from '../../data';

export function Earnings() {
  const { ms, showToast } = useApp();
  const [range, setRange] = useState<'week' | 'month'>('week');
  const week = WEEK_EARNINGS.map((d, i) => (i === WEEK_EARNINGS.length - 1 ? { ...d, v: ms.todayEarned } : d));
  const total = week.reduce((s, d) => s + d.v, 0);
  const max = Math.max(...week.map((d) => d.v), 1);
  const shown = range === 'week' ? total : 2394600 + ms.todayEarned - 63200;

  return (
    <div className="scroll">
      <h1 className="t-large pad" style={{ paddingTop: 6 }}>Орлого</h1>
      <div className="pad mt12">
        <div className="seg" style={{ width: 220 }}>
          <button className={range === 'week' ? 'on' : ''} onClick={() => setRange('week')}>7 хоног</button>
          <button className={range === 'month' ? 'on' : ''} onClick={() => setRange('month')}>Сар</button>
        </div>
        <div className="t-large num mt16" style={{ fontSize: 38 }}>{fmt(shown)}</div>
        <div className="t-foot c2"><span className="cl w6">↑ 18%</span> өмнөх үеэс · {14 + ms.jobsToday} ажил</div>

        <div className="bar-chart mt24">
          {week.map((d, i) => {
            const today = i === week.length - 1;
            return (
              <div key={d.d} className="bar-col">
                <span className="t-cap num c3" style={{ fontSize: 10.5 }}>{d.v ? `${Math.round(d.v / 1000)}к` : ''}</span>
                <div className={`bar${today ? ' today' : ''}`} style={{ height: `${(d.v / max) * 96}px` }} />
                <span className="t-cap" style={{ color: today ? 'var(--text)' : 'var(--text-3)', fontWeight: today ? 600 : 400 }}>{today ? 'Өнөөдөр' : d.d}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="band mt24" />
      <div className="pad row between mt16">
        <div>
          <div className="t-foot c3">Татах боломжтой</div>
          <div className="t-title3 num">{fmt(total)}</div>
        </div>
        <button className="btn btn-dark btn-m" onClick={() => showToast('Шилжүүлэх хүсэлт илгээгдлээ', 'Ажлын 1 өдөрт дансанд орно.')}>Данс руу татах</button>
      </div>

      <div className="group-h">Орлого хэрхэн хуваагддаг вэ</div>
      <div className="pad">
        <div className="split" style={{ height: 10 }}>
          <i style={{ width: '79%', background: 'var(--leaf)' }} />
          <i style={{ width: '10%', background: 'var(--brand)' }} />
          <i style={{ width: '10%', background: '#9AA0AA' }} />
          <i style={{ width: '1%', background: '#C9CCD2' }} />
        </div>
        <div className="mt12" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
          {[
            { c: 'var(--leaf)', t: '79% — та' },
            { c: 'var(--brand)', t: '10% — УранГар' },
            { c: '#9AA0AA', t: '10% — НӨАТ' },
            { c: '#C9CCD2', t: '1% — QPay' },
          ].map((x) => (
            <span key={x.t} className="row g8 t-sub"><span className="dotc" style={{ background: x.c }} />{x.t}</span>
          ))}
        </div>
        <p className="t-foot c3 mt12">Жишээ: 100,000₮-ийн ажлаас танд 79,000₮ ногдоно. Материалын төлбөр нийлүүлэгчид шууд очно.</p>
      </div>

      <div className="group-h">Шилжүүлгийн түүх</div>
      <div className="group plain" style={{ marginBottom: 20 }}>
        {[{ d: '11.16', v: 412500 }, { d: '11.09', v: 538200 }, { d: '11.02', v: 465900 }].map((p) => (
          <div key={p.d} className="cell tall">
            <div className="grow">
              <div className="t-callout w5">Данс руу шилжүүлсэн</div>
              <div className="t-foot c3">{p.d} · Банкны данс ••4821</div>
            </div>
            <span className="t-callout w6 num">{fmt(p.v)}</span>
            <ChevronRight size={18} className="chev" />
          </div>
        ))}
      </div>
    </div>
  );
}
