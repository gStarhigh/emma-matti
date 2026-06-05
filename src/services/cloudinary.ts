// Minimal Cloudinary helper for unsigned uploads (placeholders only)
export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

export async function uploadImage(file: File) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(url, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return await res.json();
}

export function thumbnailUrl(publicId: string, opts: {width?:number,height?:number}={}){
  const {width,height} = opts;
  let params = '';
  if(width) params += `w_${width},`;
  if(height) params += `h_${height},`;
  if(params) params = params.slice(0,-1) + '/';
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params}${publicId}`;
}
