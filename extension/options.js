const form = document.querySelector("form");
const status = document.querySelector("[role='status']");

chrome.storage.sync.get(["apiBaseUrl", "apiKey"], (settings) => {
  form.apiBaseUrl.value = settings.apiBaseUrl || "";
  form.apiKey.value = settings.apiKey || "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  chrome.storage.sync.set(
    {
      apiBaseUrl: form.apiBaseUrl.value.trim(),
      apiKey: form.apiKey.value.trim()
    },
    () => {
      status.textContent = "Settings saved.";
    }
  );
});
