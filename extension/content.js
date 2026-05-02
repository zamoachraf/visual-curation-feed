(() => {
  const EXISTING = "visual-curation-overlay";
  const MIN_SIZE = 200;
  const BLOCKED_NAMES = /icon|logo|avatar|sprite|pixel|badge|tracking/i;

  document.getElementById(EXISTING)?.remove();

  const images = Array.from(document.images)
    .map((img) => ({
      url: img.currentSrc || img.src,
      width: img.naturalWidth || img.clientWidth,
      height: img.naturalHeight || img.clientHeight,
      alt: img.alt || ""
    }))
    .filter((image) => {
      if (!image.url || !/^https?:\/\//.test(image.url)) return false;
      if (image.width < MIN_SIZE || image.height < MIN_SIZE) return false;
      if (BLOCKED_NAMES.test(image.url)) return false;
      return true;
    })
    .filter((image, index, list) => list.findIndex((candidate) => candidate.url === image.url) === index);

  const selected = new Set();
  const root = document.createElement("div");
  root.id = EXISTING;
  root.innerHTML = `
    <div class="vcf-backdrop"></div>
    <section class="vcf-panel" role="dialog" aria-modal="true" aria-label="Save visuals">
      <header class="vcf-header">
        <div>
          <strong>Save visuals</strong>
          <span>${images.length} images found</span>
        </div>
        <button class="vcf-icon-button" data-close title="Close">x</button>
      </header>
      <div class="vcf-grid"></div>
      <footer class="vcf-footer">
        <textarea placeholder="Optional caption"></textarea>
        <button class="vcf-save" disabled>Save selected</button>
      </footer>
    </section>
  `;

  document.body.append(root);

  const grid = root.querySelector(".vcf-grid");
  const saveButton = root.querySelector(".vcf-save");
  const caption = root.querySelector("textarea");

  if (images.length === 0) {
    grid.innerHTML = `<p class="vcf-empty">No large page images found.</p>`;
  } else {
    for (const image of images) {
      const button = document.createElement("button");
      button.className = "vcf-tile";
      button.type = "button";
      button.innerHTML = `<img src="${escapeAttribute(image.url)}" alt="${escapeAttribute(image.alt)}"><span>✓</span>`;
      button.addEventListener("click", () => {
        if (selected.has(image.url)) {
          selected.delete(image.url);
          button.classList.remove("is-selected");
        } else {
          selected.add(image.url);
          button.classList.add("is-selected");
        }
        saveButton.disabled = selected.size === 0;
        saveButton.textContent = selected.size === 0 ? "Save selected" : `Save ${selected.size}`;
      });
      grid.append(button);
    }
  }

  root.querySelector("[data-close]").addEventListener("click", () => root.remove());
  root.querySelector(".vcf-backdrop").addEventListener("click", () => root.remove());

  saveButton.addEventListener("click", async () => {
    const settings = await chrome.storage.sync.get(["apiBaseUrl", "apiKey"]);
    if (!settings.apiBaseUrl || !settings.apiKey) {
      alert("Set the API URL and key in the extension options first.");
      return;
    }

    saveButton.disabled = true;
    saveButton.textContent = "Saving...";

    const response = await fetch(`${settings.apiBaseUrl.replace(/\/$/, "")}/api/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": settings.apiKey
      },
      body: JSON.stringify({
        images: Array.from(selected),
        sourceUrl: location.href,
        sourceTitle: document.title,
        caption: caption.value
      })
    });

    if (!response.ok) {
      saveButton.disabled = false;
      saveButton.textContent = "Try again";
      alert("Could not save those images.");
      return;
    }

    saveButton.textContent = "Saved";
    setTimeout(() => root.remove(), 650);
  });

  function escapeAttribute(value) {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  }
})();
