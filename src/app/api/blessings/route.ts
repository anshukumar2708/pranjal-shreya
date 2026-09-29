import { createHash } from "node:crypto";

import { BLESSING_MESSAGE_MAX as MESSAGE_MAX, BLESSING_NAME_MAX as NAME_MAX } from "@/lib/blessings";
import { addBlessing, allowPost, listBlessings } from "@/lib/blessings-store";

/** Trim, drop control characters, and collapse runs of blank lines/spaces. */
function clean(value: unknown, keepNewlines: boolean): string {
  if (typeof value !== "string") return "";
  const text = value
    .normalize("NFC")
    // Keep \n (and tabs → spaces); strip every other control character.
    .replace(/\t/g, " ")
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    .replace(/[  ]{2,}/g, " ");
  return (keepNewlines ? text.replace(/\n{3,}/g, "\n\n") : text.replace(/\n+/g, " ")).trim();
}

/** Anonymous per-visitor key for rate limiting — the raw IP is never stored. */
function clientKey(request: Request): string {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export async function GET() {
  try {
    const blessings = await listBlessings();
    return Response.json({ blessings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[blessings] list failed", error);
    return Response.json({ error: "Could not load blessings right now." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a field hidden from people that naive bots fill in. Pretend it
  // worked so the bot moves on.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true }, { status: 201 });
  }

  const name = clean(body.name, false);
  const message = clean(body.message, true);

  if (!name) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (Array.from(name).length > NAME_MAX) {
    return Response.json({ error: `Name can be at most ${NAME_MAX} characters.` }, { status: 400 });
  }
  if (Array.from(message).length < 2) {
    return Response.json({ error: "Please write a blessing for the couple." }, { status: 400 });
  }
  if (Array.from(message).length > MESSAGE_MAX) {
    return Response.json(
      { error: `Blessings can be at most ${MESSAGE_MAX} characters.` },
      { status: 400 },
    );
  }

  try {
    if (!(await allowPost(clientKey(request)))) {
      return Response.json(
        { error: "Thank you! You've sent several blessings — please try again in a few minutes." },
        { status: 429 },
      );
    }
    const blessing = await addBlessing(name, message);
    return Response.json({ blessing }, { status: 201 });
  } catch (error) {
    console.error("[blessings] add failed", error);
    return Response.json(
      { error: "Your blessing could not be saved just now. Please try again." },
      { status: 503 },
    );
  }
}
