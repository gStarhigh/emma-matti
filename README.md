Emma & Matti - Wedding image site (React + TypeScript + Bootstrap)

Setup
1. Copy .env.example to .env.local and set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET (unsigned upload preset).
2. npm install
3. npm run dev

Notes
- This project uses unsigned client-side Cloudinary uploads for simplicity. For production, implement signed uploads.
- Cloudinary: create an upload preset (unsigned) in Settings -> Upload in your Cloudinary dashboard.
