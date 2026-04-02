import { openDB } from "idb";

const DB_NAME = "download-manager";
const STORE_NAME = "chunks";

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
};

export const saveChunk = async (key: string, chunk: Blob) => {
  const db = await initDB();
  await db.put(STORE_NAME, chunk, key);
};

export const getChunk = async (key: string): Promise<Blob | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, key);
};

export const deleteChunk = async (key: string) => {
  const db = await initDB();
  return db.delete(STORE_NAME, key);
};


export const listChunkKeys = async (fileId: number): Promise<string[]> => {
  const db = await initDB();
  const allKeys = await db.getAllKeys(STORE_NAME) as string[];
  return allKeys.filter(k => typeof k === "string" && k.startsWith(`${fileId}-`));
};



// ✅ Properly typed metadata instead of loose `object`
export interface DownloadMetadata {
  totalSize: number;
  totalChunks: number;
  fileName: string;
}

// In downloadDB.ts
export const saveMetadata = async (fileId: number, meta: DownloadMetadata) => {
  const db = await initDB();
  await db.put(STORE_NAME, meta, `${fileId}-meta`);
};


export const getMetadata = async (fileId: number): Promise<DownloadMetadata | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, `${fileId}-meta`);
};

export const deleteMetadata = async (fileId: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, `${fileId}-meta`);
};


//to show the paused message 
export const savePaused = async (fileId: number, progress: number) => {
  const db = await initDB();
  await db.put(STORE_NAME, { paused: true, progress }, `${fileId}-paused`);
};

export const getPaused = async (fileId: number): Promise<{ paused: boolean; progress: number } | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, `${fileId}-paused`);
};

export const deletePaused = async (fileId: number) => {
  const db = await initDB();
  await db.delete(STORE_NAME, `${fileId}-paused`);
};