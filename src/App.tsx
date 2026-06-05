import { useEffect, useMemo, useState } from "react";
import { Gallery, UploadForm } from "./components";
import "./App.css";

const placeholderImages = [
  {
    asset_id: "placeholder-1",
    original_filename: "Porträtt i gyllene timmen",
    secure_url:
      "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80",
  },
  {
    asset_id: "placeholder-2",
    original_filename: "Detaljer från festbordet",
    secure_url:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  },
  {
    asset_id: "placeholder-3",
    original_filename: "Gäster som firar",
    secure_url:
      "https://images.unsplash.com/photo-1523438097201-512ae7d59cbb?auto=format&fit=crop&w=900&q=80",
  },
  {
    asset_id: "placeholder-4",
    original_filename: "Belysning från festen",
    secure_url:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80",
  },
];

export default function App() {
  const [images, setImages] = useState<any[]>([]);
  const [view, setView] = useState<"home" | "tv">(
    window.location.hash === "#/tv" ? "tv" : "home",
  );

  const galleryImages = useMemo(
    () => [...images, ...placeholderImages],
    [images],
  );
  const tvImages = useMemo(
    () => [...galleryImages, ...galleryImages],
    [galleryImages],
  );

  useEffect(() => {
    const syncView = () =>
      setView(window.location.hash === "#/tv" ? "tv" : "home");
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function handleUploaded(res: any) {
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
            {tvImages.map((img, index) => (
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
            En varm startsida där gäster kan ladda upp bilder och bläddra bland
            de senaste minnena.
          </p>

          <div className="hero__stats" aria-label="Gallery highlights">
            <div>
              <strong>01</strong>
              <span>Uppladdade</span>
            </div>
          </div>
        </div>

        <div className="hero__imageCard">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
            alt="Festbord med blommor och levande ljus"
          />
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
