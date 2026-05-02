export type SavedItem = {
  id: string;
  source_url: string;
  source_title: string;
  site_name: string;
  image_url: string;
  caption: string | null;
  is_public: boolean;
  created_at: string;
};

export type SaveImagePayload = {
  images: string[];
  sourceUrl: string;
  sourceTitle?: string;
  caption?: string;
};
