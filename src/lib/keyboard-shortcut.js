import { closeSaveModal, openSaveModal } from './dropdown';
import { info } from './toast';
import { keyboardKeys } from './keyboard-keys';

export function registerShortcuts(editor) {
  return keyboardKeys(document, {
    '$mod+s': event => {
      event.stopPropagation();
      event.preventDefault();
      openSaveModal(editor);
    },
    '$mod+shift+o': event => {
      event.stopPropagation();
      event.preventDefault();
      const hasContent = editor?.getText()?.trim().length > 0;
      if (hasContent) {
        openSaveModal(editor);
      } else {
        info('New page created');
        editor?.commands?.clearContent();
        editor?.commands?.focus();
      }
    },
    escape: event => {
      event.preventDefault();
      closeSaveModal();
      editor?.commands?.focus();
    },
  });
}
