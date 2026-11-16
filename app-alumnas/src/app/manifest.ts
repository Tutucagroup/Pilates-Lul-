import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pilates Lulú",
    short_name: "Pilates Lulú",
    description: "Tu reto de 28 días de pilates en casa.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#faf7f4",
    theme_color: "#faf7f4",
    lang: "es-AR",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
