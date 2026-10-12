import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = !getApps().length ? initializeApp(config) : getApps()[0];
const db = config.firestoreDatabaseId && config.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

async function wipe() {
  console.log(`[Wipe] Connecting to Firebase project: ${config.projectId}...`);

  const collectionsToClear = ['orders', 'products', 'stores', 'withdrawals', 'wallets'];

  for (const colName of collectionsToClear) {
    const colRef = collection(db, colName);
    const snap = await getDocs(colRef);
    console.log(`[Wipe] Collection '${colName}' has ${snap.size} documents.`);
    if (!snap.empty) {
      const batch = writeBatch(db);
      for (const d of snap.docs) {
        batch.delete(d.ref);
      }
      await batch.commit();
      console.log(`[Wipe] Cleared all ${snap.size} documents from '${colName}'.`);
    }
  }

  // Users collection: delete all test users EXCEPT user_admin_1
  const usersRef = collection(db, 'users');
  const userSnap = await getDocs(usersRef);
  console.log(`[Wipe] Users collection has ${userSnap.size} documents.`);
  if (!userSnap.empty) {
    const batch = writeBatch(db);
    let deletedUsersCount = 0;
    for (const d of userSnap.docs) {
      if (d.id !== 'user_admin_1' && d.data().email !== 'almayurnurgi563@gmail.com') {
        batch.delete(d.ref);
        deletedUsersCount++;
      }
    }
    if (deletedUsersCount > 0) {
      await batch.commit();
      console.log(`[Wipe] Deleted ${deletedUsersCount} test users from 'users'.`);
    }
  }

  // Ensure master admin is stored cleanly
  const adminDocRef = doc(db, 'users', 'user_admin_1');
  await setDoc(adminDocRef, {
    id: 'user_admin_1',
    name: 'Chefe Almayur Nurgi',
    email: 'almayurnurgi563@gmail.com',
    phone: '843456786',
    role: 'SUPER_ADMIN',
    password: 'Te@momae',
    adminLevel: 'SUPER_ADMIN',
    isBanned: false,
    twoFactorEnabled: false,
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: new Date().toISOString()
  }, { merge: true });
  console.log(`[Wipe] Super Admin account 'user_admin_1' (almayurnurgi563@gmail.com) verified and active.`);

  console.log(`[Wipe] SUCCESS: Firestore database is now 100% clean and ready for real production!`);
  process.exit(0);
}

wipe().catch((err) => {
  console.error('[Wipe] Error during database reset:', err);
  process.exit(1);
});
