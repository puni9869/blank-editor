import { error } from '../lib/toast.js';
import { EDITOR_DB_NAME, EDITOR_DB_VERSION } from '../config/config.js';

const schemas = {
  notes: {
    keyPath: 'id',
    autoIncrement: true,
  },
};

export class Database {
  /** @type {IDBDatabase|null} */
  static db = null;

  static get version() {
    return EDITOR_DB_VERSION;
  }

  static get dbName() {
    return EDITOR_DB_NAME;
  }

  static init() {
    const indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;

    if (!indexedDB) {
      error('Failed to initialize storage');
      return Promise.reject(new Error('IndexedDB not supported'));
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(Database.dbName, Database.version);

      request.onupgradeneeded = event => {
        const db = event.target.result;
        Object.keys(schemas).forEach(schema => {
          if (!db.objectStoreNames.contains(schema)) {
            db.createObjectStore(schema, schemas[schema]);
          }
        });
      };

      request.onsuccess = event => {
        this.db = event.target.result;

        this.db.onversionchange = () => {
          this.db?.close();
          this.db = null;
        };

        resolve(this.db);
      };

      request.onblocked = () => reject(new Error('Database upgrade blocked'));
      request.onerror = () =>
        reject(request.error || new Error('Failed to open database'));
    });
  }

  static getDb() {
    return this.db;
  }
}
