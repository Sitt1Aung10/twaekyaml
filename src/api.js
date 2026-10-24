import { buildSuggestion } from '../shared/meetup.js';

const LEGACY_API_BASE_URL = 'https://twaekyamlbe.hermesmyanmar.com';
const API_BASE_URL = LEGACY_API_BASE_URL;

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${path.startsWith('/legacy/') ? LEGACY_API_BASE_URL : API_BASE_URL}${path.replace(/^\/legacy/, '')}`, {
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
    error.field = data.field;
    throw error;
  }
  return data;
}

function memberToResponse(member) {
  let availability = [];
  if (Array.isArray(member.available_time)) availability = member.available_time;
  else if (typeof member.available_time === 'string' && member.available_time) {
    try { const parsed = JSON.parse(member.available_time); if (Array.isArray(parsed)) availability = parsed; } catch { availability = []; }
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

export function createMeeting(organizer) {
  return request('/legacy/recordHistory.php', { method: 'POST', body: JSON.stringify({ action: 'create_meeting', organizer }) });
}

export function getMeeting(code) {
  return request(`/meetings/${encodeURIComponent(code)}`);
}

export async function getResponses(code) {
  const data = await request(`/legacy/index.php?room=${encodeURIComponent(code)}`);
  const responses = (data.members || []).map(memberToResponse);
  return {
    code: data.room,
    organizer: data.organizer || null,
    fixedPlace: data.fixedPlace || '',
    responses,
    suggestion: buildSuggestion(responses, data.places || []),
    placeVotes: data.placeVotes || [],
    confirmedDate: data.confirmedDate || '',
    confirmedSlot: data.confirmedSlot || null,
    locations: data.locations || [],
  };
}

export async function saveResponse(code, payload) {
  const saved = await request('/legacy/recordHistory.php', {
    method: 'POST', body: JSON.stringify({
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
  return { updated: Boolean(saved.updated), ...room };
}

export function voteForPlace(code, member, place) {
  return request(`/meetings/${encodeURIComponent(code)}/votes`, {
    method: 'POST', body: JSON.stringify({ ...member, place }),
  });
}

export function confirmDate(code, organizer, slot, place) {
  return request(`/meetings/${encodeURIComponent(code)}/confirmation`, {
    method: 'POST', body: JSON.stringify({ organizer, ...slot, place }),
  });
}

export function shareLocation(code, member, latitude, longitude) {
  return request(`/meetings/${encodeURIComponent(code)}/locations`, {
    method: 'POST', body: JSON.stringify({ ...member, latitude, longitude }),
  });
}
