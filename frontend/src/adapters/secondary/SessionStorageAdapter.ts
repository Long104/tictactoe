import { StoragePort } from "../../ports/outbound";

export class SessionStorageAdapter implements StoragePort {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const value = sessionStorage.getItem(key);
    if (!value) return null;
    try { return JSON.parse(value) as T; } catch { return null; }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void { if (typeof window === "undefined") return; sessionStorage.removeItem(key); }
  clear(): void { if (typeof window === "undefined") return; sessionStorage.clear(); }
}

export default SessionStorageAdapter;