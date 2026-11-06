/* Guided UI controller. AI can explain and extract facts; only the state machine advances tasks. */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s),
    Model = window.QuarkOnboarding,
    machine = Model.create(),
    s = machine.state;
  const Locales = window.QuarkOnboardingLocales;
  const Language = window.QuarkOnboardingLanguage;
  let uiLanguage = Language.initial(location.search),
    suggestedLanguage = null;
  const declinedLanguages = [];
  s.preferences.language = uiLanguage;
  const esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  let view = "webrf",
    format = "handheld",
    draft = "",
    busy = false,
    error = "",
    file = null,
    controller = null,
    generation = 0,
    timer = null,
    seen = 0,
    lastText = "";
  const workspace = $("#workspace");
  function factsHTML() {
    return (
      '<div class="on-facts"><strong>Confirmed warehouse facts</strong>' +
      Model.questions
        .filter((q) => s.facts[q.key])
        .map(
          (q) =>
            "<div><span>" +
            esc(q.text) +
            "</span><b>✓ " +
            esc(q.choices.find(([v]) => v === s.facts[q.key])[1]) +
            "</b></div>",
        )
        .join("") +
      "</div>"
    );
  }
  function diffHTML(change) {
    return (
      '<div class="on-change"><strong>' +
      esc(change.label) +
      "</strong><div><span>Before</span><del>" +
      esc(change.before) +
      "</del></div><div><span>After</span><b>" +
      esc(change.after) +
      "</b></div></div>"
    );
  }
  const button = (name, label, cls = "start-task") =>
    '<button type="button" class="' +
    cls +
    '" data-action="' +
    name +
    '">' +
    label +
    "</button>";
  function controls() {
    if (s.stage === "profile") {
      const q = machine.question();
      return (
        (Object.keys(s.facts).length ? factsHTML() : "") +
        (q
          ? '<div class="on-question"><h3>' +
            esc(q.text) +
            '</h3><div class="quick-replies">' +
            q.choices
              .map(
                ([value, label]) =>
                  '<button type="button" class="chip" data-answer="' +
                  value +
                  '" data-key="' +
                  q.key +
                  '"' +
                  ">" +
                  esc(label) +
                  "</button>",
              )
              .join("") +
            "</div></div>" +
            button("sample", "Use General Distribution sample") +
            '<p class="on-note">The sample includes one expiry-dated milk line. No serial capture.</p>'
          : button("configure", "Prepare mobile processes →"))
      );
    }
    if (s.stage === "configuration")
      return (
        '<div class="on-progress">' +
        Model.progress
          .map(
            (t, i) =>
              '<p class="' +
              (s.configIndex > i ? "done" : "") +
              '">' +
              (s.configIndex > i ? "✓" : "○") +
              " " +
              esc(t) +
              "</p>",
          )
          .join("") +
        "<p>→ Preparing the virtual handheld</p></div>"
      );
    if (s.correction)
      return (
        diffHTML(s.correction) +
        button("correction", "Apply correction & retry →")
      );
    if (s.stage.endsWith("_review")) {
      const change = s.changes.find(
        (c) => c.process === s.stage.replace("_review", ""),
      );
      return (
        (change ? diffHTML(change) : "") +
        button(
          "next",
          s.stage === "receiving_review"
            ? "Test putaway →"
            : s.stage === "putaway_review"
              ? "Test picking →"
              : "Customize the handheld →",
        )
      );
    }
    if (s.stage === "customize")
      return (
        '<div class="on-preferences"><h3>Make the handheld fit your team</h3>' +
        [
          ["large", "Larger text"],
          ["simple", "Hide extra fields"],
          ["image", "Show sample product illustration"],
          ["sound", "Play an error sound"],
          ["codes", "Enable short action codes"],
          ["reasons", "Show why a scan is blocked"],
          ["quantity", "Confirm quantity before completion"],
        ]
          .map(
            ([k, label]) =>
              '<label><input type="checkbox" data-pref="' +
              k +
              '" ' +
              (s.preferences[k] ? "checked" : "") +
              "><span>" +
              label +
              "</span></label>",
          )
          .join("") +
        '<p class="on-note">The assistant can offer to switch the language when you write in another language.</p></div>' +
        button("next", "Check operator permissions →")
      );
    if (s.stage === "permissions")
      return (
        '<div class="on-permissions"><h3>Warehouse Operator</h3><p>✓ Receiving · Putaway · Picking</p><p>Excluded from the operator role:</p><ul><li>Administration</li><li>Policy changes</li><li>User management</li><li>Financial data</li><li>Unassigned operations</li></ul><p class="on-note">This checks the simulated menu, not access to a live system.</p></div>' +
        button("next", "Review onboarding result →")
      );
    if (["result", "approved"].includes(s.stage))
      return (
        '<div class="on-result"><h3>Warehouse mobile configuration ready</h3><p class="on-note">Guided demo results · sample warehouse only</p>' +
        [
          "Receiving — Validated in demo",
          "Putaway — Validated in demo",
          "Picking — Validated in demo",
          "Barcode controls — Enabled",
          "Location verification — Required",
          "Operator permissions — Verified in demo",
          "TSD layout — Customized",
          "Business scenarios — 3/3 passed",
        ]
          .map((t) => "<p>✓ " + t + "</p>")
          .join("") +
        "</div>" +
        button("enquiry", "Discuss my setup · leave work email →") +
        button("review", "Review configuration", "on-secondary") +
        button("replay", "Replay simulation", "on-secondary") +
        (s.approved
          ? '<p class="on-note">Demo result acknowledged. No activation was performed.</p>'
          : button("approve", "Approve onboarding result", "on-secondary"))
      );
    const v = machine.screen();
    return (
      '<div class="on-guide"><strong>' +
      esc(v?.label || "Continue on the handheld") +
      "</strong><p>Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.</p></div>"
    );
  }
  function render() {
    const active = document.activeElement?.id === "on-input",
      position = active ? document.activeElement.selectionStart : null;
    const messages = $("#messages");
    messages.innerHTML =
      s.messages
        .map(
          (m) =>
            '<div class="message-row ' +
            (m.role === "user" ? "user" : "assistant") +
            '"' +
            (m.guided ? " data-guided-answer" : "") +
            ">" +
            (m.role === "user"
              ? ""
              : '<div class="message-avatar">' +
                (m.role === "ai" ? "AI" : "Q") +
                "</div>") +
            '<div class="bubble"><p class="message-text"' +
            (m.role === "ai" && (!m.lang || m.lang === uiLanguage)
              ? " data-ai-message"
              : "") +
            ">" +
            esc(
              m.role === "ai" && m.lang && m.lang !== uiLanguage
                ? "Earlier AI reply. Ask again in this language."
                : m.text,
            ) +
            "</p></div></div>",
        )
        .join("") +
      '<div class="on-controls">' +
      (suggestedLanguage
        ? '<div class="on-language-offer" role="status"><strong>' +
          esc(
            Locales.format(
              "Switch the demo to {language}?",
              { language: Language.names[suggestedLanguage] },
              uiLanguage,
            ),
          ) +
          "</strong>" +
          button("accept-language", "Switch language") +
          button("keep-language", "Keep current language", "on-secondary") +
          "</div>"
        : "") +
      controls() +
      "</div>" +
      (busy
        ? '<div class="on-note" role="status">Quark AI is replying… ' +
          button("cancel", "Stop", "on-secondary") +
          "</div>"
        : "");
    if (seen !== s.messages.length) {
      messages.scrollTop = messages.scrollHeight;
      seen = s.messages.length;
    }
    $("#chatError").classList.toggle("hidden", !error);
    $("#chatError").innerHTML = error
      ? esc(error) + button("retry-ai", "Retry AI", "on-secondary")
      : "";
    $("#sendBtn").disabled = busy;
    $("#attachBtn").disabled = busy;
    $("#rfStage").innerHTML = window.QuarkOnboardingDevice.render(machine, {
      esc,
      shell: window.QuarkRFDevice.shell,
      view,
      format,
      draft,
    });
    $("#engineLabel").textContent =
      {
        profile: "Discover warehouse",
        configuration: "Prepare mobile processes",
        customize: "Customize the handheld",
        permissions: "Check operator access",
        result: "Demo checks complete",
        approved: "Demo result acknowledged",
      }[s.stage] ||
      (s.stage.endsWith("_review")
        ? "Review sample result"
        : "Try the " + s.stage + " task");
    $("#eventList").innerHTML = s.events
      .map(
        (e) =>
          '<div class="event ' +
          e.tone +
          '"><div class="event-icon">' +
          (e.tone === "error" ? "!" : e.tone === "waiting" ? "?" : "✓") +
          '</div><div class="event-copy"><div class="event-title">' +
          esc(e.title) +
          '</div><div class="event-detail">' +
          esc(e.detail) +
          "</div></div></div>",
      )
      .join("");
    $("#eventList").scrollTop = $("#eventList").scrollHeight;
    $("#eventCount").textContent = s.events.length + " events";
    $("#activityBadge").textContent = s.events.length;
    $("#layoutSummary").textContent =
      "Configuration · " + s.passed.length + "/3 sample processes";
    $("#layoutBody").innerHTML =
      '<div class="on-config-list"><p><b>Role</b> Warehouse Operator</p><p><b>Processes</b> Receiving, Putaway, Picking</p><p><b>Target scan</b> ' +
      esc(s.config.targetScan) +
      "</p><p><b>Product check</b> " +
      esc(s.config.productCheck) +
      "</p><p><b>Unknown barcode</b> " +
      esc(s.config.unknownBarcode) +
      "</p><p><b>Activation</b> Separate administrator step</p></div>";
    $("#jsonCode").textContent = "";
    document.querySelector(".json-panel").hidden = true;
    document.querySelectorAll("[data-view]").forEach((b) => {
      b.classList.toggle("active", b.dataset.view === view);
      b.setAttribute("aria-selected", b.dataset.view === view);
    });
    const attachment = $("#draftAttachment");
    attachment.classList.toggle("hidden", !file);
    attachment.innerHTML = file
      ? "<strong>" +
        esc(file.name) +
        '</strong><span>Sent only with your next AI message</span><button type="button" id="removePlan" aria-label="Remove plan">×</button>'
      : "";
    Locales.apply(document.body, uiLanguage);
    sizeDevice();
    if (active && $("#on-input")) {
      $("#on-input").focus({ preventScroll: true });
      if ($("#on-input").type !== "date" && position !== null)
        $("#on-input").setSelectionRange(position, position);
    }
  }
  function sizeDevice() {
    const fit = $(".wd-fit");
    if (!fit) return;
    const stage = $("#rfStage"),
      w = format === "handheld" ? 528 : 1068,
      h = format === "handheld" ? 1038 : 842,
      k = Math.max(
        0.2,
        Math.min(
          1,
          (stage.clientWidth - 28) / w,
          (stage.clientHeight - 24) / h,
        ),
      );
    fit.style.setProperty("--device-scale", k);
    fit.style.setProperty("--fit-width", w * k + "px");
    fit.style.setProperty("--fit-height", h * k + "px");
  }
  function mobile(page) {
    workspace.dataset.mobileView = page;
    document
      .querySelectorAll("[data-mobile]")
      .forEach((b) => b.classList.toggle("active", b.dataset.mobile === page));
    sizeDevice();
  }
  function sound() {
    if (!s.preferences.sound) return;
    try {
      const Context = window.AudioContext || window.webkitAudioContext,
        context = new Context(),
        osc = context.createOscillator(),
        gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.frequency.value = 240;
      gain.gain.value = 0.04;
      osc.start();
      osc.stop(context.currentTime + 0.12);
      osc.onended = () => context.close();
    } catch {
      /* Audio is optional; visible errors always remain. */
    }
  }
  function apply(action) {
    if (action === "accept-language" && suggestedLanguage) {
      setLanguage(suggestedLanguage);
      return;
    }
    if (action === "keep-language") {
      declinedLanguages.push(suggestedLanguage);
      suggestedLanguage = null;
      render();
      return;
    }
    if (action === "retry-ai") return ask(true);
    if (
      busy &&
      [
        "sample",
        "configure",
        "next",
        "replay",
        "approve",
        "correction",
      ].includes(action)
    )
      cancel();
    const prior = s.stage;
    draft = "";
    if (action === "sample") machine.useSample();
    else if (action === "configure") {
      if (machine.beginConfiguration()) {
        const revision = generation;
        timer = setInterval(() => {
          if (revision !== generation) {
            clearInterval(timer);
            return;
          }
          machine.configureNext();
          s.preferences.language = uiLanguage;
          render();
          if (s.stage !== "configuration") {
            clearInterval(timer);
            mobile("rf");
          }
        }, 450);
      }
    } else if (action === "scan") {
      const v = machine.screen();
      if (v) {
        if (
          v.key === (s.stage === "putaway" ? "destination" : "product") &&
          !s.faults[s.stage]
        )
          machine.injectError();
        else
          machine.submit(
            v.kind === "unit"
              ? s.facts.goods === "expiry"
                ? "MILK-1L"
                : "SOAP-500"
              : v.expected,
          );
        if (s.error) sound();
      }
    } else if (action === "error") {
      machine.injectError();
      sound();
    } else if (action === "submit") {
      machine.submit($("#on-input")?.value || "");
      if (s.error) sound();
    } else if (action === "correction") machine.applyCorrection();
    else if (action === "next") machine.next();
    else if (action === "approve") machine.approve();
    else if (action === "replay") {
      cancel();
      machine.replay();
      s.preferences.language = uiLanguage;
      const revision = generation;
      timer = setInterval(() => {
        if (revision !== generation) {
          clearInterval(timer);
          return;
        }
        machine.configureNext();
        render();
        if (s.stage !== "configuration") clearInterval(timer);
      }, 450);
    } else if (action === "test-sound") {
      sound();
      machine.event(
        "Error feedback preview",
        "Visible feedback always shown; audio only when enabled",
      );
    } else if (action === "review") return review();
    else if (action === "enquiry") {
      window.QuarkSetupEnquiry.open(
        {
          operation: "receiving",
          product: {
            name: s.facts.goods === "expiry" ? "MILK-1L" : "SOAP-500",
            pack_label: "Case",
            pack_quantity: 2,
            pack_units: 24,
            serialized: false,
          },
        },
        { type: "Distribution", aisles: 3, bays: 4, levels: 4 },
        (text) => Locales.tr(text, uiLanguage),
      );
      Locales.apply(document.querySelector("dialog"), uiLanguage);
      return;
    }
    render();
    if (
      prior !== s.stage &&
      ["receiving", "putaway", "picking", "customize", "permissions"].includes(
        s.stage,
      )
    )
      mobile("rf");
    if (
      s.stage.endsWith("_review") ||
      ["customize", "result", "approved"].includes(s.stage)
    )
      mobile("chat");
  }
  function review() {
    const dialog = document.createElement("dialog");
    dialog.className = "setup-enquiry";
    dialog.innerHTML =
      '<button class="enquiry-close" aria-label="Close">×</button><h2>Review sample configuration</h2>' +
      factsHTML() +
      "<h3>Configured controls</h3>" +
      s.changes.map(diffHTML).join("") +
      "<h3>Handheld preferences</h3><ul>" +
      Object.entries(s.preferences)
        .map(
          ([key, value]) =>
            "<li>" +
            esc(
              {
                large: "Larger text",
                simple: "Hide extra fields",
                image: "Show sample product illustration",
                sound: "Play an error sound",
                codes: "Enable short action codes",
                reasons: "Show why a scan is blocked",
                quantity: "Confirm quantity before completion",
                language: "Handheld language",
              }[key],
            ) +
            ": " +
            esc(
              typeof value === "boolean"
                ? value
                  ? "On"
                  : "Off"
                : Language.names[value] || value,
            ) +
            "</li>",
        )
        .join("") +
      "</ul><p>No production activation or live permissions test.</p>";
    dialog.querySelector("button").onclick = () => dialog.close();
    dialog.onclose = () => dialog.remove();
    document.body.appendChild(dialog);
    dialog.showModal();
    Locales.apply(dialog, uiLanguage);
  }
  function setLanguage(next) {
    if (!Language.supported.includes(next)) return;
    cancel();
    uiLanguage = next;
    s.preferences.language = next;
    suggestedLanguage = null;
    const url = new URL(location.href);
    url.searchParams.set("lang", next);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    machine.say("Language switched. Your progress is preserved.");
    render();
  }
  function cancel() {
    generation++;
    controller?.abort();
    controller = null;
    busy = false;
    clearInterval(timer);
  }
  async function ask(retry = false) {
    if (busy) return;
    const text = retry ? lastText : $("#chatInput").value.trim();
    if (!text) return;
    const revision = generation,
      stage = s.stage;
    if (!retry) machine.say(text, "user");
    lastText = text;
    $("#chatInput").value = "";
    busy = true;
    error = "";
    controller = new AbortController();
    render();
    try {
      const response = await fetch("/api/engine-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: "onboarding",
          consent: true,
          stage,
          facts: s.facts,
          text,
          preferred_language: uiLanguage,
          ...(file ? { file: { type: file.type, data: file.data } } : {}),
        }),
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(45000),
        ]),
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw Error(
          "AI returned an unexpected response. The guided sample is still available.",
        );
      const data = await response.json();
      if (!response.ok || !data.ok)
        throw Error(
          data.error ||
            "AI is unavailable. Use the guided choices to continue.",
        );
      if (revision !== generation) return;
      if (stage === "profile" && s.stage === "profile")
        machine.setFacts(data.result.answers);
      machine.say(data.result.assistant_message, "ai");
      s.messages[s.messages.length - 1].lang = uiLanguage;
      suggestedLanguage = Language.suggestion(
        data.result,
        uiLanguage,
        declinedLanguages,
      );
      machine.event(
        "AI reply received",
        "Explanation and confirmed facts only; no warehouse actions",
      );
    } catch (e) {
      if (revision !== generation) return;
      error =
        e.name === "TimeoutError"
          ? "AI took too long. Your message is kept; retry or use the guided choices."
          : "AI is unavailable. Use the guided choices to continue.";
      machine.event(
        "AI reply unavailable",
        "The controlled simulation remains available",
        "waiting",
      );
    } finally {
      if (revision === generation) {
        busy = false;
        controller = null;
        render();
      }
    }
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.action) {
      if (b.dataset.action === "cancel") {
        cancel();
        render();
        return;
      }
      return apply(b.dataset.action);
    }
    if (b.dataset.answer) {
      if (busy) cancel();
      machine.answer(b.dataset.key, b.dataset.answer);
      render();
      return;
    }
    if (b.dataset.view) {
      view = b.dataset.view;
      render();
      return;
    }
    if (b.dataset.format) {
      format = b.dataset.format;
      document
        .querySelectorAll("[data-format]")
        .forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
      return;
    }
    if (b.dataset.mobile) return mobile(b.dataset.mobile);
    if (b.dataset.hardkey) {
      const key = b.dataset.hardkey,
        v = machine.screen();
      if (key === "F1") {
        workspace.classList.remove("chat-collapsed");
        mobile("chat");
        $("#chatInput").focus();
        return;
      }
      if (key === "F2" || key === "ENT") {
        if (s.correction) return apply("correction");
        if (v)
          return apply(
            v.kind === "scan" || v.kind === "unit" ? "scan" : "submit",
          );
      }
      if (key === "F3" && v) return apply("error");
      if (s.preferences.codes && key === "1") return apply("scan");
      return;
    }
    if (b.id === "sendBtn") return ask();
    if (b.id === "attachBtn") return $("#fileInput").click();
    if (b.id === "removePlan") {
      file = null;
      $("#fileInput").value = "";
      render();
      return;
    }
    if (b.id === "themeBtn") {
      document.body.classList.toggle("dark");
      return;
    }
    if (b.id === "resetBtn") {
      cancel();
      Object.assign(s, Model.create().state);
      s.preferences.language = uiLanguage;
      file = null;
      suggestedLanguage = null;
      declinedLanguages.length = 0;
      draft = "";
      error = "";
      lastText = "";
      $("#chatInput").value = "";
      $("#fileInput").value = "";
      render();
      mobile("chat");
      return;
    }
    if (b.id === "collapseChat") {
      workspace.classList.add("chat-collapsed");
      $("#openChat").classList.add("visible");
      sizeDevice();
      return;
    }
    if (b.id === "openChat") {
      workspace.classList.remove("chat-collapsed");
      $("#openChat").classList.remove("visible");
      mobile("chat");
      sizeDevice();
      return;
    }
    if (b.id === "activityToggle") workspace.classList.toggle("show-activity");
  });
  document.addEventListener("change", (e) => {
    if (e.target.dataset.pref) {
      machine.preference(
        e.target.dataset.pref,
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
      );
      render();
    }
  });
  $("#rfStage").addEventListener("input", (e) => {
    if (e.target.id === "on-input") draft = e.target.value;
  });
  $("#rfStage").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "on-input") {
      e.preventDefault();
      apply("submit");
    }
  });
  $("#chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ask();
    }
  });
  $("#fileInput").addEventListener("change", async (e) => {
    const chosen = e.target.files[0];
    if (!chosen) return;
    if (
      chosen.size > 3 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "application/pdf"].includes(chosen.type)
    ) {
      error = "Choose a JPEG, PNG or PDF up to 3 MB.";
      render();
      return;
    }
    const rev = generation;
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(Error("Could not read the file."));
        reader.readAsDataURL(chosen);
      });
      if (rev !== generation) return;
      file = { name: chosen.name, type: chosen.type, data };
      error = "";
      render();
    } catch (e) {
      error = e.message;
      render();
    }
  });
  const opts = document.createElement("div");
  opts.className = "device-options";
  opts.innerHTML =
    '<button type="button" data-format-button data-format="handheld" aria-pressed="true">Handheld</button><button type="button" data-format-button data-format="forklift" aria-pressed="false">Forklift</button>';
  $(".rf-panel .panel-head").insertBefore(opts, $(".stage-meta"));
  if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.body.classList.add("dark");
  new ResizeObserver(sizeDevice).observe($("#rfStage"));
  render();
})();
