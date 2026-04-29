import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  console.log("🔥 API HIT: /api/cloudinary/upload");

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string;

    console.log("📁 Folder:", folder);

    if (!file) {
      console.error("❌ No file received");
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    console.log("📄 File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("🔄 Buffer created, size:", buffer.length);

    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: folder || "general",
        },
        (error, result) => {
          if (error) {
            console.error("❌ Cloudinary error:", error);
            reject(error);
          } else {
            console.log("✅ Cloudinary success:", result?.secure_url);
            resolve(result);
          }
        }
      );

      stream.end(buffer);
    });

    console.log("🎉 Upload completed");

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (err: any) {
    console.error("🔥 SERVER ERROR:", err);

    return NextResponse.json(
      {
        error: "Upload failed",
        message: err?.message,
      },
      { status: 500 }
    );
  }
}