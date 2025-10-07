import "server-only";
import { initializeApp, getApps, App, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
};

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

async function initializeAdminApp() {
  if (!adminApp) {
    if (getApps().some(app => app.name === 'firebase-admin-app')) {
      adminApp = getApps().find(app => app.name === 'firebase-admin-app');
    } else {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      }, 'firebase-admin-app');
    }
    adminDb = getFirestore(adminApp);
  }
  return { app: adminApp, db: adminDb };
}

export { initializeAdminApp };
