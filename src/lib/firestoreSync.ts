import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Sanitizes object by recursively stripping out undefined values that Firestore rejects
 */
function sanitizeForFirestore(val: any): any {
  if (val === undefined) return undefined;
  if (val === null) return null;
  if (Array.isArray(val)) {
    return val.map(sanitizeForFirestore).filter((v) => v !== undefined);
  }
  if (typeof val === 'object' && val.constructor === Object) {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      const sanitized = sanitizeForFirestore(v);
      if (sanitized !== undefined) {
        clean[k] = sanitized;
      }
    }
    return clean;
  }
  return val;
}

/**
 * Persists a document to Firestore with error safety
 */
export async function saveDocToFirestore<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const sanitizedData = sanitizeForFirestore(data) || {};
    await setDoc(docRef, sanitizedData, { merge: true });
    console.debug(`[Firestore] Saved ${collectionName}/${docId}`);
  } catch (error) {
    console.warn(`[Firestore] Error saving ${collectionName}/${docId}:`, error);
  }
}

/**
 * Removes a document from Firestore
 */
export async function deleteDocFromFirestore(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.debug(`[Firestore] Deleted ${collectionName}/${docId}`);
  } catch (error) {
    console.warn(`[Firestore] Error deleting ${collectionName}/${docId}:`, error);
  }
}

/**
 * Subscribes to real-time changes of a collection in Firestore
 */
export function subscribeToFirestoreCollection<T>(
  collectionName: string,
  onUpdate: (docs: T[]) => void
): () => void {
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data()
          })) as T[];
          onUpdate(items);
        } else {
          onUpdate([]);
        }
      },
      (error) => {
        console.warn(`[Firestore] Subscription warning on ${collectionName}:`, error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn(`[Firestore] Failed to subscribe to ${collectionName}:`, error);
    return () => {};
  }
}

/**
 * Seeds initial mock data to Firestore if the collection has not been populated yet
 */
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
): Promise<void> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && initialData.length > 0) {
      console.log(`[Firestore] Seeding ${initialData.length} items to ${collectionName}...`);
      const batch = writeBatch(db);
      for (const item of initialData) {
        const itemRef = doc(db, collectionName, item.id);
        const clean = sanitizeForFirestore(item) || {};
        batch.set(itemRef, clean);
      }
      await batch.commit();
      console.log(`[Firestore] Seeded ${collectionName} successfully.`);
    }
  } catch (error) {
    console.warn(`[Firestore] Seeding skipped/failed for ${collectionName}:`, error);
  }
}

/**
 * Completely wipes all documents in a Firestore collection (with optional exclusions).
 * Used for full production reset.
 */
export async function clearFirestoreCollection(
  collectionName: string,
  excludeIds: string[] = []
): Promise<number> {
  try {
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return 0;

    const batch = writeBatch(db);
    let count = 0;
    for (const d of snapshot.docs) {
      if (!excludeIds.includes(d.id)) {
        batch.delete(d.ref);
        count++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`[Firestore] Cleared ${count} documents from ${collectionName}`);
    }
    return count;
  } catch (error) {
    console.warn(`[Firestore] Error clearing collection ${collectionName}:`, error);
    return 0;
  }
}
