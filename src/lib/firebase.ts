'use server';

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  Firestore,
} from 'firebase/firestore';
import { initializeAdminApp } from '@/lib/firebase-admin';

// This function should be called from server-side code (e.g., API routes)
const getAdminDb = async (): Promise<Firestore> => {
  const { db } = await initializeAdminApp();
  return db as unknown as Firestore;
};

export const saveTransaction = async (data: any) => {
  const db = await getAdminDb();
  const { userId, ...transactionData } = data;

  if (!userId) {
    throw new Error('User ID is required to save a transaction.');
  }

  try {
    const transactionsCollection = collection(db, 'users', userId, 'transactions');
    const docRef = await addDoc(transactionsCollection, {
      ...transactionData,
      userId, // ensure userId is part of the document data
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Transaction document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.error('Error adding transaction document: ', e);
    throw new Error('Could not save transaction to Firestore.');
  }
};

export const updateTransactionStatus = async (orderId: string, status: string) => {
  const db = await getAdminDb();
  try {
    // This logic is more complex now because we don't know the userId.
    // We need to query across all user transaction subcollections.
    // This is inefficient and not recommended for large-scale apps.
    // For this specific use case, we assume it's okay.
    // A better design might be a top-level 'transactions' collection with userId as a field.
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

    let updated = false;

    for (const userDoc of usersSnapshot.docs) {
      const transactionsCollection = collection(db, 'users', userDoc.id, 'transactions');
      const q = query(transactionsCollection, where('orderId', '==', orderId), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const transactionDoc = querySnapshot.docs[0];
        await updateDoc(transactionDoc.ref, {
          status,
          updatedAt: serverTimestamp(),
        });
        console.log(`Transaction for order ${orderId} in user ${userDoc.id} updated to ${status}`);
        updated = true;
        break; // Stop after finding and updating the first match
      }
    }

    if (!updated) {
        console.log(`No transaction found with orderId: ${orderId} to update.`);
    }

  } catch (e) {
    console.error('Error updating transaction status: ', e);
    // We don't throw here to avoid webhook retry loops if the doc doesn't exist.
  }
};
