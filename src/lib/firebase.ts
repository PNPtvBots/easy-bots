
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
} from 'firebase/firestore';
import { initializeAdminApp } from '@/lib/firebase-admin';

// This function should be called from server-side code (e.g., API routes)
const getAdminDb = async () => {
  const { db } = await initializeAdminApp();
  return db;
};

export const saveTransaction = async (data: any) => {
  const db = await getAdminDb();
  const { userId, ...transactionData } = data;

  if (!userId || userId === 'anonymous') {
    console.warn('Cannot save transaction for anonymous or missing user ID.');
    // Decide if you want to save to a different collection or just return
    return;
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

export const updateTransactionStatus = async (orderId: string, status: string, userId?: string) => {
  const db = await getAdminDb();
  try {
    if (userId && userId !== 'anonymous') {
      // If we have a userId, the query is much more efficient
      const transactionsCollection = collection(db, 'users', userId, 'transactions');
      const q = query(transactionsCollection, where('orderId', '==', orderId), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const transactionDoc = querySnapshot.docs[0];
        await updateDoc(transactionDoc.ref, {
          status,
          updatedAt: serverTimestamp(),
        });
        console.log(`Transaction for order ${orderId} in user ${userId} updated to ${status}`);
        return;
      }
    }
    
    // Fallback for cases where userId might not be in the metadata (e.g., older transactions)
    // This is inefficient and should be avoided if possible.
    console.warn(`Performing inefficient cross-user search for orderId: ${orderId}. Please ensure userId is passed in webhook metadata.`);
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);

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
        return; // Stop after finding and updating
      }
    }
    
    console.log(`No transaction found with orderId: ${orderId} to update.`);

  } catch (e) {
    console.error('Error updating transaction status: ', e);
    // We don't throw here to avoid webhook retry loops if the doc doesn't exist.
  }
};
