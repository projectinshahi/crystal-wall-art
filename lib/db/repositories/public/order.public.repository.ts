import { readQuery } from "@/lib/db";
import { OrderStatusDTO, toPublicOrderDTO } from "../../dto/order.dto";
import { OrderPublicQueries } from "../../queries/public/order.public.queries";
import { OrderResult } from "@/types/order.type";

export const getOrderStatusByOrderNumber = async (orderNumber: string): Promise<OrderStatusDTO> => {
    const query = OrderPublicQueries.getOrderStatus;

    const rows = await readQuery<OrderResult>(query, [orderNumber])
console.log("rows",rows);

    return toPublicOrderDTO(rows[0])
}