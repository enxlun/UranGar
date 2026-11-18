import { memo, type ReactNode } from 'react';
import { Truck } from 'lucide-react';

/* Загварчилсан газрын зураг (390×780 px). Бодит хувилбарт Google Maps SDK-аар солигдоно. */
export const MAP_W = 390;
export const MAP_H = 780;
const VX = [40, 128, 216, 304, 372];
const HY = [84, 168, 252, 336, 420, 504, 588, 672];

export interface MapMarker {
  id: string;
  kind: 'me' | 'master' | 'truck' | 'dest';
  pos: [number, number];
  initials?: string;
  color?: string;
  selected?: boolean;
  tag?: string;
  onClick?: () => void;
}

const nearest = (arr: number[], v: number) => arr.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));

/** Замын сүлжээгээр дамжих маршрут */
export function roadRoute(from: [number, number], to: [number, number]): [number, number][] {
  const vx1 = nearest(VX, from[0]);
  const vx2 = nearest(VX, to[0]);
  const hy = nearest(HY, to[1]);
  return [from, [vx1, from[1]], [vx1, hy], [vx2, hy], [vx2, to[1]], to];
}

export function pointAlong(points: [number, number][], t: number): [number, number] {
  if (points.length === 1) return points[0];
  const segs = points.slice(1).map((p, i) => ({ a: points[i], b: p, len: Math.hypot(p[0] - points[i][0], p[1] - points[i][1]) }));
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (const s of segs) {
    if (d <= s.len) {
      const k = s.len ? d / s.len : 0;
      return [s.a[0] + (s.b[0] - s.a[0]) * k, s.a[1] + (s.b[1] - s.a[1]) * k];
    }
    d -= s.len;
  }
  return points[points.length - 1];
}

/** Барилгуудыг тогтмол (seed) байдлаар үүсгэнэ */
function buildings() {
  let s = 11;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const out: { x: number; y: number; w: number; h: number }[] = [];
  const xs = [0, ...VX, MAP_W];
  const ys = [0, ...HY, MAP_H];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < ys.length - 1; j++) {
      const x0 = xs[i] + 8, x1 = xs[i + 1] - 8, y0 = ys[j] + 8, y1 = ys[j + 1] - 8;
      if (x1 - x0 < 14 || y1 - y0 < 14) continue;
      if ((i === 1 && j === 4) || (i === 4 && j === 1) || (i === 4 && j === 7)) continue; // цэцэрлэг
      if (j === ys.length - 2) continue; // голын эрэг
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const w = 14 + r() * Math.min(34, x1 - x0 - 14);
        const h = 10 + r() * Math.min(26, y1 - y0 - 10);
        out.push({ x: x0 + r() * Math.max(1, x1 - x0 - w), y: y0 + r() * Math.max(1, y1 - y0 - h), w, h });
      }
    }
  }
  return out;
}
const BUILDINGS = buildings();

const label = { fontFamily: 'Inter, sans-serif', fontSize: 10.5, fontWeight: 500, fill: '#8C877C', paintOrder: 'stroke' as const, stroke: '#F3F1EC', strokeWidth: 3 };

