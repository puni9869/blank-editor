/* ============================
   Menu + Save Modal Controller
   ============================ */

let lastFocusedElement = null;
let focusableElements = [];
let firstFocusable = null;
let lastFocusable = null;

/* ----------------------------
   Utilities
---------------------------- */

function getFocusableElements(container) {
  return [
    ...container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ];
}

function isSaveModalOpen() {
  const modal = document.getElementById('saveModal');
  return modal && !modal.hidden;
}

/* ----------------------------
   Core Actions
---------------------------- */

async function doAction(editor, e) {
  if (!editor || !e?.target?.id) return;

  const action = e.target.id;

  switch (action) {
    case 'new':
    case 'clear': {
      editor.commands.clearContent();
      editor.commands.focus();
      break;
    }

    case 'copy': {
      editor.commands.focus();
      await navigator.clipboard.writeText(editor.getText());
      break;
    }

    case 'save': {
      openSaveModal();
      break;
    }

    default:
      break;
  }
}

/* ----------------------------
   Save Modal
---------------------------- */

export function openSaveModal() {
  const modal = document.getElementById('saveModal');
  if (!modal || !modal.hidden) return;

  lastFocusedElement = document.activeElement;
  modal.hidden = false;

  const dialog = modal.querySelector('.modal');
  const input = document.getElementById('fileName');

  focusableElements = getFocusableElements(dialog);
  firstFocusable = focusableElements[0];
  lastFocusable = focusableElements[focusableElements.length - 1];

  input?.focus();
}

export function closeSaveModal() {
  const modal = document.getElementById('saveModal');
  if (!modal) return;

  modal.hidden = true;
  lastFocusedElement?.focus?.();
}

export function saveFile() {
  const name =
    document.getElementById('fileName')?.value || 'Untitled';
  const format =
    document.getElementById('fileFormat')?.value || 'txt';

  console.log('Saving:', name, format);

  closeSaveModal();
}

/* ----------------------------
   Menu Wiring
---------------------------- */

export function loadMenu(editor) {
  window.addEventListener('load', () => {
    const moreMenu = document.getElementById('moreMenu');
    if (moreMenu) moreMenu.hidden = false;
  });

  const btn = document.querySelector('.dots-btn');
  const menu = document.querySelector('.dropdown-menu');

  if (!btn || !menu) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
  })

  ;['copy', 'clear', 'new', 'save'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('click', async e => {
      menu.hidden = true;
      await doAction(editor, e);
    });
  });

  document.addEventListener('click', () => {
    menu.hidden = true;
  });
}

/* ----------------------------
   Keyboard Shortcuts
---------------------------- */
export function registerKeyAction() {
  document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const saveKey = isMac ? e.metaKey : e.ctrlKey;

    /* ⌘S / Ctrl+S */
    if (saveKey && e.key.toLowerCase() === 's') {
      e.preventDefault();

      if (isSaveModalOpen()) {
        saveFile();
      } else {
        openSaveModal();
      }
    }

    /* Escape → close modal */
    if (e.key === 'Escape' && isSaveModalOpen()) {
      e.preventDefault();
      closeSaveModal();
    }

    /* Focus trap (Tab) */
    if (e.key === 'Tab' && isSaveModalOpen()) {
      if (!focusableElements.length) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }

    /* Enter → confirm save (optional but premium) */
    if (e.key === 'Enter' && isSaveModalOpen()) {
      const tag = document.activeElement.tagName;
      if (tag !== 'TEXTAREA') {
        e.preventDefault();
        saveFile();
      }
    }
  });
}


