const MYANMAR_DIGITS = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];

export const DAYS = [
  { id: 'mon', label: 'တနင်္လာ' },
  { id: 'tue', label: 'အင်္ဂါ' },
  { id: 'wed', label: 'ဗုဒ္ဓဟူး' },
  { id: 'thu', label: 'ကြာသပတေး' },
  { id: 'fri', label: 'သောကြာ' },
  { id: 'sat', label: 'စနေ' },
  { id: 'sun', label: 'တနင်္ဂနွေ' },
];

export const STYLES = [
  { id: 'karaoke', label: 'Karaoke ကာရာအိုကေ' },
  { id: 'zoo', label: 'Zoo တိရစ္ဆာန်ရုံ' },
  { id: 'staycation', label: 'Staycation စတေးကေးရှင်း' },
  { id: 'camp', label: 'Camp စခန်းချ' },
  { id: 'bar', label: 'Bar ဘား' },
  { id: 'coffee', label: 'Coffee ကော်ဖီဆိုင်' },
  { id: 'restaurant', label: 'Restaurant စားသောက်ဆိုင်' },
  { id: 'fine_dining', label: 'Fine Dining ဖိုင်းဒိုင်နင်း' },
  { id: 'tea_house', label: 'Tea House လက်ဖက်ရည်ဆိုင်' },
  { id: 'movie', label: 'Movie ရုပ်ရှင်' },
  { id: 'show', label: 'Show ရှိုး' },
];

export const STYLE_GUIDES = {
  karaoke: {
    intro: 'ကာရာအိုကေဆိုရင် ဒီနေရာတွေက လူသိများတဲ့ ဧရိယာတွေ ဖြစ်ပါတယ်။',
    places: [
      'Junction City ရှိ ကာရာအိုကေ ဧရိယာ',
      'Myanmar Plaza ရှိ ကာရာအိုကေ ဧရိယာ',
      'လှည်းတန်းရှိ ကာရာအိုကေ ဧရိယာ',
    ],
  },
  zoo: {
    intro: 'တိရစ္ဆာန်ရုံသွားမယ်ဆိုရင် ဒီဥယျာဉ်တွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: [
      'ရန်ကုန်တိရစ္ဆာန်ဥယျာဉ်',
      'နေပြည်တော်တိရစ္ဆာန်ဥယျာဉ်',
      'မန္တလေးတိရစ္ဆာန်ဥယျာဉ်',
      'လှော်ကား တောရိုင်းတိရစ္ဆာန်ဥယျာဉ်',
    ],
  },
  staycation: {
    intro: 'စတေးကေးရှင်းအတွက် နားခိုလေ့ရှိတဲ့ နေရာတွေ ဖြစ်ပါတယ်။',
    places: ['အင်းလေး', 'ပုဂံ', 'ငွေဆောင်', 'ချောင်းသာ'],
  },
  camp: {
    intro: 'စခန်းချဖို့ ဒီဒေသတွေမှာ သွားလေ့ရှိပါတယ်။',
    places: ['ကလော', 'အင်းလေးဒေသ', 'ငွေဆောင်', 'ချောင်းသာ'],
  },
  bar: {
    intro: 'ဘားသွားမယ်ဆိုရင် ရန်ကုန်မှာ လူသိများတဲ့ ဒီနေရာတွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: ['The 7th Joint', 'Yangon Yangon Bar', 'Gekko'],
  },
  coffee: {
    intro: 'ကော်ဖီဆိုင်အတွက် ဒီဆိုင်တွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: ['Yangon Bakehouse', 'Coffee Circles', 'Bar Boon'],
  },
  restaurant: {
    intro: 'စားသောက်ဆိုင်အတွက် ဒီဆိုင်တွေက လူသိများပါတယ်။',
    places: ['Shan Yoe Yar', 'Aung Thukha', '999 Shan Noodle Shop'],
  },
  fine_dining: {
    intro: 'ဖိုင်းဒိုင်နင်းအတွက် ဒီဆိုင်တွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: ["Sharky's", 'Gekko', 'Port Autonomy'],
  },
  tea_house: {
    intro: 'လက်ဖက်ရည်ဆိုင်အတွက် ဒီနေရာတွေက လူသိများပါတယ်။',
    places: ['Rangoon Tea House', 'Feel Myanmar Food', 'Lucky Seven Tea House'],
  },
  movie: {
    intro: 'ရုပ်ရှင်ကြည့်မယ်ဆိုရင် ဒီရုံတွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: ['JCGV Junction City', 'Mingalar Cinemas', 'Junction Square ရုပ်ရှင်ရုံ'],
  },
  show: {
    intro: 'ရှိုးကြည့်မယ်ဆိုရင် ယဉ်ကျေးမှုဖျော်ဖြေပွဲတွေနဲ့ လူသိများတဲ့ ဒီနေရာတွေကို စဉ်းစားနိုင်ပါတယ်။',
    places: ['ကရဝိက်နန်းတော် ယဉ်ကျေးမှုဖျော်ဖြေပွဲ', 'ရန်ကုန် အမျိုးသားဇာတ်ရုံ'],
  },
};

