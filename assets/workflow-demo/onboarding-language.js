/* Locale policy: English by default, explicit URL locale, model-assisted switch by consent. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkOnboardingLanguage = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  const names = {
    en: "English",
    ru: "Русский",
    el: "Ελληνικά",
    bg: "Български",
    sr: "Srpski",
    ro: "Română",
    sq: "Shqip",
  };
  const supported = Object.keys(names);
  function initial(search = "") {
    const value = new URLSearchParams(search).get("lang")?.toLowerCase();
    return supported.includes(value) ? value : "en";
  }
  function suggestion(result, current, declined = []) {
    return result.language_confidence === "high" &&
      supported.includes(result.message_language) &&
      result.message_language !== current &&
      !declined.includes(result.message_language)
      ? result.message_language
      : null;
  }
  return { names, supported, initial, suggestion };
});
