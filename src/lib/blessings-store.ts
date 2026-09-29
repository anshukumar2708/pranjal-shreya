import { MongoClient, type Collection } from "mongodb";

/**
 * Storage for the Blessings Wall, in MongoDB. Server-only.
 *
 * Needs `MONGODB_URI` (and optionally `MONGODB_DB`, default "wedding") — in
 * `.env.local` for development and in the host's environment variables for
 * the live site.
 */

export interface Blessing {
  id: string;
  name: string;
  message: string;
  /** ISO timestamp. */
  createdAt: string;
}

interface BlessingDoc {
  name: string;
  message: string;
  createdAt: Date;
  /** Hashed visitor key, used only for rate limiting. Never sent to clients. */
  clientKey: string;
}

const DB_NAME = process.env.MONGODB_DB || "wedding";
const COLLECTION = "blessings";

/**
 * One client per server process. In development the module is re-evaluated on
 * every hot reload, so the promise is parked on `globalThis` to avoid opening
 * a new connection pool each time.
 */
const globalForMongo = globalThis as typeof globalThis & {
  _blessingsMongo?: Promise<Collection<BlessingDoc>>;
};

function collection(): Promise<Collection<BlessingDoc>> {
  if (!globalForMongo._blessingsMongo) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return Promise.reject(new Error("MONGODB_URI is not set"));
    }

    globalForMongo._blessingsMongo = (async () => {
      // Short timeouts: the driver's default is to keep retrying for 30s, which
      // left the wall's loading placeholders spinning when the server could
      // not reach Atlas (e.g. its IP missing from Network Access). Failing in
      // a few seconds lets the page show an error with a "Try again" button.
      const client = await new MongoClient(uri, {
        appName: "pranjal-weds-shriya",
        serverSelectionTimeoutMS: 6000,
        connectTimeoutMS: 6000,
      }).connect();
      const blessings = client.db(DB_NAME).collection<BlessingDoc>(COLLECTION);
      await Promise.all([
        blessings.createIndex({ createdAt: -1 }),
        blessings.createIndex({ clientKey: 1, createdAt: -1 }),
      ]);
      return blessings;
    })().catch((error) => {
      // Don't cache a failed connection — let the next request retry.
      globalForMongo._blessingsMongo = undefined;
      throw error;
    });
  }
  return globalForMongo._blessingsMongo;
}

/** Newest first. */
export async function listBlessings(limit = 200): Promise<Blessing[]> {
  const docs = await (await collection())
    .find({}, { projection: { clientKey: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toHexString(),
    name: doc.name,
    message: doc.message,
    createdAt: doc.createdAt.toISOString(),
  }));
}

export async function addBlessing(
  name: string,
  message: string,
  clientKey: string,
): Promise<Blessing> {
  const createdAt = new Date();
  const { insertedId } = await (await collection()).insertOne({ name, message, createdAt, clientKey });
  return { id: insertedId.toHexString(), name, message, createdAt: createdAt.toISOString() };
}

/** Allows `limit` blessings per `windowSeconds` from one visitor key. */
export async function allowPost(clientKey: string, limit = 5, windowSeconds = 600): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000);
  const recent = await (await collection()).countDocuments({ clientKey, createdAt: { $gte: since } });
  return recent < limit;
}
