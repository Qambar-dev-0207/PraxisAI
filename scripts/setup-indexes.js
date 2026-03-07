import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = process.env.DATABASE_URL;

async function createIndexes() {
  if (!uri) {
    console.error('DATABASE_URL is not set.');
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('clearmind'); // Using explicit DB name based on previous findings
    
    console.log('Creating indexes for thoughts collection...');
    await db.collection('thoughts').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('thoughts').createIndex({ userId: 1, isArchived: 1, isReviewed: 1, reviewDate: 1 });
    
    console.log('Creating indexes for patterns collection...');
    await db.collection('patterns').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('patterns').createIndex({ relatedThoughtIds: 1 });

    console.log('Creating indexes for insights collection...');
    await db.collection('insights').createIndex({ patternId: 1 });

    console.log('Indexes created successfully!');
  } catch (error) {
    console.error('Error creating indexes:', error);
  } finally {
    await client.close();
  }
}

createIndexes();
