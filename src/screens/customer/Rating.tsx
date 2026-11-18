import { useState } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '../../state';
import { getMaster } from '../../data';
import { Avatar, BerryCoin, NavBar } from '../../components/ui';

const TAGS = ['Цагтаа ирсэн', 'Чанартай', 'Цэвэрхэн', 'Эелдэг', 'Үнэ шударга', 'Зөвлөгөө өгсөн'];
const LABELS = ['', 'Муу', 'Дунд зэрэг', 'Боломжийн', 'Сайн', 'Маш сайн'];

export function Rating() {
  const { order, finishOrder, resetTo, setTab, showToast, points, setPoints } = useApp();
  const m = getMaster(order?.masterId ?? 'm1');
  const [stars, setStars] = useState(5);
  const [tags, setTags] = useState<string[]>(['Цагтаа ирсэн', 'Чанартай']);
  const [text, setText] = useState('');

  const submit = (skip = false) => {
    finishOrder(stars);
    setTab('home');
    resetTo([{ name: 'tabs' }]);
    if (!skip && text.trim()) {
      setPoints(points + 50);
      showToast('Сэтгэгдэлд баярлалаа', '+50 чацаргана оноо нэмэгдлээ.');
    } else if (!skip) {
      showToast('Үнэлгээ илгээгдлээ', 'Таны үнэлгээ бусдад зөв мастер сонгоход тусална.');
    }
  };

  return (
    <div className="screen">
      <NavBar right={<button className="btn-text c2" style={{ padding: '0 14px', fontWeight: 500, color: 'var(--text-2)' }} onClick={() => submit(true)}>Алгасах</button>} />
      <div className="scroll pad">
        <div className="col" style={{ alignItems: 'center', textAlign: 'center' }}>
          <Avatar initials={m.initials} color={m.color} size={72} />
          <h1 className="t-title mt16">Ажил хэр байсан бэ?</h1>
          <p className="t-callout c2 mt4">{m.short} · {order?.description.split('.')[0] ?? 'Засвар'}</p>
          <div className="row g6 mt20">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setStars(i)} aria-label={`${i} од`}>
                <Star size={42} fill={i <= stars ? 'var(--star)' : '#E3E3E8'} color={i <= stars ? 'var(--star)' : '#E3E3E8'} strokeWidth={0} />
              </button>
            ))}
          </div>
          <div className="t-head mt8 c2">{LABELS[stars]}</div>
        </div>
        <div className="row wrap g8 mt24" style={{ justifyContent: 'center' }}>
          {TAGS.map((t) => (
            <button key={t} className={`chip${tags.includes(t) ? ' on' : ' outline'}`} onClick={() => setTags((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))}>{t}</button>
          ))}
        </div>
        <textarea className="textarea mt24" placeholder="Сэтгэгдэл үлдээх" value={text} onChange={(e) => setText(e.target.value)} />
        <p className="row g6 t-foot c3 mt8"><BerryCoin size={14} /> Сэтгэгдэл бичвэл +50 чацаргана оноо</p>
      </div>
      <div className="bottom-bar clean">
        <button className="btn btn-brand btn-block" onClick={() => submit()}>Илгээх</button>
      </div>
    </div>
  );
}
