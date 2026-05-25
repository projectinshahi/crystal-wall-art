export type OrderTimelineDTO = {
    id: string;
    status: string;
    note: string;
    created_at: string;
};

export function toOrderTimelineDTO(
    row: any
): OrderTimelineDTO {

    return {
        id: row.id,
        status: row.status,
        note: row.note,
        created_at:
            row.created_at instanceof Date
                ? row.created_at.toISOString()
                : row.created_at
    };
}