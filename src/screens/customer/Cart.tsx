import { ArrowLeftRight, MapPin, Minus, Plus, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { TIER_LABEL, TRUCK, USER, cartTotal, fmt, getMaterial, itemPrice } from '../../data';
import { NavBar, Row } from '../../components/ui';
import { GROUP_ICON } from './Shop';

export function Cart() {
  const { pop, push, cart, setQty, clearCart, switchTier, order, updateOrder, resetTo, showToast, setTab } = useApp();
  const total = cartTotal(cart);
  const attach = !!order && (order.status === 'arrived' || order.status === 'working');
  const delivery = attach ? 0 : 3000;

  const confirm = () => {
    if (attach && order) {
      updateOrder({ materials: cart.map((c) => ({ ...c })), materialsStatus: 'ordered', status: 'working' });
      clearCart();
      setTab('home');
      resetTo([{ name: 'tabs' }, { name: 'tracking' }]);
      showToast('Материал захиалагдлаа', `${TRUCK.name} ${TRUCK.etaMin} минутад мастерт хүргэнэ.`);
    } else {
      push({ name: 'checkout', materialsOnly: true });
    }
  };

  return (
    <div className="screen">
      <NavBar title="Сагс" onBack={pop} right={cart.length ? <button className="btn-text" style={{ padding: '0 12px', fontWeight: 500 }} onClick={clearCart}>Хоослох</button> : undefined} />
      {cart.length === 0 ? (
        <div className="grow col" style={{ alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
          <img src={BERRY.sprig} alt="" style={{ width: 120, opacity: 0.95 }} />
          <h2 className="t-title3 mt16">Сагс хоосон байна</h2>
          <p className="t-callout c2 mt4">Явуулын машинаас хэрэгтэй материалаа сонгоорой.</p>
          <button className="btn btn-grey btn-m mt20" onClick={pop}>Дэлгүүр үзэх</button>
        </div>
      ) : (
        <>
          <div className="scroll">
            <div className="group plain">
              {cart.map((c) => {
                const m = getMaterial(c.materialId);
                const Icon = GROUP_ICON[m.group];
                return (
                  <div key={`${c.materialId}-${c.tier}`} className="cell" style={{ ['--inset' as string]: '84px', padding: '14px 16px', alignItems: 'flex-start' }}>
                    <span className="thumb"><Icon size={26} strokeWidth={1.6} /></span>
                    <div className="grow">
                      <div className="t-callout w5">{m.name}</div>
                      <button className="row g4 t-foot cb w5 mt2" onClick={() => switchTier(c.materialId, c.tier)}>
                        {TIER_LABEL[c.tier]} · {m[c.tier].life} <ArrowLeftRight size={13} />
                      </button>
                      <div className="row between mt8">
                        <span className="t-head num">{fmt(itemPrice(c))}</span>
                        <div className="qty">
                          <button onClick={() => setQty(c.materialId, c.tier, c.qty - 1)} aria-label="Хасах"><Minus size={16} /></button>
                          <span>{c.qty}</span>
                          <button onClick={() => setQty(c.materialId, c.tier, c.qty + 1)} aria-label="Нэмэх"><Plus size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="band" />
            <div className="group plain">
              <div className="cell tall" style={{ ['--inset' as string]: '50px' }}>
                <Truck size={20} className="c2" />
                <div className="grow">
                  <div className="t-callout w5">{TRUCK.name}</div>
                  <div className="t-foot c3">~{TRUCK.etaMin} минутад · {attach ? 'мастерт шууд' : 'таны хаягаар'}</div>
                </div>
              </div>
              <div className="cell tall" style={{ ['--inset' as string]: '50px' }}>
                <MapPin size={20} className="c2" />
                <div className="grow">
                  <div className="t-callout w5">Гэр</div>
                  <div className="t-foot c3 ellipsis">{USER.address}</div>
                </div>
              </div>
            </div>
            <div className="band" />
            <div className="pad mt12" style={{ paddingBottom: 16 }}>
              <Row k={`Бараа (${cart.reduce((s, c) => s + c.qty, 0)})`} v={fmt(total)} />
              <Row k="Хүргэлт" v={delivery ? fmt(delivery) : 'Үнэгүй'} />
              <div className="hair" style={{ margin: '8px 0' }} />
              <Row k="Нийт" v={fmt(total + delivery)} strong />
              {attach && <p className="t-foot c3 mt8">Ажлын төлбөртэй хамт, ажил дууссаны дараа нэг дор төлнө.</p>}
            </div>
          </div>
          <div className="bottom-bar">
            <button className="btn btn-brand btn-block" onClick={confirm}>
              {attach ? 'Захиалах · мастерт хүргүүлэх' : `Төлөх · ${fmt(total + delivery)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
