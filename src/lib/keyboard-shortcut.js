import {closeSaveModal, openSaveModal} from './dropdown.js';
import {info} from "./toast.js";

function throttle(fn, limit) {
	let lastCall = 0;
	return function (...args) {
		const now = Date.now();
		if (now - lastCall >= limit) {
			lastCall = now;
			fn.apply(this, args);
		}
	};
}

function handleKey(event, editor) {
	// Optional: prevent default behavior (like scrolling)
	const isCtrlOrCmdNotShift =
		event.ctrlKey || (event.metaKey && !event.shiftKey);

	const isCtrlOrCmdWithShift =
		(event.ctrlKey || event.metaKey) && event.shiftKey;

	if (isCtrlOrCmdNotShift && (event.key === 's' || event.key === 'S')) {
		event.stopPropagation(); // Prevent event bubbling
		event.preventDefault();
		openSaveModal(editor);
	} else if (isCtrlOrCmdWithShift && (event.key === 'o' || event.key === 'O')) {
		event.stopPropagation();
		event.preventDefault();
		// Check if there's content before creating new file
		const hasContent = editor?.getText()?.trim().length > 0;
		if (hasContent) {
			// Prompt to save first
			openSaveModal(editor);
		} else {
			// No content, just clear and focus
			info("New page created");
			editor?.commands?.clearContent();
			editor?.commands?.focus();
		}
	} else if (event.key === 'Escape') {
		event.preventDefault();
		closeSaveModal();
		editor.commands.focus();
	} else if (isCtrlOrCmdWithShift && (event.key === 'r' || event.key === 'R')) {
		event.stopPropagation();
		event.preventDefault();
	}
}

export function registerKey(editor) {
	// Throttle to 0ms
	const throttledHandler = throttle(handleKey, 0);
	document.addEventListener('keydown', e => throttledHandler(e, editor), false);
}
