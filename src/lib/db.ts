import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // for TS hot reload
  var _mongoClient: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    client = new MongoClient(uri, options);
    global._mongoClient = client.connect();
  }
  clientPromise = global._mongoClient;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectDB() {
  const client = await clientPromise;
  const db = client.db(); // uses default db from URI
  return { client, db };
}
