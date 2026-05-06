import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { CartItem, useCartStore } from "@/store/cartStore";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseBrowser } from "@/lib/supabase/client";

let debounceTimer: NodeJS.Timeout | null = null;

export function useCartSync() {
  const { data: session, status } = useSession();

  const isSyncing = useRef(false);
  const userId = (session?.user as any)?.id ?? null;

  /**
   * 🔐 INITIAL SYNC ON LOGIN
   */
  useEffect(() => {
    if (status === "loading") return;
    if (!userId) return;

    mergeAndLoad(isSyncing);
  }, [userId, status]);

  /**
   * 🔁 LOCAL → DB SYNC (debounced)
   */
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

/**
 * 🔄 Merge local cart into DB and load DB cart
 */
async function mergeAndLoad(
  isSyncing: React.MutableRefObject<boolean>
) {
  isSyncing.current = true;

  try {
    
    const localItems = useCartStore.getState().items;

    console.log("localItems",localItems);
    

    // 1️⃣ Merge local → DB
    if (localItems.length > 0) {
      await fetch("/api/cart/merge", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: localItems }),
      });
    }

    // 2️⃣ Load DB → local
    const res = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
    });

    const json = await res.json();

    const items: CartItem[] = (json.data || []).map(fromDbRow);

    useCartStore.setState({ items });

  } catch (err) {
    console.error("Cart sync error:", err);
  } finally {
    isSyncing.current = false;
  }
}

/**
 * 💾 Persist full cart to DB
 */
async function persistToDb(
  items: CartItem[],
  isSyncing: React.MutableRefObject<boolean>
) {
  isSyncing.current = true;

  try {
    await fetch("/api/cart/sync", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items }),
    });
  } catch (err) {
    console.error("Cart persist error:", err);
  } finally {
    isSyncing.current = false;
  }
}

/**
 * 🔄 Transform Zustand → DB
 */
function toDbRow(uid: string, item: CartItem) {
  return {
    user_id: uid,
    product_id: item.product_id,
    title: item.title,
    image: item.image,
    size: item.size,
    thickness: item.thickness,
    mounting_method: item.mounting_method,
    orientation: item.orientation,
    price: item.price,
    quantity: item.quantity,
    variant_id: item.variant_id ?? null,
  };
}

/**
 * 🔄 Transform DB → Zustand
 */
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
    variant_id: row.variant_id ?? undefined
  };
}