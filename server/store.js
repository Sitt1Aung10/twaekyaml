import fs from 'node:fs/promises';
import path from 'node:path';
import { buildSuggestion, nameKey, normalizeJoinCode, normalizePhone, validateOrganizer, validateResponse } from '../shared/meetup.js';
import { HttpError } from './http.js';

const dataFile = path.join(process.cwd(), 'data', 'db.json');
const MAX_RESPONSES = 30;
const MEETING_TTL_MS = 90 * 24 * 60 * 60 * 1000;

function isExpired(meeting, now = Date.now()) {
  const created = Date.parse(meeting?.createdAt ?? '');
  return Number.isFinite(created) && now - created >= MEETING_TTL_MS;
}

function purgeExpired(db, now = Date.now()) {
  let removed = false;
  for (const [code, meeting] of Object.entries(db.meetings)) {
    if (isExpired(meeting, now)) {
      delete db.meetings[code];
      removed = true;
    }
  }
  return removed;
}

let queue = Promise.resolve();

function locked(task) {
  const run = queue.then(task, task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readDb() {
  try {
    const raw = await fs.readFile(dataFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.meetings) {
      return { meetings: {} };
    }
    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') return { meetings: {} };
    throw new HttpError(500, 'server', 'သိမ်းထားသော အချက်အလက်ကို ဖတ်မရပါ။');
  }
}

async function writeDb(db) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(db, null, 2), 'utf8');
}

function randomCode(existing) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let attempt = 0; attempt < 40; attempt += 1) {
    let code = '';
    for (let index = 0; index < 4; index += 1) {
      code += letters[Math.floor(Math.random() * letters.length)];
    }
    if (!existing[code]) return code;
  }
  throw new HttpError(500, 'server', 'အခန်းကုဒ် အသစ် မဖန်တီးနိုင်ပါ။');
}

function publicResponse(response) {
  return {
    id: response.id,
    name: response.name,
    phone: response.phone,
    place: response.place,
    style: response.style,
    availability: response.availability,
    arrival: response.arrival,
    createdAt: response.createdAt,
    submittedAt: response.submittedAt,
    updatedAt: response.updatedAt,
  };
}

function todayInMyanmar() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Yangon', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function matchingMember(meeting, body) {
  const name = nameKey(body?.name);
  const phone = normalizePhone(String(body?.phone || ''));
  if (!name || !phone) throw new HttpError(400, 'validation', 'အမည်နှင့် ဖုန်းနံပါတ် ထည့်ပါ။');
  const member = meeting.responses.find((item) => item.nameKey === name && item.phone === phone);
  if (!member) throw new HttpError(403, 'member', 'ဒီအခန်းမှာ ဖြည့်ထားသော အမည်နှင့် ဖုန်းနံပါတ်ကို သုံးပါ။');
  return member;
}

function sortedResponses(meeting) {
  return [...meeting.responses].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function createMeeting(organizerInput) {
  return locked(async () => {
    const organizer = validateOrganizer(organizerInput);
    if (!organizer.ok) {
      throw new HttpError(400, 'validation', organizer.message, organizer.field);
    }
    const db = await readDb();
    purgeExpired(db);
    const code = randomCode(db.meetings);
    const meeting = {
      code,
      createdAt: new Date().toISOString(),
      organizer: organizer.value,
      responses: [],
      votes: {},
      locations: {},
      confirmedDate: '',
    };
    db.meetings[code] = meeting;
    await writeDb(db);
    return {
      code,
      createdAt: meeting.createdAt,
      organizer: meeting.organizer,
      joinPath: `/join/${code}`,
    };
  });
}

export function getMeeting(rawCode) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    if (!code) throw new HttpError(400, 'validation', 'အခန်းကုဒ် မမှန်ပါ။', 'room');
    const db = await readDb();
    const meeting = db.meetings[code];
    if (meeting && isExpired(meeting)) {
      delete db.meetings[code];
      purgeExpired(db);
      await writeDb(db);
      throw new HttpError(404, 'expired', 'ဤအခန်းကုဒ် သက်တမ်းကုန်သွားပါပြီ။');
    }
    if (purgeExpired(db)) await writeDb(db);
    if (!meeting) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။');
    return {
      code: meeting.code,
      createdAt: meeting.createdAt,
      organizer: meeting.organizer,
      responseCount: meeting.responses.length,
      confirmedDate: meeting.confirmedDate || '',
      confirmedSlot: meeting.confirmedSlot || null,
    };
  });
}

export function getResponses(rawCode) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    if (!code) throw new HttpError(400, 'validation', 'အခန်းကုဒ် မမှန်ပါ။', 'room');
    const db = await readDb();
    const meeting = db.meetings[code];
    if (meeting && isExpired(meeting)) {
      delete db.meetings[code];
      purgeExpired(db);
      await writeDb(db);
      throw new HttpError(404, 'expired', 'ဤအခန်းကုဒ် သက်တမ်းကုန်သွားပါပြီ။');
    }
    if (purgeExpired(db)) await writeDb(db);
    if (!meeting) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။');
    const responses = sortedResponses(meeting).map(publicResponse);
    return {
      code,
      responses,
      suggestion: buildSuggestion(responses),
      placeVotes: Object.entries(meeting.votes || {}).map(([place, ids]) => ({ place, count: ids.length })),
      confirmedDate: meeting.confirmedDate || '',
      confirmedSlot: meeting.confirmedSlot || null,
      locations: meeting.confirmedDate === todayInMyanmar()
        ? Object.values(meeting.locations || {}).map((location) => ({ ...location }))
        : [],
    };
  });
}

