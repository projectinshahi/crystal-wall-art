import { deleteFromCloudinary } from "@/lib/cloudinary.service";

export type ProductVideo = { url: string; public_id: string };

// Videos are uploaded from the admin's browser straight to Cloudinary (see /api/admin/product/video-signature),
// always into this folder, so the server only ever stores videos it signed for
export const PRODUCT_VIDEO_FOLDER = "product_videos";
export const MAX_PRODUCT_VIDEOS = 5;

const isCloudinaryProductVideo = (video: ProductVideo) => {
    const cloud = process.env.CLOUDINARY_CLOUD_NAME;
    return (
        video.public_id.startsWith(`${PRODUCT_VIDEO_FOLDER}/`) &&
        video.url.startsWith(`https://res.cloudinary.com/${cloud}/video/upload/`) &&
        video.url.includes(`/${video.public_id}.`)
    );
};

// Build the stored video list from the admin payload. Existing videos are kept as stored;
// a new one must be a video we uploaded into the product video folder (no arbitrary URLs).
export function resolveProductVideos(
    input: unknown,
    existing: ProductVideo[] = []
): { videos: ProductVideo[]; added: string[] } {
    const videos: ProductVideo[] = [];
    const added: string[] = [];

    if (!Array.isArray(input)) return { videos, added };

    for (const value of input) {
        if (!value || typeof value !== "object") continue;
        const { url, public_id } = value as Partial<ProductVideo>;
        if (typeof url !== "string" || typeof public_id !== "string") continue;
        if (videos.some((v) => v.public_id === public_id)) continue;

        const kept = existing.find((v) => v.public_id === public_id);
        if (kept) {
            videos.push(kept);
        } else if (isCloudinaryProductVideo({ url, public_id })) {
            videos.push({ url, public_id });
            added.push(public_id);
        }
    }

    if (videos.length > MAX_PRODUCT_VIDEOS) {
        throw new Error(`A product can have at most ${MAX_PRODUCT_VIDEOS} videos`);
    }

    return { videos, added };
}

// Public IDs that were in `before` but are no longer used in `after`
export function unusedProductVideos(before: ProductVideo[] = [], after: ProductVideo[] = []): string[] {
    const keep = new Set(after.map((v) => v.public_id));
    return before.map((v) => v.public_id).filter((id) => !keep.has(id));
}

export async function discardVideos(publicIds: string[]) {
    await Promise.all(
        publicIds.map((id) => deleteFromCloudinary(id, "video").catch((e) => console.warn("[CLOUDINARY_DELETE_FAILED]", e)))
    );
}
