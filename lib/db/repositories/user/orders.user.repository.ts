import { readQuery } from "@/lib/db";
import { toUserOrderDetailsDTO, toUserOrderDTO, UserOrderDTO } from "../../dto/order.dto";
import { UserOrderQueries } from "../../queries/user/order.user.queries";
import { OrderItemDTO, toOrderItemDTO } from "../../dto/order-item.dto";
import { OrderTimelineDTO, toOrderTimelineDTO } from "../../dto/order-timeline.dto";

export async function getUserOrders(userId: string): Promise<UserOrderDTO[]> {
    const query = UserOrderQueries.getAllByUser;
    const rows = await readQuery<UserOrderDTO>(query, [userId])
    return rows.map(
        toUserOrderDTO
    )
}

export async function getOrderDetails(id: string): Promise<any> {
    const query = UserOrderQueries.getOrderDetails;
    const rows = await readQuery<UserOrderDTO>(query, [id])
    return toUserOrderDetailsDTO(rows[0])
}

export async function getOrderedItemsData(id: string): Promise<OrderItemDTO[]>{
    const query = UserOrderQueries.getAllItemsData;
    const rows = await readQuery<OrderItemDTO>(query, [id])
    return rows.map(toOrderItemDTO);
}

export async function getOrderTimelineData(id: string): Promise<OrderTimelineDTO[]>{
    const query = UserOrderQueries.getAllTimeLineData;
    const rows = await readQuery<OrderTimelineDTO>(query, [id])
    return rows.map(toOrderTimelineDTO);
}