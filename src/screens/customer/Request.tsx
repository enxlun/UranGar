import { Camera, ChevronRight, MapPin, X } from 'lucide-react';
import { useApp } from '../../state';
import { MASTERS, SERVICES, canSplit, fmt, getCategory, getService, installmentSteps, installments, priceLabel, serviceLabor } from '../../data';
import { NavBar } from '../../components/ui';

const SLOTS = ['Өнөөдөр 18–20', 'Маргааш 10–12', 'Маргааш 14–16', 'Бямба 11–13'];

export function Request() {
  const { pop, push, draft, updateDraft } = useApp();
  const cat = getCategory(draft.categoryId);
  const services = SERVICES[cat.id] ?? SERVICES.other;
  const svc = getService(cat.id, draft.serviceId);
  const near = MASTERS.filter((m) => m.categoryIds.includes(cat.id));
  const labor = serviceLabor(svc);
  const splittable = canSplit(labor, svc.long);
  const plan = splittable ? draft.plan : 1;
  const parts = installments(labor, plan);
  const Icon = cat.icon;

  return (
    <div className="screen">
      <NavBar onBack={pop} />
      <div className="scroll">
        <div className="pad row g12">
          <span className="thumb" style={{ background: cat.tint, color: cat.fg, width: 52, height: 52, borderRadius: 14 }}><Icon size={26} strokeWidth={1.8} /></span>
          <div>
            <h1 className="t-title">{cat.name}</h1>
            <p className="t-foot c2">{near.length || MASTERS.length} мастер ойрхон · ~{Math.min(...(near.length ? near : MASTERS).map((m) => m.etaMin))} минутад</p>
          </div>
        </div>

        <div className="group-h" style={{ marginTop: 24 }}>Юу хийлгэх вэ?</div>
        <div className="group plain">
          {services.map((s) => (
            <button key={s.id} className="cell tall" onClick={() => updateDraft({ serviceId: s.id })}>
              <span className={`radio${s.id === svc.id ? ' on' : ''}`} />
              <div className="grow">
                <div className="t-callout w5">{s.name}</div>
                <div className="t-foot c3">{s.dur}{s.unit ? ` · ~${s.qty} ${s.unit}` : ''}</div>
              </div>
              <span className="t-sub num c2 nowrap">{priceLabel(s)}</span>
            </button>
          ))}
        </div>

        <div className="band mt8" />
        <div className="pad mt20">
          <div className="t-head">Дэлгэрэнгүй <span className="c3 w5">(заавал биш)</span></div>
          <textarea
            className="textarea mt8"
            placeholder="Асуудлаа товч бичээрэй"
            value={draft.description}
            onChange={(e) => updateDraft({ description: e.target.value })}
          />
          <div className="row g8 mt12">
            {Array.from({ length: draft.photos }).map((_, i) => (
              <div key={i} className={`photo${i % 2 ? ' b' : ''}`} style={{ width: 72, height: 72 }}>
                <button
                  onClick={() => updateDraft({ photos: draft.photos - 1 })}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11, background: 'rgba(0,0,0,0.55)', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 2 }}
                  aria-label="Зураг устгах"
                >
                  <X size={13} strokeWidth={2.6} />
                </button>
              </div>
            ))}
            {draft.photos < 3 && (
              <button className="col g4" onClick={() => updateDraft({ photos: draft.photos + 1 })}
                style={{ width: 72, height: 72, borderRadius: 10, background: 'var(--fill)', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}>
                <Camera size={22} strokeWidth={1.8} />
                <span className="t-cap">Зураг</span>
              </button>
            )}
          </div>
        </div>

        <div className="pad mt24">
          <div className="t-head">Хэзээ?</div>
          <div className="seg mt8">
            <button className={draft.urgency === 'now' ? 'on' : ''} onClick={() => updateDraft({ urgency: 'now' })}>Аль болох хурдан</button>
            <button className={draft.urgency === 'scheduled' ? 'on' : ''} onClick={() => updateDraft({ urgency: 'scheduled' })}>Цаг товлох</button>
          </div>
        </div>
        {draft.urgency === 'scheduled' && (
          <div className="hscroll mt12">
            {SLOTS.map((s) => (
              <button key={s} className={`chip${draft.slot === s ? ' on' : ''}`} onClick={() => updateDraft({ slot: s })}>{s}</button>
            ))}
          </div>
        )}

        {splittable && (
          <div className="pad mt24">
            <div className="row between">
              <div className="t-head">Төлбөр</div>
              <span className="pill pill-leaf">Хүүгүй</span>
            </div>
            <div className="seg mt8">
              {[1, 2, 3].map((n) => (
                <button key={n} className={plan === n ? 'on' : ''} onClick={() => updateDraft({ plan: n })}>{n === 1 ? 'Нэг дор' : `${n} хувааж`}</button>
              ))}
            </div>
            <div className="mt12" style={{ background: 'var(--fill)', borderRadius: 12, padding: '4px 14px' }}>
              {installmentSteps(plan).map((st, i) => (
                <div key={i} className="row g12" style={{ padding: '10px 0', borderTop: i ? '1px solid var(--sep)' : undefined }}>
                  <span className="num" style={{ width: 24, height: 24, borderRadius: 12, background: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flex: '0 0 auto' }}>{i + 1}</span>
                  <div className="grow">
                    <div className="t-sub w5">{st.stage}</div>
                    <div className="t-cap c3">{plan === 1 ? 'Ажил дууссаны дараа' : i === 0 ? '1-р сарын ажлыг хүлээж авсны дараа' : `${st.due} орчим`}</div>
                  </div>
                  <span className="t-sub w6 num">≈ {fmt(parts[i])}</span>
                </div>
              ))}
            </div>
            <p className="t-cap c3 mt8">Ажлын шат бүрийг хүлээж авсныхаа дараа тухайн хэсгийг QPay-ээр төлнө. Мастерт мөн шат бүрээр шилжинэ.</p>
          </div>
        )}

        <div className="group plain mt16">
          <button className="cell tall" style={{ ['--inset' as string]: '0px' }}>
            <MapPin size={22} className="cb" />
            <div className="grow">
              <div className="t-callout w5">Гэр</div>
              <div className="t-foot c3 ellipsis">{draft.address}</div>
            </div>
            <ChevronRight size={18} className="chev" />
          </button>
        </div>
        <p className="t-foot c3 pad mt12" style={{ marginBottom: 24 }}>
          Эцсийн үнийг мастер ирж үзээд апп дотор илгээнэ. Та зөвшөөрсний дараа ажил эхэлнэ. Замын зардал мастерын зайнаас хамаарна.
        </p>
      </div>
      <div className="bottom-bar row g16">
        <div>
          <div className="t-cap c3">{plan > 1 ? `Сар бүр · ${plan} хувааж` : svc.unit ? `Ажлын хөлс · ~${svc.qty} ${svc.unit}` : 'Ажлын хөлс'}</div>
          <div className="t-head num">{plan > 1 ? `≈ ${fmt(parts[0])}` : svc.unit ? `≈ ${fmt(labor)}` : `${fmt(svc.price)}-с`}</div>
        </div>
        <button className="btn btn-brand grow" onClick={() => push({ name: 'masters' })}>Мастер сонгох</button>
      </div>
    </div>
  );
}
