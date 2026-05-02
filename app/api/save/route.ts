import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createAdminClient } from "@/lib/supabase/admin";
import { getImageExtension, getSiteName } from "@/lib/site";
import type { SaveImagePayload } from "@/lib/types";

const MAX_IMAGES_PER_REQUEST = 12;
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const configuredKey = process.env.EXTENSION_API_KEY;
  const providedKey = request.headers.get("x-api-key");

  if (!configuredKey || providedKey !== configuredKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as SaveImagePayload;
  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = createAdminClient();
  const saved = [];

  for (const imageUrl of payload.images.slice(0, MAX_IMAGES_PER_REQUEST)) {
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent": "VisualCurationFeed/1.0"
      }
    });

    if (!imageResponse.ok) {
      continue;
    }

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      continue;
    }

    const contentLength = Number(imageResponse.headers.get("content-length") || 0);
    if (contentLength > MAX_IMAGE_BYTES) {
      continue;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      continue;
    }

    const extension = getImageExtension(contentType, imageUrl);
    const storagePath = `${new Date().toISOString().slice(0, 10)}/${nanoid()}.${extension}`;

    const upload = await supabase.storage.from("feed-images").upload(storagePath, arrayBuffer, {
      contentType,
      upsert: false
    });

    if (upload.error) {
      continue;
    }

    const publicUrl = supabase.storage.from("feed-images").getPublicUrl(storagePath).data.publicUrl;
    const insert = await supabase
      .from("saved_items")
      .insert({
        source_url: payload.sourceUrl,
        source_title: payload.sourceTitle || "",
        site_name: getSiteName(payload.sourceUrl),
        image_url: publicUrl,
        caption: payload.caption?.trim() || null,
        is_public: true
      })
      .select()
      .single();

    if (!insert.error) {
      saved.push(insert.data);
    }
  }

  return NextResponse.json({ saved });
}

function validatePayload(payload: SaveImagePayload) {
  if (!payload || !Array.isArray(payload.images) || payload.images.length === 0) {
    return "At least one image is required.";
  }

  if (payload.images.length > MAX_IMAGES_PER_REQUEST) {
    return `Save up to ${MAX_IMAGES_PER_REQUEST} images at a time.`;
  }

  if (!payload.sourceUrl || !isHttpUrl(payload.sourceUrl)) {
    return "A valid source URL is required.";
  }

  for (const imageUrl of payload.images) {
    if (!isHttpUrl(imageUrl)) {
      return "Every image must have a valid URL.";
    }
  }

  return "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
