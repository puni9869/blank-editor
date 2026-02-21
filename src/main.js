import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { Journal } from './plugins/journal';
import { loadMenu } from './lib/dropdown.js';
import { loadTopToolbar } from './lib/toolbar.js';
import { registerShortcuts } from './lib/keyboard-shortcut.js';
import { saveTitle, setTitle } from './lib/editor-title.js';
import {
  EDITOR_NOTES_ID_KEY,
  EDITOR_STORAGE_KEY,
  EDITOR_TITLE_KEY,
} from './config/config.js';
import { Database } from './db/database.js';
import { setNoteId } from './lib/editor-notes-id.js';

/* --------------------
   Storage helpers
-------------------- */
function loadContent(editor) {
  try {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);
    editor?.commands.setContent(raw ? JSON.parse(raw) : null);

    const id = localStorage.getItem(EDITOR_NOTES_ID_KEY);
    id && setNoteId(editor, id);

    const title = localStorage.getItem(EDITOR_TITLE_KEY);
    setTitle(editor, title);
  } catch (err) {
    console.warn('Failed to load editor content', err);
  }
}

function saveContent(editor) {
  try {
    localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(editor.getJSON()));
  } catch (err) {
    // storage full / private mode / quota exceeded
    console.warn('Failed to save editor content', err);
  }
}

function loadEditor() {
  /* --------------------
   Editor bootstrap
-------------------- */
  const element = document.querySelector('#editor');

  if (!element) {
    throw new Error('Editor mount element (#editor) not found');
  }

  const editor = new Editor({
    element,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        codeBlock: true,
        blockquote: true,
        horizontalRule: true,
        strike: true,
        orderedList: true,
      }),
      Placeholder.configure({ placeholder: 'Whats on your mind...' }),
      Highlight,
      Typography,
      Journal,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    autofocus: 'end',

    injectCSS: false, // keep styling fully controlled by you

    editorProps: {
      attributes: {
        class: 'editor',
        spellcheck: 'true',
        autocorrect: 'off',
      },
    },
    onUpdate({ editor }) {
      saveTitle(editor);
      saveContent(editor);
    },
  });
  return editor;
}

window.addEventListener('load', async () => {
  await Database.init();
  const editor = loadEditor();
  loadMenu(editor);
  loadTopToolbar(editor);
  registerShortcuts(editor);
  loadContent(editor);
  if (import.meta.env?.DEV) {
    window.editor = editor;
  }
});
