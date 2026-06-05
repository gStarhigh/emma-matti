export default function Gallery({ images }: { images: any[] }) {
  return (
    <div className="row">
      {images.map((img) => (
        <div
          key={img.asset_id || img.public_id}
          className="col-6 col-md-3 mb-3"
        >
          <img
            src={img.secure_url || img.url || img.public_url}
            alt={img.original_filename || 'Uppladdad bild'}
            className="img-fluid rounded"
          />
        </div>
      ))}
    </div>
  );
}
