function actions(editor, cmd) {
  const map = {
    bold: () => editor.commands.toggleBold(),
    strike: () => editor.commands.toggleStrike(),
    underline: () => editor.commands.toggleUnderline(),
    italic: () => editor.commands.toggleItalic(),
    'heading-1': () => editor.commands.toggleHeading({ level: 2 }),
    'heading-2': () => editor.commands.toggleHeading({ level: 3 }),
    bullet: () => editor.commands.toggleBulletList(),
    quote: () => editor.commands.toggleBlockquote(),
    codeblock: () => editor.commands.toggleCodeBlock(),
    divider: () => editor.commands.setHorizontalRule(),
    ordered: () => editor.commands.toggleOrderedList(),
    'align-left': () => editor.commands.setTextAlign('left'),
    'align-center': () => editor.commands.setTextAlign('center'),
    'align-right': () => editor.commands.setTextAlign('right'),
    'align-justify': () => editor.commands.setTextAlign('justify'),
    highlight: () => editor.commands.toggleHighlight(),
    journal: () => editor.commands.setJournal(),
  };
  map[cmd]?.();
}

export function loadTopToolbar(editor) {
  const toolbar = document.getElementById('top-toolbar');
  if (!toolbar) return;

  toolbar.addEventListener('click', e => {
    const btn = e.target.closest('button[data-cmd]');
    if (!btn) return;
    const cmd = btn.dataset.cmd;
    editor.commands.focus();
    actions(editor, cmd);
  });
}
