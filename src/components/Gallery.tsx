export type GalleryImage = {
  asset_id?: string;
  public_id?: string;
  secure_url?: string;
  url?: string;
  public_url?: string;
  original_filename?: string;
};

export default function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <div className="row">
      {images.map((img) => (
        <div
          key={img.asset_id || img.public_id}
          className="col-6 col-md-3 mb-3"
        >
          <img
            src={img.secure_url || img.url || img.public_url}
            alt={img.original_filename || "Uppladdad bild"}
            className="img-fluid rounded"
          />
        </div>
      ))}
    </div>
  );
}
