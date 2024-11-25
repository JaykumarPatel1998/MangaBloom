import { openDB, DBSchema, IDBPDatabase } from "idb";
import { PersistedClient } from "@tanstack/react-query-persist-client";

// Define types for IndexedDB database structure
interface ReactQueryDB extends DBSchema {
  queries: {
    key: string; // The key will be the query key (string)
    value: PersistedClient; // Entire client state (queries and mutations)
  };
}

// Create IndexedDB database and stores data for queries
const createDatabase = async (): Promise<IDBPDatabase<ReactQueryDB>> => {
  const db = await openDB<ReactQueryDB>("react-query", 1, {
    upgrade(database) {
      if (!database.objectStoreNames.contains("queries")) {
        database.createObjectStore("queries");
      }
    },
  });
  return db;
};

// Persist data into IndexedDB
const saveToDatabase = async (client: PersistedClient): Promise<void> => {
  const db = await createDatabase();
  const tx = db.transaction("queries", "readwrite");
  const store = tx.objectStore("queries");
  await store.put(client, "react-query-client"); // Store the client with a fixed key
  await tx.done;
};

// Get data from IndexedDB
const loadFromIndexedDB = async (): Promise<PersistedClient | undefined> => {
  const db = await createDatabase();
  const tx = db.transaction("queries", "readonly");
  const store = tx.objectStore("queries");
  const client = await store.get("react-query-client"); // Retrieve the client state
  await tx.done;
  return client || undefined; // Ensure undefined is returned if no data is found
};

// Clear all queries from IndexedDB
const clearIndexedDB = async (): Promise<void> => {
  const db = await createDatabase();
  const tx = db.transaction("queries", "readwrite");
  const store = tx.objectStore("queries");
  await store.clear();
  await tx.done;
};

export const indexedDBPersister = {
  persistClient: saveToDatabase,
  restoreClient: loadFromIndexedDB,
  removeClient: clearIndexedDB,
};
