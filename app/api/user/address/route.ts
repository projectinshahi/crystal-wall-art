import { ok, okList, withHandler } from "@/lib/api/handler";
import { addAddress, getUserAddress } from "@/lib/db/repositories/user/address.user.repository";
import { AddressFormValues } from "@/schema/address.schema";
import { NextResponse } from "next/server";

export const GET = withHandler(
    async ({user}): Promise<NextResponse> => {
        const address = await getUserAddress(user.id)

        const response = okList(address, {})

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    }, { access: "user" }
)

export const POST = withHandler(
    async ({ req, user }): Promise<NextResponse> => {
        const address: AddressFormValues = await req.json();

        const inserted = await addAddress([
            user.id,
            address.type,
            address.name,
            address.phone,
            address.address,
            address.city,
            address.state,
            address.pincode,
            false,
        ]);

        const response = ok({
            message: "Address created successfully",
            data: inserted
        }, 201)

        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    },
  { access: "user" }
);