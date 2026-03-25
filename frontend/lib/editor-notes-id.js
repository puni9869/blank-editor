import { EDITOR_NOTES_ID_KEY } from '../config/config';

/**
 * Persists the active note id in localStorage and mirrors it in the hidden input.
 *
 * @param {object} editor
 * @param {string|number} id
 * @returns {void}
 */
export function saveNoteId(editor, id) {
  if (!editor) {
    return;
  }

  localStorage.setItem(EDITOR_NOTES_ID_KEY, id);

  const idEl = document.getElementById('editor-note-id');
  idEl.value = id;
}

/**
 * Updates only the hidden note-id input field.
 *
 * @param {object} editor
 * @param {string|number} id
 * @returns {void}
 */
export function setNoteId(editor, id) {
  const idEl = document.getElementById('editor-note-id');
  idEl.value = id;
}

/**
 * Returns the persisted active note id.
 *
 * @returns {string|null}
 */
export function getNoteId() {
  return localStorage.getItem(EDITOR_NOTES_ID_KEY);
}

/**
 * Clears the persisted active note id from storage and DOM state.
 *
 * @returns {void}
 */
export function clearNoteId() {
  localStorage.removeItem(EDITOR_NOTES_ID_KEY);
  document.getElementById('editor-note-id').value = '';
}
