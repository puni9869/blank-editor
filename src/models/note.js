import {EDITOR_DB_VERSION} from '../config/config';

/**
 * Represents a single editor note.
 *
 * Used as the core data model for storing and managing note content.
 * Designed to be serializable (IndexedDB / localStorage safe).
 */
export class Note {

	/**
	 * Create a new Note
	 *
	 * @param {Object} [options]
	 * @param {string|null} [options.content=null] - Note content (HTML/JSON/Text)
	 * @param {string[]} [options.tags=['default']] - Tags assigned to note
	 * @param {string[]} [options.workspace=['default']] - Workspace identifiers
	 */
	constructor({
		            content = null,
		            tags = ['default'],
		            workspace = ['default']
	            } = {}) {

		/** @type {number} Application version that created the note */
		this.version = EDITOR_DB_VERSION;

		/** @type {string|null} Main note content */
		this.content = content;

		/** @type {number} Unix timestamp (ms) when created */
		this.createdAt = Date.now();

		/** @type {number} Unix timestamp (ms) when last updated */
		this.updatedAt = Date.now();

		/** @type {number} Unix timestamp (ms) when deleted (0 = active) */
		this.deletedAt = 0;

		/** @type {string[]} List of tags */
		this.tags = tags;

		/** @type {string[]} Workspace identifiers */
		this.workspace = workspace;
	}

	/**
	 * Update the note content.
	 * Automatically refreshes the updatedAt timestamp.
	 *
	 * @param {string|null} newContent
	 */
	updateContent(newContent) {
		this.content = newContent;
		this.updatedAt = Date.now();
	}

	/**
	 * Soft delete the note.
	 * Sets deletedAt timestamp instead of removing it.
	 */
	delete() {
		this.deletedAt = Date.now();
	}

	/**
	 * Restore a soft-deleted note.
	 */
	restore() {
		this.deletedAt = 0;
		this.updatedAt = Date.now();
	}

	/**
	 * Convert note instance to a plain object.
	 * Useful for IndexedDB or JSON serialization.
	 *
	 * @returns {Object}
	 */
	toJSON() {
		return {
			appVersion: this.appVersion,
			content: this.content,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			deletedAt: this.deletedAt,
			tags: this.tags,
			workspace: this.workspace
		};
	}

	/**
	 * Recreate a Note instance from stored data.
	 *
	 * @param {Object} data
	 * @returns {Note}
	 */
	static from(data) {
		const note = new Note({
			content: data.content,
			tags: data.tags,
			workspace: data.workspace
		});

		note.appVersion = data.appVersion;
		note.createdAt = data.createdAt;
		note.updatedAt = data.updatedAt;
		note.deletedAt = data.deletedAt;

		return note;
	}
}
