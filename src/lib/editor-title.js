import { EDITOR_TITLE_KEY } from '../config/config.js';

const DEFAULT_TITLE = 'Blank Editor | Minimal Rich Text Editor for Focused Writing';

/**
 * Builds a browser title string from the active note title.
 *
 * @param {string} rawTitle
 * @returns {string}
 */
function getDocumentTitle(rawTitle) {
  const cleaned = String(rawTitle || '').trim();
  return cleaned ? `${cleaned} | Blank Editor` : DEFAULT_TITLE;
}

/**
 * Persists and renders the current note title.
 *
 * @param {object} editor
 * @param {string} [name]
 * @returns {void}
 */
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

/**
 * Sets title input and document title from storage or editor fallback text.
 *
 * @param {object} editor
 * @param {string} [title]
 * @returns {void}
 */
export function setTitle(editor, title) {
  const fallback = editor?.getText()?.trim()?.slice(0, 15) || '';
  const resolvedTitle = String(title || fallback).trim();
  const titleEl = document.getElementById('title');
  titleEl.value = resolvedTitle;
  document.title = getDocumentTitle(resolvedTitle);
}

/**
 * Clears persisted title state and restores default document title.
 *
 * @returns {void}
 */
export function clearTitleData() {
  localStorage.removeItem(EDITOR_TITLE_KEY);
  const titleEl = document.getElementById('title');
  if (titleEl) {
    titleEl.value = '';
  }
  document.title = DEFAULT_TITLE;
}