const MONTHS = [
  'ဇန်နဝါရီ',
  'ဖေဖော်ဝါရီ',
  'မတ်',
  'ဧပြီ',
  'မေ',
  'ဇွန်',
  'ဇူလိုင်',
  'ဩဂုတ်',
  'စက်တင်ဘာ',
  'အောက်တိုဘာ',
  'နိုဝင်ဘာ',
  'ဒီဇင်ဘာ',
];

export const MESSAGES = {
  room: 'အခန်းနံပါတ်သည် အင်္ဂလိပ်အက္ခရာ ၁ လုံးမှ ၄ လုံးအထိ ဖြစ်ရပါမည်။',
  name: 'အမည် ထည့်ပါ။',
  nameLong: 'အမည် အလွန်ရှည်နေပါတယ်။',
  phone: 'ဖုန်းနံပါတ် မမှန်ပါ။ ၀၉… သို့မဟုတ် +၉၅၉… ပုံစံကို သုံးပါ။',
  place: 'တွေ့ဆုံလိုသည့် နေရာ ထည့်ပါ။',
  placeLong: 'နေရာ အလွန်ရှည်နေပါတယ်။',
  style: 'တွေ့ဆုံမည့် ပုံစံ တစ်ခု ရွေးပါ။',
  availability: 'ရနိုင်သည့်နေ့ အနည်းဆုံး တစ်နေ့ ရွေးပါ။',
  availabilityRange: 'ပြီးဆုံးချိန်သည် စတင်ချိန်ထက် နောက်ကျရပါမည်။',
  availabilityDay: 'နေ့ ရွေးချယ်မှု မမှန်ပါ။',
  availabilityDuplicate: 'နေ့တစ်နေ့ကို တစ်ကြိမ်သာ ရွေးပါ။',
  availabilityTime: 'အချိန် ပုံစံ မမှန်ပါ။',
  arrival: 'မျှော်မှန်းရောက်ရှိချိန် ရွေးပါ။',
  notFound: 'ဤအခန်းကုဒ် မရှိသေးပါ။',
  gmail: '@gmail.com ဖြင့် ဆုံးသော လိပ်စာသာ လက်ခံပါသည်။',
  organizer: 'စီစဉ်သူ အချက်အလက် မပြည့်စုံပါ။',
  full: 'ဒီအခန်းမှာ လူပြည့်သွားပါပြီ။',
};

export function toMyanmarDigits(value) {
  return String(value).replace(/\d/g, (digit) => MYANMAR_DIGITS[Number(digit)]);
}

export function dayLabel(dayId) {
  return DAYS.find((day) => day.id === dayId)?.label ?? dayId;
}

export function dayIndex(dayId) {
  return DAYS.findIndex((day) => day.id === dayId);
}

export function styleLabel(styleId) {
  return STYLES.find((style) => style.id === styleId)?.label ?? styleId;
}

export function normalizeJoinCode(input) {
  if (typeof input !== 'string') return '';
  const code = input.trim().toUpperCase();
  return /^[A-Z]{1,4}$/.test(code) ? code : '';
}

