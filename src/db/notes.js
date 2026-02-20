import { Database } from './database';

export class Notes {
  static NAME = 'notes';

  static _store(mode = 'readonly') {
    const db = Database.getDb();

    if (!db) {
      throw new Error('Database not initialized. Call Database.init() first.');
    }

    const tx = db.transaction(this.NAME, mode);
    return tx.objectStore(this.NAME);
  }

  static add(note) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.add(note);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static update(note) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.put(note);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static get(id) {
    return new Promise((resolve, reject) => {
      const store = this._store('readonly');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      const store = this._store('readonly');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const store = this._store('readwrite');
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}
