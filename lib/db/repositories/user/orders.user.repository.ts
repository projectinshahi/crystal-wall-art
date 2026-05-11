import { readQuery } from "@/lib/db";
import { toUserOrderDTO, UserOrderDTO } from "../../dto/order.dto";
import { UserOrderQueries } from "../../queries/user/order.user.queries";

export async function getUserOrders(userId: string): Promise<UserOrderDTO[]>{
    const query = UserOrderQueries.getAllByUser;
    const rows = await readQuery<UserOrderDTO>(query, [userId])
        return rows.map(
            toUserOrderDTO
        )
}