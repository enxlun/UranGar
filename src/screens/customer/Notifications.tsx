import { CircleCheck, Flame, Star, Truck } from 'lucide-react';
import { useApp } from '../../state';
import { BerryCoin, NavBar } from '../../components/ui';

const ITEMS = [
  { icon: <Truck size={19} />, bg: '#15181F', t: 'Явуулын машин №3 таны дүүрэгт', d: 'Өнөөдөр 09:00–21:00 цагт Баянзүрхэд үйлчилнэ.', time: '10 мин', unread: true },
  { icon: <Flame size={19} />, bg: '#E8620C', t: 'Хүйтрэхээс өмнө', d: 'Радиаторын үзлэг 35,000₮-с. Энэ долоо хоногт захиалбал замын зардал үнэгүй.', time: '2 цаг', unread: true },
  { icon: <BerryCoin size={22} />, bg: '#FFE7D4', t: '+860 чацаргана оноо', d: '#UG-2041 захиалгаас оноо нэмэгдлээ.', time: '11.02', unread: false },
  { icon: <Star size={19} />, bg: '#F5A524', t: 'Ганбаатар Д.-д үнэлгээ өгсөнд баярлалаа', d: 'Таны сэтгэгдэл бусдад тусалсан.', time: '11.02', unread: false },
  { icon: <CircleCheck size={19} />, bg: '#4C7A47', t: 'Захиалга #UG-2041 дууслаа', d: 'Төлбөр 86,000₮ QPay-ээр төлөгдсөн.', time: '11.02', unread: false },
];

export function Notifications() {
  const { pop } = useApp();
  return (
    <div className="screen">
      <NavBar title="Мэдэгдэл" onBack={pop} />
      <div className="scroll">
        {ITEMS.map((n) => (
          <div key={n.t} className="cell" style={{ ['--inset' as string]: '68px', padding: '12px 16px', alignItems: 'flex-start', background: n.unread ? '#FFFAF6' : undefined }}>
            <span style={{ width: 40, height: 40, borderRadius: 20, background: n.bg, color: '#fff', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>{n.icon}</span>
            <div className="grow">
              <div className="row between g8">
                <span className="t-callout w6">{n.t}</span>
                <span className="t-cap c3 nowrap">{n.time}</span>
              </div>
              <p className="t-sub c2 mt2">{n.d}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
