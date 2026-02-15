import { EDITOR_TITLE_KEY } from '../config/config.js';

export function saveTitle(editor) {
  if (!editor) {
    return;
  }

  const title = localStorage.getItem(EDITOR_TITLE_KEY);

  const titleEl = document.getElementById('title');
  titleEl.value = title || editor.getText()?.trim()?.slice(0, 15);
}
