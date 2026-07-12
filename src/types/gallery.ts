export type GalleryImage = {
  asset_id?: string;
  public_id?: string;
  version?: number;
  format?: string;
  secure_url?: string;
  url?: string;
  public_url?: string;
  original_filename?: string;
  created_at?: string;
};

export function getGalleryImageSrc(img: GalleryImage) {
  return img.secure_url || img.url || img.public_url || "";
}
