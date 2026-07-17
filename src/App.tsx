import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gallery, UploadForm } from "./components";
import { listGalleryImages } from "./services/cloudinary";
import { getGalleryImageSrc, type GalleryImage } from "./types/gallery";
import familyImage from "./assets/familyImage.jpg";
import "./App.css";

const GALLERY_REFRESH_INTERVAL_MS = 30_000;
const AUTO_SCROLL_SPEED_PX_PER_SEC = 40;
const AUTO_SCROLL_RESUME_DELAY_MS = 3_000;

function getImageKey(image: GalleryImage) {
  return image.public_id || image.asset_id || getGalleryImageSrc(image);
}

function mergeImages(images: GalleryImage[]) {
  const imageMap = new Map<string, GalleryImage>();
  images.forEach((image) => {
    const key = getImageKey(image);
    if (key && !imageMap.has(key)) imageMap.set(key, image);
  });
  return [...imageMap.values()].sort((first, second) =>
    String(second.created_at || "").localeCompare(
      String(first.created_at || ""),
    ),
  );
}

export default function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [view, setView] = useState<"home" | "tv">(
    window.location.hash === "#/tv" ? "tv" : "home",
  );
  const tvStageRef = useRef<HTMLDivElement | null>(null);
  const lastInteractionRef = useRef(0);

  const galleryImages = useMemo(() => [...images], [images]);
  const visibleImageCount = galleryImages.length.toString().padStart(2, "0");

  const refreshGalleryImages = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setGalleryLoading(true);
      setGalleryError(null);
    }

    try {
      const cloudinaryImages = await listGalleryImages();
      setImages((prev) => mergeImages([...cloudinaryImages, ...prev]));
    } catch (error: unknown) {
      if (showLoading) {
        setGalleryError(
          error instanceof Error
            ? error.message
            : "Kunde inte hämta galleriet från Cloudinary.",
        );
      }
    } finally {
      if (showLoading) setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => {
      void refreshGalleryImages();
    }, 0);
    return () => window.clearTimeout(refreshTimer);
  }, [refreshGalleryImages]);

  useEffect(() => {
    if (view !== "tv") return;

    const initialRefreshTimer = window.setTimeout(() => {
      void refreshGalleryImages(false);
    }, 0);
    const refreshInterval = window.setInterval(() => {
      void refreshGalleryImages(false);
    }, GALLERY_REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialRefreshTimer);
      window.clearInterval(refreshInterval);
    };
  }, [refreshGalleryImages, view]);

  useEffect(() => {
    if (view !== "tv") return;

    const stage = tvStageRef.current;
    if (!stage) return;

    lastInteractionRef.current = 0;

    const markInteraction = () => {
      lastInteractionRef.current = Date.now();
    };

    stage.addEventListener("touchstart", markInteraction, { passive: true });
    stage.addEventListener("pointerdown", markInteraction);
    stage.addEventListener("wheel", markInteraction, { passive: true });

    let lastTimestamp: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (lastTimestamp === null) lastTimestamp = timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const idleFor = Date.now() - lastInteractionRef.current;
      if (idleFor > AUTO_SCROLL_RESUME_DELAY_MS) {
        const maxScroll = stage.scrollHeight - stage.clientHeight;
        if (maxScroll > 0) {
          const next =
            stage.scrollTop + AUTO_SCROLL_SPEED_PX_PER_SEC * deltaSeconds;
          stage.scrollTop = next >= maxScroll ? 0 : next;
        }
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      stage.removeEventListener("touchstart", markInteraction);
      stage.removeEventListener("pointerdown", markInteraction);
      stage.removeEventListener("wheel", markInteraction);
    };
  }, [view, galleryImages.length]);

  useEffect(() => {
    if (!selectedImage) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedImage]);

  const lightbox = selectedImage ? (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Bild i helskärm"
      onClick={() => setSelectedImage(null)}
    >
      <button
        className="lightbox__close"
        type="button"
        onClick={() => setSelectedImage(null)}
        aria-label="Stäng helskärmsbild"
      >
        Stäng ×
      </button>
      <img
        src={getGalleryImageSrc(selectedImage)}
        alt={selectedImage.original_filename || "Uppladdad bild"}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  ) : null;

  useEffect(() => {
    const syncView = () =>
      setView(window.location.hash === "#/tv" ? "tv" : "home");
    window.addEventListener("hashchange", syncView);
    return () => window.removeEventListener("hashchange", syncView);
  }, []);

  function handleUploaded(res: GalleryImage) {
    setImages((prev) => mergeImages([res, ...prev]));
    window.setTimeout(() => void refreshGalleryImages(), 1500);
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
          ref={tvStageRef}
        >
          <div className="tvpage__track">
            {galleryImages.map((img, index) => (
              <figure
                key={`${img.asset_id || img.public_id || img.secure_url}-${index}`}
                className="tvpage__tile"
              >
                <button
                  className="tvpage__imageButton"
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  aria-label={`Visa ${img.original_filename || "uppladdad bild"} i helskärm`}
                >
                  <img
                    src={getGalleryImageSrc(img)}
                    alt={img.original_filename || "Uppladdad bild"}
                  />
                </button>
              </figure>
            ))}
          </div>
        </section>
        {lightbox}
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
          {galleryLoading && (
            <div className="alert alert-info">Hämtar galleriet...</div>
          )}
          {galleryError && (
            <div className="alert alert-warning">{galleryError}</div>
          )}
          <Gallery images={galleryImages} onImageClick={setSelectedImage} />
        </div>
      </section>
      {lightbox}
    </main>
  );
}
