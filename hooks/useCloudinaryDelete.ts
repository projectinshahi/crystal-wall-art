import { useState } from "react";

export const useCloudinaryDelete = () => {
  const [deleting, setDeleting] = useState(false);

  const deleteFile = async (public_id: string) => {
    try {
      setDeleting(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/coudinary/delete`, {
        method: "POST",
        body: JSON.stringify({ public_id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
    } finally {
      setDeleting(false);
    }
  };

  return { deleteFile, deleting };
};