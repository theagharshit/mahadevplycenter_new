import fs from 'fs';
import path from 'path';
import { db } from './src/server/firebase.js';
import { doc, setDoc, collection } from 'firebase/firestore';

async function migrate() {
  console.log('Starting migration to Firestore...');
  const dbPath = path.join(process.cwd(), 'data', 'cms_database.json');
  
  if (!fs.existsSync(dbPath)) {
    console.error('No database file found at', dbPath);
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(dbPath, 'utf8');
  const cmsDb = JSON.parse(rawData);
  
  const collections = [
    'users', 'categories', 'categoryCatalogues', 'products', 'laminateBrands',
    'blogPosts', 'inquiries', 'testimonials', 'faqs', 'media', 'activityLogs',
    'navigationMenu'
  ];
  
  for (const coll of collections) {
    console.log(`Migrating ${coll}...`);
    const arr = cmsDb[coll];
    if (Array.isArray(arr)) {
      for (const item of arr) {
        // use item.id if available, otherwise generate one or just use index as string
        // but for string arrays like categories, we need a different approach
        let id = '';
        let docData: any = item;
        
        if (typeof item === 'string') {
          id = item;
          docData = { name: item };
        } else {
          id = item.id || Math.random().toString(36).substring(7);
        }
        
        await setDoc(doc(db, coll, id), docData);
      }
    }
  }
  
  const singletons = ['siteSettings', 'homeContent', 'aboutContent', 'contactContent', 'translations'];
  for (const singleton of singletons) {
    console.log(`Migrating ${singleton}...`);
    const data = cmsDb[singleton];
    if (data) {
      await setDoc(doc(db, 'singletons', singleton), data);
    }
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
