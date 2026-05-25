import { readQuery, writeQuery } from "@/lib/db";
import { UserAddressQueries } from "../../queries/user/address.user.queries";
import { toUserAddressDTO, UserAddressDTO } from "../../dto/address.dto";
import { AddressFormValues } from "@/schema/address.schema";

export async function getUserAddress(userId: string): Promise<UserAddressDTO[]> {
    const query = UserAddressQueries.getAllByUser;
    const rows = await readQuery<UserAddressDTO>(query, [userId])
    return rows.map(
        toUserAddressDTO
    )
}

export async function addAddress(params: any[]): Promise<UserAddressDTO> {
    const rows = await writeQuery<UserAddressDTO>(UserAddressQueries.upsert, params);
    return toUserAddressDTO(rows[0]);
}