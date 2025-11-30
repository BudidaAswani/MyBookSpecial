export const AUTH_KEY = "mybooks_currentUser";

export function getStoredUser(): null | { userId: string; name?: string } {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    if (!obj || !obj.userId) { localStorage.removeItem(AUTH_KEY); return null; }
    return obj;
  } catch (e) {
    console.warn("Corrupt auth - clearing:", e);
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function setStoredUser(user: { userId: string; name?: string }) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearStoredUser() {
  localStorage.removeItem(AUTH_KEY);
}
