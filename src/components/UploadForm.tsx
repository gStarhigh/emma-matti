import React, { useState } from "react";
import { uploadImage } from "../services/cloudinary";
import type { GalleryImage } from "../types/gallery";

export default function UploadForm({
  onUploaded,
}: {
  onUploaded: (res: GalleryImage) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Välj en fil");
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await uploadImage(file);
      onUploaded(res);
      setSuccess("Bilden har laddats upp och syns nu i galleriet.");
      setFile(null);
      setFileInputKey((currentKey) => currentKey + 1);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Uppladdningen misslyckades",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] || null);
    setError(null);
    setSuccess(null);
  }

  return (
    <form onSubmit={submit} className="mb-3">
      <div className="mb-3">
        <input
          key={fileInputKey}
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Laddar upp..." : "Ladda upp"}
      </button>
    </form>
  );
}
