import { validateOrganizer } from '../shared/meetup.js';

const KEY = 'twae-kya-ml-organizer';

export function readSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const checked = validateOrganizer(JSON.parse(raw));
    return checked.ok ? checked.value : null;
  } catch {
    return null;
  }
}

export function writeSession(value) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
