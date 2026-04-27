import { useState } from "react";

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder = "general") => {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/coudinary/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      return data; // { url, public_id }
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading };
};