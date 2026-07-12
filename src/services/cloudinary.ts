// Minimal Cloudinary helper for unsigned browser uploads.
export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";

function hasCloudinaryConfig() {
  return (
    CLOUD_NAME &&
    UPLOAD_PRESET &&
    CLOUD_NAME !== "your_cloud_name" &&
    UPLOAD_PRESET !== "your_unsigned_preset"
  );
}

export async function uploadImage(file: File) {
  if (!hasCloudinaryConfig()) {
    throw new Error(
      "Cloudinary saknar konfiguration. Kontrollera VITE_CLOUDINARY_CLOUD_NAME och VITE_CLOUDINARY_UPLOAD_PRESET i .env.local.",
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(url, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.error?.message || "Uppladdningen till Cloudinary misslyckades",
    );
  }
  return data;
}

export function thumbnailUrl(
  publicId: string,
  opts: { width?: number; height?: number } = {},
) {
  const { width, height } = opts;
  let params = "";
  if (width) params += `w_${width},`;
  if (height) params += `h_${height},`;
  if (params) params = params.slice(0, -1) + "/";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}${publicId}`;
}
