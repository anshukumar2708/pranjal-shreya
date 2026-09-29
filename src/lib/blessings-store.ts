import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Storage for the Blessings Wall. Server-only.
 *
 * Two backends, picked automatically:
 *
 * - **Upstash Redis** (production). Used whenever its REST credentials are
 *   set — either the Upstash names or the ones Vercel's Upstash/KV integration
 *   injects. Talked to over plain `fetch`, so no SDK is needed.
 * - **A local JSON file** (`.data/blessings.json`) otherwise, so the wall
 *   works in `next dev` with no setup. Serverless hosts such as Vercel have no
 *   writable, persistent disk, so the live site must use Redis.
 */

export interface Blessing {
  id: string;
  name: string;
  message: string;
  /** ISO timestamp. */
  createdAt: string;
}

const LIST_KEY = "blessings";
/** Oldest blessings beyond this are dropped, keeping the list bounded. */
const MAX_STORED = 2000;

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

export const usingRedis = Boolean(REDIS_URL && REDIS_TOKEN);

/* ------------------------------------------------------------------ Redis */

async function redis<T>(command: (string | number)[]): Promise<T> {
  const res = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const body = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || body.error) throw new Error(`Redis error: ${body.error ?? res.status}`);
  return body.result as T;
}

/* ------------------------------------------------------------------- File */

const FILE = path.join(process.cwd(), ".data", "blessings.json");

async function readFileStore(): Promise<Blessing[]> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Blessing[];
  } catch {
    return [];
  }
}

// Serialise writes so two quick posts cannot overwrite each other.
let fileQueue: Promise<unknown> = Promise.resolve();

function writeFileStore(update: (list: Blessing[]) => Blessing[]) {
  const run = fileQueue.then(async () => {
    const next = update(await readFileStore());
    await mkdir(path.dirname(FILE), { recursive: true });
    await writeFile(FILE, JSON.stringify(next, null, 2), "utf8");
  });
  fileQueue = run.catch(() => {});
  return run;
}

/* -------------------------------------------------------------------- API */

/** Newest first. */
export async function listBlessings(limit = 200): Promise<Blessing[]> {
  if (usingRedis) {
    const raw = await redis<string[]>(["LRANGE", LIST_KEY, 0, limit - 1]);
    return raw.flatMap((item) => {
      try {
        return [JSON.parse(item) as Blessing];
      } catch {
        return [];
      }
    });
  }
  return (await readFileStore()).slice(0, limit);
}

export async function addBlessing(name: string, message: string): Promise<Blessing> {
  const blessing: Blessing = {
    id: randomUUID(),
    name,
    message,
    createdAt: new Date().toISOString(),
  };

  if (usingRedis) {
    await redis(["LPUSH", LIST_KEY, JSON.stringify(blessing)]);
    await redis(["LTRIM", LIST_KEY, 0, MAX_STORED - 1]);
  } else {
    await writeFileStore((list) => [blessing, ...list].slice(0, MAX_STORED));
  }
  return blessing;
}

/**
 * Allows `limit` posts per `windowSeconds` for one client key (an IP hash).
 * Only enforced with Redis; the local file store is for development.
 */
export async function allowPost(key: string, limit = 5, windowSeconds = 600): Promise<boolean> {
  if (!usingRedis) return true;
  const bucket = `blessings:rate:${key}`;
  const count = await redis<number>(["INCR", bucket]);
  if (count === 1) await redis(["EXPIRE", bucket, windowSeconds]);
  return count <= limit;
}
