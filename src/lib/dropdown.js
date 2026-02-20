import { clearTitleData, saveTitle } from './editor-title.js';
import { info, success } from './toast';
import { Note } from '../models/note';
import { NotesModal } from '../components/notes';
import { Notes } from '../db/notes';
import { clearNoteId, getNoteId, saveNoteId } from './editor-notes-id.js';

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
  const id = t?.target?.id;
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
  success("File is saved");
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

  btn.addEventListener('click', e => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  ['copy', 'clear', 'new', 'save', 'all-notes'].forEach(action => {
    const elm = document.querySelector(`#${action}`);
    elm.addEventListener('click', async e => await doAction(editor, e));
  });

  document.addEventListener('click', () => {
    menu.style.display = 'none';
  });
}
