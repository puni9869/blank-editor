const EDITOR_NAME = 'blank-editor';
export const EDITOR_VERSION = 'v1';
export const EDITOR_STORAGE_KEY = `${EDITOR_NAME}:${EDITOR_VERSION}`;
export const EDITOR_TITLE_KEY = `${EDITOR_NAME}:title`;
export const EDITOR_NOTES_ID_KEY = `${EDITOR_NAME}:id`;

export const EDITOR_DB_NAME = EDITOR_NAME;
export const EDITOR_DB_VERSION = 1;



export const VALID_BUILD_TYPES = new Set(['local', 'prod', 'beta']);
export const LOCALHOST_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);
export const DEFAULT_DEMO_URL = 'https://puni9869.github.io/blank-editor/';