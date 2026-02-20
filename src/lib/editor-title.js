import { EDITOR_TITLE_KEY } from '../config/config.js';

export function saveTitle(editor, name) {
  if (!editor) {
    return;
  }
  if (!name) {
    name = editor.getText()?.trim()?.slice(0, 15);
  }

  localStorage.setItem(EDITOR_TITLE_KEY, name);

  const titleEl = document.getElementById('title');
  titleEl.value = name;
}

export function setTitle(editor, title) {
  const titleEl = document.getElementById('title');
  titleEl.value = title || editor.getText()?.trim()?.slice(0, 15);
}

export function clearTitleData() {
  localStorage.removeItem(EDITOR_TITLE_KEY);
  document.getElementById('title').value = '';
}
