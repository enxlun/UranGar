/** Демо QR (жинхэнэ QPay нэхэмжлэх биш — зөвхөн дүрслэл) */
export function QRCode({ seed = 7, size = 200 }: { seed?: number; size?: number }) {
  const n = 29;
  let s = seed * 9301 + 49297;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  const cells: [number, number][] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (rnd() > 0.52) cells.push([x, y]);
    }
  }
  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width={7} height={7} fill="#1A1F2B" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="#FFFDF9" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="#1A1F2B" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges" aria-label="QPay QR код (демо)">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#FFFDF9" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#1A1F2B" />
      ))}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
      <rect x={n / 2 - 3} y={n / 2 - 3} width={6} height={6} rx={1} fill="#FFFDF9" />
      <rect x={n / 2 - 2.2} y={n / 2 - 2.2} width={4.4} height={4.4} rx={1} fill="#F2711C" />
    </svg>
  );
}
