import Storage from 'expo-sqlite/kv-store';
import { useSyncExternalStore } from 'react';

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, unknown>();
const failed = new Set<string>();

/** True when a stored value existed but could not be read, so callers can avoid overwriting real data with a default. */
export function settingReadFailed(key: string): boolean {
  return failed.has(key);
}

function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let value = fallback;
  try {
    const raw = Storage.getItemSync(key);
    if (raw != null) value = JSON.parse(raw) as T;
  } catch {
    // Corrupt or unreadable value: fall back to the default rather than crash, and remember it.
    failed.add(key);
  }
  cache.set(key, value);
  return value;
}

/** A typed, persisted setting that React components can subscribe to. */
export function createSetting<T>(key: string, fallback: T) {
  const get = () => read(key, fallback);
  const set = (value: T) => {
    failed.delete(key);
    cache.set(key, value);
    try {
      Storage.setItemSync(key, JSON.stringify(value));
    } catch {
      // Keep the in-memory value so the session still behaves correctly.
    }
    listeners.get(key)?.forEach((l) => l());
  };
  const subscribe = (listener: Listener) => {
    let set_ = listeners.get(key);
    if (!set_) listeners.set(key, (set_ = new Set()));
    set_.add(listener);
    return () => {
      set_.delete(listener);
    };
  };
  const use = (): [T, (value: T) => void] => [useSyncExternalStore(subscribe, get, get), set];
  return { key, get, set, subscribe, use, readFailed: () => failed.has(key) };
}

export type Setting<T> = ReturnType<typeof createSetting<T>>;
