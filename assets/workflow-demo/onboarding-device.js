/* Presentation only. Every action is resolved by onboarding-machine.js. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkOnboardingDevice = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  const words = {
    sq: {
      scan: "Skano",
      confirm: "Konfirmo",
      retry: "Zbato dhe provo përsëri",
      complete: "Detyra përfundoi",
      ready: "Menuja e operatorit",
    },
    en: {
      scan: "Scan",
      confirm: "Confirm",
      retry: "Apply correction & retry",
      complete: "Task complete",
      ready: "Operator menu",
    },
    ro: {
      scan: "Scanează",
      confirm: "Confirmă",
      retry: "Aplică și reîncearcă",
      complete: "Sarcină finalizată",
      ready: "Meniu operator",
    },
    bg: {
      scan: "Сканирай",
      confirm: "Потвърди",
      retry: "Приложи и опитай отново",
      complete: "Задачата е завършена",
      ready: "Меню на оператора",
    },
    el: {
      scan: "Σάρωση",
      confirm: "Επιβεβαίωση",
      retry: "Εφαρμογή και επανάληψη",
      complete: "Η εργασία ολοκληρώθηκε",
      ready: "Μενού χειριστή",
    },
    sr: {
      scan: "Skeniraj",
      confirm: "Potvrdi",
      retry: "Primeni i pokušaj ponovo",
      complete: "Zadatak završen",
      ready: "Meni operatera",
    },
    pl: {
      scan: "Skanuj",
      confirm: "Potwierdź",
      retry: "Zastosuj i ponów",
      complete: "Zadanie ukończone",
      ready: "Menu operatora",
    },
    cs: {
      scan: "Skenovat",
      confirm: "Potvrdit",
      retry: "Použít a zkusit znovu",
      complete: "Úkol dokončen",
      ready: "Nabídka operátora",
    },
    ru: {
      scan: "Сканировать",
      confirm: "Подтвердить",
      retry: "Применить и повторить",
      complete: "Задание завершено",
      ready: "Меню кладовщика",
    },
  };
  const field = (label, value, esc) =>
    '<div class="wd-field"><span>' +
    esc(label) +
    "</span><strong>" +
    esc(value) +
    "</strong></div>";
  function terminal(text, esc, controls = "") {
    return (
      '<div class="wd-tui" role="region" aria-label="Terminal session"><pre>' +
      esc(text) +
      "</pre>" +
      controls +
      "</div>"
    );
  }
  function render(
    machine,
    { esc, shell, view = "webrf", format = "handheld", draft = "" },
  ) {
    const s = machine.state,
      v = machine.screen(),
      w = words[s.preferences.language] || words.en,
      milk = s.facts.goods === "expiry" ? "MILK-1L" : "SOAP-500";
    const scanned = (key) =>
      s.accepted?.find(
        (a) =>
          a.operation === s.stage &&
          a.key === key &&
          (s.stage !== "picking" || a.line === s.line),
      )?.value || "Awaiting scan";
    let title,
      body,
      foot = "",
      status = "",
      crumb = "GUIDED SIMULATION";
    if (v) {
      title = {
        receiving: "Receiving RECV-10042",
        putaway: "Putaway PUT-2041",
        picking: "Picking SO-10428",
      }[v.operation];
      crumb += " · " + (v.index + 1) + "/" + v.total;
      const rows =
        v.operation === "receiving"
          ? [
              ["Pallet", scanned("pallet")],
              ["Product", scanned("product")],
              ["Expected", "48 EA · 2 cases × 24"],
            ]
          : v.operation === "putaway"
            ? [
                ["Pallet", scanned("pallet")],
                ["Contents", milk + " · 48 EA"],
                ["Suggested bin", "A-01-02"],
                ["Scanned destination", scanned("destination")],
              ]
            : [
                ["Order", "SO-10428 · line " + (s.line + 1) + "/2"],
                ["Source", scanned("source")],
                ["Product", scanned("product")],
                ["Quantity", s.line ? "6 EA" : "12 EA"],
              ];
      body =
        '<div class="wd-scan-strip ' +
        (s.error ? "is-error" : "") +
        '"><i></i>' +
        esc(v.label) +
        "<b>" +
        (v.index + 1) +
        "/" +
        v.total +
        '</b></div><div class="wd-fields">' +
        rows
          .filter((r, i) => !s.preferences.simple || i !== 0)
          .map((r) => field(...r, esc))
          .join("");
      if (s.preferences.image)
        body +=
          '<div class="on-product-image" aria-label="Sample product illustration"><svg viewBox="0 0 100 80" role="img"><title>Sample carton illustration</title><path d="M32 20h36l10 16v37H22V36z" fill="#d8f5ef" stroke="currentColor" stroke-width="2"/><path d="M32 20v16h46M50 36v37" fill="none" stroke="currentColor"/><text x="50" y="57" text-anchor="middle" font-size="9">' +
          esc(milk) +
          "</text></svg></div>";
      if (v.operation === "putaway")
        body +=
          '<p class="on-device-help">Sample zone match · free capacity. Target scan verifies the suggested bin.</p>';
      if (v.kind === "confirm")
        body +=
          '<div class="wd-confirm">Review the accepted scans and complete this step.</div>';
      else if (v.kind === "scan" || v.kind === "unit")
        body +=
          '<div class="on-device-help">' +
          esc(
            v.kind === "unit"
              ? s.unitsScanned + " / 48 units scanned"
              : "Expected: " + v.expected,
          ) +
          "</div>";
      else
        body +=
          '<label class="wd-field wd-active" for="on-input"><span>' +
          esc(v.kind === "date" ? "Expiry date" : "Quantity (EA)") +
          '</span><input id="on-input" aria-label="' +
          esc(v.kind === "date" ? "Expiry date" : "Quantity (EA)") +
          '" type="' +
          (v.kind === "date" ? "date" : "text") +
          '" ' +
          (v.kind === "number" ? 'inputmode="numeric"' : "") +
          ' autocomplete="off" value="' +
          esc(draft) +
          '"></label>';
      const faultKey = v.operation === "putaway" ? "destination" : "product";
      if (v.key === faultKey && !s.faults[v.operation] && !s.correction)
        body +=
          '<div class="on-fault-test"><b>Controlled error test</b><p>The next Scan deliberately tests an incorrect barcode.</p></div>';
      body += "</div>";
      status = s.error || v.label;
      if (s.correction)
        foot =
          '<button class="primary" data-action="correction">' +
          esc(w.retry) +
          "</button>";
      else
        foot =
          '<button class="primary" data-action="' +
          (v.kind === "scan" || v.kind === "unit" ? "scan" : "submit") +
          '">' +
          esc(v.kind === "scan" || v.kind === "unit" ? w.scan : w.confirm) +
          "</button>";
      if (view === "terminal") {
        let controls = "";
        if (["number", "date"].includes(v.kind))
          controls =
            '<label class="on-terminal-input" for="on-input">' +
            esc(v.kind === "date" ? "Expiry date" : "Quantity (EA)") +
            ' &gt; <input id="on-input" aria-label="' +
            esc(v.kind === "date" ? "Expiry date" : "Quantity (EA)") +
            '" type="' +
            (v.kind === "date" ? "date" : "text") +
            '" value="' +
            esc(draft) +
            '"></label>';
        if (v.key === faultKey && !s.faults[v.operation] && !s.correction)
          controls +=
            '<div class="on-fault-test"><b>Controlled error test</b><p>The next Scan deliberately tests an incorrect barcode.</p></div>';
        body = terminal(
          [
            "QUARK / GUIDED SIMULATION",
            title,
            ...rows.map(([k, val]) => k.toUpperCase() + ": " + val),
            "-----------------------------",
            v.label,
            v.kind === "unit" ? s.unitsScanned + " / 48 units scanned" : "",
            s.error ? "ERROR: " + s.error : "",
          ].join("\n"),
          esc,
          controls,
        );
      }
    } else if (s.stage === "customize") {
      title = "Handheld layout preview";
      body =
        '<div class="wd-scan-strip"><i></i>Live layout preview</div><div class="wd-fields">' +
        field("Product", milk, esc) +
        (!s.preferences.simple ? field("Pallet", "PLT-000184", esc) : "") +
        field("Quantity", "12 EA", esc) +
        field(
          "Quantity confirmation",
          s.preferences.quantity ? "Required" : "Optional",
          esc,
        ) +
        (s.preferences.codes
          ? field("Action codes", "1 Scan · 2 Confirm", esc)
          : "") +
        (s.preferences.image
          ? '<div class="on-product-image"><svg viewBox="0 0 100 80"><title>Sample carton</title><path d="M25 18h50v55H25z" fill="#d8f5ef" stroke="currentColor"/><text x="50" y="48" text-anchor="middle" font-size="9">' +
            esc(milk) +
            "</text></svg></div>"
          : "") +
        (s.preferences.reasons
          ? '<p class="on-device-help">Wrong product. Scan ' +
            esc(milk) +
            ".</p>"
          : "") +
        "</div>";
      status = "Preview only · no stock change";
      foot = '<button data-action="test-sound">Test error feedback</button>';
    } else if (["permissions", "result", "approved"].includes(s.stage)) {
      title = w.ready;
      body =
        '<div class="wd-menu on-operator-menu">' +
        ["Receiving", "Putaway", "Picking"]
          .map(
            (name, i) =>
              '<div class="wd-tile"><span class="wd-tile-icon">' +
              ["↓", "⇲", "⇱"][i] +
              "</span><strong>" +
              name +
              "</strong><small>Assigned process</small></div>",
          )
          .join("") +
        '</div><div class="on-device-help">Warehouse Operator<br>Only assigned warehouse tasks.<br>No administration access.</div>';
      status = "Simulated role · 3 processes";
      if (s.stage === "permissions")
        foot =
          '<button class="primary" data-action="next">Review onboarding result →</button>';
    } else if (s.stage.endsWith("_review")) {
      title = w.complete;
      body =
        '<div class="wd-completed">✓<strong>' +
        esc(s.stage.replace("_review", "")) +
        "</strong><span>Sample checks passed</span><small>No live warehouse changes</small></div>";
      status = "Review the configuration change in chat";
    } else {
      title = "Warehouse Operator";
      body =
        '<div class="wd-completed"><span class="on-wait-icon">⌁</span><strong>Your mobile processes</strong><span>Receiving · Putaway · Picking</span><small>Confirm warehouse facts in chat to prepare the sample.</small></div>';
      status =
        s.stage === "configuration"
          ? "Preparing the sample configuration"
          : "Waiting for warehouse facts";
    }
    if (view === "terminal" && !v) {
      const lines = [
        "QUARK / GUIDED SIMULATION",
        title,
        "-----------------------------",
      ];
      if (["permissions", "result", "approved"].includes(s.stage))
        lines.push(
          "WAREHOUSE OPERATOR",
          "[1] Receiving",
          "[2] Putaway",
          "[3] Picking",
          "",
          "Only assigned warehouse tasks.",
          "No administration access.",
        );
      else if (s.stage === "customize")
        lines.push(
          "Product: " + milk,
          ...(s.preferences.simple ? [] : ["Pallet: PLT-000184"]),
          s.preferences.quantity
            ? "Quantity: 12 EA · confirmation required"
            : "Quantity: 12 EA",
          s.preferences.reasons
            ? "Wrong product. Scan " + milk + "."
            : "Scan blocked",
          s.preferences.codes ? "[1] SCAN · [2] CONFIRM" : "",
          s.preferences.image ? "Product illustration: WebRF view" : "",
        );
      else if (s.stage.endsWith("_review"))
        lines.push(
          "SAMPLE CHECKS PASSED",
          s.stage.replace("_review", "").toUpperCase(),
        );
      else
        lines.push(
          "Receiving · Putaway · Picking",
          "Confirm warehouse facts in chat.",
        );
      body = terminal(lines.join("\n"), esc);
    }
    const feedback =
      s.feedback && v
        ? '<div class="on-feedback is-' +
          s.feedback.kind +
          '" role="status" aria-live="polite" data-feedback-sequence="' +
          s.feedback.sequence +
          '"><b>' +
          esc(s.feedback.kind === "error" ? "Scan blocked" : s.feedback.label) +
          "</b><strong>" +
          esc(s.feedback.value) +
          "</strong></div>"
        : "";
    const glass =
      '<div class="wd-glass ' +
      (view === "terminal" ? "terminal-glass " : "") +
      (s.preferences.large ? "on-large " : "") +
      '"><div class="wd-statusbar"><b>' +
      (view === "terminal" ? "Terminal" : "WebRF") +
      '</b><span>Warehouse Operator</span><span class="wd-sim">DEMO</span></div><header class="wd-header"><small>' +
      esc(crumb) +
      "</small><h2>" +
      esc(title) +
      "</h2></header>" +
      feedback +
      '<div class="wd-body">' +
      body +
      '</div><div class="wd-status ' +
      (s.error ? "error" : "") +
      '" role="status">' +
      esc(s.preferences.reasons ? status : s.error ? "Scan blocked" : status) +
      '</div><footer class="wd-actions">' +
      foot +
      "</footer></div>";
    return shell(glass, format);
  }
  return { render, words };
});
