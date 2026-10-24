// Content banners (Admin → Content) accept an image or a video. Shared by the admin API and the UI.

export const CONTENT_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const CONTENT_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export const MAX_CONTENT_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_CONTENT_VIDEO_SIZE = 30 * 1024 * 1024;

export const CONTENT_MEDIA_ACCEPT = [...CONTENT_IMAGE_TYPES, ...CONTENT_VIDEO_TYPES].join(",");

// Returns an error message, or null when the file is an allowed image/video within its size limit
export function validateContentMedia(file: File, label = "File"): string | null {
    if (CONTENT_VIDEO_TYPES.includes(file.type)) {
        return file.size > MAX_CONTENT_VIDEO_SIZE ? `${label}: video must be 30MB or smaller` : null;
    }
    if (CONTENT_IMAGE_TYPES.includes(file.type)) {
        return file.size > MAX_CONTENT_IMAGE_SIZE ? `${label}: image must be 5MB or smaller` : null;
    }
    return `${label}: use JPEG, PNG, WebP, MP4, WebM or MOV`;
}

// Cloudinary serves videos from /video/upload/; also matches plain video file URLs
export function isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    return url.includes("/video/upload/") || /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url);
}

// Product videos (Admin → Products): uploaded straight from the browser to Cloudinary
export const PRODUCT_VIDEO_TYPES = CONTENT_VIDEO_TYPES;
export const MAX_PRODUCT_VIDEO_SIZE = 50 * 1024 * 1024;

// Cloudinary renders a still frame of a video when its extension is swapped for .jpg
export function videoPosterUrl(url: string): string | undefined {
    if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return undefined;
    return url.replace(/\.[a-z0-9]+(\?.*)?$/i, ".jpg");
}
