async function doAction(editor, t) {
  if (!editor) {
    return;
  }
  const id = t?.target?.id;
  if (!id) {
    return;
  }

  if (id === 'new' || id === 'clear') {
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

function openSaveModal(editor) {
  const modal = document.getElementById('saveModal');
  const saveBtn = document.getElementById('save-file');
  const cancelBtn = document.getElementById('close-modal-btn');
  const fileName = document.getElementById('fileName');

  modal.classList.add('modal-backdrop-show');

  // prevent duplicate listeners
  saveBtn.onclick = () => saveFile(editor);
  cancelBtn.onclick = closeSaveModal;

  fileName.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFile(editor);
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      closeSaveModal();
    }
  };

  setTimeout(() => {
    fileName.focus();
    fileName.select();
  }, 0);
}

function saveFile(editor) {
  const fileNameEl = document.getElementById('fileName');
  const fileFormatEl = document.getElementById('fileFormat');

  if (!editor || !fileNameEl || !fileFormatEl) return;

  const name = fileNameEl.value || 'Untitled';
  const format = fileFormatEl.value || '.txt';

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


function closeSaveModal() {
  const modal = document.getElementById('saveModal');
  if (modal) modal.classList.remove('modal-backdrop-show');

  const fileName = document.getElementById('fileName');
  const fileFormat = document.getElementById('fileFormat');

  if (fileName) fileName.value = '';
  if (fileFormat) fileFormat.value = '.txt';
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
