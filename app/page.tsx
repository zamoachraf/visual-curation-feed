import Link from "next/link";
import { demoItems } from "@/lib/demo-items";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { SavedItem } from "@/lib/types";

export const revalidate = 0;

export default async function FeedPage() {
  if (!hasSupabaseEnv()) {
    return <FeedShell items={demoItems} isDemo />;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_items")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const items = (data || []) as SavedItem[];

  return <FeedShell items={items} />;
}

function FeedShell({ items, isDemo = false }: { items: SavedItem[]; isDemo?: boolean }) {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Visual Curation Feed</h1>
          <p>
            {isDemo
              ? "Demo mode is showing sample visuals until Supabase credentials are added."
              : "A living public board of saved visual references, collected by hand from the open web."}
          </p>
        </div>
        <Link className="nav-link" href="/dashboard">
          Dashboard
        </Link>
      </header>

      {items.length === 0 ? (
        <section className="empty">
          <p>No saved visuals yet.</p>
        </section>
      ) : (
        <section className="feed" aria-label="Saved visual references">
          {items.map((item) => (
            <article className="feed-card" key={item.id}>
              <a href={item.source_url} target="_blank" rel="noreferrer">
                <img src={item.image_url} alt={item.caption || item.source_title || item.site_name} loading="lazy" />
              </a>
              <div className="feed-card__body">
                <a className="feed-card__source" href={item.source_url} target="_blank" rel="noreferrer">
                  {item.site_name}
                </a>
                {item.caption ? <p className="feed-card__caption">{item.caption}</p> : null}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
