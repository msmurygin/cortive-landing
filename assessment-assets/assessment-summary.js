/* Presentation only: all conclusions come from the unchanged assessment engine. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuarkAssessmentSummary = api;
})(typeof window === 'object' ? window : globalThis, function () {
  function unique(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.action.trim().replace(/\s+/g, ' ').toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  function summarize(report) {
    const ordered = [...report.recommendations].sort((a, b) => a.priority - b.priority);
    const unknowns = ordered.filter(item => item.conclusionType === 'unknown');
    const important = [...unknowns].sort((a, b) =>
      Number(b.ruleId.startsWith('conflict:')) - Number(a.ruleId.startsWith('conflict:')) ||
      Number(b.supportingAnswers.some(x => report.implementationReadiness.unknownInputs.includes(x.answerKey))) -
      Number(a.supportingAnswers.some(x => report.implementationReadiness.unknownInputs.includes(x.answerKey))) || a.priority - b.priority);
    const actions = unique(ordered).slice(0, 3), shown = new Set(actions.map(item => item.ruleId));
    return {readiness: report.implementationReadiness.level, actions,
      unknowns: unique(important.filter(item => !shown.has(item.ruleId))).slice(0, 3), totalUnknowns: unknowns.length};
  }
  return {summarize};
});
