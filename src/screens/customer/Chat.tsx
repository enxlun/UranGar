import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ChevronLeft, Phone, Plus } from 'lucide-react';
import { useApp } from '../../state';
import { getMaster } from '../../data';
import { Avatar } from '../../components/ui';

interface Msg { me: boolean; text: string }
const REPLIES = ['За, ойлголоо.', 'Тийм ээ, багаж бүрэн байгаа.', 'Ирээд залгая.'];

export function Chat() {
  const { pop, order, showToast } = useApp();
  const m = getMaster(order?.masterId ?? 'm1');
  const [msgs, setMsgs] = useState<Msg[]>([
    { me: false, text: `Сайн байна уу, ${m.short.split(' ')[0]} байна. Захиалгыг тань авлаа.` },
    { me: false, text: 'Зургийг харлаа, холигч болон шланкийг солих хэрэгтэй бололтой.' },
    { me: true, text: 'Сайн байна уу. За, хүлээж байя.' },
  ]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const idx = useRef(0);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  const send = (t: string) => {
    if (!t.trim()) return;
    setMsgs((x) => [...x, { me: true, text: t.trim() }]);
    setText('');
    window.setTimeout(() => setTyping(true), 500);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((x) => [...x, { me: false, text: REPLIES[idx.current++ % REPLIES.length] }]);
    }, 1700);
  };

  return (
    <div className="screen">
      <div className="nav" style={{ borderBottom: '0.5px solid var(--sep)', height: 56 }}>
        <button className="nav-back" onClick={pop} aria-label="Буцах"><ChevronLeft size={28} strokeWidth={2.2} /></button>
        <div className="row g10 grow">
          <Avatar initials={m.initials} color={m.color} size={36} />
          <div>
            <div className="t-callout w6">{m.short}</div>
            <div className="t-cap" style={{ color: '#34A853' }}>{typing ? 'бичиж байна…' : 'Онлайн'}</div>
          </div>
        </div>
        <button className="nav-btn" onClick={() => showToast('Залгаж байна…')} aria-label="Залгах"><Phone size={21} strokeWidth={1.9} /></button>
      </div>
      <div className="scroll col g6 pad" style={{ paddingTop: 12, paddingBottom: 12 }}>
        <div className="t-cap c3 center" style={{ margin: '4px 0 8px' }}>Өнөөдөр 14:02</div>
        {msgs.map((x, i) => <div key={i} className={`bubble ${x.me ? 'me' : 'them'}`}>{x.text}</div>)}
        {typing && <div className="bubble them c3" style={{ letterSpacing: 2 }}>•••</div>}
        <div ref={endRef} />
      </div>
      <div className="hscroll" style={{ paddingBottom: 8 }}>
        {['Орцны код 42#', 'Зогсоол байгаа', 'Хэдэн минутад ирэх вэ?'].map((q) => (
          <button key={q} className="chip outline" onClick={() => send(q)}>{q}</button>
        ))}
      </div>
      <div className="row g8" style={{ padding: '6px 10px calc(8px + var(--hi))', borderTop: '0.5px solid var(--sep)' }}>
        <button className="round-btn" style={{ width: 36, height: 36 }} aria-label="Хавсаргах"><Plus size={20} /></button>
        <div className="grow row" style={{ height: 38, borderRadius: 19, boxShadow: 'inset 0 0 0 1px var(--sep)', padding: '0 4px 0 14px' }}>
          <input
            className="grow"
            style={{ border: 0, outline: 0, background: 'none', fontSize: 16 }}
            placeholder="Мессеж"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(text)}
          />
          {text && (
            <button onClick={() => send(text)} aria-label="Илгээх" style={{ width: 30, height: 30, borderRadius: 15, background: 'var(--brand)', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <ArrowUp size={18} strokeWidth={2.6} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
