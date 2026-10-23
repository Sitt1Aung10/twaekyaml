import { buildSuggestion } from '../shared/meetup.js';

const API_BASE_URL = 'https://twaekyamlbe.hermesmyanmar.com';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      cache: 'no-store',
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    const error = new Error('ဆာဗာနှင့် ချိတ်ဆက်မရပါ။ နောက်တစ်ကြိမ် ထပ်ကြိုးစားပါ။');
    error.status = 0;
    throw error;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    const error = new Error(data.error || data.message || 'မအောင်မြင်ပါ။');
    error.status = response.status;
    error.code = data.error;
    throw error;
  }
  return data;
}

function memberToResponse(member) {
  let availability = [];
  if (Array.isArray(member.available_time)) {
    availability = member.available_time;
  } else if (typeof member.available_time === 'string' && member.available_time !== '') {
    try {
      const parsed = JSON.parse(member.available_time);
      if (Array.isArray(parsed)) availability = parsed;
    } catch {
      availability = [];
    }
  }

  return {
    id: member.id,
    name: member.member_name,
    phone: member.phone,
    place: member.suggest_location,
    style: member.meetup_style === 'tea' ? 'tea_house' : member.meetup_style,
    availability,
    arrival: member.expected_arrival || '',
    createdAt: member.created_at,
    submittedAt: member.updated_at || member.created_at,
    updatedAt: member.updated_at,
  };
}

export function createMeeting(organizer, place = '') {
  return request('/recordHistory.php', {
    method: 'POST',
    body: JSON.stringify({ action: 'create_meeting', organizer, fixed_place: place }),
  });
}

export async function getResponses(code) {
  const data = await request(`/index.php?room=${encodeURIComponent(code)}`);
  const responses = (data.members || []).map(memberToResponse);
  return {
    code: data.room,
    fixedPlace: data.fixedPlace || '',
    responses,
    suggestion: buildSuggestion(responses, data.places || []),
  };
}

export async function saveResponse(code, payload) {
  const saved = await request('/recordHistory.php', {
    method: 'POST',
    body: JSON.stringify({
      room_number: code,
      member_name: payload.name,
      phone: payload.phone,
      suggest_location: payload.place,
      meetup_style: payload.style,
      available_time: payload.availability,
      expected_arrival: payload.arrival,
    }),
  });
  const room = await getResponses(code);
  return {
    updated: Boolean(saved.updated),
    id: saved.id,
    room: saved.room,
    ...room,
  };
}
