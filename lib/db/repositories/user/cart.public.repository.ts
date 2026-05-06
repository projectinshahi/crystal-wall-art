import { readQuery } from "@/lib/db";
import { CartUserQueries } from "../../queries/user/user.public.queries";

export const CartRepository = {
  getAll: (userId: string) =>
    readQuery(CartUserQueries.getAll, [userId]),

  upsert: (params: any[]) =>
    readQuery(CartUserQueries.upsert, params),

  updateQuantity: (params: any[]) =>
    readQuery(CartUserQueries.updateQuantity, params),

  changeQuantity: (params: any[]) =>
    readQuery(CartUserQueries.changeQuantity, params),

  deleteItem: (params: any[]) =>
    readQuery(CartUserQueries.deleteItem, params),

  clearCart: (userId: string) =>
    readQuery(CartUserQueries.clearCart, [userId]),
};