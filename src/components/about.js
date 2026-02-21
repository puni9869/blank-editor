function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char],
  );
}

function toSafeExternalUrl(value) {
  if (!value) {
    return '';
  }

  const raw = String(value).trim();
  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(normalized);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '';
    }
    return url.toString();
  } catch {
    return '';
  }
}

function renderValue(value) {
  return escapeHtml(value || 'N/A');
}

export class AboutModal {
  constructor({
    supportJsBuildVersion,
    buildType,
    githubUrl,
    licenseType,
    demoUrl,
  }) {
    const safeGithubUrl = toSafeExternalUrl(githubUrl);
    const safeDemoUrl = toSafeExternalUrl(demoUrl);
    const githubCell = safeGithubUrl
      ? `<a class="about-link" href="${escapeHtml(safeGithubUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(safeGithubUrl)}</a>`
      : '<span class="about-empty">N/A</span>';
    const demoRow = safeDemoUrl
      ? `
          <div class="about-row">
            <dt>Demo</dt>
            <dd><a class="about-link" href="${escapeHtml(safeDemoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(safeDemoUrl)}</a></dd>
          </div>
        `
      : '';

    this.mounted = false;
    this.root = document.createElement('div');
    this.root.className = 'modal-backdrop';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');
    this.root.setAttribute('aria-labelledby', 'about-title');

    this.root.innerHTML = `
      <div class="modal about-modal">
        <h2 id="about-title">Blank Editor</h2>
        <dl class="about-grid">
          <div class="about-row">
            <dt>Support JS build version</dt>
            <dd>${renderValue(supportJsBuildVersion)}</dd>
          </div>
          <div class="about-row">
            <dt>Build type</dt>
            <dd>${renderValue(buildType)}</dd>
          </div>
          <div class="about-row">
            <dt>License type</dt>
            <dd>${renderValue(licenseType)}</dd>
          </div>
          <div class="about-row">
            <dt>GitHub</dt>
            <dd>${githubCell}</dd>
          </div>
          ${demoRow}
        </dl>

        <div class="modal-actions">
          <button id="close-about-modal-btn" type="button" class="btn ghost">Close</button>
        </div>
      </div>
    `;

    this.closeBtn = this.root.querySelector('#close-about-modal-btn');
    this.onClose = () => this.unmount();
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
    this.root.addEventListener('click', this.onBackdrop);
    document.addEventListener('keydown', this.onKeydown);
    this.mounted = true;
  }

  open() {
    if (!this.mounted) {
      return;
    }

    this.root.classList.add('modal-backdrop-show');
    this.closeBtn.focus();
  }

  unmount() {
    if (!this.mounted) {
      return;
    }

    this.closeBtn.removeEventListener('click', this.onClose);
    this.root.removeEventListener('click', this.onBackdrop);
    document.removeEventListener('keydown', this.onKeydown);
    this.root.remove();
    this.mounted = false;
  }
}
