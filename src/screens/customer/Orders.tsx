import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { ORDER_STATUS_LABEL, SERVICES, fmt, getCategory, getMaster, installmentSteps, installments, orderTotal } from '../../data';
import { Avatar, Stars } from '../../components/ui';

export function Orders() {
  const { order, pastOrders, push, updateDraft, payInstallment, showToast } = useApp();
  const [seg, setSeg] = useState<'active' | 'past'>(order ? 'active' : 'past');
  const pending = pastOrders.filter((o) => (o.plan ?? 1) > 1 && (o.paidParts ?? 0) < (o.plan ?? 1));

  return (
    <div className="scroll">
      <h1 className="t-large pad" style={{ paddingTop: 6 }}>Захиалга</h1>
      <div className="pad mt12">
        <div className="seg">
          <button className={seg === 'active' ? 'on' : ''} onClick={() => setSeg('active')}>Идэвхтэй{order ? ' (1)' : ''}</button>
          <button className={seg === 'past' ? 'on' : ''} onClick={() => setSeg('past')}>Өмнөх</button>
        </div>
      </div>

      {pending.map((o) => {
        const n = o.plan ?? 1;
        const k = o.paidParts ?? 0;
        const amt = installments(orderTotal(o), n)[k];
        const step = installmentSteps(n)[k];
        return (
          <div key={o.id} className="pad mt16">
            <div style={{ background: '#FFF4EC', borderRadius: 16, padding: 16 }}>
              <div className="row between">
                <span className="t-foot w6 cb">Дараагийн төлбөр · {k + 1}/{n}</span>
                <span className="t-foot c2">{step.due}</span>
              </div>
              <div className="t-title3 num mt4">{fmt(amt)}</div>
              <div className="t-sub c2">{o.description.split('.')[0]} · {step.stage}</div>
              <div className="progress mt12" style={{ background: 'rgba(0,0,0,0.08)' }}><i style={{ width: `${(k / n) * 100}%` }} /></div>
              <div className="row between mt12">
                <span className="t-cap c2">{k}/{n} төлсөн · хүүгүй</span>
                <button className="btn btn-brand btn-s" onClick={() => { payInstallment(o.id); showToast(`${k + 1}-р төлбөр төлөгдлөө`, `${fmt(amt)} · QPay`); }}>Төлөх</button>
              </div>
            </div>
          </div>
        );
      })}

      {seg === 'active' && (order ? (
        <div className="pad mt16">
          <button className="card col g12" style={{ width: '100%', padding: 16 }} onClick={() => push({ name: 'tracking' })}>
            <div className="row g12" style={{ width: '100%' }}>
              <Avatar initials={getMaster(order.masterId).initials} color={getMaster(order.masterId).color} size={46} />
              <div className="grow">
                <div className="t-head">{order.description.split('.')[0]}</div>
                <div className="t-foot c3">{getMaster(order.masterId).short} · #{order.id}</div>
              </div>
              <ChevronRight size={20} className="c3" />
            </div>
            <div className="row between" style={{ width: '100%' }}>
              <span className="pill pill-brand">{ORDER_STATUS_LABEL[order.status]}</span>
              <span className="t-sub c2">Өнөөдөр</span>
            </div>
          </button>
        </div>
      ) : (
        <div className="col pad" style={{ alignItems: 'center', textAlign: 'center', paddingTop: 48 }}>
          <img src={BERRY.cluster} alt="" style={{ width: 200 }} />
          <h2 className="t-title3 mt16">Идэвхтэй захиалга алга</h2>
          <p className="t-callout c2 mt4">Засвар хэрэгтэй бол хэдхэн товшилтоор мастер дуудаарай.</p>
          <button className="btn btn-brand btn-m mt20" onClick={() => { updateDraft({ categoryId: 'plumbing', serviceId: 'faucet' }); push({ name: 'request', categoryId: 'plumbing' }); }}>Мастер дуудах</button>
        </div>
      ))}

      {seg === 'past' && (
        <div className="group plain mt8">
          {pastOrders.map((o) => {
            const c = getCategory(o.categoryId);
            const m = getMaster(o.masterId);
            const Icon = c.icon;
            return (
              <div key={o.id} className="cell" style={{ ['--inset' as string]: '72px', padding: '14px 16px', alignItems: 'flex-start' }}>
                <span className="thumb" style={{ width: 44, height: 44, borderRadius: 11, background: c.tint, color: c.fg }}><Icon size={22} strokeWidth={1.8} /></span>
                <div className="grow">
                  <div className="row between">
                    <span className="t-callout w6">{o.description.split('.')[0]}</span>
                    <span className="t-callout w6 num">{fmt(orderTotal(o))}</span>
                  </div>
                  <div className="t-foot c3 mt2">{o.date} · {m.short}</div>
                  <div className="row between mt8">
                    {(o.plan ?? 1) > 1 ? <span className="pill pill-brand">{o.paidParts ?? 0}/{o.plan} төлсөн</span> : o.rating ? <Stars value={o.rating} size={12} /> : <span />}
                    <button className="btn btn-grey btn-s" onClick={() => { updateDraft({ categoryId: o.categoryId, serviceId: SERVICES[o.categoryId][0].id }); push({ name: 'request', categoryId: o.categoryId }); }}>Дахин захиалах</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
