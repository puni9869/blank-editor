export class LinkModel {
  constructor(editor) {
    this.mounted = false;
    this.editor = editor;
    document.activeElement.blur();
    this.root = document.createElement('div');
    this.root.className = 'modal-backdrop';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    this.root.setAttribute('aria-labelledby', 'link-title');
    const title = this.selectedText() || '';
    const url = this.getSelectedLink() || '';

    this.root.innerHTML = `
      <div class="modal link-modal">
        <h2>Insert Link</h2>
        <label>
          Title
          <input id="link-title" type="text" placeholder="" value="${title}" ${!title ? 'autofocus' : ''}/>
        </label>
        <label>
          Link
          <input id="link-url" type="url" placeholder=""  value="${url}" ${!url ? 'autofocus' : ''} />
        </label>

        <div class="modal-actions">
          <button id="close-link-modal-btn" type="button" class="btn ghost">Close</button>
          <button id="set-link" type="button" class="btn primary">Link</button>
        </div>
      </div>
    `;

    this.onBackdrop = event => {
      if (event.target === this.root) this.unmount();
    };
    this.onInput = () => this.input();

    this.onKeydown = event => {
      if (event.key === 'Escape') this.unmount();
    };
    this.onClose = () => this.unmount();
  }

  input() {
    const titleInput = this.root.querySelector('#link-title');
    const urlInput = this.root.querySelector('#link-url');
    const title =
      typeof titleInput?.value === 'string' ? titleInput.value.trim() : '';
    const url =
      typeof urlInput?.value === 'string' ? urlInput.value.trim() : '';
    return { title, url };
  }

  selectedText() {
    const { from, to } = this.editor.state.selection;
    return this.editor.state.doc.textBetween(from, to, ' ');
  }

  getSelectedLink() {
    const { state } = this.editor;
    const { from, to } = state.selection;
    let href = null;
    state.doc.nodesBetween(from, to, node => {
      const linkMark = node.marks.find(mark => mark.type.name === 'link');
      if (linkMark) {
        href = linkMark.attrs.href;
      }
    });

    // If nothing selected, check cursor position
    if (!href) {
      const marks = state.storedMarks || state.doc.resolve(from).marks();

      const linkMark = marks.find(mark => mark.type.name === 'link');

      href = linkMark?.attrs.href || null;
    }

    return href;
  }

  setLink() {
    const { empty } = this.editor.state.selection;
    const { title, url } = this.input();
    if (!url) {
      this.editor.chain().focus().extendMarkRange('link').toggleLink().run();
      this.unmount();
      return;
    }

    if (empty) {
      this.editor
        .chain()
        .focus()
        .insertContent([
          {
            type: 'text',
            text: title || url,
            marks: [{ type: 'link', attrs: { href: url } }],
          },
          { type: 'text', text: ' ' },
        ])
        .run();
    } else {
      this.editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .toggleLink({ href: url })
        .run();
    }

    this.unmount();
  }

  mount(parent = document.body) {
    if (this.mounted) return;

    parent.appendChild(this.root);
    this.root.addEventListener('click', this.onBackdrop);
    document.addEventListener('keydown', this.onKeydown);

    this.root
      .querySelector('#link-title')
      .addEventListener('input', this.onInput);
    this.root
      .querySelector('#set-link')
      .addEventListener('click', this.setLink.bind(this));
    this.root
      .querySelector('#link-url')
      .addEventListener('input', this.onInput);
    this.root
      .querySelector('#close-link-modal-btn')
      .addEventListener('click', this.onClose);
    this.mounted = true;
    this.open();
  }

  open() {
    if (!this.mounted) return;
    this.root.classList.add('modal-backdrop-show');
    this.editor?.commands.blur();
  }

  unmount() {
    if (!this.mounted) return;
    this.root.removeEventListener('click', this.onBackdrop);
    document.removeEventListener('keydown', this.onKeydown);
    this.root.remove();
    this.mounted = false;
    this.editor?.commands.focus();
  }
}
