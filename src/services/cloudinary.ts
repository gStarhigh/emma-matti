// Minimal Cloudinary helper for unsigned browser uploads.
import type { GalleryImage } from "../types/gallery";

export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
export const GALLERY_TAG =
  import.meta.env.VITE_CLOUDINARY_GALLERY_TAG || "emma-matti-gallery";

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
  fd.append("tags", GALLERY_TAG);
  const res = await fetch(url, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.error?.message || "Uppladdningen till Cloudinary misslyckades",
    );
  }
  return data;
}

function sortGalleryImages(images: GalleryImage[]) {
  return [...images].sort((first, second) =>
    String(second.created_at || "").localeCompare(
      String(first.created_at || ""),
    ),
  );
}

function normalizeCloudinaryList(resources: GalleryImage[]) {
  return sortGalleryImages(resources).map((resource) => ({
    public_id: resource.public_id,
    version: resource.version,
    format: resource.format,
    created_at: resource.created_at,
    secure_url:
      resource.secure_url ||
      `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${resource.version}/${resource.public_id}.${resource.format}`,
    original_filename:
      resource.original_filename || resource.public_id?.split("/").pop(),
  }));
}

export async function listGalleryImages(): Promise<GalleryImage[]> {
  if (!CLOUD_NAME || CLOUD_NAME === "your_cloud_name") {
    throw new Error(
      "Cloudinary saknar cloud name. Kontrollera VITE_CLOUDINARY_CLOUD_NAME.",
    );
  }

  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(GALLERY_TAG)}.json?t=${Date.now()}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "Cloudinary blockerar publik gallerilista. Aktivera Resource list i Cloudinary Security-inställningarna och kontrollera att upload preset taggar bilder med emma-matti-gallery.",
      );
    }

    throw new Error(
      data?.error?.message ||
        "Kunde inte hämta galleriet från Cloudinary. Kontrollera att Resource list är aktiverat och att upload preset taggar bilderna.",
    );
  }

  return normalizeCloudinaryList(data?.resources || []);
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
