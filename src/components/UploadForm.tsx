import React, { useState } from 'react';
import { uploadImage } from '../services/cloudinary';

export default function UploadForm({ onUploaded }: { onUploaded: (res:any)=>void }){
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent){
    e.preventDefault();
    if(!file) return setError('Select a file');
    setLoading(true); setError(null);
    try{
      const res = await uploadImage(file);
      onUploaded(res);
    }catch(err:any){
      setError(err.message || 'Upload error');
    }finally{setLoading(false)}
  }

  return (
    <form onSubmit={submit} className="mb-3">
      <div className="mb-3">
        <input type="file" className="form-control" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button className="btn btn-primary" disabled={loading}>{loading? 'Uploading...':'Upload'}</button>
    </form>
  );
}
