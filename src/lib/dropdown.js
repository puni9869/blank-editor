import { clearTitleData, saveTitle } from './editor-title.js';
import { info, success } from '../components/toast';
import { Note } from '../types/note';
import { NotesModal } from '../components/notes';
import { AboutModal } from '../components/about';
import { Notes } from '../db/notes';
import { clearNoteId, getNoteId, saveNoteId } from './editor-notes-id';
import appMeta from '../../package.json';

const VALID_BUILD_TYPES = new Set(['local', 'prod', 'beta', 'test']);
const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
const DEFAULT_DEMO_URL = 'https://puni9869.github.io/blank-editor/';

function normalizeRepositoryUrl(repository) {
  const raw =
    typeof repository === 'string' ? repository : repository?.url || '';
  if (!raw) {
    return '';
  }

  return raw.replace(/^git\+/, '').replace(/\.git$/, '');
}

function resolveBuildType() {
  const explicitType = (import.meta.env?.VITE_BUILD_TYPE || '')
    .toLowerCase()
    .trim();

  if (VALID_BUILD_TYPES.has(explicitType)) {
    return explicitType;
  }

  return isLocalhost() ? 'local' : 'prod';
}

function isLocalhost() {
  return LOCALHOST_HOSTNAMES.has(window.location.hostname);
}

function createAboutModal() {
  const buildVersion =
    import.meta.env?.VITE_SUPPORT_JS_BUILD_VERSION || appMeta?.version || 'N/A';
  const demoUrl = import.meta.env?.VITE_DEMO_URL || DEFAULT_DEMO_URL;

  return new AboutModal({
    supportJsBuildVersion: buildVersion,
    buildType: resolveBuildType(),
    githubUrl: normalizeRepositoryUrl(appMeta?.repository),
    licenseType: appMeta?.license || 'N/A',
    demoUrl: isLocalhost() ? demoUrl : '',
  });
}

function isFullscreenActive() {
  return Boolean(
    document.fullscreenElement || document.webkitFullscreenElement,
  );
}

function updateFullscreenMenuLabel() {
  const fullScreenMenuItem = document.getElementById('full-screen');
  if (!fullScreenMenuItem) {
    return;
  }

  const labelEl = fullScreenMenuItem.querySelector('.menu-label');
  if (!labelEl) {
    return;
  }

  labelEl.textContent = isFullscreenActive()
    ? 'Exit Full Screen'
    : 'Full Screen';
}

export async function toggleFullScreen() {
  const doc = document;
  const root = doc.documentElement;

  try {
    if (isFullscreenActive()) {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    } else if (root.requestFullscreen) {
      await root.requestFullscreen();
    } else if (root.webkitRequestFullscreen) {
      root.webkitRequestFullscreen();
    } else {
      info('Fullscreen is not supported in this browser');
      return;
    }
  } catch (error) {
    info('Unable to toggle full screen mode');
  }
}

function hasEditorContent(editor, title = '') {
  if (!editor) return false;
  const text = editor.getText(false)?.trim();
  return Boolean(text) || Boolean(title.trim());
}

async function persistCurrentNote(editor, title = '') {
  if (!editor) return null;

  const fallbackTitle = editor.getText(false)?.trim()?.slice(0, 15) || '';
  const resolvedTitle = title.trim() || fallbackTitle;

  if (!hasEditorContent(editor, resolvedTitle)) {
    return null;
  }

  const note = new Note({
    title: resolvedTitle,
    tags: ['default'],
    workspace: ['default'],
    content: editor.getJSON(),
  });

  let noteId = getNoteId();
  if (!noteId) {
    noteId = await Notes.add(note);
    saveNoteId(editor, noteId);
  } else {
    await Notes.update(noteId, note);
  }

  saveTitle(editor, resolvedTitle);
  return noteId;
}

