import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let firebaseConfig = {};

if (fs.existsSync(configPath)) {
  const configRaw = fs.readFileSync(configPath, 'utf8');
  firebaseConfig = JSON.parse(configRaw);
}

export const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);

