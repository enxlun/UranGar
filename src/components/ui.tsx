import type { CSSProperties, ReactNode } from 'react';
import { ChevronLeft, Star } from 'lucide-react';

/* ------------------------------ Брэнд ------------------------------ */

/** УранГар-ын тэмдэг: чацарганы гурван жимс, нэг навч */
export function BerryMark({ size = 28, mono = false }: { size?: number; mono?: boolean }) {
  const c1 = mono ? '#FFFFFF' : '#F07A1E';
  const c2 = mono ? '#FFFFFF' : '#E8620C';
  const c3 = mono ? '#FFFFFF' : '#F59A3C';
  const leaf = mono ? 'rgba(255,255,255,0.82)' : '#5E8B57';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path d="M19 17 C 21 9, 27 4.5, 35 3.5 C 33.5 10, 28 15.5, 19 17 Z" fill={leaf} />
      <path d="M19.5 16.5 L 18 20" stroke={leaf} strokeWidth={1.6} strokeLinecap="round" />
      <ellipse cx={13} cy={25} rx={7.6} ry={8.4} fill={c1} />
      <ellipse cx={26.5} cy={23.5} rx={7.6} ry={8.4} fill={c2} />
      <ellipse cx={20} cy={33} rx={6.4} ry={6.6} fill={c3} />
      {!mono && (
        <>
          <circle cx={10.5} cy={21.5} r={1.8} fill="#fff" opacity={0.55} />
          <circle cx={24} cy={20} r={1.8} fill="#fff" opacity={0.55} />
          <circle cx={18} cy={30.5} r={1.5} fill="#fff" opacity={0.55} />
        </>
      )}
    </svg>
  );
}

export function AppIcon({ size = 36, radius }: { size?: number; radius?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: radius ?? size * 0.24, flex: '0 0 auto',
        background: 'linear-gradient(160deg, #F58A2E 0%, #E2580A 100%)', display: 'grid', placeItems: 'center',
      }}
    >
      <BerryMark size={size * 0.7} mono />
    </div>
  );
}

export function Wordmark({ size = 20, color = 'var(--text)' }: { size?: number; color?: string }) {
  return (
    <span style={{ fontSize: size, fontWeight: 700, letterSpacing: -0.04 * size, color }}>
      Уран<span style={{ color: 'var(--brand)' }}>Гар</span>
    </span>
  );
}

/** Чацаргана оноо — нэг жимсний жижиг дүрс */
export function BerryCoin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden style={{ flex: '0 0 auto' }}>
      <path d="M10.5 6.5 C 11.5 3, 14.5 1.2, 18 1 C 17.2 4, 14.5 6, 10.5 6.5 Z" fill="#5E8B57" />
      <ellipse cx={9.5} cy={12} rx={6.6} ry={7} fill="#EE6E14" />
      <circle cx={7.4} cy={9.4} r={1.6} fill="#fff" opacity={0.6} />
    </svg>
  );
}

/* ------------------------------ Навигаци ------------------------------ */

export function NavBar({ title, onBack, right, style }: { title?: ReactNode; onBack?: () => void; right?: ReactNode; style?: CSSProperties }) {
  return (
    <div className="nav" style={style}>
      {onBack && (
        <button className="nav-back" onClick={onBack} aria-label="Буцах">
          <ChevronLeft size={28} strokeWidth={2.2} />
        </button>
      )}
      {title && <div className="nav-title">{title}</div>}
      <div className="nav-right">{right}</div>
    </div>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="section-h">
      <h2>{title}</h2>
      {action && <button onClick={onAction}>{action}</button>}
    </div>
  );
}

/* ------------------------------ Хүмүүс ------------------------------ */

export function Avatar({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.36, color, background: `color-mix(in srgb, ${color} 15%, #fff)` }}
    >
      {initials}
    </div>
  );
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`${value} од`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} fill={i <= Math.round(value) ? 'var(--star)' : '#E3E3E8'} color={i <= Math.round(value) ? 'var(--star)' : '#E3E3E8'} strokeWidth={0} />
      ))}
    </span>
  );
}

export function Rating({ value, count, size = 13 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="row g4" style={{ display: 'inline-flex', fontSize: size + 1 }}>
      <Star size={size} fill="var(--star)" color="var(--star)" strokeWidth={0} />
      <span className="w6 num">{value.toFixed(1)}</span>
      {count !== undefined && <span className="c3 num">({count})</span>}
    </span>
  );
}

/* ------------------------------ Давхаргууд ------------------------------ */

export function Sheet({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <>
      <div className="dim" onClick={onClose} />
      <div className="sheet" role="dialog">
        <div className="grab" />
        {children}
      </div>
    </>
  );
}

export function Row({ k, v, strong, muted }: { k: ReactNode; v: ReactNode; strong?: boolean; muted?: boolean }) {
  return (
    <div className="row between" style={{ padding: '5px 0', fontSize: strong ? 17 : 15, fontWeight: strong ? 700 : 400 }}>
      <span style={{ color: strong ? 'var(--text)' : 'var(--text-2)' }}>{k}</span>
      <span className="num" style={{ color: muted ? 'var(--text-3)' : undefined }}>{v}</span>
    </div>
  );
}
