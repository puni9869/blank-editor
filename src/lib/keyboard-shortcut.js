import { closeSaveModal, openSaveModal } from './dropdown.js';

function throttle(fn, limit) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

function handleKey(event, editor) {
  // Optional: prevent default behavior (like scrolling)
  const isCtrlOrCmd = event.ctrlKey || event.metaKey && !event.shiftKey;
  if (isCtrlOrCmd && (event.key === 's' || event.key === 'S')) {
    event.stopPropagation();  // Prevent event bubbling
    event.preventDefault();
    openSaveModal(editor);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    closeSaveModal();
    editor.commands.focus();
  }
}


export function registerKey(editor) {
  // Throttle to 300ms
  const throttledHandler = throttle(handleKey, 0);
  document.addEventListener('keydown', (e) => throttledHandler(e, editor), false);
}

