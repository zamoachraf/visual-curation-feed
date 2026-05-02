import type { SavedItem } from "./types";

export const demoItems: SavedItem[] = [
  {
    id: "demo-1",
    source_url: "https://unsplash.com",
    source_title: "Editorial color study",
    site_name: "unsplash.com",
    image_url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    caption: "Strong geometric color and shadow language.",
    is_public: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-2",
    source_url: "https://unsplash.com",
    source_title: "Printed matter reference",
    site_name: "unsplash.com",
    image_url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80",
    caption: "Quiet workspace texture with useful negative space.",
    is_public: true,
    created_at: new Date().toISOString()
  },
  {
    id: "demo-3",
    source_url: "https://unsplash.com",
    source_title: "Architecture reference",
    site_name: "unsplash.com",
    image_url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    caption: null,
    is_public: true,
    created_at: new Date().toISOString()
  }
];
