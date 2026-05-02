"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Save, Trash2 } from "lucide-react";
import type { SavedItem } from "@/lib/types";

export default function DashboardControls({ items }: { items: SavedItem[] }) {
  const [rows, setRows] = useState(items);
  const [isPending, startTransition] = useTransition();

  function updateRow(id: string, patch: Partial<SavedItem>) {
    setRows((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function saveItem(item: SavedItem, patch: Partial<SavedItem>) {
    startTransition(async () => {
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });

      if (!response.ok) {
        updateRow(item.id, item);
        alert("Could not save that change.");
      }
    });
  }

  function deleteItem(item: SavedItem) {
    startTransition(async () => {
      setRows((current) => current.filter((row) => row.id !== item.id));
      const response = await fetch(`/api/items/${item.id}`, { method: "DELETE" });

      if (!response.ok) {
        setRows((current) => [item, ...current]);
        alert("Could not delete that item.");
      }
    });
  }

  if (rows.length === 0) {
    return (
      <section className="empty">
        <p>No saved visuals yet.</p>
      </section>
    );
  }

  return (
    <section className="dashboard-list" aria-busy={isPending}>
      {rows.map((item) => (
        <article className="dashboard-row" key={item.id}>
          <img src={item.image_url} alt={item.source_title || item.site_name} />
          <div>
            <a className="feed-card__source" href={item.source_url} target="_blank" rel="noreferrer">
              {item.site_name}
            </a>
            <textarea
              aria-label={`Caption for ${item.site_name}`}
              value={item.caption || ""}
              onChange={(event) => updateRow(item.id, { caption: event.target.value })}
              onBlur={(event) => saveItem(item, { caption: event.currentTarget.value })}
            />
          </div>
          <div className="row-actions">
            <button
              className="button"
              type="button"
              title={item.is_public ? "Hide from public feed" : "Show on public feed"}
              onClick={() => {
                updateRow(item.id, { is_public: !item.is_public });
                saveItem(item, { is_public: !item.is_public });
              }}
            >
              {item.is_public ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button className="button" type="button" title="Save caption" onClick={() => saveItem(item, { caption: item.caption || null })}>
              <Save size={18} />
            </button>
            <button className="button danger" type="button" title="Delete item" onClick={() => deleteItem(item)}>
              <Trash2 size={18} />
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
