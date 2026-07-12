import { getGalleryImageSrc, type GalleryImage } from "../types/gallery";

export default function Gallery({
  images,
  onImageClick,
}: {
  images: GalleryImage[];
  onImageClick?: (image: GalleryImage) => void;
}) {
  return (
    <div className="row">
      {images.map((img) => (
        <div
          key={img.asset_id || img.public_id}
          className="col-6 col-md-3 mb-3"
        >
          <button
            className="galleryImageButton"
            type="button"
            onClick={() => onImageClick?.(img)}
            aria-label={`Visa ${img.original_filename || "uppladdad bild"} i helskärm`}
          >
            <img
              src={getGalleryImageSrc(img)}
              alt={img.original_filename || "Uppladdad bild"}
              className="img-fluid rounded"
            />
          </button>
        </div>
      ))}
    </div>
  );
}
