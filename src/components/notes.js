export class NotesModal {
  constructor({ getNotes, onSelect }) {
    this.getNotes = getNotes;
    this.onSelect = onSelect;
    this.notes = [];
    this.filtered = [];
    this._mounted = false;

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
    this._onClose = () => this.unmount();

    this._onBackdrop = e => {
      if (e.target === this.root) this.close();
    };

    this._onSearch = e => this.renderList(e.target.value);

    this._onListClick = async e => {
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
    if (this._mounted) return;
    parent.appendChild(this.root);

    this.closeBtn.addEventListener('click', this._onClose);
    this.root.addEventListener('click', this._onBackdrop);
    this.searchInput.addEventListener('input', this._onSearch);
    this.listEl.addEventListener('click', this._onListClick);

    this._mounted = true;
    document
      .getElementById('destroy-notes-modal-btn')
      ?.addEventListener('click', () => {
        this.unmount();
      });
  }

  unmount() {
    if (!this._mounted) return;

    this.closeBtn.removeEventListener('click', this._onClose);
    this.root.removeEventListener('click', this._onBackdrop);
    this.searchInput.removeEventListener('input', this._onSearch);
    this.listEl.removeEventListener('click', this._onListClick);

    this.root.remove();
    this.notes = [];
    this.filtered = [];
    this._mounted = false;
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
