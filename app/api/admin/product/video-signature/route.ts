import { ok, withHandler } from "@/lib/api/handler";
import { PRODUCT_VIDEO_FOLDER } from "@/lib/productVideos";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Signs a direct browser → Cloudinary video upload. Videos are too large to send through our API as base64,
// so the admin form uploads them itself and only sends back { url, public_id } when the product is saved.
export const POST = withHandler(
    async (): Promise<NextResponse> => {
        const timestamp = Math.round(Date.now() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { folder: PRODUCT_VIDEO_FOLDER, timestamp },
            process.env.CLOUDINARY_API_SECRET!
        );

        const response = ok({
            data: {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                folder: PRODUCT_VIDEO_FOLDER,
                timestamp,
                signature,
            },
        });
        response.headers.set("Cache-Control", "private, no-store");
        return response;
    },
    { access: "admin" }
);
