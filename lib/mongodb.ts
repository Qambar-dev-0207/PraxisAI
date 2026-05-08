import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.DATABASE_URL;

if (!uri) {
  if (process.env.NODE_ENV === 'production') {
    console.error(
      'WARNING: DATABASE_URL is not configured. Database operations will fail. ' +
      'Please set the DATABASE_URL environment variable.'
    );
  } else {
    console.warn('DATABASE_URL not set — falling back to mongodb://localhost:27017 (dev only).');
  }
}

const mongoUri = uri || 'mongodb://localhost:27017';

const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(mongoUri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  const client = new MongoClient(mongoUri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}
