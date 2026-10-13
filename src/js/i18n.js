// English-only language configuration

export function getCurrentLanguage() {
  return "en";
}

export function setLanguage(lang = "en") {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", "en");
  }
}

export function initLanguageSwitcher() {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("lang", "en");
    // Clean up any legacy language preferences
    try {
      localStorage.setItem("site_lang", "en");
    } catch (_) {}
  }
}

// Ensure html lang attribute is set to English
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageSwitcher);
  } else {
    initLanguageSwitcher();
  }
}
