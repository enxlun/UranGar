import { useEffect, useState } from 'react';
import { useApp } from '../../state';
import { NavBar } from '../../components/ui';
import { Keypad } from '../../components/Keypad';

const fmtPhone = (d: string) => (d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d);

export function Login() {
  const { push, pop, stack } = useApp();
  const [digits, setDigits] = useState('9911');
  const ok = digits.length === 8;

  return (
    <div className="screen">
      <NavBar onBack={stack.length > 1 ? pop : undefined} />
      <div className="pad grow col">
        <h1 className="t-title">Утасны дугаараа оруулна уу</h1>
        <p className="t-callout c2 mt8">Нэвтрэх код SMS-ээр очно.</p>
        <div className="row g12 mt24" style={{ borderBottom: `2px solid ${ok ? 'var(--brand)' : 'var(--sep)'}`, paddingBottom: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--text-3)' }}>+976</span>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: 1 }} className="num">
            {fmtPhone(digits)}
            <span style={{ display: 'inline-block', width: 2, height: 28, background: 'var(--brand)', marginLeft: 2, verticalAlign: -4, animation: 'fade 1s steps(2) infinite' }} />
          </span>
        </div>
        <div className="grow" />
        <button className="btn btn-brand btn-block" style={{ marginBottom: 12 }} disabled={!ok} onClick={() => push({ name: 'otp', phone: fmtPhone(digits) })}>
          Үргэлжлүүлэх
        </button>
      </div>
      <Keypad onKey={(d) => setDigits((x) => (x.length < 8 ? x + d : x))} onDelete={() => setDigits((x) => x.slice(0, -1))} />
    </div>
  );
}

export function Otp({ phone }: { phone: string }) {
  const { pop, resetTo, setTab, showToast } = useApp();
  const [code, setCode] = useState('');
  const [left, setLeft] = useState(42);
  const verifying = code.length === 4;

  useEffect(() => {
    if (left <= 0) return;
    const t = window.setTimeout(() => setLeft((x) => x - 1), 1000);
    return () => window.clearTimeout(t);
  }, [left]);

  useEffect(() => {
    if (!verifying) return;
    const t = window.setTimeout(() => {
      setTab('home');
      resetTo([{ name: 'tabs' }]);
      showToast('Тавтай морил, Номин!', 'Танд 6,850 чацаргана оноо хуримтлагдсан байна.');
    }, 900);
    return () => window.clearTimeout(t);
  }, [verifying, resetTo, setTab, showToast]);

  return (
    <div className="screen">
      <NavBar onBack={pop} />
      <div className="pad grow col">
        <h1 className="t-title">Кодоо оруулна уу</h1>
        <p className="t-callout c2 mt8">+976 {phone} дугаарт 4 оронтой код илгээлээ.</p>
        <div className="row g10 mt24">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="num"
              style={{
                width: 58, height: 64, borderRadius: 12, background: 'var(--fill)', display: 'grid', placeItems: 'center',
                fontSize: 28, fontWeight: 600, boxShadow: code.length === i ? 'inset 0 0 0 2px var(--brand)' : undefined,
              }}
            >
              {code[i] ?? ''}
            </div>
          ))}
          {verifying && <div className="spinner" style={{ marginLeft: 8 }} />}
        </div>
        <p className="t-sub c3 mt16">
          {left > 0 ? `Дахин илгээх 0:${String(left).padStart(2, '0')}` : <button className="btn-text" onClick={() => setLeft(42)}>Код дахин илгээх</button>}
        </p>
      </div>
      <Keypad
        suggestion={code.length === 0 ? 'Мессежээс: 1234' : undefined}
        onSuggestion={() => setCode('1234')}
        onKey={(d) => setCode((x) => (x.length < 4 ? x + d : x))}
        onDelete={() => setCode((x) => x.slice(0, -1))}
      />
    </div>
  );
}
