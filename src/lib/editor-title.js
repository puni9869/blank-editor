import { EDITOR_TITLE_KEY } from '../config/config.js';

const DEFAULT_TITLE = 'Blank Editor | Minimal Rich Text Editor for Focused Writing';

function getDocumentTitle(rawTitle) {
  const cleaned = String(rawTitle || '').trim();
  return cleaned ? `${cleaned} | Blank Editor` : DEFAULT_TITLE;
}

export function saveTitle(editor, name) {
  if (!editor) {
    return;
  }
  if (!name) {
    name = editor.getText()?.trim()?.slice(0, 15);
  }

  const resolvedTitle = String(name || '').trim();
  localStorage.setItem(EDITOR_TITLE_KEY, resolvedTitle);

  const titleEl = document.getElementById('title');
  titleEl.value = resolvedTitle;
  document.title = getDocumentTitle(resolvedTitle);
}

export function setTitle(editor, title) {
  const fallback = editor?.getText()?.trim()?.slice(0, 15) || '';
  const resolvedTitle = String(title || fallback).trim();
  const titleEl = document.getElementById('title');
  titleEl.value = resolvedTitle;
  document.title = getDocumentTitle(resolvedTitle);
}

export function clearTitleData() {
  localStorage.removeItem(EDITOR_TITLE_KEY);
  const titleEl = document.getElementById('title');
  if (titleEl) {
    titleEl.value = '';
  }
  document.title = DEFAULT_TITLE;
}
