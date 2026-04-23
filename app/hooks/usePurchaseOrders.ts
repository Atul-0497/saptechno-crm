"use client";

import { useCallback, useState } from "react";
import type { PurchaseOrderRecord } from "@/app/types/purchaseOrder";

const STORAGE_KEY = "saptechno.crm.purchase-orders";

function readPurchaseOrders(): PurchaseOrderRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PurchaseOrderRecord[];
  } catch (error) {
    console.error("Failed to read purchase orders from storage", error);
    return [];
  }
}

function writePurchaseOrders(purchaseOrders: PurchaseOrderRecord[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(purchaseOrders));
}

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(() => readPurchaseOrders());
  const [isLoading] = useState(false);

  const createPurchaseOrder = useCallback(async (purchaseOrder: PurchaseOrderRecord) => {
    setPurchaseOrders((current) => {
      const next = [purchaseOrder, ...current];
      writePurchaseOrders(next);
      return next;
    });
  }, []);

  const updatePurchaseOrder = useCallback(async (purchaseOrder: PurchaseOrderRecord) => {
    setPurchaseOrders((current) => {
      const next = current.map((item) => (item.id === purchaseOrder.id ? purchaseOrder : item));
      writePurchaseOrders(next);
      return next;
    });
  }, []);

  const deletePurchaseOrder = useCallback(async (id: string) => {
    setPurchaseOrders((current) => {
      const next = current.filter((item) => item.id !== id);
      writePurchaseOrders(next);
      return next;
    });
  }, []);

  return {
    data: purchaseOrders,
    isLoading,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
  };
}
