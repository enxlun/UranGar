import { Bell, ChevronRight, CircleHelp, Gift, Globe, Heart, MapPin, Wallet, Wrench } from 'lucide-react';
import { useApp } from '../../state';
import { BERRY } from '../../assets';
import { USER } from '../../data';
import { Avatar, BerryCoin } from '../../components/ui';

const NEXT_LEVEL = 10000;

export function Profile() {
  const { setMode, resetTo, showToast, push, points } = useApp();
  const soon = () => showToast('Удахгүй нэмэгдэнэ');

  const groups = [
    [
      { icon: MapPin, bg: '#0A84FF', t: 'Хаягууд', s: '2', go: soon },
      { icon: Wallet, bg: '#34A853', t: 'Төлбөрийн хэрэгсэл', s: 'QPay', go: soon },
      { icon: Heart, bg: '#FF3B5C', t: 'Хадгалсан мастерууд', s: '3', go: soon },
    ],
    [
      { icon: Bell, bg: '#FF9F0A', t: 'Мэдэгдэл', s: '', go: () => push({ name: 'notifications' }) },
      { icon: Globe, bg: '#5E5CE6', t: 'Хэл', s: 'Монгол', go: soon },
      { icon: Gift, bg: '#E8620C', t: 'Найзаа урих', s: '+1,000 оноо', go: soon },
      { icon: CircleHelp, bg: '#8E8E93', t: 'Тусламж', s: '', go: soon },
    ],
  ];

  return (
    <div className="scroll pad" style={{ background: 'var(--bg-grouped)', paddingBottom: 24 }}>
      <h1 className="t-large" style={{ paddingTop: 6 }}>Миний</h1>

      <button className="group row g12 mt16" style={{ padding: 14, width: '100%' }} onClick={soon}>
        <Avatar initials="НБ" color="#15181F" size={56} />
        <div className="grow">
          <div className="t-head">{USER.fullName}</div>
          <div className="t-foot c3">+976 {USER.phone}</div>
        </div>
        <ChevronRight size={18} className="chev" />
      </button>

      {/* Чацаргана оноо */}
      <div className="mt16" style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, padding: 16, background: 'linear-gradient(140deg, #FFF3E9, #FFE3CC)' }}>
        <img src={BERRY.cluster} alt="" style={{ position: 'absolute', width: 190, right: -40, top: -6 }} />
        <div style={{ position: 'relative' }}>
          <div className="row g6 t-foot w6 cb"><BerryCoin size={16} /> Чацаргана оноо</div>
          <div className="t-large num mt4">{points.toLocaleString('en-US')}</div>
          <div className="t-foot c2">≈ {points.toLocaleString('en-US')}₮ хөнгөлөлт</div>
          <div className="progress mt16" style={{ width: 200, background: 'rgba(0,0,0,0.08)' }}><i style={{ width: `${Math.min(100, (points / NEXT_LEVEL) * 100)}%` }} /></div>
          <div className="t-cap c2 mt6">«Алтан чацаргана» хүртэл {(Math.max(0, NEXT_LEVEL - points)).toLocaleString('en-US')} оноо</div>
        </div>
      </div>

      {groups.map((g, i) => (
        <div key={i} className="group mt16">
          {g.map(({ icon: Icon, bg, t, s, go }) => (
            <button key={t} className="cell" style={{ ['--inset' as string]: '58px' }} onClick={go}>
              <span className="icon-sq" style={{ background: bg }}><Icon size={17} strokeWidth={2.2} /></span>
              <span className="grow t-callout">{t}</span>
              <span className="t-sub c3">{s}</span>
              <ChevronRight size={18} className="chev" />
            </button>
          ))}
        </div>
      ))}

      <div className="group mt16">
        <button className="cell" style={{ ['--inset' as string]: '58px' }} onClick={() => setMode('master')}>
          <span className="icon-sq" style={{ background: 'var(--ink)' }}><Wrench size={17} strokeWidth={2.2} /></span>
          <div className="grow">
            <div className="t-callout">Мастер болох</div>
            <div className="t-cap c3">Ажлын хөлсний 79% таных</div>
          </div>
          <ChevronRight size={18} className="chev" />
        </button>
      </div>

      <div className="group mt16">
        <button className="cell center" style={{ justifyContent: 'center', color: 'var(--danger)' }} onClick={() => resetTo([{ name: 'login' }])}>
          <span className="t-callout">Гарах</span>
        </button>
      </div>
      <p className="t-cap c3 center mt16">УранГар 0.1.0 · Чацаргана баг</p>
    </div>
  );
}
