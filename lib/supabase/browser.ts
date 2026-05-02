"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./config";

export function createClient() {
  const { supabaseUrl, supabaseKey } = getSupabasePublicConfig();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase browser credentials are not configured.");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
