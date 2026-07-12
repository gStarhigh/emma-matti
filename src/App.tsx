import { useEffect, useMemo, useState } from "react";
import { Gallery, UploadForm } from "./components";
import type { GalleryImage } from "./components/Gallery";
import familyImage from "./assets/familyImage.jpg";
import "./App.css";

export default function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [view, setView] = useState<"home" | "tv">(
    window.location.hash === "#/tv" ? "tv" : "home",
  );

  const galleryImages = useMemo(() => [...images], [images]);
  const visibleImageCount = galleryImages.length.toString().padStart(2, "0");

  useEffect(() => {
    const syncView = () =>
      setView(window.location.hash === "#/tv" ? "tv" : "home");
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function handleUploaded(res: GalleryImage) {
    setImages((prev) => [res, ...prev]);
  }

  function showHome() {
    window.location.hash = "#/";
    setView("home");
  }

  function showTv() {
    window.location.hash = "#/tv";
    setView("tv");
  }

  if (view === "tv") {
    return (
      <main className="tvpage">
        <header className="tvpage__header">
          <div>
            <p className="eyebrow">Livegalleri</p>
            <h1>Emma & Mattis bildvägg</h1>
          </div>
          <button
            className="tvpage__homeButton"
            onClick={showHome}
            type="button"
          >
            Hem
          </button>
        </header>

        <section
          className="tvpage__stage"
          aria-label="Animerat galleri med uppladdade bilder"
        >
          <div className="tvpage__track">
            {galleryImages.map((img, index) => (
              <figure
                key={`${img.asset_id || img.public_id || img.secure_url}-${index}`}
                className="tvpage__tile"
              >
                <img
                  src={img.secure_url || img.url || img.public_url}
                  alt={img.original_filename || "Uppladdad bild"}
                />
              </figure>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="startpage">
      <div className="topbar">
        <button
          className="topbar__link topbar__link--active"
          type="button"
          onClick={showHome}
        >
          Uppladdningssida
        </button>
        <button className="topbar__link" type="button" onClick={showTv}>
          Galleri
        </button>
      </div>

      <section className="hero">
        <div className="hero__content">
          <p className="eyebrow">Emma & Matti</p>
          <h1>Dela era favoritstunder</h1>
          <p className="lead">
            Dela era bilder från dagen med övriga gäster och brudparet!
          </p>

          <div className="hero__stats" aria-label="Gallery highlights">
            <div>
              <strong>{visibleImageCount}</strong>
              <span>Uppladdade</span>
            </div>
          </div>
        </div>

        <div className="hero__imageCard">
          <img src={familyImage} alt="Festbord med blommor och levande ljus" />
          <div className="hero__imageOverlay">
            <span>Bröllopsminnen</span>
            <strong>Elegant, ljust och lätt att bläddra i</strong>
          </div>
        </div>
      </section>

      <section className="uploadSection">
        <div className="sectionHeader">
          <p className="eyebrow">Ladda upp bilder</p>
          <h2>Skicka in era bilder</h2>
        </div>
        <div className="uploadCard">
          <UploadForm onUploaded={handleUploaded} />
        </div>
      </section>

      <section className="gallerySection">
        <div className="sectionHeader">
          <p className="eyebrow">Galleri</p>
          <h2>Senaste uppladdningar</h2>
        </div>
        <div className="galleryFrame">
          <Gallery images={galleryImages} />
        </div>
      </section>
    </main>
  );
}
