import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export const transactionsCollection = collection(db, "transactions");

export const saveTransaction = async (data: any) => {
    try {
        const docRef = await addDoc(transactionsCollection, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        console.log("Transaction document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding transaction document: ", e);
        throw new Error("Could not save transaction to Firestore.");
    }
};

export const updateTransactionStatus = async (orderId: string, status: string) => {
    try {
        // This assumes orderId is unique and used as the document ID.
        // A more robust implementation would query for the document with the matching orderId field.
        const transactionRef = doc(db, "transactions", orderId);
        await updateDoc(transactionRef, {
            status,
            updatedAt: serverTimestamp(),
        });
        console.log(`Transaction ${orderId} status updated to ${status}`);
    } catch (e) {
        console.error("Error updating transaction status: ", e);
        // We don't throw here to avoid webhook retry loops if the doc doesn't exist.
    }
};

export { db };