export function voteForPlace(rawCode, body) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    const db = await readDb();
    const meeting = db.meetings[code];
    if (!meeting || isExpired(meeting)) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။');
    const member = matchingMember(meeting, body);
    const place = String(body?.place || '').trim();
    const options = [...new Set(meeting.responses.map((response) => response.place).filter(Boolean))];
    if (!options.includes(place)) throw new HttpError(400, 'place', 'မဲပေးမည့် နေရာကို စာရင်းထဲမှ ရွေးပါ။');
    meeting.votes ||= {};
    for (const ids of Object.values(meeting.votes)) {
      const index = ids.indexOf(member.id);
      if (index >= 0) ids.splice(index, 1);
    }
    meeting.votes[place] ||= [];
    meeting.votes[place].push(member.id);
    await writeDb(db);
    return { placeVotes: Object.entries(meeting.votes).map(([name, ids]) => ({ place: name, count: ids.length })) };
  });
}

export function confirmDate(rawCode, body) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    const db = await readDb();
    const meeting = db.meetings[code];
    if (!meeting || isExpired(meeting)) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။');
    const organizer = validateOrganizer(body?.organizer);
    if (!organizer.ok || JSON.stringify(organizer.value) !== JSON.stringify(meeting.organizer)) throw new HttpError(403, 'organizer', 'စီစဉ်သူအဖြစ် ဝင်ထားသော အကောင့်ဖြင့် အတည်ပြုပါ။');
    const date = String(body?.date || '');
    const suggested = buildSuggestion(sortedResponses(meeting).map(publicResponse)).time;
    const start = String(body?.start || '');
    const end = String(body?.end || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || suggested.date !== date || suggested.start !== start || suggested.end !== end) throw new HttpError(400, 'date', 'အကြံပြုထားသော ရက်နှင့်အချိန်ကို ရွေးပါ။');
    meeting.confirmedDate = date;
    meeting.confirmedSlot = { date, start, end };
    await writeDb(db);
    return { confirmedDate: date, confirmedSlot: meeting.confirmedSlot };
  });
}

export function shareLocation(rawCode, body) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    const db = await readDb();
    const meeting = db.meetings[code];
    if (!meeting || isExpired(meeting)) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။');
    if (!meeting.confirmedDate || meeting.confirmedDate !== todayInMyanmar()) throw new HttpError(403, 'date', 'အတည်ပြုထားသော တွေ့ဆုံမည့်နေ့တွင်သာ တည်နေရာမျှဝေနိုင်ပါသည်။');
    const member = matchingMember(meeting, body);
    const latitude = Number(body?.latitude);
    const longitude = Number(body?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) throw new HttpError(400, 'location', 'တည်နေရာ မမှန်ပါ။');
    meeting.locations ||= {};
    meeting.locations[member.id] = { name: member.name, latitude, longitude, sharedAt: new Date().toISOString() };
    await writeDb(db);
    return { locations: Object.values(meeting.locations) };
  });
}

export function saveResponse(rawCode, body) {
  return locked(async () => {
    const code = normalizeJoinCode(rawCode ?? '');
    if (!code) throw new HttpError(400, 'validation', 'အခန်းကုဒ် မမှန်ပါ။', 'room');
    const checked = validateResponse(body);
    if (!checked.ok) {
      const field = Object.keys(checked.errors)[0];
      throw new HttpError(400, 'validation', checked.errors[field], field);
    }
    const db = await readDb();
    const meeting = db.meetings[code];
    if (meeting && isExpired(meeting)) {
      delete db.meetings[code];
      purgeExpired(db);
      await writeDb(db);
      throw new HttpError(404, 'expired', 'ဤအခန်းကုဒ် သက်တမ်းကုန်သွားပါပြီ။');
    }
    if (purgeExpired(db)) await writeDb(db);
    if (!meeting) throw new HttpError(404, 'not_found', 'ဤအခန်းကုဒ် မရှိသေးပါ။ စီစဉ်သူ ဖွင့်ထားသော ကုဒ်ကို သုံးပါ။');

    const now = new Date().toISOString();
    const key = `${nameKey(checked.value.name)}|${checked.value.phone}`;
    const existing = meeting.responses.find((item) => `${item.nameKey}|${item.phone}` === key);
    let updated = false;
    if (existing) {
      existing.name = checked.value.name;
      existing.nameKey = nameKey(checked.value.name);
      existing.phone = checked.value.phone;
      existing.place = checked.value.place;
      existing.style = checked.value.style;
      existing.availability = checked.value.availability;
      existing.arrival = checked.value.arrival;
      existing.submittedAt = now;
      existing.updatedAt = now;
      updated = true;
    } else {
      if (meeting.responses.length >= MAX_RESPONSES) {
        throw new HttpError(400, 'full', 'ဒီအခန်းမှာ လူပြည့်သွားပါပြီ။');
      }
      meeting.responses.push({
        id: crypto.randomUUID(),
        nameKey: nameKey(checked.value.name),
        ...checked.value,
        createdAt: now,
        submittedAt: now,
        updatedAt: now,
      });
    }
    await writeDb(db);
    const responses = sortedResponses(meeting).map(publicResponse);
    const saved = responses.find((item) => `${nameKey(item.name)}|${item.phone}` === key);
    return {
      updated,
      response: saved,
      responses,
      suggestion: buildSuggestion(responses),
    };
  });
}
