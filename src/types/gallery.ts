export type GalleryImage = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  url?: string;
  public_url?: string;
  original_filename?: string;
};

export function getGalleryImageSrc(img: GalleryImage) {
  return img.secure_url || img.url || img.public_url || "";
}
