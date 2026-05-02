import { redirect } from "next/navigation";
import { demoItems } from "@/lib/demo-items";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { SavedItem } from "@/lib/types";
import DashboardControls from "./ui";

export const revalidate = 0;

export default async function DashboardPage() {
  if (!hasSupabaseEnv()) {
    return (
      <main className="shell">
        <header className="topbar">
          <div className="brand">
            <h1>Dashboard</h1>
            <p>Demo mode is unlocked until Supabase credentials are added.</p>
          </div>
        </header>
        <DashboardControls items={demoItems} />
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("saved_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Dashboard</h1>
          <p>Edit captions, hide references, or remove saved visuals.</p>
        </div>
      </header>
      <DashboardControls items={(data || []) as SavedItem[]} />
    </main>
  );
}
