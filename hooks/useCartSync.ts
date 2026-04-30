import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { CartItem, useCartStore } from "@/store/cartStore";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseBrowser } from "@/lib/supabase/client";

export function useCartSync() {
  const { data: session, status } = useSession();

  const isSyncing = useRef(false);
  const userId = useRef<string | null>(null);

  /**
   * 🔐 AUTH + INITIAL SYNC
   */
  useEffect(() => {
    if (status === "loading") return;

    const newUserId = (session?.user as any)?.id ?? null;
    const prevUserId = userId.current;

    userId.current = newUserId;

    // ✅ LOGIN FLOW
    if (newUserId && newUserId !== prevUserId) {
      mergeAndLoad(newUserId, isSyncing);
    }

    // ✅ LOGOUT FLOW (optional)
    if (!newUserId) {
      userId.current = null;
    }
  }, [session, status]);

  /**
   * 🔁 CART → DB SYNC
   */
  useEffect(() => {
    const unsub = useCartStore.subscribe((state, prevState) => {
      if (isSyncing.current) return;

      if (state.items !== prevState.items && userId.current) {
        persistToDb(userId.current, state.items, isSyncing);
      }
    });

    return () => unsub();
  }, []);
}

/**
 * 🔄 Merge local cart into DB and load DB cart
 */
async function mergeAndLoad(
  uid: string,
  isSyncing: React.MutableRefObject<boolean>
) {
  const localItems = useCartStore.getState().items;

  isSyncing.current = true;

  try {
    // 1️⃣ Push local → DB
    if (localItems.length > 0) {
      const rows = localItems.map((item) => toDbRow(uid, item));

      const { error } = await supabaseBrowser.from("cart_items").upsert(rows, {
        onConflict:
          "user_id,product_id,size,thickness,mounting_method,orientation",
      });

      if (error) {
        console.error("Cart upsert error:", error);
      }
    }

    // 2️⃣ Pull DB → local
    const { data, error } = await supabaseBrowser
      .from("cart_items")
      .select("*")
      .eq("user_id", uid);

    if (error) {
      console.error("Cart fetch error:", error);
      return;
    }

    const items: CartItem[] = (data || []).map(fromDbRow);

    // Replace local store
    useCartStore.setState({ items });
  } finally {
    isSyncing.current = false;
  }
}

/**
 * 💾 Persist full cart to DB
 */
async function persistToDb(
  uid: string,
  items: CartItem[],
  isSyncing: React.MutableRefObject<boolean>
) {
  isSyncing.current = true;

  try {
    // 🔥 Simple strategy (replace all)
    const { error: deleteError } = await supabaseBrowser
      .from("cart_items")
      .delete()
      .eq("user_id", uid);

    if (deleteError) {
      console.error("Cart delete error:", deleteError);
      return;
    }

    if (items.length > 0) {
      const rows = items.map((item) => toDbRow(uid, item));

      const { error: insertError } = await supabaseBrowser
        .from("cart_items")
        .insert(rows);

      if (insertError) {
        console.error("Cart insert error:", insertError);
      }
    }
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
    product_id: item.productId,
    title: item.title,
    image: item.image,
    size: item.size,
    thickness: item.thickness,
    mounting_method: item.mountingMethod,
    orientation: item.orientation,
    price: item.price,
    quantity: item.quantity,
    variant_id: item.variantId ?? null,
  };
}

/**
 * 🔄 Transform DB → Zustand
 */
function fromDbRow(row: any): CartItem {
  return {
    productId: row.product_id,
    title: row.title,
    image: row.image,
    size: row.size,
    thickness: row.thickness,
    mountingMethod: row.mounting_method,
    orientation: row.orientation,
    price: Number(row.price),
    quantity: Number(row.quantity),
    variantId: row.variant_id ?? undefined
  };
}