export function normalizeTime(value) {
  if (typeof value !== 'string') return '';
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return '';
  if (hour > 23 || minute > 59) return '';
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function cleanName(input) {
  if (typeof input !== 'string') return '';
  return input.normalize('NFC').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().replace(/\s+/g, ' ');
}

export function nameKey(name) {
  return cleanName(name).toLowerCase();
}

export function cleanText(input) {
  if (typeof input !== 'string') return '';
  return input.normalize('NFC').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().replace(/\s+/g, ' ');
}

export function normalizePhone(input) {
  if (typeof input !== 'string') return '';
  const compact = input.trim().replace(/[\s\-().]/g, '');
  if (!/^(\+959\d{7,9}|09\d{7,9})$/.test(compact)) return '';
  return compact.startsWith('+959') ? `09${compact.slice(4)}` : compact;
}

export function timeToMinutes(hhmm) {
  const [hour, minute] = hhmm.split(':').map(Number);
  return hour * 60 + minute;
}

export function minutesToClock(mins) {
  const hour = Math.floor(mins / 60);
  const minute = mins % 60;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function splitClock(hhmm) {
  const normalized = normalizeTime(hhmm);
  if (!normalized) return { hour: '', minute: '', period: 'am' };
  const [hourText, minute] = normalized.split(':');
  const hour24 = Number(hourText);
  const period = hour24 >= 12 ? 'pm' : 'am';
  const hour12 = hour24 % 12 || 12;
  return { hour: String(hour12), minute, period };
}

export function joinClock(hour, minute, period) {
  if (hour === '' || minute === '') return '';
  let hour24 = Number(hour) % 12;
  if (period === 'pm') hour24 += 12;
  return `${String(hour24).padStart(2, '0')}:${minute}`;
}

export function formatClock(hhmm) {
  const parts = splitClock(hhmm);
  if (!parts.hour) return '';
  const periodLabel = parts.period === 'am' ? 'နံနက်' : 'ညနေ';
  return `${periodLabel} ${toMyanmarDigits(parts.hour)}:${toMyanmarDigits(parts.minute)}`;
}

export function formatAvailability(list) {
  if (!Array.isArray(list) || list.length === 0) return '';
  return [...list]
    .sort((a, b) => dayIndex(a.day) - dayIndex(b.day))
    .map((item) => `${dayLabel(item.day)} ${formatClock(item.start)}–${formatClock(item.end)}`)
    .join('၊ ');
}

export function formatSubmitted(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = toMyanmarDigits(date.getDate());
  const month = MONTHS[date.getMonth()];
  const year = toMyanmarDigits(date.getFullYear());
  const clock = formatClock(
    `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
  );
  return `${day} ${month} ${year}၊ ${clock}`;
}

export function validateAvailability(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return { ok: false, message: MESSAGES.availability };
  }
  const seen = new Set();
  const value = [];
  for (const item of list) {
    if (!item || !DAYS.some((day) => day.id === item.day)) {
      return { ok: false, message: MESSAGES.availabilityDay };
    }
    if (seen.has(item.day)) {
      return { ok: false, message: MESSAGES.availabilityDuplicate };
    }
    seen.add(item.day);
    const start = normalizeTime(item.start);
    const end = normalizeTime(item.end);
    if (!start || !end) return { ok: false, message: MESSAGES.availabilityTime };
    if (start >= end) return { ok: false, message: MESSAGES.availabilityRange };
    value.push({ day: item.day, start, end });
  }
  value.sort((a, b) => dayIndex(a.day) - dayIndex(b.day));
  return { ok: true, value };
}

export function validateResponse(input) {
  const source = input && typeof input === 'object' ? input : {};
  const errors = {};
  const name = cleanName(source.name);
  if (!name) errors.name = MESSAGES.name;
  else if (name.length > 120) errors.name = MESSAGES.nameLong;

  const phone = normalizePhone(source.phone ?? '');
  if (!phone) errors.phone = MESSAGES.phone;

  const fixedPlace = cleanText(source.fixedPlace);
  const place = fixedPlace || cleanText(source.place);
  if (!fixedPlace) {
    if (!place) errors.place = MESSAGES.place;
    else if (place.length > 160) errors.place = MESSAGES.placeLong;
    if (!STYLES.some((style) => style.id === source.style)) errors.style = MESSAGES.style;
  } else if (fixedPlace.length > 255) {
    errors.place = MESSAGES.placeLong;
  }

  const availability = validateAvailability(source.availability);
  if (!availability.ok) errors.availability = availability.message;

  const arrival = normalizeTime(source.arrival ?? '');
  if (!arrival) errors.arrival = MESSAGES.arrival;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    errors: {},
    value: {
      name,
      phone,
      place,
      style: fixedPlace ? '' : source.style,
      availability: availability.value,
      arrival,
    },
  };
}

export function validateOrganizer(input) {
  const source = input && typeof input === 'object' ? input : {};
  if (source.method === 'gmail') {
    const gmail = String(source.gmail ?? '').trim().toLowerCase();
    if (!/^[a-z0-9._%+-]+@gmail\.com$/.test(gmail)) {
      return { ok: false, message: MESSAGES.gmail, field: 'gmail' };
    }
    return { ok: true, value: { method: 'gmail', gmail } };
  }
  if (source.method === 'phone') {
    const name = cleanName(source.name);
    const phone = normalizePhone(source.phone ?? '');
    if (!name) return { ok: false, message: MESSAGES.name, field: 'name' };
    if (name.length > 120) return { ok: false, message: MESSAGES.nameLong, field: 'name' };
    if (!phone) return { ok: false, message: MESSAGES.phone, field: 'phone' };
    return { ok: true, value: { method: 'phone', name, phone } };
  }
  return { ok: false, message: MESSAGES.organizer, field: 'organizer' };
}

export function organizerLabel(organizer) {
  if (!organizer) return '';
  if (organizer.method === 'gmail') return organizer.gmail;
  return `${organizer.name} · ${organizer.phone}`;
}

function joinList(items) {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} နှင့် ${items[1]}`;
  return `${items.slice(0, -1).join('၊ ')} နှင့် ${items[items.length - 1]}`;
}

function bestWindow(intervals) {
  if (!intervals.length) return null;
  const events = [];
  for (const interval of intervals) {
    events.push({ t: interval.start, type: 'start', id: interval.id });
    events.push({ t: interval.end, type: 'end', id: interval.id });
  }
  events.sort((a, b) => a.t - b.t || (a.type === 'end' ? -1 : 1) - (b.type === 'end' ? -1 : 1));

  const active = new Set();
  let prev = null;
  let best = null;
  const consider = (from, to) => {
    if (prev === null || to <= from || active.size === 0) return;
    const candidate = {
      start: from,
      end: to,
      count: active.size,
      ids: [...active],
    };
    const better =
      !best ||
      candidate.count > best.count ||
      (candidate.count === best.count && candidate.end - candidate.start > best.end - best.start) ||
      (candidate.count === best.count &&
        candidate.end - candidate.start === best.end - best.start &&
        candidate.start < best.start);
    if (better) best = candidate;
  };

  for (const event of events) {
    if (prev !== null) consider(prev, event.t);
    if (event.type === 'start') active.add(event.id);
    else active.delete(event.id);
    prev = event.t;
  }
  return best;
}

function effectiveInterval(start, end, arrival) {
  const from = Math.max(start, arrival);
  if (from >= end) return null;
  return { start: from, end };
}

function slotLabel(dayId, start, end) {
  return `${dayLabel(dayId)} ${formatClock(minutesToClock(start))}–${formatClock(minutesToClock(end))}`;
}

const NOON_MINUTES = 12 * 60;

function summarizeArrivals(responses, overlap) {
  const ids = overlap?.ids;
  const people = ids?.length ? responses.filter((response) => ids.includes(response.id)) : responses;
  const arrivals = people
    .map((response) => timeToMinutes(response.arrival))
    .filter((time) => Number.isFinite(time));
  if (!arrivals.length) return { text: 'မျှော်မှန်းရောက်ရှိချိန် မရှိသေးပါ။', time: null };

  const morning = arrivals.filter((time) => time < NOON_MINUTES);
  const evening = arrivals.filter((time) => time >= NOON_MINUTES);
  const windowStart = overlap?.startMinutes;
  const useMorning =
    morning.length > evening.length ||
    (morning.length === evening.length && morning.length > 0 && (windowStart == null || windowStart < NOON_MINUTES));
  const chosen = (useMorning ? morning : evening).length ? (useMorning ? morning : evening) : arrivals;
  const latest = Math.max(...chosen);
  const clock = formatClock(minutesToClock(latest));
  const period = useMorning ? 'နံနက်' : 'ညနေ';
  const same = chosen.every((time) => time === latest);
  const text = same
    ? `${period}အချိန်မှာ အားလုံးဆုံဖို့ အသင့်တော်ဆုံးပါပဲ။ လူတိုင်း ${clock} မှာ ရောက်နိုင်ပါတယ်။`
    : `${period}အချိန်မှာ အားလုံးဆုံဖို့ အသင့်တော်ဆုံးပါပဲ။ အဲဒီအထဲ နောက်အကျဆုံး ရောက်နိုင်ချိန်က ${clock} ဖြစ်ပါတယ်။`;
  return { text, time: latest };
}

function memberCircle(response, dayId) {
  const slot = response.availability?.find((item) => item.day === dayId);
  if (!slot) return null;
  return effectiveInterval(
    timeToMinutes(slot.start),
    timeToMinutes(slot.end),
    timeToMinutes(response.arrival),
  );
}

function intersectCircles(circles) {
  if (!circles.length) return null;
  const start = Math.max(...circles.map((circle) => circle.start));
  const end = Math.min(...circles.map((circle) => circle.end));
  if (start >= end) return null;
  return { start, end };
}

function recommendTime(responses) {
  const total = responses.length;
  const shared = [];
  const partial = [];

  DAYS.forEach((day, index) => {
    const circles = [];
    let complete = true;
    for (const response of responses) {
      const circle = memberCircle(response, day.id);
      if (!circle) {
        complete = false;
        continue;
      }
      circles.push({ id: response.id, ...circle });
    }

    if (complete) {
      const common = intersectCircles(circles);
      if (common) {
        shared.push({
          dayId: day.id,
          dayIndex: index,
          count: total,
          ids: circles.map((circle) => circle.id),
          ...common,
        });
      }
    }

    const best = bestWindow(circles);
    if (best) partial.push({ dayId: day.id, dayIndex: index, ...best });
  });

  const everyone = shared.length > 0;
  const candidates = everyone ? shared : partial;
  if (!candidates.length) {
    return {
      everyone: false,
      count: 0,
      total,
      text: 'ရွေးထားသော အချိန်ထဲမှာ လူတိုင်းဆုံတဲ့ အပိုင်း မရှိသေးပါ။',
    };
  }

  candidates.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const lengthDiff = b.end - b.start - (a.end - a.start);
    if (lengthDiff !== 0) return lengthDiff;
    if (a.dayIndex !== b.dayIndex) return a.dayIndex - b.dayIndex;
    return a.start - b.start;
  });

  const best = candidates[0];
  const slot = slotLabel(best.dayId, best.start, best.end);
  let text;
  if (everyone) {
    const others = candidates.slice(1).map((candidate) => slotLabel(candidate.dayId, candidate.start, candidate.end));
    text = `လူအားလုံး (${toMyanmarDigits(total)} ယောက်) ${slot} မှာ တွေ့နိုင်ပါတယ်။`;
    if (others.length) {
      text += ` လူအားလုံး ဆုံတဲ့ နောက်ထပ်အချိန်က ${joinList(others)} ဖြစ်ပါတယ်။`;
    }
  } else {
    const alternate = candidates.find(
      (candidate) =>
        candidate.dayId !== best.dayId &&
        candidate.count === best.count &&
        candidate.end - candidate.start === best.end - best.start,
    );
    text = `လူအားလုံး တစ်ချိန်တည်း မဆုံပါ။ အများဆုံးဆုံတဲ့အချိန်က ${slot} ဖြစ်ပြီး ${toMyanmarDigits(best.count)} ယောက် တက်နိုင်ပါတယ်။`;
    if (alternate) {
      text += ` လူအရေအတွက်တူတဲ့ နောက်ထပ်အချိန်က ${slotLabel(alternate.dayId, alternate.start, alternate.end)} ဖြစ်ပါတယ်။`;
    }
  }

  return {
    everyone,
    count: best.count,
    total,
    day: best.dayId,
    start: minutesToClock(best.start),
    end: minutesToClock(best.end),
    startMinutes: best.start,
    endMinutes: best.end,
    ids: best.ids ?? [],
    text,
  };
}

function catalogForStyle(style, catalog) {
  return (Array.isArray(catalog) ? catalog : []).filter(
    (place) => place && place.style === style && (!place.city || place.city === 'Yangon'),
  );
}

function venuesForStyle(style, catalog) {
  const rows = catalogForStyle(style, catalog);
  if (!rows.length) {
    const names = STYLE_GUIDES[style]?.places ?? [];
    return {
      intro: STYLE_GUIDES[style]?.intro ?? '',
      townships: names.length
        ? [{
            township: '',
            townshipMm: '',
            places: names.map((name) => ({ name, address: '', detail: '' })),
          }]
        : [],
    };
  }

  const groups = new Map();
  for (const place of rows) {
    const key = place.township || '';
    if (!groups.has(key)) {
      groups.set(key, {
        township: place.township || '',
        townshipMm: place.townshipMm || '',
        places: [],
      });
    }
    groups.get(key).places.push({
      name: place.name,
      address: place.address || '',
      detail: place.detail || '',
    });
  }

  return {
    intro: 'ရန်ကုန်မြို့နယ်အလိုက် လူသိများတဲ့ နေရာတွေပါ။',
    townships: [...groups.values()],
  };
}

export function buildSuggestion(responses, catalog = []) {
  if (!Array.isArray(responses) || responses.length === 0) return null;
  const counts = new Map(STYLES.map((style) => [style.id, 0]));
  for (const response of responses) {
    counts.set(response.style, (counts.get(response.style) ?? 0) + 1);
  }
  const votes = STYLES.map((style) => ({
    style: style.id,
    label: style.label,
    count: counts.get(style.id) ?? 0,
  }))
    .filter((vote) => vote.count > 0)
    .sort(
      (a, b) =>
        b.count - a.count ||
        STYLES.findIndex((style) => style.id === a.style) - STYLES.findIndex((style) => style.id === b.style),
    );
  const top = votes[0]?.count ?? 0;
  const winners = votes.filter((vote) => vote.count === top);
  const tied = winners.length > 1;
  const headline = votes.length === 0
    ? 'စီစဉ်သူက တွေ့ဆုံမည့် နေရာကို ဆုံးဖြတ်ပြီးပါပြီ။'
    : tied
      ? `မဲတူနေပါတယ် (${toMyanmarDigits(top)} မဲစီ) — ${joinList(winners.map((vote) => vote.label))}။ ပုံစံတိုင်းအတွက် နေရာအကြံပြုချက်ကို အောက်မှာ ပြထားပါတယ်။`
      : `အများစုက ${winners[0].label} ကို ရွေးထားပါတယ် (${toMyanmarDigits(top)} မဲ / ${toMyanmarDigits(responses.length)} ယောက်)။`;

  const placeCounts = new Map();
  for (const response of responses) {
    placeCounts.set(response.place, (placeCounts.get(response.place) ?? 0) + 1);
  }
  const mentionedPlaces = [...placeCounts.entries()]
    .map(([place, count]) => ({ place, count }))
    .sort((a, b) => b.count - a.count || a.place.localeCompare(b.place));

  const time = recommendTime(responses);
  const arrival = summarizeArrivals(responses, time);
  delete time.startMinutes;
  delete time.endMinutes;
  delete time.ids;

  return {
    total: responses.length,
    votes,
    tied,
    headline,
    venues: winners.map((winner) => {
      const guide = venuesForStyle(winner.style, catalog);
      return {
        style: winner.style,
        label: winner.label,
        intro: guide.intro,
        townships: guide.townships,
        places: guide.townships.flatMap((group) => group.places.map((place) => place.name)),
      };
    }),
    mentionedPlaces,
    time,
    arrival: { text: arrival.text },
  };
}
