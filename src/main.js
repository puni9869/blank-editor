import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import { loadMenu } from './dropdown';
import { loadTopToolbar } from './toolbar.js';
import { registerKey } from './keyboard_shortcut.js';

const STORAGE_KEY = 'blank-editor:v1';

/* --------------------
   Storage helpers
-------------------- */
function loadContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Failed to load editor content', err);
    return null;
  }
}

function saveContent(editor) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(editor.getJSON()));
  } catch (err) {
    // storage full / private mode / quota exceeded
    console.warn('Failed to save editor content', err);
  }
}

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
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],

  content: loadContent(),

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
    saveContent(editor);
  },
});
editor.on('update', () => {
  saveContent(editor);
});

const saved = localStorage.getItem('blank-content');
if (saved) editor.commands.setContent(saved);

/* --------------------
   Optional: expose for debugging
-------------------- */
if (import.meta.env?.DEV) {
  window.editor = editor;
}
window.addEventListener('load', () => {
  loadMenu(editor);
  loadTopToolbar(editor);
  registerKey(editor);
});
