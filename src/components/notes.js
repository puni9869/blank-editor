import { Notes } from '@/db/notes';
import { Note } from '@/types/note';
import { saveNoteId, getNoteId, clearNoteId } from '@/lib/editor-notes-id';
import { saveTitle } from '@/lib/editor-title';

/**
 * Notes picker modal that supports searching and selecting saved notes.
 */
class NotesModal {
  /**
   * @param {{ getNotes: () => Promise<Array<object>>, onSelect: (note: object) => Promise<void> }} options
   */
  constructor({ getNotes, onSelect }) {
    this.getNotes = getNotes;
    this.onSelect = onSelect;
    this.notes = [];
    this.filtered = [];
    this.mounted = false;

    this.root = document.createElement('div');
    this.root.className = 'modal-backdrop';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    this.root.setAttribute('aria-labelledby', 'notes-title');

    this.root.innerHTML = `
      <div class="modal notes-modal">
        <h2 id="notes-title">All notes</h2>

        <label for="notes-search">
          Search
          <input id="notes-search" type="text" placeholder="Search notes..." autocomplete="off" />
        </label>

        <div id="notes-list" class="notes-list"></div>

        <div class="modal-actions">
          <button id="close-notes-modal-btn" type="button" class="btn ghost">Close</button>
        </div>
      </div>
    `;

    this.searchInput = this.root.querySelector('#notes-search');
    this.listEl = this.root.querySelector('#notes-list');
    this.closeBtn = this.root.querySelector('#close-notes-modal-btn');

    // keep references so removeEventListener works
    this.onClose = () => this.unmount();

    this.onBackdrop = e => {
      if (e.target === this.root) this.close();
    };

    this.onSearch = e => this.renderList(e.target.value);

    this.onListClick = async e => {
      const row = e.target.closest('[data-note-id]');
      if (!row) return;
      const id = row.dataset.noteId;
      const note = this.notes.find(n => String(n.id) === id);
      if (!note) return;
      await this.onSelect?.(note);
      this.unmount();
    };
  }

  mount(parent = document.body) {
    if (this.mounted) return;
    parent.appendChild(this.root);

    this.closeBtn.addEventListener('click', this.onClose);
    this.root.addEventListener('click', this.onBackdrop);
    this.searchInput.addEventListener('input', this.onSearch);
    this.listEl.addEventListener('click', this.onListClick);

    this.mounted = true;
    document
      .getElementById('destroy-notes-modal-btn')
      ?.addEventListener('click', () => {
        this.unmount();
      });
  }

  unmount() {
    if (!this.mounted) return;

    this.closeBtn.removeEventListener('click', this.onClose);
    this.root.removeEventListener('click', this.onBackdrop);
    this.searchInput.removeEventListener('input', this.onSearch);
    this.listEl.removeEventListener('click', this.onListClick);

    this.root.remove();
    this.notes = [];
    this.filtered = [];
    this.mounted = false;
  }

  async open() {
    this.notes = await this.getNotes();
    this.notes.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    this.searchInput.value = '';
    this.renderList('');
    this.root.classList.add('modal-backdrop-show');
    this.searchInput.focus();
  }

  close() {
    this.root.classList.remove('modal-backdrop-show');
  }

  renderList(query) {
    const q = query.trim().toLowerCase();
    this.filtered = this.notes.filter(n => {
      const title = (n.title || '').toLowerCase();
      return !q || title.includes(q);
    });

    if (!this.filtered.length) {
      this.listEl.innerHTML = `<div class="notes-empty">No notes found</div>`;
      return;
    }

    this.listEl.innerHTML = this.filtered
      .map(n => {
        const title = escapeHtml(n.title || 'Untitled');
        const date = new Date(n.updatedAt || Date.now()).toLocaleDateString();
        return `
          <button type="button" class="note-row" data-note-id="${n.id}">
            <span class="note-title">${title}</span>
            <span class="note-date">${date}</span>
          </button>
        `;
      })
      .join('');
  }
}

/**
 * Escapes unsafe HTML characters before rendering note titles.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    m =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[m],
  );
}

/**
 * Checks whether the editor has meaningful content to persist.
 *
 * @param {object} editor
 * @param {string} [title]
 * @returns {boolean}
 */
function hasEditorContent(editor, title = '') {
  if (!editor) return false;
  const text = editor.getText(false)?.trim();
  return Boolean(text) || Boolean(title.trim());
}

/**
 * Persists the current note, creating or updating based on existing note id.
 *
 * @param {object} editor
 * @param {string} [title]
 * @returns {Promise<number|string|null>}
 */
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

/**
 * Opens a modal listing all saved notes and loads the selected note into editor.
 *
 * @param {object} editor
 * @returns {Promise<void>}
 */
const showNotesModal = async editor => {
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
};

export { NotesModal, showNotesModal, persistCurrentNote };
