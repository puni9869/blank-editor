import {error} from "../lib/toast.js";
import {EDITOR_DB_NAME, EDITOR_DB_VERSION} from "../config/config.js";

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
			window?.mozIndexedDB ||
			window?.webkitIndexedDB ||
			window?.msIndexedDB;

		if (!indexedDB) {
			error("Failed to initialize storage");
			return Promise.reject("IndexedDB not supported");
		}

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(Database.dbName, Database.version);

			request.onupgradeneeded = (event) => {
				const db = event.target.result;

				if (!db.objectStoreNames.contains("notes")) {
					db.createObjectStore("notes", {
						keyPath: "id",
						autoIncrement: true,
					});
				}
			};

			request.onsuccess = (event) => {
				Database.db = event.target.result;
				resolve(Database.db);
			};

			request.onerror = () => reject(request.error);
		});
	}

	static getDb() {
		return Database.db;
	}
}
