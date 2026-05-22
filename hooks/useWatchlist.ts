'use client';

import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/lib/types';

const STORAGE_KEY = 'watchlist_v1';

// Storage adapter interface — replace with supabaseStore when ready to migrate
interface WatchlistStore {
  load(): WatchlistItem[];
  save(items: WatchlistItem[]): void;
}

const localStorageStore: WatchlistStore = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
    } catch {
      return [];
    }
  },
  save(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // private browsing or quota exceeded — silently no-op
    }
  },
};

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load once on mount (client-only — localStorage not available during SSR)
  useEffect(() => {
    setWatchlist(localStorageStore.load());
    setIsLoading(false);
  }, []);

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist((prev) => {
      if (prev.some((w) => w.stockCode === item.stockCode)) return prev;
      const next = [...prev, { ...item, addedAt: new Date().toISOString() }];
      localStorageStore.save(next);
      return next;
    });
  };

  const removeFromWatchlist = (stockCode: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((w) => w.stockCode !== stockCode);
      localStorageStore.save(next);
      return next;
    });
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isLoading };
}
