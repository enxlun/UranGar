import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { fmt, installmentSteps, installments, orderTotal } from '../../data';
import { BerryCoin, Row } from '../../components/ui';

export function Paid({ materialsOnly, amount }: { materialsOnly: boolean; amount: number }) {
  const { replace, resetTo, setTab, points, setPoints, order } = useApp();
  const plan = !materialsOnly && order ? order.plan ?? 1 : 1;
  const parts = order ? installments(orderTotal(order), plan) : [];
  const earned = Math.round(amount * 0.01);
  const added = useRef(false);

  useEffect(() => {
    if (added.current) return;
    added.current = true;
    setPoints(points + earned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="screen static" style={{ animation: 'fade 300ms' }}>
      <div className="scroll pad" style={{ paddingTop: 24 }}>
        <div className="col" style={{ alignItems: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 180, height: 170 }}>
            <img src={BERRY.sprig} alt="" className="float" style={{ width: 140, position: 'absolute', left: 20, top: 0 }} />
            <span className="pop" style={{ position: 'absolute', right: 18, bottom: 6, width: 48, height: 48, borderRadius: 24, background: 'var(--leaf)', color: '#fff', display: 'grid', placeItems: 'center', border: '4px solid #fff', animationDelay: '200ms' }}>
              <Check size={26} strokeWidth={3} />
            </span>
          </div>
          <h1 className="t-title mt16">Төлбөр амжилттай</h1>
          <div className="t-large num mt8">{fmt(amount)}</div>
          <p className="t-callout c2 mt8">{materialsOnly ? 'Материал тань ~12 минутад хүргэгдэнэ.' : 'Төлбөр мастерт шилжлээ. Баярлалаа!'}</p>
        </div>

        <div className="row g12 mt24 pop" style={{ background: '#FFF1E6', borderRadius: 16, padding: 14, animationDelay: '400ms' }}>
          <BerryCoin size={32} />
          <div className="grow">
            <div className="t-callout w6 num">+{earned.toLocaleString('en-US')} чацаргана оноо</div>
            <div className="t-foot c2">Дараагийн захиалгадаа хөнгөлөлт болгон ашиглаарай</div>
          </div>
        </div>

        {plan > 1 && (
          <div className="mt16" style={{ background: 'var(--fill)', borderRadius: 16, padding: '6px 14px' }}>
            <div className="t-sub w6" style={{ padding: '8px 0 4px' }}>Төлбөрийн хуваарь · 1/{plan} төлөгдсөн</div>
            {installmentSteps(plan).map((st, i) => (
              <div key={i} className="row between t-sub" style={{ padding: '7px 0', borderTop: '1px solid var(--sep)' }}>
                <span className={i === 0 ? 'cl w6' : 'c2'}>{i === 0 ? 'Төлсөн · ' : ''}{st.due} · {st.stage}</span>
                <span className="num">{fmt(parts[i])}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt20" style={{ padding: '4px 2px' }}>
          <Row k="Гүйлгээний дугаар" v="QP-88412093" />
          <Row k="Огноо" v="2026.11.17 · 15:42" />
          <Row k="И-баримт" v={<span className="cl w6">Бүртгэгдсэн</span>} />
        </div>
      </div>
      <div className="bottom-bar clean">
        {materialsOnly ? (
          <button className="btn btn-grey btn-block" onClick={() => { setTab('home'); resetTo([{ name: 'tabs' }]); }}>Нүүр хуудас</button>
        ) : (
          <button className="btn btn-brand btn-block" onClick={() => replace({ name: 'rating' })}>Мастерт үнэлгээ өгөх</button>
        )}
      </div>
    </div>
  );
}
