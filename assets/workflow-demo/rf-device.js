/* WebRF Prototype visual language, adapted to the shared declarative RF runtime. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkRFDevice = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  const icons = {
    receiving: "↓",
    putaway: "⇲",
    picking: "⇱",
    counting: "⟳",
    replenishment: "⇡",
    packing: "▣",
    loading: "⤒",
    receiving_and_putaway: "⇄",
  };
  const action = (key, label, name, primary = false) =>
    '<button type="button" data-rf="' +
    name +
    '" class="' +
    (primary ? "primary" : "") +
    '"><kbd>' +
    key +
    "</kbd><span>" +
    label +
    "</span></button>";
  function render(state, Flow, esc, format = "handheld") {
    const d = state.definition,
      r = state.run,
      active = state.screen === "task" && d && r;
    const v = active ? Flow.view(d, r) : null;
    const t = state.view === "terminal";
    const commands = d?.localized_commands || {};
    const status = state.busy
      ? "AI setup in progress"
      : active
        ? r.error || (r.completed ? "Task complete" : v.label)
        : state.proposal?.ready
          ? "Workflow ready · start from chat"
          : "Describe your warehouse in chat";
    let content, crumb, title, footer;
    if (t) {
      title = "Terminal session";
      crumb = active ? Flow.labels[d.operation] : "WAITING FOR SETUP";
      const lines = active
        ? [
            "QUARK WMS / TERMINAL PREVIEW",
            "--------------------------------",
            Flow.labels[d.operation].toUpperCase() +
              " " +
              Math.min(r.index + 1, d.steps.length) +
              "/" +
              d.steps.length,
            "ITEM : " + d.product.name,
            "SKU  : " + d.product.sku,
            "PACK : " +
              d.product.pack_quantity +
              " " +
              d.product.pack_label +
              " x " +
              d.product.pack_units,
            "UNITS: " + d.total_units,
            "LPN  : " + d.lpn,
            "DOCK : " + r.dock + "  STORED: " + r.stored,
            "--------------------------------",
            r.completed ? "TASK COMPLETED" : v.label.toUpperCase(),
            ...(v.control === "serial"
              ? [
                  "SERIALS: " +
                    (v.code === "capture_serials"
                      ? r.serials.length
                      : r.verified.length) +
                    " / " +
                    d.total_units,
                ]
              : []),
          ]
        : [
            "QUARK WMS / TERMINAL PREVIEW",
            "--------------------------------",
            "WAITING FOR SETUP",
            "",
            "Describe your warehouse in chat.",
          ];
      content =
        '<div class="wd-tui" role="region" aria-label="Terminal session"><pre>' +
        esc(lines.join("\n")) +
        "</pre>";
      if (active && !r.completed)
        content +=
          v.control === "confirm"
            ? "<p>[ENTER] " + esc(commands.primary_btn || "CONFIRM") + "</p>"
            : '<label for="rf-scan" class="wd-terminal-prompt">&gt; <input id="rf-scan" aria-label="' +
              esc(v.label) +
              '" autocomplete="off" maxlength="120" value="' +
              esc(state.scanDraft || "") +
              '"></label>';
      content += "</div>";
      footer =
        active && !r.completed
          ? action(
              "F2",
              esc(
                v.control === "confirm"
                  ? commands.primary_btn || "Confirm"
                  : commands.enter_btn || "Enter",
              ),
              "submit",
              true,
            ) +
            action("F3", "Sample", "sample") +
            action("Esc", "Menu", "menu")
          : action("F1", "Chat", "chat", true) +
            (d ? action("F4", "Restart", "restart") : "");
    } else if (!active) {
      title = "Main menu";
      crumb = "MAIN MENU · PAGE " + (state.menuPage + 1) + " OF 2";
      const ops = Flow.operations.slice(
        state.menuPage * 6,
        state.menuPage * 6 + 6,
      );
      content =
        '<div class="wd-menu" aria-label="Warehouse processes">' +
        ops
          .map(
            (op, i) =>
              '<button type="button" class="wd-tile" data-rf="choose" data-op="' +
              op +
              '" ' +
              (state.busy ? "disabled" : "") +
              '><span class="wd-tile-icon">' +
              icons[op] +
              "</span><kbd>" +
              (i + 1) +
              "</kbd><strong>" +
              esc(Flow.labels[op]) +
              "</strong><small>" +
              esc(
                op === "receiving"
                  ? "Receive goods"
                  : op === "putaway"
                    ? "Stow to bin"
                    : op === "picking"
                      ? "Pick orders"
                      : "Try this operation",
              ) +
              "</small></button>",
          )
          .join("") +
        "</div>";
      footer =
        action("F1", "Setup chat", "chat", true) +
        (state.run ? action("Enter", "Resume", "resume") : "") +
        '<div class="wd-pager">' +
        action("‹", "Previous", "prev") +
        "<span>" +
        (state.menuPage + 1) +
        "/2</span>" +
        action("›", "Next", "next") +
        "</div>";
    } else {
      title = r.completed ? "Task complete" : Flow.labels[d.operation];
      crumb =
        "LOCAL RF SIMULATION · " +
        Math.min(r.index + 1, d.steps.length) +
        " OF " +
        d.steps.length;
      const rows = [
        ["Product", d.product.name],
        ["SKU", d.product.sku],
        ["LPN", d.lpn],
        [
          "Packaging",
          d.product.pack_quantity +
            " " +
            d.product.pack_label +
            " × " +
            d.product.pack_units,
        ],
        ["Base units", d.total_units],
      ];
      content =
        '<div class="wd-scan-strip ' +
        (r.error ? "is-error" : "") +
        '"><i></i>' +
        esc(r.completed ? "Completed" : v.label) +
        "<b>" +
        Math.min(r.index + 1, d.steps.length) +
        "/" +
        d.steps.length +
        '</b></div><div class="wd-fields">' +
        rows
          .map(
            ([label, value]) =>
              '<div class="wd-field"><span>' +
              label +
              "</span><strong>" +
              esc(value) +
              "</strong></div>",
          )
          .join("");
      if (!r.completed) {
        if (v.control === "confirm")
          content +=
            '<div class="wd-confirm"><strong>' +
            esc(v.label) +
            "</strong><p>Review the accepted scans, then confirm.</p></div>";
        else {
          const label =
            v.control === "number"
              ? v.label + " (" + d.product.pack_label + ")"
              : v.label;
          content +=
            '<label class="wd-field wd-active" for="rf-scan"><span>' +
            esc(label) +
            '</span><input id="rf-scan" aria-label="' +
            esc(label) +
            '" type="' +
            (v.control === "date" ? "date" : "text") +
            '" ' +
            (v.control === "number" ? 'inputmode="numeric"' : "") +
            ' autocomplete="off" maxlength="120" placeholder="Scan or type" value="' +
            esc(state.scanDraft || "") +
            '"></label>';
        }
        if (v.control === "serial")
          content +=
            '<div class="wd-track">' +
            (v.code === "capture_serials"
              ? r.serials.length
              : r.verified.length) +
            " / " +
            d.total_units +
            " serials accepted</div>";
        const sample = Flow.expected(d, r);
        if (v.control !== "confirm")
          content +=
            '<button type="button" class="wd-sample" data-rf="sample">Use sample · ' +
            esc(sample) +
            "</button>";
      } else
        content +=
          '<div class="wd-completed">✓<strong>' +
          d.total_units +
          " base units</strong><span>" +
          esc(Flow.labels[d.operation]) +
          " completed</span><small>This was a local simulation.</small></div>";
      content += "</div>";
      const bottom =
        v.control === "confirm"
          ? commands.primary_btn || "Confirm"
          : commands.enter_btn || "Enter";
      footer = r.completed
        ? action("F4", "Restart", "restart", true) +
          action("Esc", "Menu", "menu")
        : action("Enter", esc(bottom), "submit", true) +
          action("F3", "Sample", "sample") +
          action("Esc", "Menu", "menu");
    }
    const glass =
      '<div class="wd-glass ' +
      (t ? "terminal-glass" : "") +
      '"><div class="wd-statusbar"><b>WebRF</b><span>op.demo · DEMO-WH</span><span class="wd-sim">SIM</span></div><header class="wd-header"><small>' +
      esc(crumb) +
      "</small><h2>" +
      esc(title) +
      '</h2></header><div class="wd-body">' +
      content +
      '</div><div class="wd-status ' +
      (r?.error && active ? "error" : r?.completed && active ? "ok" : "") +
      '" role="status">' +
      esc(status) +
      '</div><footer class="wd-actions">' +
      footer +
      "</footer></div>";
    return shell(glass, format);
  }
  function shell(glass, format = "handheld") {
    const keys = [
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "↑",
      "↓",
      "←",
      "→",
      "ESC",
      "TAB",
      "SP",
      "·",
      "BKSP",
      "ENT",
    ];
    return (
      '<div class="wd-fit" data-format="' +
      format +
      '"><div class="wd-frame ' +
      (format === "forklift" ? "wd-forklift" : "wd-handheld") +
      '"><div class="wd-scanner">━ SCANNER ━</div>' +
      glass +
      (format === "handheld"
        ? '<div class="wd-hardkeys" aria-label="Handheld keyboard">' +
          keys
            .map(
              (k) =>
                '<button type="button" data-hardkey="' +
                k +
                '" aria-label="Device key ' +
                k +
                '">' +
                k +
                "</button>",
            )
            .join("") +
          "</div>"
        : '<div class="wd-forklift-name">FORKLIFT TERMINAL · SIMULATION</div>') +
      "</div></div>"
    );
  }
  return { render, shell };
});
