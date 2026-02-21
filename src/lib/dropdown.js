import { clearTitleData } from './editor-title.js';
import { info, success } from '../components/toast';
import { AboutModal } from '../components/about';
import { clearNoteId } from './editor-notes-id';
import { persistCurrentNote, showNotesModal } from '@/components/notes';
import appMeta from '../../package.json';
import {
  DEFAULT_DEMO_URL,
  VALID_BUILD_TYPES,
  LOCALHOST_HOSTNAMES,
} from '@/config/config';

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

/**
 * Toggles browser fullscreen mode and handles vendor-prefixed fallbacks.
 *
 * @returns {Promise<void>}
 */
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
  } catch {
    info('Unable to toggle full screen mode');
  }
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
    await showNotesModal(editor);
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

/**
 * Opens the save modal and binds save/cancel handlers.
 *
 * @param {object} editor
 * @returns {void}
 */
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

/**
 * Saves the active editor content into the note store.
 *
 * @param {object} editor
 * @returns {Promise<void>}
 */
async function saveFile(editor) {
  const fileNameEl = document.getElementById('file-name');
  const fileFormatEl = document.getElementById('file-format');
  const titleEL = document.getElementById('title');

  if (!editor || !fileNameEl || !fileFormatEl || !titleEL) {
    return;
  }

  const name = fileNameEl.value.trim();

  await persistCurrentNote(editor, name);

  closeSaveModal();
  success('File is saved');
}

/**
 * Closes and resets the save modal.
 *
 * @returns {void}
 */
export function closeSaveModal() {
  const modal = document.getElementById('save-modal');
  if (modal) modal.classList.remove('modal-backdrop-show');

  const fileName = document.getElementById('file-name');
  if (fileName) fileName.value = '';
}

/**
 * Attaches dropdown menu listeners for file and view actions.
 *
 * @param {object} editor
 * @returns {void}
 */
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

  ['copy', 'clear', 'new', 'save', 'all-notes', 'about', 'full-screen'].forEach(
    action => {
      const elm = document.querySelector(`#${action}`);
      elm?.addEventListener('click', async e => await doAction(editor, e));
    },
  );

  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
}
