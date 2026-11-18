import { useEffect, useState } from 'react';
import { CreditCard, Smartphone } from 'lucide-react';
import { useApp } from '../../state';
import { SPLIT_MIN, cartTotal, fmt, getMaster, installmentSteps, installments } from '../../data';
import { Avatar, BerryCoin, NavBar, Row, Sheet } from '../../components/ui';
import { QRCode } from '../../components/QRCode';

export function Checkout({ materialsOnly }: { materialsOnly: boolean }) {
  const { pop, replace, order, cart, updateOrder, clearCart, points, setPoints } = useApp();
  const [usePts, setUsePts] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const materials = materialsOnly ? cart : order?.materials ?? [];
  const matTotal = cartTotal(materials);
  const travel = materialsOnly ? 0 : order?.travelFee ?? 0;
  const labor = materialsOnly ? 0 : order?.laborFee ?? 0;
  const delivery = materialsOnly ? 3000 : 0;
  const subtotal = travel + labor + matTotal + delivery;
  const splittable = !materialsOnly && (subtotal >= SPLIT_MIN || (order?.plan ?? 1) > 1);
  const plan = splittable ? order?.plan ?? 1 : 1;
  const parts = installments(subtotal, plan);
  const discount = usePts ? Math.min(points, parts[0]) : 0;
  const total = parts[0] - discount;
  const m = order ? getMaster(order.masterId) : null;

  const complete = () => {
    if (materialsOnly) clearCart();
    else updateOrder({ status: 'paid', plan, paidParts: 1 });
    setPoints(points - discount);
    replace({ name: 'paid', materialsOnly, amount: total });
  };

  useEffect(() => {
    if (!qrOpen) return;
    const t1 = window.setTimeout(() => setChecking(true), 2000);
    const t2 = window.setTimeout(complete, 4000);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrOpen]);

  return (
    <div className="screen grouped">
      <NavBar title="Төлбөр" onBack={pop} />
      <div className="scroll pad" style={{ paddingBottom: 24 }}>
        {!materialsOnly && order && m && (
          <div className="group row g12 mt8" style={{ padding: 14 }}>
            <Avatar initials={m.initials} color={m.color} size={44} />
            <div className="grow">
              <div className="t-callout w6">{order.description.split('.')[0]}</div>
              <div className="t-foot c3">{m.short} · #{order.id}</div>
            </div>
          </div>
        )}

        <div className="group-h" style={{ paddingLeft: 4 }}>Задаргаа</div>
        <div className="group" style={{ padding: '10px 16px' }}>
          {!materialsOnly && <Row k="Замын зардал" v={fmt(travel)} />}
          {!materialsOnly && <Row k="Хийгдсэн ажлын төлбөр" v={fmt(labor)} />}
          <Row k={`Материал${materials.length ? ` (${materials.reduce((s, c) => s + c.qty, 0)})` : ''}`} v={matTotal ? fmt(matTotal) : '—'} muted={!matTotal} />
          {materialsOnly && <Row k="Хүргэлт" v={fmt(delivery)} />}
          {plan > 1 && <><div className="hair" style={{ margin: '8px 0' }} /><Row k="Нийт ажлын төлбөр" v={fmt(subtotal)} /></>}
          {usePts && <Row k={<span className="row g4"><BerryCoin size={14} /> Чацаргана оноо</span>} v={<span className="cl">−{fmt(discount)}</span>} />}
          <div className="hair" style={{ margin: '8px 0' }} />
          <Row k={plan > 1 ? `Өнөөдөр төлөх · 1/${plan}` : 'Нийт'} v={fmt(total)} strong />
        </div>
        <div className="group-f">НӨАТ орсон. И-баримт таны дугаарт автоматаар бүртгэгдэнэ.</div>

        {splittable && (
          <>
            <div className="group-h row between" style={{ paddingLeft: 4, paddingRight: 4 }}>
              <span>Хувааж төлөх</span><span className="cl w6">Хүүгүй</span>
            </div>
            <div className="group" style={{ padding: 12 }}>
              <div className="seg">
                {[1, 2, 3].map((n) => (
                  <button key={n} className={plan === n ? 'on' : ''} onClick={() => updateOrder({ plan: n })}>{n === 1 ? 'Нэг дор' : `${n} хувааж`}</button>
                ))}
              </div>
              {plan > 1 && (
                <div className="mt8">
                  {installmentSteps(plan).map((st, i) => (
                    <div key={i} className="row g12" style={{ padding: '10px 2px', borderTop: i ? '1px solid var(--sep)' : undefined }}>
                      <span className="num" style={{ width: 24, height: 24, borderRadius: 12, background: i === 0 ? 'var(--brand)' : 'var(--fill)', color: i === 0 ? '#fff' : 'var(--text-2)', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>{i + 1}</span>
                      <div className="grow">
                        <div className="t-sub w5">{st.stage}</div>
                        <div className="t-cap c3">{st.due}</div>
                      </div>
                      <span className="t-sub w6 num">{fmt(parts[i])}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="group-f">Олон сар үргэлжлэх ажлыг шат шатаар нь хүлээж аваад, тухайн хэсгийг төлнө. Хугацаа болохоос 1 өдрийн өмнө сануулна.</div>
          </>
        )}

        <div className="group mt16">
          <div className="cell tall">
            <BerryCoin size={26} />
            <div className="grow">
              <div className="t-callout w5">Чацаргана оноо ашиглах</div>
              <div className="t-foot c3 num">{points.toLocaleString('en-US')} оноо · 1 оноо = 1₮</div>
            </div>
            <button className={`switch${usePts ? ' on' : ''}`} onClick={() => setUsePts(!usePts)} aria-label="Оноо ашиглах" />
          </div>
        </div>

        <div className="group-h" style={{ paddingLeft: 4 }}>Төлбөрийн хэрэгсэл</div>
        <div className="group">
          <div className="cell tall" style={{ ['--inset' as string]: '62px' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 800, letterSpacing: -0.3 }}>QPay</span>
            <div className="grow">
              <div className="t-callout w5">QPay</div>
              <div className="t-foot c3">Банкны аппаар QR уншуулна</div>
            </div>
            <span className="radio on" />
          </div>
          <div className="cell tall" style={{ ['--inset' as string]: '62px', opacity: 0.45 }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--fill)', display: 'grid', placeItems: 'center' }}><CreditCard size={18} /></span>
            <div className="grow">
              <div className="t-callout w5">Банкны карт</div>
              <div className="t-foot c3">Удахгүй</div>
            </div>
            <span className="radio" />
          </div>
        </div>
      </div>
      <div className="bottom-bar">
        <button className="btn btn-brand btn-block" onClick={() => setQrOpen(true)}>{plan > 1 ? `1-р төлбөр төлөх · ${fmt(total)}` : `Төлөх · ${fmt(total)}`}</button>
      </div>

      {qrOpen && (
        <Sheet onClose={() => { setQrOpen(false); setChecking(false); }}>
          <div className="col" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div className="t-foot c3">QPay нэхэмжлэх{plan > 1 ? ` · 1/${plan} хэсэг` : ''}</div>
            <div className="t-large num mt4">{fmt(total)}</div>
            <div style={{ padding: 10, borderRadius: 18, boxShadow: 'inset 0 0 0 1px var(--sep)', marginTop: 16 }}>
              <QRCode seed={total % 97} size={200} />
            </div>
            <p className="t-sub c2 mt12">Банкны аппаа нээгээд QR кодыг уншуулна уу</p>
            <div className="row g8 mt12" style={{ height: 24 }}>
              {checking ? <><div className="spinner" /><span className="t-sub w6">Төлбөр шалгаж байна…</span></> : <span className="t-sub c3">Төлбөр хүлээж байна</span>}
            </div>
            <button className="btn btn-grey btn-block mt16"><Smartphone size={19} /> Банкны апп нээх</button>
            <button className="btn btn-block mt8 btn-text" style={{ height: 44 }} onClick={complete}>Төлсөн</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
