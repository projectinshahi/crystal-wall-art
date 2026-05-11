import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { CartItem, useCartStore } from "@/store/cartStore";

let debounceTimer: NodeJS.Timeout | null = null;

export function useCartSync() {
  const { data: session, status } = useSession();
  const isSyncing = useRef(false);
  const userId = (session?.user as any)?.id ?? null;

  // 🔐 INITIAL SYNC ON LOGIN
  useEffect(() => {
    if (status === "loading") return;
    if (!userId) return;

    mergeAndLoad(isSyncing);
  }, [userId, status]);

  // 🔁 LOCAL → DB SYNC (debounced)
  useEffect(() => {
    const unsub = useCartStore.subscribe((state, prev) => {
      if (isSyncing.current) return;
      if (!userId) return;

      if (state.items !== prev.items) {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
          persistToDb(state.items, isSyncing);
        }, 800);
      }
    });

    return () => unsub();
  }, [userId]);
}

// 🔄 Merge local cart into DB, then load DB cart into store
async function mergeAndLoad(isSyncing: React.MutableRefObject<boolean>) {
  isSyncing.current = true;

  try {
    const localItems = useCartStore.getState().items;
    console.log("[useCartSync] localItems:", localItems);

    // 1️⃣ Merge local → DB
    if (localItems.length > 0) {
      const mergeRes = await fetch("/api/cart/merge", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: localItems }),
      });

      if (!mergeRes.ok) {
        console.error("[useCartSync] Merge failed:", await mergeRes.text());
      }
    }

    // 2️⃣ Load DB → local
    const res = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
    });

    const json = await res.json();
    console.log("[useCartSync] DB cart loaded:", json);

    const items: CartItem[] = (json.data || []).map(fromDbRow);
    useCartStore.setState({ items });

  } catch (err) {
    console.error("[useCartSync] Cart sync error:", err);
  } finally {
    isSyncing.current = false;
  }
}

// 💾 Persist full cart to DB
async function persistToDb(
  items: CartItem[],
  isSyncing: React.MutableRefObject<boolean>
) {
  isSyncing.current = true;

  try {
    console.log("[useCartSync] Persisting to DB:", items);

    const res = await fetch("/api/cart/sync", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (!res.ok) {
      console.error("[useCartSync] Persist failed:", await res.text());
    }
  } catch (err) {
    console.error("[useCartSync] Cart persist error:", err);
  } finally {
    isSyncing.current = false;
  }
}

// 🔄 Transform DB row → Zustand CartItem
function fromDbRow(row: any): CartItem {
  return {
    id: row.id,
    product_id: row.product_id,
    title: row.title,
    image: row.image,
    size: row.size,
    thickness: row.thickness,
    mounting_method: row.mounting_method,
    orientation: row.orientation,
    price: Number(row.price),
    quantity: Number(row.quantity),
    variant_id: row.variant_id ?? undefined,
  };
}