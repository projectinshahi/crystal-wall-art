import { deleteFromCloudinary, uploadBase64ToCloudinary } from "@/lib/cloudinary.service";

export type SizeImage = { url: string; public_id?: string };
export type SizeImages = Record<string, SizeImage>;

// Build the stored size → image map from the admin payload.
// New images arrive as "data:image/..." URIs and are uploaded; an existing image is kept only
// if it is already one of this product's size images (no arbitrary URLs). Unknown sizes are ignored.
export async function resolveSizeImages(
    input: unknown,
    sizes: unknown,
    existing: SizeImages = {}
): Promise<{ sizeImages: SizeImages; uploaded: string[] }> {
    const sizeImages: SizeImages = {};
    const uploaded: string[] = [];

    if (!input || typeof input !== "object" || !Array.isArray(sizes)) {
        return { sizeImages, uploaded };
    }

    const known = Object.values(existing);

    try {
        for (const size of sizes) {
            if (typeof size !== "string") continue;
            const value = (input as Record<string, unknown>)[size];

            if (typeof value === "string" && value.startsWith("data:image/")) {
                const image = await uploadBase64ToCloudinary(value, "product_images");
                uploaded.push(image.public_id);
                sizeImages[size] = image;
            } else if (value && typeof value === "object" && typeof (value as SizeImage).url === "string") {
                const kept = known.find((img) => img.url === (value as SizeImage).url);
                if (kept) sizeImages[size] = kept;
            }
        }
    } catch (error) {
        await discardImages(uploaded);
        throw error;
    }

    return { sizeImages, uploaded };
}

// Public IDs that were in `before` but are no longer used in `after`
export function unusedSizeImages(before: SizeImages = {}, after: SizeImages = {}): string[] {
    const keep = new Set(Object.values(after).map((img) => img.public_id));
    return Object.values(before)
        .map((img) => img.public_id)
        .filter((id): id is string => !!id && !keep.has(id));
}

export async function discardImages(publicIds: string[]) {
    await Promise.all(
        publicIds.map((id) => deleteFromCloudinary(id).catch((e) => console.warn("[CLOUDINARY_DELETE_FAILED]", e)))
    );
}
