export const UserAddressQueries = {
    getAllByUser: `
        SELECT
            id,
            type,
            name,
            phone,
            address,
            city,
            state,
            pincode,
            is_default
        FROM saved_addresses
        WHERE user_id = $1
    `,

    upsert: `
        INSERT INTO saved_addresses (
            user_id, type, name, phone, address, city, state, pincode, is_default
        )
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`
}