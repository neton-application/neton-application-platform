/**
 * This browser's device id (ecosystem device-id contract).
 *
 * A random RFC 4122 UUID v4 in lowercase hyphenated form, generated once from a secure random source,
 * persisted in localStorage and sent with every login and token refresh. The account module rejects
 * anything else (`DEVICE_ID_REQUIRED` / `INVALID_DEVICE_ID`) and never generates one.
 */
const DEVICE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const STORAGE_KEY = 'neton.deviceId';

let pageDeviceId: string | undefined;

function generateDeviceId(): string {
  if (typeof crypto.randomUUID === 'function') {
    const id = crypto.randomUUID().toLowerCase();
    if (DEVICE_ID_PATTERN.test(id)) return id;
  }
  // Never Math.random: getRandomValues with the version / variant bits set.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function getOrCreateDeviceId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DEVICE_ID_PATTERN.test(stored)) return stored;
  } catch {
    // storage unavailable: fall through
  }
  const id = (pageDeviceId ??= generateDeviceId());
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // storage unavailable: the id lives for this page only
  }
  return id;
}

/** The `device` object the account module's login endpoints expect. */
export function webLoginDevice() {
  return { deviceId: getOrCreateDeviceId(), platform: 'web' };
}
