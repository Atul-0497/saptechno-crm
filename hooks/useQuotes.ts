"use client";

import { useCallback, useState } from "react";
import type { QuoteRecord } from "@/types/quote";

const STORAGE_KEY = "saptechno.crm.quotes";

function readQuotes(): QuoteRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QuoteRecord[];
  } catch (error) {
    console.error("Failed to read quotes from storage", error);
    return [];
  }
}

function writeQuotes(quotes: QuoteRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function useQuotes() {
  const [quotes, setQuotes] = useState<QuoteRecord[]>(() => readQuotes());
  const [isLoading] = useState(false);

  const createQuote = useCallback(async (quote: QuoteRecord) => {
    setQuotes((current) => {
      const next = [quote, ...current];
      writeQuotes(next);
      return next;
    });
  }, []);

  const updateQuote = useCallback(async (quote: QuoteRecord) => {
    setQuotes((current) => {
      const next = current.map((item) => (item.id === quote.id ? quote : item));
      writeQuotes(next);
      return next;
    });
  }, []);

  const deleteQuote = useCallback(async (id: string) => {
    setQuotes((current) => {
      const next = current.filter((item) => item.id !== id);
      writeQuotes(next);
      return next;
    });
  }, []);

  return {
    data: quotes,
    isLoading,
    createQuote,
    updateQuote,
    deleteQuote,
  };
}