async function doAction(editor, t) {
  if (!editor) {
    return;
  }
  const id = t?.target?.closest?.('[id]')?.id || t?.target?.id;
  if (!id) {
    return;
  }

  if (id === 'new') {
    editor?.commands?.clearContent();
    clearTitleData();
    clearNoteId();
    editor?.commands?.focus();
    info('New page created');
  }

  if (id === 'clear') {
    editor?.commands?.clearContent();
    editor?.commands?.focus();
  }

  if (id === 'copy') {
    editor.commands.focus();
    const text = editor?.getText();
    if (!text) {
      return;
    }
    await navigator.clipboard.writeText(text);
    success('Content is copied');
  }
  if (id === 'save') {
    openSaveModal(editor);
  }

  if (id === 'all-notes') {
    const notes = await Notes.getAll();
    const notesModal = new NotesModal({
      getNotes: () => notes,
      onSelect: async note => {
        const currentTitle = document.querySelector('#title')?.value || '';
        const currentNoteId = getNoteId();
        const selectedNoteId = note?.id;

        if (
          typeof selectedNoteId !== 'undefined' &&
          String(currentNoteId || '') !== String(selectedNoteId)
        ) {
          await persistCurrentNote(editor, currentTitle);
        }

        if (typeof selectedNoteId !== 'undefined') {
          saveNoteId(editor, selectedNoteId);
        } else {
          clearNoteId();
        }

        editor?.commands?.setContent(note.content || '');
        saveTitle(editor, note.title || '');
      },
    });

    notesModal.mount();
    await notesModal.open();
  }

  if (id === 'about') {
    const aboutModal = createAboutModal();
    aboutModal.mount();
    aboutModal.open();
  }

  if (id === 'full-screen') {
    await toggleFullScreen();
  }
}

export function openSaveModal(editor) {
  const modal = document.getElementById('save-modal');
  const saveBtn = document.getElementById('save-file');
  const cancelBtn = document.getElementById('close-modal-btn');
  const fileNameEl = document.getElementById('file-name');
  const titleEL = document.getElementById('title');
  fileNameEl.value = titleEL.value;
  modal.classList.add('modal-backdrop-show');

  // prevent duplicate listeners
  saveBtn.onclick = () => saveFile(editor);
  cancelBtn.onclick = closeSaveModal;

  fileNameEl.onkeydown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      return saveFile(editor);
    }
  };

  setTimeout(() => {
    fileNameEl.focus();
  }, 0);
}

async function saveFile(editor) {
  const fileNameEl = document.getElementById('file-name');
  const fileFormatEl = document.getElementById('file-format');
  const titleEL = document.getElementById('title');

  if (!editor || !fileNameEl || !fileFormatEl || !titleEL) {
    return;
  }

  const name = fileNameEl.value.trim();

  await persistCurrentNote(editor, name);

  // const text = editor.getText(false);
  // const format = fileFormatEl.value;
  // downloadTxt(name + format, text);
  closeSaveModal();
  success('File is saved');
}

function downloadTxt(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function closeSaveModal() {
  const modal = document.getElementById('save-modal');
  if (modal) modal.classList.remove('modal-backdrop-show');

  const fileName = document.getElementById('file-name');
  if (fileName) fileName.value = '';
}

export function loadMenu(editor) {
  window.addEventListener('load', () => {
    document.getElementById('more-menu').hidden = false;
  });

  const btn = document.querySelector('.dots-btn');
  const menu = document.querySelector('.dropdown-menu');

  updateFullscreenMenuLabel();
  document.addEventListener('fullscreenchange', updateFullscreenMenuLabel);
  document.addEventListener(
    'webkitfullscreenchange',
    updateFullscreenMenuLabel,
  );

  btn.addEventListener('click', e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  [
    'copy',
    'clear',
    'new',
    'save',
    'all-notes',
    'about',
    'full-screen',
  ].forEach(action => {
    const elm = document.querySelector(`#${action}`);
    elm?.addEventListener('click', async e => await doAction(editor, e));
  });

  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
}
