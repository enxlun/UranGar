import { ArrowLeftRight, BadgeCheck, CalendarDays, ChevronRight, CircleHelp, FileCheck2, IdCard, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../../state';
import { REVIEWS } from '../../data';
import { Avatar, Stars } from '../../components/ui';
import { ME } from './jobData';

export function MasterSelf() {
  const { setMode, showToast } = useApp();
  const reviews = REVIEWS.filter((r) => r.masterId === ME.id);

  return (
    <div className="scroll pad" style={{ background: 'var(--bg-grouped)', paddingBottom: 24 }}>
      <h1 className="t-large" style={{ paddingTop: 6 }}>Профайл</h1>
      <div className="group row g12 mt16" style={{ padding: 14 }}>
        <Avatar initials={ME.initials} color={ME.color} size={60} />
        <div className="grow">
          <div className="row g4 t-head">{ME.name}<BadgeCheck size={17} color="var(--leaf)" /></div>
          <div className="t-foot c3">{ME.skills.join(' · ')}</div>
          <div className="row g6 mt4"><Stars value={ME.rating} size={13} /><span className="t-foot w6">{ME.rating}</span><span className="t-foot c3">({ME.reviews})</span></div>
        </div>
      </div>

      <div className="group mt16" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', padding: '14px 0' }}>
        {[{ v: ME.jobs, l: 'ажил' }, { v: `${ME.years} жил`, l: 'туршлага' }, { v: '96%', l: 'хүлээн авалт' }].map((x, i) => (
          <div key={x.l} className="col" style={{ alignItems: 'center', borderLeft: i ? '1px solid var(--sep)' : undefined }}>
            <span className="t-head num">{x.v}</span>
            <span className="t-cap c3">{x.l}</span>
          </div>
        ))}
      </div>

      <div className="group-h" style={{ paddingLeft: 4 }}>Баримт бичиг</div>
      <div className="group">
        {[{ icon: IdCard, t: 'Иргэний үнэмлэх' }, { icon: FileCheck2, t: 'Мэргэжлийн үнэмлэх' }, { icon: ShieldCheck, t: 'Туршилтын ажил' }].map(({ icon: Icon, t }) => (
          <div key={t} className="cell" style={{ ['--inset' as string]: '50px' }}>
            <Icon size={20} className="c2" strokeWidth={1.9} />
            <span className="grow t-callout">{t}</span>
            <span className="pill pill-leaf">Шалгагдсан</span>
          </div>
        ))}
      </div>

      <div className="group mt16">
        {[{ icon: MapPin, bg: '#0A84FF', t: 'Үйлчлэх бүс', s: 'БЗД, СБД' }, { icon: CalendarDays, bg: '#FF9F0A', t: 'Ажлын цаг', s: '09:00–21:00' }, { icon: CircleHelp, bg: '#8E8E93', t: 'Тусламж', s: '' }].map(({ icon: Icon, bg, t, s }) => (
          <button key={t} className="cell" style={{ ['--inset' as string]: '58px' }} onClick={() => showToast('Удахгүй нэмэгдэнэ')}>
            <span className="icon-sq" style={{ background: bg }}><Icon size={17} strokeWidth={2.2} /></span>
            <span className="grow t-callout">{t}</span>
            <span className="t-sub c3">{s}</span>
            <ChevronRight size={18} className="chev" />
          </button>
        ))}
      </div>

      <div className="group-h" style={{ paddingLeft: 4 }}>Сүүлийн сэтгэгдэл</div>
      <div className="group" style={{ padding: '2px 16px' }}>
        {reviews.map((r, i) => (
          <div key={r.id} style={{ padding: '12px 0', borderTop: i ? '1px solid var(--sep)' : undefined }}>
            <div className="row between"><span className="t-sub w6">{r.author}</span><span className="t-cap c3">{r.date}</span></div>
            <div className="mt4"><Stars value={r.rating} size={12} /></div>
            <p className="t-sub c2 mt4">{r.text}</p>
          </div>
        ))}
      </div>

      <div className="group mt16">
        <button className="cell" style={{ ['--inset' as string]: '58px' }} onClick={() => setMode('customer')}>
          <span className="icon-sq" style={{ background: 'var(--brand)' }}><ArrowLeftRight size={17} strokeWidth={2.2} /></span>
          <span className="grow t-callout">Хэрэглэгчийн апп руу шилжих</span>
          <ChevronRight size={18} className="chev" />
        </button>
      </div>
    </div>
  );
}
