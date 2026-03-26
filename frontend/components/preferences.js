import { Preferences } from '@/types/preferences';

export class PreferencesModal {
  constructor({ preferences, onSave }) {
    this.mounted = false;
    this.onSave = typeof onSave === 'function' ? onSave : () => {};
    this.preferences = Preferences.from(preferences).toJSON();
    this.root = document.createElement('div');
    this.root.className = 'modal-backdrop';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    this.root.setAttribute('aria-labelledby', 'preferences-title');

    this.root.innerHTML = `
      <div class="modal about-modal preferences-modal">
        <h2 id="preferences-title">Preferences</h2>
        <dl class="about-grid preferences-grid">
          <div class="about-row">
            <dt>Auto-hide title</dt>
            <dd><input id="pref-auto-hide-title" type="checkbox" ${this.preferences.autoHideTitle ? 'checked' : ''}></dd>
          </div>
          <div class="about-row">
            <dt>Auto-hide menu</dt>
            <dd><input id="pref-auto-hide-right-menu" type="checkbox" ${this.preferences.autoHideRightMenu ? 'checked' : ''}></dd>
          </div>
          <div class="about-row">
            <dt>Auto-hide formatting toolbar</dt>
            <dd><input id="pref-auto-hide-toolbar" type="checkbox" ${this.preferences.autoHideEditorFormattingTool ? 'checked' : ''}></dd>
          </div>
          <div class="about-row">
            <dt>Enable spell check</dt>
            <dd><input id="pref-spellcheck-enabled" type="checkbox" ${this.preferences.spellcheckEnabled ? 'checked' : ''}></dd>
          </div>
        </dl>

        <div class="modal-actions">
          <button id="close-preferences-modal-btn" type="button" class="btn ghost">Cancel</button>
          <button id="save-preferences-modal-btn" type="button" class="btn primary">Save</button>
        </div>
      </div>
    `;

    this.closeBtn = this.root.querySelector('#close-preferences-modal-btn');
    this.saveBtn = this.root.querySelector('#save-preferences-modal-btn');
    this.onClose = () => this.unmount();
    this.onConfirm = () => {
      this.onSave({
        autoHideTitle: Boolean(
          this.root.querySelector('#pref-auto-hide-title')?.checked,
        ),
        autoHideRightMenu: Boolean(
          this.root.querySelector('#pref-auto-hide-right-menu')?.checked,
        ),
        autoHideEditorFormattingTool: Boolean(
          this.root.querySelector('#pref-auto-hide-toolbar')?.checked,
        ),
        spellcheckEnabled: Boolean(
          this.root.querySelector('#pref-spellcheck-enabled')?.checked,
        ),
      });
      this.unmount();
    };
    this.onBackdrop = event => {
      if (event.target === this.root) {
        this.unmount();
      }
    };
    this.onKeydown = event => {
      if (event.key === 'Escape') {
        this.unmount();
      }
    };
  }

  mount(parent = document.body) {
    if (this.mounted) {
      return;
    }

    parent.appendChild(this.root);
    this.closeBtn.addEventListener('click', this.onClose);
    this.saveBtn.addEventListener('click', this.onConfirm);
    this.root.addEventListener('click', this.onBackdrop);
    document.addEventListener('keydown', this.onKeydown);
    this.mounted = true;
  }

  open() {
    if (!this.mounted) {
      return;
    }

    this.root.classList.add('modal-backdrop-show');
    this.saveBtn.focus();
  }

  unmount() {
    if (!this.mounted) {
      return;
    }

    this.closeBtn.removeEventListener('click', this.onClose);
    this.saveBtn.removeEventListener('click', this.onConfirm);
    this.root.removeEventListener('click', this.onBackdrop);
    document.removeEventListener('keydown', this.onKeydown);
    this.root.remove();
    this.mounted = false;
  }
}
