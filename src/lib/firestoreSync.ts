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
 * Persists a document to Firestore with error safety
 */
export async function saveDocToFirestore<T extends Record<string, any>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
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
        batch.set(itemRef, item);
      }
      await batch.commit();
      console.log(`[Firestore] Seeded ${collectionName} successfully.`);
    }
  } catch (error) {
    console.warn(`[Firestore] Seeding skipped/failed for ${collectionName}:`, error);
  }
}
