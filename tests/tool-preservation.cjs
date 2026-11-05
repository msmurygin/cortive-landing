// Historical release checks still freeze the original English markup and data engines.
// Permit only the two new local presentation scripts and cost UI deferral required by their order.
module.exports = function withoutToolPresentation(file, text) {
  if (!file.endsWith('.html')) return text;
  return text.replace('<!-- localized-tools --><script src="/assets/i18n/tool-copy.js" defer></script><script src="/assets/i18n/tool-locale.js" defer></script><!-- /localized-tools -->', '')
    .replace('<script src="/assets/seo/cost-ui.js" defer></script>', '<script src="/assets/seo/cost-ui.js"></script>');
};
