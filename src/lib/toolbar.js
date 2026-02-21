const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify']);

function runAction(editor, cmd) {
  const map = {
    bold: () => editor.commands.toggleBold(),
    strike: () => editor.commands.toggleStrike(),
    underline: () => editor.commands.toggleUnderline(),
    italic: () => editor.commands.toggleItalic(),
    bullet: () => editor.commands.toggleBulletList(),
    quote: () => editor.commands.toggleBlockquote(),
    codeblock: () => editor.commands.toggleCodeBlock(),
    divider: () => editor.commands.setHorizontalRule(),
    ordered: () => editor.commands.toggleOrderedList(),
    highlight: () => editor.commands.toggleHighlight(),
    journal: () => editor.commands.setJournal(),
  };
  map[cmd]?.();
}

function setHeading(editor, value) {
  if (value === 'paragraph') {
    editor.chain().focus().setParagraph().run();
    return;
  }

  const level = Number.parseInt(value, 10);
  if (!Number.isInteger(level) || level < 1 || level > 5) {
    return;
  }

  editor.chain().focus().setHeading({ level }).run();
}

function setContentDirection(editor, value) {
  if (!ALIGNMENTS.has(value)) {
    return;
  }
  editor.chain().focus().setTextAlign(value).run();
}

function syncToolbarSelects(editor, headingMenu, directionMenu) {
  if (headingMenu) {
    let activeHeading = 'paragraph';
    for (let level = 1; level <= 5; level += 1) {
      if (editor.isActive('heading', { level })) {
        activeHeading = String(level);
        break;
      }
    }
    headingMenu.value = activeHeading;
  }

  if (directionMenu) {
    const paragraphAlign = editor.getAttributes('paragraph')?.textAlign;
    const headingAlign = editor.getAttributes('heading')?.textAlign;
    const activeAlign = [paragraphAlign, headingAlign].find(value =>
      ALIGNMENTS.has(value),
    );

    directionMenu.value = activeAlign || 'left';
  }
}

export function loadTopToolbar(editor) {
  const toolbar = document.getElementById('top-toolbar');
  if (!toolbar) return;

  const headingMenu = document.getElementById('heading-menu');
  const directionMenu = document.getElementById('content-direction-menu');

  toolbar.addEventListener('click', e => {
    const btn = e.target.closest('button[data-cmd]');
    if (!btn) return;
    editor.commands.focus();
    runAction(editor, btn.dataset.cmd);
  });

  headingMenu?.addEventListener('change', e => {
    setHeading(editor, e.target.value);
  });

  directionMenu?.addEventListener('change', e => {
    setContentDirection(editor, e.target.value);
  });

  const sync = () => syncToolbarSelects(editor, headingMenu, directionMenu);
  sync();
  editor.on('selectionUpdate', sync);
  editor.on('update', sync);
}
