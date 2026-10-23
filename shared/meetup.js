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
    .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || dayIndex(a.day) - dayIndex(b.day))
    .map((item) => `${item.date ? new Intl.DateTimeFormat('my-MM', { dateStyle: 'medium' }).format(new Date(`${item.date}T12:00:00`)) : dayLabel(item.day)} ${formatClock(item.start)}–${formatClock(item.end)}`)
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
    if (!item || (!item.date && !DAYS.some((day) => day.id === item.day))) {
      return { ok: false, message: MESSAGES.availabilityDay };
    }
    const key = item.date || item.day;
    if (item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) return { ok: false, message: MESSAGES.availabilityDay };
    if (seen.has(key)) {
      return { ok: false, message: MESSAGES.availabilityDuplicate };
    }
    seen.add(key);
    const start = normalizeTime(item.start);
    const end = normalizeTime(item.end);
    if (!start || !end) return { ok: false, message: MESSAGES.availabilityTime };
    if (start >= end) return { ok: false, message: MESSAGES.availabilityRange };
    value.push(item.date ? { date: item.date, start, end } : { day: item.day, start, end });
  }
  value.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')) || dayIndex(a.day) - dayIndex(b.day));
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

function slotLabel(date, start, end) {
  const dateLabel = new Intl.DateTimeFormat('my-MM', { dateStyle: 'full' }).format(new Date(`${date}T12:00:00`));
  return `${dateLabel} ${formatClock(minutesToClock(start))}–${formatClock(minutesToClock(end))}`;
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

function memberCircle(response, date) {
  const slot = response.availability?.find((item) => item.date === date);
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
  const dates = [...new Set(responses.flatMap((response) => (response.availability || []).map((item) => item.date).filter(Boolean)))].sort();

  dates.forEach((date) => {
    const circles = [];
    let complete = true;
    for (const response of responses) {
      const circle = memberCircle(response, date);
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
          date,
          count: total,
          ids: circles.map((circle) => circle.id),
          ...common,
        });
      }
    }

    const best = bestWindow(circles);
    if (best) partial.push({ date, ...best });
  });

  const everyone = shared.length > 0;
  const candidates = everyone ? shared : partial;
  if (!candidates.length) {
    return {
      everyone: false,
      count: 0,
      total,
      text: 'ရွေးထားသော ပြက္ခဒိန်ရက်များထဲမှာ ဆုံနိုင်သော အချိန် မရှိသေးပါ။',
      unavailable: total,
    };
  }

  candidates.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const lengthDiff = b.end - b.start - (a.end - a.start);
    if (lengthDiff !== 0) return lengthDiff;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.start - b.start;
  });

  const best = candidates[0];
  const slot = slotLabel(best.date, best.start, best.end);
  const unavailable = total - best.count;
  let text;
  if (everyone) {
    text = `လူအားလုံး (${toMyanmarDigits(total)} ယောက်) ${slot} မှာ တွေ့နိုင်ပါတယ်။`;
  } else {
    const alternate = candidates.find(
      (candidate) =>
        candidate.date !== best.date &&
        candidate.count === best.count &&
        candidate.end - candidate.start === best.end - best.start,
    );
    text = `လူအားလုံး တစ်ချိန်တည်း မဆုံပါ။ အများဆုံးဆုံတဲ့အချိန်က ${slot} ဖြစ်ပြီး ${toMyanmarDigits(best.count)} ယောက် တက်နိုင်ပါတယ်။`;
    if (alternate) {
      text += ` လူအရေအတွက်တူတဲ့ နောက်ထပ်အချိန်က ${slotLabel(alternate.date, alternate.start, alternate.end)} ဖြစ်ပါတယ်။`;
    }
  }

  return {
    everyone,
    count: best.count,
    total,
    date: best.date,
    unavailable,
    start: minutesToClock(best.start),
    end: minutesToClock(best.end),
    startMinutes: best.start,
    endMinutes: best.end,
    ids: best.ids ?? [],
    text,
  };
}

export function buildSuggestion(responses) {
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
    mentionedPlaces,
    time,
    arrival: { text: arrival.text },
  };
}
