import { MongoClient } from 'mongodb';

// Get the DATABASE_URL from environment
const uri = process.env.DATABASE_URL;

// Provide helpful error message if missing
if (!uri) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'WARNING: DATABASE_URL is not configured. Database operations will fail. ' +
      'Please set the DATABASE_URL environment variable in your Vercel project settings.'
    );
  }
}

// Use localhost only in development as fallback
const mongoUri = uri || 'mongodb://localhost:27017';
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(mongoUri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(mongoUri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb() {
    const client = await clientPromise;
    // Assuming the DB name is in the connection string, or default to 'clearmind'
    return client.db('clearmind');
}