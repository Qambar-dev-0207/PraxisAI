import { MongoClient, MongoClientOptions } from 'mongodb';

// Get the DATABASE_URL from environment
const uri = process.env.DATABASE_URL;

// Provide helpful error message if missing
if (!uri) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'WARNING: DATABASE_URL is not configured. Database operations will fail. ' +
      'Please set the DATABASE_URL environment variable.'
    );
  }
}

// Use localhost only in development as fallback
const mongoUri = uri || 'mongodb://localhost:27017';
const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export default (async () => {
    if (process.env.NODE_ENV === 'development') {
        const globalWithMongo = global as typeof globalThis & {
          _mongoClientPromise?: Promise<MongoClient>;
        };
      
        if (!globalWithMongo._mongoClientPromise) {
          client = new MongoClient(mongoUri, options);
          globalWithMongo._mongoClientPromise = client.connect();
        }
        return globalWithMongo._mongoClientPromise;
      } else {
        if (!clientPromise) {
          client = new MongoClient(mongoUri, options);
          clientPromise = client.connect();
        }
        return clientPromise;
      }
})();

export async function getDb() {
    // Determine which promise to use
    let promise: Promise<MongoClient>;

    if (process.env.NODE_ENV === 'development') {
        const globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };
        if (!globalWithMongo._mongoClientPromise) {
            const c = new MongoClient(mongoUri, options);
            globalWithMongo._mongoClientPromise = c.connect();
        }
        promise = globalWithMongo._mongoClientPromise;
    } else {
        if (!clientPromise) {
            const c = new MongoClient(mongoUri, options);
            clientPromise = c.connect();
        }
        promise = clientPromise;
    }

    const clientInstance = await promise;
    return clientInstance.db();
}
