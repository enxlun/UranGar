import { useState } from 'react';
import { Check } from 'lucide-react';
import { useApp } from '../../state';
import { MASTER_REQUEST, MATERIALS, TIER_LABEL, TRUCK, fmt } from '../../data';
import { NavBar } from '../../components/ui';
import type { Tier } from '../../types';

const RELEVANT = MATERIALS.filter((m) => m.group === 'Сантехник' || m.group === 'Плита' || m.group === 'Ерөнхий');

export function MasterShop() {
  const { mPop, updateMs, ms, showToast } = useApp();
  const [sel, setSel] = useState<Record<string, { tier: Tier; qty: number } | undefined>>(() =>
    Object.fromEntries(MASTER_REQUEST.map((r) => [r.materialId, { tier: r.tier, qty: r.qty }])),
  );
  const total = RELEVANT.reduce((s, m) => { const x = sel[m.id]; return x ? s + m[x.tier].price * x.qty : s; }, 0);
  const count = Object.values(sel).filter(Boolean).length;

  return (
    <div className="screen">
      <NavBar title="Материал хүсэх" onBack={mPop} />
      <div className="scroll">
        <p className="t-sub c2 pad">Сонгосон материалыг хэрэглэгч апп дээрээ баталгаажуулна. {TRUCK.name} ~{TRUCK.etaMin} минутад хүргэнэ.</p>
        <div className="group plain mt12">
          {RELEVANT.map((m) => {
            const x = sel[m.id];
            return (
              <div key={m.id} className="cell" style={{ padding: '12px 16px', flexDirection: 'column', alignItems: 'stretch', ['--inset' as string]: '50px' }}>
                <button className="row g12" style={{ width: '100%' }} onClick={() => setSel((s) => ({ ...s, [m.id]: s[m.id] ? undefined : { tier: 'pro', qty: 1 } }))}>
                  <span className={`check${x ? ' on' : ''}`}>{x && <Check size={15} strokeWidth={3} />}</span>
                  <span className="grow t-callout">{m.name}</span>
                  {x && <span className="t-sub num c2">{fmt(m[x.tier].price * x.qty)}</span>}
                </button>
                {x && (
                  <div className="seg mt8" style={{ marginLeft: 34 }}>
                    {(['eco', 'pro'] as Tier[]).map((t) => (
                      <button key={t} className={x.tier === t ? 'on' : ''} style={{ fontSize: 13 }} onClick={() => setSel((s) => ({ ...s, [m.id]: { tier: t, qty: x.qty } }))}>
                        {TIER_LABEL[t]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bottom-bar">
        <div className="row between t-sub" style={{ marginBottom: 10 }}>
          <span className="c2">{count} бараа</span>
          <b className="num">{fmt(total)}</b>
        </div>
        <button className="btn btn-brand btn-block" disabled={!count} onClick={() => {
          updateMs({ materialsSent: true, jobStep: Math.max(ms.jobStep, 4) });
          showToast('Хэрэглэгч материалыг баталлаа', `${TRUCK.name} ${TRUCK.etaMin} минутад хүргэнэ.`);
          mPop();
        }}>
          Хэрэглэгчид илгээх
        </button>
      </div>
    </div>
  );
}
