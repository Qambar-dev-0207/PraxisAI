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
const options = {
  connectTimeoutMS: 10000, // 10 seconds
  serverSelectionTimeoutMS: 10000, // 10 seconds
};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Initializing MongoDB connection (dev)...');
    client = new MongoClient(mongoUri, options);
    globalWithMongo._mongoClientPromise = client.connect().catch(err => {
        console.error("CRITICAL: MongoDB connection error (dev):", err.message);
        throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  console.log('Initializing MongoDB connection (prod)...');
  client = new MongoClient(mongoUri, options);
  clientPromise = client.connect().catch(err => {
    console.error("CRITICAL: MongoDB connection error (prod):", err.message);
    throw err;
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb() {

    const client = await clientPromise;

    return client.db(); // This uses the database name from the URI

}
