async function doAction(editor, t) {
  if (!editor) {
    return;
  }
  switch (t?.target?.id) {
    case 'new' :
    case 'clear':
      editor?.commands?.clearContent();
      editor?.commands?.focus();
      break;
    case 'copy':
      editor.commands.focus();
      await navigator.clipboard.writeText(editor?.getText());
      break;
  }
}

export function loadMenu(editor) {
  window.addEventListener('load', () => {
    document.getElementById('moreMenu').hidden = false;
  });

  const btn = document.querySelector('.dots-btn');
  const menu = document.querySelector('.dropdown-menu');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  });

  ['copy', 'clear', 'new'].forEach(action => {
    const elm = document.querySelector(`#${action}`);
    elm.addEventListener('click', async (e) => await doAction(editor, e));
  });

  document.addEventListener('click', () => menu.style.display = 'none');
}