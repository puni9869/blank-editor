import { Database } from '../db/database';

export class Notes {
  /**
   * Get object store in given mode
   * @private
   */
  static _store(mode = 'readonly') {
    const db = Database.getDb();

    if (!db) {
      throw new Error('Database not initialized. Call Database.open() first.');
    }

    const tx = db.transaction('notes', mode);
    return tx.objectStore('notes');
  }

  /**
   * Create a new note
   * @param {Object} note
   * @returns {Promise<number>} inserted id
   */
  static add(note) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.add(note);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update an existing note
   * @param {Object} note
   */
  static update(note) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.put(note);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get note by id
   * @param {number} id
   */
  static get(id) {
    return new Promise((resolve, reject) => {
      const store = this._store('readonly');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all notes
   */
  static getAll() {
    return new Promise((resolve, reject) => {
      const store = this._store('readonly');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Delete note by id
   * @param {number} id
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}
