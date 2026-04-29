import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export type CloudinaryUploadResult = {
  url: string;
  public_id: string;
};

export async function uploadToCloudinary(
  file: File,
  folder: string = "general"
): Promise<CloudinaryUploadResult> {
  if (!file) throw new Error("File is required");

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}

export async function deleteFromCloudinary(public_id: string) {
  if (!public_id) return;

  await cloudinary.uploader.destroy(public_id);
}

// Upload a base64 data URI (sent from client)
export async function uploadBase64ToCloudinary(
  base64: string,
  folder: string = "general"
): Promise<CloudinaryUploadResult> {
  if (!base64) throw new Error("Base64 data is required");

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader.upload(
        base64, // accepts "data:image/png;base64,..." directly
        { folder, resource_type: "image" },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Upload returned empty result"));
          else resolve(result);
        }
      );
    }
  );

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
}