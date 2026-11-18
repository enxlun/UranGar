import { useEffect, useState } from 'react';
import { Star, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { AppIcon, Avatar, Wordmark } from '../../components/ui';

export function Onboarding() {
  const { replace, resetTo, setTab } = useApp();
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setSplash(false), 1300);
    return () => window.clearTimeout(t);
  }, []);

  if (splash) {
    return (
      <div className="screen static" style={{ background: 'linear-gradient(170deg, #F58A2E, #E2580A)', alignItems: 'center', justifyContent: 'center' }}>
        <div className="col pop" style={{ alignItems: 'center', gap: 14 }}>
          <AppIcon size={92} />
          <span style={{ color: '#fff', fontSize: 30, fontWeight: 700, letterSpacing: -1 }}>УранГар</span>
        </div>
        <span className="t-foot" style={{ position: 'absolute', bottom: 'calc(var(--hi) + 28px)', color: 'rgba(255,255,255,0.8)' }}>Чацаргана баг</span>
      </div>
    );
  }

  return (
    <div className="screen static full" style={{ animation: 'fade 400ms' }}>
      <div style={{ position: 'relative', flex: 1, background: 'linear-gradient(180deg, #FFF3E8 0%, #FFFFFF 92%)', overflow: 'hidden' }}>
        <img src={BERRY.branch} alt="Чацарганы мөчир" style={{ position: 'absolute', width: 400, left: -8, top: 150 }} className="float" />

        <div className="card row g10 pop" style={{ position: 'absolute', left: 18, top: 118, padding: '10px 14px 10px 10px', animationDelay: '150ms' }}>
          <Avatar initials="БЭ" color="#C2500A" size={38} />
          <div>
            <div className="t-sub w6">Бат-Эрдэнэ Г.</div>
            <div className="t-cap c2 row g4"><Star size={11} fill="var(--star)" strokeWidth={0} /> 4.9 · 12 минутад ирнэ</div>
          </div>
        </div>
        <div className="card row g8 pop" style={{ position: 'absolute', right: 18, bottom: 34, padding: '10px 14px', animationDelay: '350ms' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--ink)', color: '#fff', display: 'grid', placeItems: 'center' }}><Truck size={16} /></div>
          <div>
            <div className="t-sub w6">Материал хүргэлт</div>
            <div className="t-cap c2">Явуулын машин · 1.4 км</div>
          </div>
        </div>
      </div>

      <div className="pad" style={{ paddingBottom: 'calc(var(--hi) + 12px)' }}>
        <div className="row g8"><AppIcon size={28} /><Wordmark size={18} /></div>
        <h1 className="t-large mt16">Гэрийн засвар —<br />найдвартай гарт</h1>
        <p className="t-body c2 mt8">Шалгагдсан мастер дуудаж, дутсан материалаа ойроос авч, ажил дууссаны дараа QPay-ээр төлнө.</p>
        <button className="btn btn-brand btn-block mt24" onClick={() => replace({ name: 'login' })}>
          Утасны дугаараар нэвтрэх
        </button>
        <button className="btn btn-block mt4 c2" style={{ fontWeight: 500, fontSize: 16 }} onClick={() => { setTab('home'); resetTo([{ name: 'tabs' }]); }}>
          Эхлээд үзэх
        </button>
      </div>
    </div>
  );
}
