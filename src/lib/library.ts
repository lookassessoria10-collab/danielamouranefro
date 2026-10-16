"use client";

import { useSyncExternalStore } from "react";
import { videos } from "@/data/videos";
import { isProfileId, PROFILE_STORAGE_KEY } from "@/data/profiles";
import type { ProfileId } from "@/data/types";

/**
 * Biblioteca local do visitante (sem conta): perfil, Minha lista, vídeos abertos,
 * vídeos marcados como assistidos e interesses escolhidos na trilha.
 * Tudo fica no localStorage deste navegador.
 */

export type HistoryEntry = { id: string; at: number };

export type Library = {
  /** `false` durante a renderização no servidor e na hidratação. */
  ready: boolean;
  profile: ProfileId | null;
  list: string[];
  history: HistoryEntry[];
  watched: string[];
  interests: string[];
};

const PROFILE_KEY = PROFILE_STORAGE_KEY;
const KEYS = {
  list: "nefroflix:lista",
  history: "nefroflix:historico",
  watched: "nefroflix:assistidos",
  interests: "nefroflix:interesses",
} as const;

const MAX_HISTORY = 30;
const MAX_INTERESTS = 9;
const knownIds = new Set(videos.map((v) => v.id));

const SERVER_LIBRARY: Library = {
  ready: false,
  profile: null,
  list: [],
  history: [],
  watched: [],
  interests: [],
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const validIds = (value: unknown) =>
  Array.isArray(value)
    ? Array.from(new Set(value.filter((id): id is string => typeof id === "string" && knownIds.has(id))))
    : [];

function readLibrary(): Library {
  let profile: ProfileId | null = null;
  try {
    const stored = window.localStorage.getItem(PROFILE_KEY);
    profile = isProfileId(stored) ? stored : null;
  } catch {
    profile = null;
  }

  const rawHistory = readJson<unknown>(KEYS.history, []);
  const history = Array.isArray(rawHistory)
    ? rawHistory.filter(
        (e): e is HistoryEntry =>
          !!e && typeof e === "object" && knownIds.has((e as HistoryEntry).id) && typeof (e as HistoryEntry).at === "number",
      )
    : [];

  return {
    ready: true,
    profile,
    list: validIds(readJson(KEYS.list, [])),
    history,
    watched: validIds(readJson(KEYS.watched, [])),
    interests: validIds(readJson(KEYS.interests, [])),
  };
}

let current: Library | null = null;
const listeners = new Set<() => void>();

const getSnapshot = () => (current ??= readLibrary());
const getServerSnapshot = () => SERVER_LIBRARY;

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key.startsWith("nefroflix:")) {
    current = readLibrary();
    listeners.forEach((l) => l());
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function commit(patch: Partial<Omit<Library, "ready">>) {
  const next = { ...getSnapshot(), ...patch };
  current = next;
  try {
    if ("profile" in patch && next.profile) window.localStorage.setItem(PROFILE_KEY, next.profile);
    if ("list" in patch) window.localStorage.setItem(KEYS.list, JSON.stringify(next.list));
    if ("history" in patch) window.localStorage.setItem(KEYS.history, JSON.stringify(next.history));
    if ("watched" in patch) window.localStorage.setItem(KEYS.watched, JSON.stringify(next.watched));
    if ("interests" in patch) window.localStorage.setItem(KEYS.interests, JSON.stringify(next.interests));
  } catch {
    // Navegação privada ou armazenamento bloqueado: segue funcionando nesta aba.
  }
  listeners.forEach((l) => l());
}

export function useLibrary(): Library {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const library = {
  setProfile(profile: ProfileId) {
    if (getSnapshot().profile !== profile) commit({ profile });
  },
  /** Alterna o vídeo na Minha lista. Retorna `true` se foi adicionado. */
  toggleList(id: string) {
    const { list } = getSnapshot();
    const added = !list.includes(id);
    commit({ list: added ? [id, ...list] : list.filter((x) => x !== id) });
    return added;
  },
  /** Adiciona vários vídeos. Retorna quantos eram novos. */
  addManyToList(ids: string[]) {
    const { list } = getSnapshot();
    const fresh = ids.filter((id) => knownIds.has(id) && !list.includes(id));
    if (fresh.length) commit({ list: [...fresh, ...list] });
    return fresh.length;
  },
  removeFromList(id: string) {
    commit({ list: getSnapshot().list.filter((x) => x !== id) });
  },
  recordView(id: string) {
    if (!knownIds.has(id)) return;
    const history = [{ id, at: Date.now() }, ...getSnapshot().history.filter((e) => e.id !== id)];
    commit({ history: history.slice(0, MAX_HISTORY) });
  },
  clearHistory() {
    commit({ history: [] });
  },
  toggleWatched(id: string) {
    const { watched } = getSnapshot();
    const marked = !watched.includes(id);
    commit({ watched: marked ? [id, ...watched] : watched.filter((x) => x !== id) });
    return marked;
  },
  addInterests(ids: string[]) {
    const merged = [...ids, ...getSnapshot().interests.filter((x) => !ids.includes(x))];
    commit({ interests: merged.filter((id) => knownIds.has(id)).slice(0, MAX_INTERESTS) });
  },
};
