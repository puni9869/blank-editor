import {
  closeSaveModal,
  openSaveModal,
  toggleFullScreen,
} from '@/lib/dropdown';
import { info } from '@/components/toast';
import { keyboardKeys } from '@/plugins/keyboard-keys';
import { showNotesModal } from '@/components/notes';

/**
 * Registers global keyboard shortcuts for editor actions.
 *
 * @param {object} editor
 * @returns {() => void} Cleanup function that removes key listeners.
 */
export function registerShortcuts(editor) {
  return keyboardKeys(document, {
    '$mod+s': event => {
      event.stopPropagation();
      event.preventDefault();
      openSaveModal(editor);
    },
    '$mod+/': async event => {
      event.stopPropagation();
      event.preventDefault();
      await showNotesModal(editor);
    },
    '$mod+shift+f': event => {
      event.stopPropagation();
      event.preventDefault();
      toggleFullScreen();
    },
    '$mod+shift+r': event => {
      event.stopPropagation();
      window.location.reload();
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
