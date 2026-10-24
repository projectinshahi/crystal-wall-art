// Uploads a product video from the browser straight to Cloudinary, using a signature from our admin API.
// Videos are too large to send through the product API as base64 like images are.
export async function uploadProductVideo(
    file: File,
    onProgress?: (percent: number) => void
): Promise<{ url: string; public_id: string }> {
    const signRes = await fetch("/api/admin/product/video-signature", { method: "POST" });
    if (!signRes.ok) {
        throw new Error(signRes.status === 401 || signRes.status === 403
            ? "Your session has expired. Please log in again and retry."
            : "Couldn't start the video upload. Please try again.");
    }
    const { data: sign } = await signRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sign.api_key);
    form.append("timestamp", String(sign.timestamp));
    form.append("folder", sign.folder);
    form.append("signature", sign.signature);

    // XHR rather than fetch, so the admin sees upload progress for large files
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${sign.cloud_name}/video/upload`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
            let body: { secure_url?: string; public_id?: string; error?: { message?: string } } = {};
            try { body = JSON.parse(xhr.responseText); } catch { /* handled below */ }

            if (xhr.status >= 200 && xhr.status < 300 && body.secure_url && body.public_id) {
                resolve({ url: body.secure_url, public_id: body.public_id });
            } else {
                reject(new Error(body.error?.message || `Video upload failed (error ${xhr.status})`));
            }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading the video. Please try again."));

        xhr.send(form);
    });
}
