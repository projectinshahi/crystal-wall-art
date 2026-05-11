import { SavedAddress } from "@/types/address.types";

export type UserAddressDTO = {
  id: string;
  type: string;
  name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
};

export function toUserAddressDTO(
  row: SavedAddress
): UserAddressDTO {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    is_default: row.is_default,
  };
}