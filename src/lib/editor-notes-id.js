import { EDITOR_NOTES_ID_KEY } from '../config/config';

export function saveNoteId(editor, id) {
  if (!editor) {
    return;
  }

  localStorage.setItem(EDITOR_NOTES_ID_KEY, id);

  const idEl = document.getElementById('editor-note-id');
  idEl.value = id;
}

export function setNoteId(editor, id) {
  const idEl = document.getElementById('editor-note-id');
  idEl.value = id;
}

export function getNoteId() {
  return localStorage.getItem(EDITOR_NOTES_ID_KEY);
}

export function clearNoteId() {
  localStorage.removeItem(EDITOR_NOTES_ID_KEY);
  document.getElementById('editor-note-id').value = '';
}
