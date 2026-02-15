import { clearTitleData, saveTitle } from './editor-title.js';
import { EDITOR_TITLE_KEY } from '../config/config.js';

async function doAction(editor, t) {
  if (!editor) {
    return;
  }
  const id = t?.target?.id;
  if (!id) {
    return;
  }

  if (id === 'new') {
    editor?.commands?.clearContent();
    clearTitleData();
    editor?.commands?.focus();
  }

  if (id === 'clear') {
    editor?.commands?.clearContent();
    editor?.commands?.focus();
  }

  if (id === 'copy') {
    editor.commands.focus();
    await navigator.clipboard.writeText(editor?.getText());
  }
  if (id === 'save') {
    openSaveModal(editor);
  }
}

export function openSaveModal(editor) {
  const modal = document.getElementById('saveModal');
  const saveBtn = document.getElementById('save-file');
  const cancelBtn = document.getElementById('close-modal-btn');
  const fileNameEl = document.getElementById('fileName');
  const titleEL = document.getElementById('title');
  fileNameEl.value = titleEL.value;
  modal.classList.add('modal-backdrop-show');

  // prevent duplicate listeners
  saveBtn.onclick = () => saveFile(editor);
  cancelBtn.onclick = closeSaveModal;

  fileNameEl.onkeydown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFile(editor);
    }
  };

  setTimeout(() => {
    fileNameEl.focus();
  }, 0);
}

function saveFile(editor) {
  const fileNameEl = document.getElementById('fileName');
  const fileFormatEl = document.getElementById('fileFormat');
  const titleEL = document.getElementById('title');

  if (!editor || !fileNameEl || !fileFormatEl || !titleEL) {
    return;
  }

  const name = fileNameEl.value;
  const format = fileFormatEl.value;

  localStorage?.setItem(EDITOR_TITLE_KEY, name);
  saveTitle(editor);
  const text = editor.getText(false);
  downloadTxt(name + format, text);

  closeSaveModal();
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
  const modal = document.getElementById('saveModal');
  if (modal) modal.classList.remove('modal-backdrop-show');

  const fileName = document.getElementById('fileName');
  if (fileName) fileName.value = '';
}

export function loadMenu(editor) {
  window.addEventListener('load', () => {
    document.getElementById('moreMenu').hidden = false;
  });

  const btn = document.querySelector('.dots-btn');
  const menu = document.querySelector('.dropdown-menu');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  ['copy', 'clear', 'new', 'save'].forEach(action => {
    const elm = document.querySelector(`#${action}`);
    elm.addEventListener('click', async e => await doAction(editor, e));
  });

  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
}
