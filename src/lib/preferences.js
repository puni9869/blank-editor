import { EDITOR_PREFERENCES_KEY } from '@/config/config';
import { DEFAULT_PREFERENCES, Preferences } from '@/types/preferences';

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(EDITOR_PREFERENCES_KEY);
    if (!raw) {
      return { ...DEFAULT_PREFERENCES };
    }

    return Preferences.from(JSON.parse(raw)).toJSON();
  } catch (err) {
    console.warn('Failed to load preferences', err);
    return { ...DEFAULT_PREFERENCES };
  }
}

export function savePreferences(preferences) {
  const normalized = Preferences.from(preferences).toJSON();
  localStorage.setItem(EDITOR_PREFERENCES_KEY, JSON.stringify(normalized));
  return normalized;
}
