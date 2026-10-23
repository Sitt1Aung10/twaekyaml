const API_BASE_URL = '/api';

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
    error.field = data.field;
    throw error;
  }
  return data;
}

export function createMeeting(organizer) {
  return request('/meetings', { method: 'POST', body: JSON.stringify({ organizer }) });
}

export async function getResponses(code) {
  const data = await request(`/meetings/${encodeURIComponent(code)}/responses`);
  return {
    code: data.code,
    fixedPlace: '',
    responses: data.responses || [],
    suggestion: data.suggestion,
    placeVotes: data.placeVotes || [],
    confirmedDate: data.confirmedDate || '',
    confirmedSlot: data.confirmedSlot || null,
    locations: data.locations || [],
  };
}

export async function saveResponse(code, payload) {
  const saved = await request(`/meetings/${encodeURIComponent(code)}/responses`, {
    method: 'POST', body: JSON.stringify(payload),
  });
  const room = await getResponses(code);
  return { updated: Boolean(saved.updated), ...room };
}

export function voteForPlace(code, member, place) {
  return request(`/meetings/${encodeURIComponent(code)}/votes`, {
    method: 'POST', body: JSON.stringify({ ...member, place }),
  });
}

export function confirmDate(code, organizer, slot) {
  return request(`/meetings/${encodeURIComponent(code)}/confirmation`, {
    method: 'POST', body: JSON.stringify({ organizer, ...slot }),
  });
}

export function shareLocation(code, member, latitude, longitude) {
  return request(`/meetings/${encodeURIComponent(code)}/locations`, {
    method: 'POST', body: JSON.stringify({ ...member, latitude, longitude }),
  });
}
