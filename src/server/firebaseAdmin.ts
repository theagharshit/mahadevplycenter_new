import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let projectId = 'gen-lang-client-0310614869';
let firestoreDatabaseId = '(default)';

let storageBucket = 'gen-lang-client-0310614869.firebasestorage.app';

if (fs.existsSync(configPath)) {
  const configRaw = fs.readFileSync(configPath, 'utf8');
  const firebaseConfig = JSON.parse(configRaw);
  if (firebaseConfig.projectId) projectId = firebaseConfig.projectId;
  if (firebaseConfig.firestoreDatabaseId) firestoreDatabaseId = firebaseConfig.firestoreDatabaseId;
  if (firebaseConfig.storageBucket) storageBucket = firebaseConfig.storageBucket;
}

if (admin.getApps().length === 0) {
  admin.initializeApp({ projectId, storageBucket });
}

export const adminApp = admin.getApp();
export const adminDb = getFirestore(adminApp, firestoreDatabaseId);
export const adminAuth = getAuth(adminApp);
export const adminStorage = getStorage(adminApp);
