"use client";

import { useSyncExternalStore } from "react";

export type Toast = { id: number; message: string };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Toast[] = [];

export function toast(message: string, duration = 2800) {
  const id = nextId++;
  toasts = [...toasts.slice(-2), { id, message }];
  emit();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, duration);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => toasts,
    () => EMPTY,
  );
}