const MapBase = memo(function MapBase() {
  return (
    <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: 'absolute', inset: 0 }} aria-hidden>
      <rect width={MAP_W} height={MAP_H} fill="#F3F1EC" />
      {/* цэцэрлэг */}
      <rect x={48} y={344} width={72} height={68} rx={4} fill="#DCEBD1" />
      <rect x={380} y={92} width={20} height={68} fill="#DCEBD1" />
      <rect x={312} y={92} width={52} height={68} rx={4} fill="#DCEBD1" />
      <rect x={312} y={596} width={52} height={68} rx={4} fill="#DCEBD1" />
      {/* гол */}
      <path d="M-10 738 C 70 718, 120 748, 200 730 S 330 708, 400 722" fill="none" stroke="#B9D9EF" strokeWidth={18} strokeLinecap="round" />
      {BUILDINGS.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx={1.5} fill="#E7E3DB" stroke="#DDD8CE" strokeWidth={0.6} />
      ))}
      {/* замын хүрээ */}
      <g stroke="#E2DDD3" strokeLinecap="round">
        {HY.map((y) => <line key={`hc${y}`} x1={-10} y1={y} x2={MAP_W + 10} y2={y} strokeWidth={y === 252 ? 15 : 8} />)}
        {VX.map((x) => <line key={`vc${x}`} x1={x} y1={-10} x2={x} y2={MAP_H + 10} strokeWidth={x === 216 ? 13 : 8} />)}
        <line x1={-10} y1={478} x2={MAP_W + 10} y2={396} strokeWidth={10} />
      </g>
      <g stroke="#FFFFFF" strokeLinecap="round">
        {HY.map((y) => <line key={`h${y}`} x1={-10} y1={y} x2={MAP_W + 10} y2={y} strokeWidth={y === 252 ? 0 : 6} />)}
        {VX.map((x) => <line key={`v${x}`} x1={x} y1={-10} x2={x} y2={MAP_H + 10} strokeWidth={x === 216 ? 0 : 6} />)}
        <line x1={-10} y1={478} x2={MAP_W + 10} y2={396} strokeWidth={8} />
      </g>
      {/* гол замууд */}
      <line x1={-10} y1={252} x2={MAP_W + 10} y2={252} stroke="#FBE3A2" strokeWidth={13} />
      <line x1={216} y1={-10} x2={216} y2={MAP_H + 10} stroke="#FBE3A2" strokeWidth={11} />
      {/* шошго */}
      <text x={318} y={255.5} textAnchor="middle" style={{ ...label, fill: '#8A7A4E', stroke: '#FBE3A2' }}>Энхтайвны өргөн чөлөө</text>
      <text transform="translate(219.5 128) rotate(90)" textAnchor="middle" style={{ ...label, fill: '#8A7A4E', stroke: '#FBE3A2' }}>Чингисийн өргөн чөлөө</text>
      <text transform="translate(96 461) rotate(-11.9)" textAnchor="middle" style={{ ...label }}>Нарны зам</text>
      <text x={268} y={724} textAnchor="middle" style={{ ...label, fill: '#5C89AE', stroke: '#B9D9EF', fontStyle: 'italic' }}>Сэлбэ гол</text>
      <text x={84} y={382} textAnchor="middle" style={{ ...label, fill: '#5F8A55', stroke: '#DCEBD1' }}>Цэцэрлэг</text>
      <text x={260} y={322} textAnchor="middle" style={{ ...label, fontSize: 10, fill: '#A39E92' }}>26-р хороо</text>
      <text x={172} y={384} textAnchor="middle" style={{ ...label, fontSize: 11, fontWeight: 600, letterSpacing: 2, fill: '#B3AEA2' }}>БАЯНЗҮРХ</text>
      {[
        { x: 172, y: 124, t: 'Сургууль', c: '#7C8AA0' },
        { x: 344, y: 296, t: 'Эмнэлэг', c: '#C46A6A' },
        { x: 84, y: 212, t: 'Дэлгүүр', c: '#C98A3C' },
      ].map((p) => (
        <g key={p.t}>
          <circle cx={p.x} cy={p.y} r={5} fill={p.c} stroke="#fff" strokeWidth={1.5} />
          <text x={p.x} y={p.y + 16} textAnchor="middle" style={{ ...label, fontSize: 10 }}>{p.t}</text>
        </g>
      ))}
    </svg>
  );
});

export function MapView({
  height,
  markers,
  route,
  focus,
  children,
  inCanvas,
}: {
  height: number;
  markers: MapMarker[];
  route?: [number, number][];
  focus?: [number, number];
  children?: ReactNode;
  /** Газрын зургийн координатаар байрлах нэмэлт давхарга (жишээ нь pulse) */
  inCanvas?: ReactNode;
}) {
  const fy = focus ? focus[1] : MAP_H / 2;
  const top = Math.max(height - MAP_H, Math.min(0, height / 2 - fy));

  return (
    <div className="map" style={{ height }}>
      <div className="map-canvas" style={{ top }}>
        <MapBase />
        {inCanvas}
        {route && route.length > 1 && (
          <svg width={MAP_W} height={MAP_H} style={{ position: 'absolute', inset: 0 }} aria-hidden>
            <polyline points={route.map((p) => p.join(',')).join(' ')} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={route.map((p) => p.join(',')).join(' ')} fill="none" stroke="#E8620C" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {markers.map((m) => (
          <div
            key={m.id}
            className="pin"
            style={{ left: m.pos[0], top: m.pos[1], cursor: m.onClick ? 'pointer' : undefined, zIndex: m.selected ? 5 : 3 }}
            onClick={m.onClick}
          >
            {m.tag && <div className="pin-tag">{m.tag}</div>}
            {m.kind === 'me' && <div className="pin-me" />}
            {m.kind === 'master' && (
              <div
                className={`avatar pin-av${m.selected ? ' sel' : ''}`}
                style={{
                  width: m.selected ? 44 : 36, height: m.selected ? 44 : 36, fontSize: m.selected ? 15 : 12.5,
                  color: m.color, background: `color-mix(in srgb, ${m.color} 15%, #fff)`,
                  transition: 'width 160ms, height 160ms',
                }}
              >
                {m.initials}
              </div>
            )}
            {m.kind === 'truck' && (
              <div className="pin-truck"><Truck size={18} /></div>
            )}
            {m.kind === 'dest' && (
              <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--ink)', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
            )}
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}
