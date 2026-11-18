import { useState } from 'react';
import { BadgeCheck, Heart, IdCard, Share, ShieldCheck, FileCheck2 } from 'lucide-react';
import { useApp } from '../../state';
import { REVIEWS, SERVICES, fmt, getMaster, priceLabel, travelFeeFor } from '../../data';
import { Avatar, NavBar, Rating, Stars } from '../../components/ui';

export function MasterProfile({ masterId, selectable }: { masterId: string; selectable: boolean }) {
  const { pop, push, startOrder, showToast } = useApp();
  const m = getMaster(masterId);
  const [saved, setSaved] = useState(false);
  const reviews = REVIEWS.filter((r) => r.masterId === m.id);
  const services = SERVICES[m.categoryIds[0]] ?? [];

  return (
    <div className="screen">
      <NavBar
        onBack={pop}
        right={
          <>
            <button className="nav-btn" aria-label="Хуваалцах" onClick={() => showToast('Холбоос хуулагдлаа')}><Share size={21} strokeWidth={1.9} /></button>
            <button className="nav-btn" aria-label="Хадгалах" onClick={() => { setSaved(!saved); if (!saved) showToast('Хадгалсан мастерт нэмэгдлээ'); }}>
              <Heart size={22} strokeWidth={1.9} fill={saved ? '#FF3B5C' : 'none'} color={saved ? '#FF3B5C' : 'currentColor'} />
            </button>
          </>
        }
      />
      <div className="scroll">
        <div className="pad row g16">
          <Avatar initials={m.initials} color={m.color} size={80} />
          <div className="grow">
            <h1 className="t-title3">{m.name}</h1>
            <p className="t-foot c2 mt2">{m.skills.join(' · ')}</p>
            <span className="pill pill-leaf mt8"><BadgeCheck size={14} /> Шалгагдсан мастер</span>
          </div>
        </div>

        <div className="pad mt20" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {[
            { v: <Rating value={m.rating} size={15} />, l: `${m.reviews} үнэлгээ` },
            { v: <span className="t-head num">{m.jobs}</span>, l: 'ажил хийсэн' },
            { v: <span className="t-head">{m.years} жил</span>, l: 'туршлагатай' },
          ].map((x, i) => (
            <div key={i} className="col" style={{ alignItems: 'center', borderLeft: i ? '1px solid var(--sep)' : undefined, gap: 2 }}>
              {x.v}
              <span className="t-cap c3">{x.l}</span>
            </div>
          ))}
        </div>

        <div className="band mt20" />
        <div className="pad mt16">
          <h2 className="t-head">Тухай</h2>
          <p className="t-callout c2 mt6">{m.bio}</p>
        </div>

        <div className="group-h">Баталгаажуулалт</div>
        <div className="group plain">
          {[
            { icon: IdCard, t: 'Иргэний үнэмлэх' },
            { icon: FileCheck2, t: 'Мэргэжлийн үнэмлэх' },
            { icon: ShieldCheck, t: 'УранГар-ын туршилтын ажил' },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="cell" style={{ ['--inset' as string]: '50px' }}>
              <Icon size={20} color="var(--leaf)" strokeWidth={1.9} />
              <span className="grow t-callout">{t}</span>
              <span className="t-foot cl w5">Шалгагдсан</span>
            </div>
          ))}
        </div>

        {services.length > 0 && (
          <>
            <div className="group-h">Үнийн жагсаалт</div>
            <div className="group plain">
              {services.slice(0, 4).map((s) => (
                <div key={s.id} className="cell">
                  <span className="grow t-callout">{s.name}</span>
                  <span className="t-sub c2 num">{priceLabel(s)}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="band mt16" />
        <div className="pad row between mt16">
          <h2 className="t-head">Сэтгэгдэл</h2>
          <span className="t-sub c3">{m.reviews}</span>
        </div>
        <div className="pad" style={{ paddingBottom: 24 }}>
          {(reviews.length ? reviews : REVIEWS.slice(0, 2)).map((r) => (
            <div key={r.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--sep)' }}>
              <div className="row g8">
                <Avatar initials={r.author[0]} color="#6E727C" size={28} />
                <span className="t-sub w6 grow">{r.author}</span>
                <span className="t-cap c3">{r.date}</span>
              </div>
              <div className="mt6"><Stars value={r.rating} size={13} /></div>
              <p className="t-callout mt4">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {selectable && (
        <div className="bottom-bar row g16">
          <div>
            <div className="t-cap c3">Замын зардал · {m.distanceKm} км</div>
            <div className="t-head num">{fmt(travelFeeFor(m.distanceKm))}</div>
          </div>
          <button className="btn btn-brand grow" onClick={() => { startOrder(m.id); push({ name: 'matching' }); }}>Дуудах</button>
        </div>
      )}
    </div>
  );
}
