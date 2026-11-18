import { HOME_POS, MASTERS, travelFeeFor } from '../../data';

/** Мастерт ирэх демо дуудлага — хэрэглэгчийн апп дахь Номины захиалгатай ижил */
export const ME = MASTERS[0];

export const JOB = {
  id: 'UG-2108',
  customer: 'Номин Б.',
  customerInitials: 'НБ',
  category: 'Сантехник',
  address: 'БЗД, 26-р хороо, 85-р байр, 42 тоот',
  description: 'Угаалтуурын холигч дусалж байна, шланк нь хуучирсан.',
  distanceKm: ME.distanceKm,
  etaMin: ME.etaMin,
  travelFee: travelFeeFor(ME.distanceKm),
  photos: 2,
  from: ME.pos,
  to: HOME_POS,
};
