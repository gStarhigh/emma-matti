Emma & Matti - Wedding image site (React + TypeScript + Bootstrap)

Setup
1. Install Node.js 20.19+ or 22.13+ (`node -v` should not report Node 16, 18, or 22.12).
2. Copy .env.example to .env.local and set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET (unsigned upload preset).
3. npm install
4. npm run dev

If PowerShell blocks `npm.ps1`, run the dev server with:

```powershell
cmd /c npm run dev
```

Cloudinary upload setup
1. In Cloudinary, go to Settings -> Upload -> Upload presets.
2. Create or edit an unsigned upload preset.
3. Set Signing Mode to Unsigned.
4. Optionally set a folder such as `emma-matti` and restrict allowed formats to images.
5. Put only these public values in `.env.local`:
	- `VITE_CLOUDINARY_CLOUD_NAME`: your Cloudinary cloud name.
	- `VITE_CLOUDINARY_UPLOAD_PRESET`: the unsigned preset name.
	- `VITE_CLOUDINARY_GALLERY_TAG`: the shared gallery tag, default `emma-matti-gallery`.

Shared gallery setup
- The app tags new uploads with `VITE_CLOUDINARY_GALLERY_TAG` and fetches all images with that tag from Cloudinary.
- In Cloudinary, go to Settings -> Security and allow public Resource list delivery. If `https://res.cloudinary.com/<cloud-name>/image/list/<tag>.json` returns 401, Resource list is still blocked.
- In the unsigned upload preset, add the tag `emma-matti-gallery` as a preset tag as well. The app also sends the tag on upload, but setting it in the preset is more reliable for unsigned uploads.
- Existing uploads made before this tag was added must be manually tagged with `emma-matti-gallery` in Cloudinary if you want them to appear after reload.
- Everyone sees the same gallery after reload because the image list is loaded from Cloudinary, not browser storage.
- For GitHub Pages only, `https://res.cloudinary.com/<cloud-name>/image/list/<tag>.json` must return JSON. If it returns 401, Cloudinary is blocking the public list and the static site cannot load the shared gallery after reload.

Credential placement:
- Cloud name: goes in `.env.local` as `VITE_CLOUDINARY_CLOUD_NAME`.
- Unsigned upload preset: goes in `.env.local` as `VITE_CLOUDINARY_UPLOAD_PRESET`.
- API key: not needed for the current unsigned browser upload flow.
- API secret: never put this in `.env.local`, React, Vite, or any `VITE_` variable.

If you want signed uploads instead, add a small backend/serverless function. In that backend only, store `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`, then have the frontend request a signed upload payload from that backend.

Notes
- This project uses unsigned client-side Cloudinary uploads for simplicity. For production, implement signed uploads.
- Cloudinary: create an upload preset (unsigned) in Settings -> Upload in your Cloudinary dashboard.
