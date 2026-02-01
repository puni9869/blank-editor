import { openSaveModal } from './dropdown.js';

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
  event.stopPropagation();  // Prevent event bubbling
  event.preventDefault();   // Optional: prevent default behavior (like scrolling)
  const isCtrlOrCmd = event.ctrlKey || event.metaKey;
  if (isCtrlOrCmd && (event.key === 's' || event.key === 'S')) {
    openSaveModal(editor);
  }
}


export function registerKey(editor) {
  // Throttle to 300ms
  const throttledHandler = throttle(handleKey, 20);
  document.addEventListener('keydown', (e) => throttledHandler(e, editor), false);
}

