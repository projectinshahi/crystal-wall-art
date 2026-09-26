import { err, ok, withHandler } from "@/lib/api/handler";
import { withTransaction } from "@/lib/db";
import { createContent, getAdminContents, updateContent } from "@/lib/db/repositories/admin/content.admin.repository";
import { HOME_INTRO_CONTENT_TYPE } from "@/lib/constants/content.constants";
import { sanitizeString } from "@/lib/validation";
import { homeIntroSchema } from "@/schema/content.schema";
import { ContentFormInput } from "@/types/Admin/content.types";
import { NextResponse } from "next/server";

// Create or update the single homepage intro section (heading + description only)
export const PUT = withHandler(
    async ({ req }): Promise<NextResponse> => {
        const body = await req.json().catch(() => null);

        if (!body || typeof body !== "object") {
            return err("Invalid payload", 400);
        }

        const parsed = homeIntroSchema.safeParse({
            title: sanitizeString(String(body.title ?? ""), 120),
            description: sanitizeString(String(body.description ?? ""), 1000),
        });

        if (parsed.success === false) {
            return err(parsed.error.issues[0]?.message || "Validation failed", 400);
        }

        const payload = {
            type: HOME_INTRO_CONTENT_TYPE as ContentFormInput["type"],
            title: parsed.data.title,
            description: parsed.data.description,
            link_url: undefined,
            image: undefined,
            priority: 0,
        } as ContentFormInput;

        const [existing] = await getAdminContents({ type: HOME_INTRO_CONTENT_TYPE });

        const content = existing
            ? await updateContent(existing.id, payload)
            : await withTransaction((client) => createContent(client, payload));

        const response = ok({
            message: "Homepage section updated successfully",
            data: content,
        });

        // Never Cache Admin APIs
        response.headers.set(
            "Cache-Control",
            "private, no-store"
        );

        return response;
    },
    {
        access: "admin",
        rateLimit: {
            max: 20,
            windowMs: 60 * 1000,
        },
    }
);
