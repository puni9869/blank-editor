const isMac =
  typeof navigator !== 'undefined' &&
  /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);

function normalizeKey(key) {
  const k = String(key || '').toLowerCase();
  if (k === 'esc') return 'escape';
  if (k === ' ') return 'space';
  return k;
}

function parseShortcut(shortcut) {
  const parts = String(shortcut)
    .toLowerCase()
    .split('+')
    .map(part => part.trim())
    .filter(Boolean);

  const parsed = {
    key: '',
    ctrl: false,
    meta: false,
    alt: false,
    shift: false,
    mod: false,
  };

  parts.forEach(part => {
    if (part === 'ctrl' || part === 'control') parsed.ctrl = true;
    else if (part === 'cmd' || part === 'meta') parsed.meta = true;
    else if (part === 'alt' || part === 'option') parsed.alt = true;
    else if (part === 'shift') parsed.shift = true;
    else if (part === 'mod' || part === '$mod') parsed.mod = true;
    else parsed.key = normalizeKey(part);
  });

  return parsed;
}

function matchesShortcut(event, shortcut) {
  if (event.isComposing || event.repeat) return false;

  const pressedKey = normalizeKey(event.key);
  const needsMod = shortcut.mod;
  const modPressed = isMac ? event.metaKey : event.ctrlKey;

  if (needsMod && !modPressed) return false;
  if (!needsMod && event.metaKey !== shortcut.meta) return false;
  if (!needsMod && event.ctrlKey !== shortcut.ctrl) return false;
  if (event.altKey !== shortcut.alt) return false;
  if (event.shiftKey !== shortcut.shift) return false;

  return pressedKey === shortcut.key;
}

export function keyboardKeys(target, keymap) {
  const bindings = Object.entries(keymap).map(([shortcut, handler]) => ({
    shortcut: parseShortcut(shortcut),
    handler,
  }));

  const listener = event => {
    for (const binding of bindings) {
      if (matchesShortcut(event, binding.shortcut)) {
        binding.handler(event);
        if (event.defaultPrevented) {
          return;
        }
      }
    }
  };

  target.addEventListener('keydown', listener, false);
  return () => target.removeEventListener('keydown', listener, false);
}
