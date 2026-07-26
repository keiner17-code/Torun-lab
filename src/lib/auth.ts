export const SESSION_COOKIE_NAME = "torun_session";
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET no está definida");
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toHex(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(): Promise<{
  token: string;
  maxAgeSeconds: number;
}> {
  const expiresAt = Date.now() + THIRTY_DAYS_SECONDS * 1000;
  const sig = await hmac(String(expiresAt));
  return { token: `${expiresAt}.${sig}`, maxAgeSeconds: THIRTY_DAYS_SECONDS };
}

export async function isValidSessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [expiresAtStr, sig] = token.split(".");
  if (!expiresAtStr || !sig) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = await hmac(expiresAtStr);
  return timingSafeEqual(expected, sig);
}

export function verifyPin(pin: string): boolean {
  const expected = process.env.MONITOR_PIN;
  if (!expected) return false;
  if (pin.length !== expected.length) return false;
  return timingSafeEqual(pin, expected);
}
