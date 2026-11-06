/* DOM workspace: conversation + actual events + two views of one RF session. */
(function () {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const Flow = window.QuarkEngineFlow;
  const esc = (value) =>
    String(value ?? "").replace(
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
  let session,
    selectedFile = null,
    deviceFormat = "handheld",
    messageCount = 0;
  const workspace = $("#workspace");
  const initialLanguage =
    (navigator.languages || [navigator.language])
      .map((v) => v?.toLowerCase().split("-")[0])
      .find((v) => Flow.rfCommands[v]) || "en";
  async function request(body, signal) {
    const timeout = AbortSignal.timeout(45000);
    let response;
    try {
      response = await fetch("/api/engine-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, preferred_language: initialLanguage }),
        signal: AbortSignal.any([signal, timeout]),
      });
    } catch (error) {
      if (timeout.aborted)
        throw Error(
          "AI took too long to respond. Your conversation is saved; please retry.",
        );
      throw error;
    }
    if (!response.headers.get("content-type")?.includes("application/json"))
      throw Error(
        "The AI endpoint returned an unexpected response. Please retry.",
      );
    const data = await response.json();
    if (!response.ok || !data.ok)
      throw Error(data.error || "AI could not complete the request.");
    return data.result;
  }
  session = window.QuarkWorkflowSession.create({
    Flow,
    request,
    onChange: render,
  });
  const state = session.state;
  function recap(p) {
    const t = p.task,
      q = t.product;
    return (
      Flow.labels[t.operation] +
      " · " +
      q.name +
      " · " +
      q.pack_quantity +
      " " +
      q.pack_label +
      " × " +
      q.pack_units +
      " units"
    );
  }
  function renderMessages() {
    const box = $("#messages"),
      nearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 100;
    box.innerHTML = state.messages
      .map(
        (m, i) =>
          '<div class="message-row ' +
          m.role +
          '">' +
          (m.role === "assistant"
            ? '<div class="message-avatar">AI</div>'
            : "") +
          '<div class="bubble"><p class="message-text">' +
          esc(m.text) +
          "</p>" +
          (m.fileName
            ? '<div class="attachment-card"><strong>Plan: ' +
              esc(m.fileName) +
              "</strong></div>"
            : "") +
          (m.role === "assistant" && i === state.messages.length - 1
            ? m.ready
              ? '<div class="summary-card"><div class="summary-label">Ready to try</div><div class="summary-value">' +
                esc(recap(m.proposal)) +
                '</div></div><button type="button" class="start-task" data-start="' +
                i +
                '">Try this task →</button>'
              : '<div class="quick-replies">' +
                (m.choices || [])
                  .map(
                    (s, n) =>
                      '<button type="button" class="chip" data-reply="' +
                      n +
                      '" ' +
                      (state.busy ? "disabled" : "") +
                      '><span class="chip-copy"><span class="chip-title">' +
                      esc(s) +
                      '</span></span><span class="chip-chevron" aria-hidden="true">›</span></button>',
                  )
                  .join("") +
                "</div>"
            : "") +
          "</div></div>",
      )
      .join("");
    if (state.run?.completed)
      box.insertAdjacentHTML(
        "beforeend",
        '<div class="message-row assistant"><div class="message-avatar">Q</div><div class="bubble"><p>Task complete. You can keep exploring or share this setup with the Quark team.</p><button type="button" class="start-task" data-enquiry>Send this setup to Quark →</button></div></div>',
      );
    if (!state.messages.length && !state.busy)
      box.innerHTML =
        '<div class="message-row assistant"><div class="message-avatar">Q</div><div class="bubble"><p>Your Quark setup conversation will appear here.</p></div></div>';
    if (state.busy)
      box.insertAdjacentHTML(
        "beforeend",
        '<div class="message-row assistant"><div class="message-avatar">AI</div><div class="bubble chat-busy" role="status"><span class="dots">•••</span><span>Waiting for Quark AI</span><button type="button" data-cancel>Stop</button></div></div>',
      );
    if (nearBottom || messageCount !== state.messages.length)
      box.scrollTop = box.scrollHeight;
    messageCount = state.messages.length;
    const error = $("#chatError");
    error.classList.toggle("hidden", !state.error);
    error.innerHTML = state.error
      ? esc(state.error) +
        '<br><button type="button" data-retry>Retry AI</button><button type="button" data-local-example>Try a local example</button>'
      : "";
    $("#sendBtn").disabled = state.busy;
    $("#attachBtn").disabled = state.busy;
  }
  function renderEvents() {
    const box = $("#eventList"),
      stick = box.scrollHeight - box.scrollTop - box.clientHeight < 80;
    box.innerHTML = state.events
      .map(
        (e) =>
          '<div class="event ' +
          e.tone +
          '"><div class="event-icon">' +
          ({ done: "✓", error: "!", waiting: "?", running: "" }[e.tone] || "") +
          '</div><div class="event-copy"><div class="event-title">' +
          esc(e.title) +
          "</div><time>" +
          esc(new Date(e.time).toLocaleTimeString()) +
          '</time><div class="event-detail">' +
          esc(e.detail) +
          "</div></div></div>",
      )
      .join("");
    if (stick) box.scrollTop = box.scrollHeight;
    $("#eventCount").textContent = state.events.length + " events";
    $("#activityBadge").textContent = state.events.length;
  }
  function renderLayout() {
    const p = state.run ? state.activeLayout : state.proposal;
    $("#layoutSummary").textContent = p
      ? "Sample layout · " +
        p.aisles +
        " aisles × " +
        p.bays +
        " bays × " +
        p.levels +
        " levels"
      : "Layout · waiting for setup";
    $("#layoutReadyDot").classList.toggle("ready", !!p);
    if (!p) {
      $("#layoutBody").innerHTML = "";
      return;
    }
    const d = state.definition,
      run = state.run,
      showStock = !!run && run.stored > 0;
    // This is a sample elevation; receiving stock stays at the dock until putaway.
    $("#layoutBody").innerHTML =
      '<p class="rf-empty-note">Sample rack elevation. ' +
      (p.defaulted_layout?.length
        ? "Unverified dimensions: " + esc(p.defaulted_layout.join(", ")) + ". "
        : "") +
      'Customer address formats are not reproduced exactly.</p><div class="rack-map" style="grid-template-columns:repeat(' +
      Math.min(p.bays, 8) +
      ',1fr)">' +
      Array.from(
        { length: Math.min(p.levels, 8) * Math.min(p.bays, 8) },
        (_, i) =>
          '<div class="rack-cell">' +
          String((i % Math.min(p.bays, 8)) + 1).padStart(2, "0") +
          "·L" +
          (Math.min(p.levels, 8) - Math.floor(i / Math.min(p.bays, 8))) +
          "</div>",
      ).join("") +
      "</div>" +
      (d
        ? '<p class="rf-empty-note">At dock: ' +
          run.dock +
          " units · stored: " +
          run.stored +
          " units" +
          (showStock ? " · " + esc(d.destination) : "") +
          "</p>"
        : "");
  }
  function sizeDevice() {
    const fit = $(".wd-fit");
    if (!fit) return;
    const stage = $("#rfStage"),
      width = deviceFormat === "handheld" ? 528 : 1068,
      height = deviceFormat === "handheld" ? 1038 : 842;
    const scale = Math.max(
      0.2,
      Math.min(
        1,
        (stage.clientWidth - 28) / width,
        (stage.clientHeight - 24) / height,
      ),
    );
    fit.style.setProperty("--device-scale", scale);
    fit.style.setProperty("--fit-width", width * scale + "px");
    fit.style.setProperty("--fit-height", height * scale + "px");
  }
  function render() {
    if (!session) return;
    const active = document.activeElement?.id === "rf-scan";
    const selection = active ? document.activeElement.selectionStart : null;
    renderMessages();
    renderEvents();
    renderLayout();
    renderPlan();
    $("#rfStage").innerHTML = window.QuarkRFDevice.render(
      state,
      Flow,
      esc,
      deviceFormat,
    );
    $("#engineLabel").textContent = state.busy
      ? "AI analysis in progress"
      : state.run
        ? state.run.completed
          ? "Task complete"
          : "RF task in progress"
        : state.proposal?.ready
          ? "Workflow ready"
          : "Waiting for setup";
    document.querySelectorAll("[data-view]").forEach((b) => {
      const on =
        b.dataset.view === (state.view === "webrf" ? "webrf" : "terminal");
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on);
    });
    $("#jsonCode").textContent = JSON.stringify(
      {
        proposal: state.proposal,
        process: state.definition,
        runtime: state.run
          ? {
              step: state.run.index,
              completed: state.run.completed,
              received: state.run.received,
              stored: state.run.stored,
              dock: state.run.dock,
              serial_count: state.run.serials.length,
              verified_count: state.run.verified.length,
            }
          : null,
      },
      null,
      2,
    );
    sizeDevice();
    if (active && $("#rf-scan")) {
      $("#rf-scan").focus({ preventScroll: true });
      if (selection !== null && $("#rf-scan").type !== "date")
        $("#rf-scan").setSelectionRange(selection, selection);
    }
  }
  function renderPlan() {
    const box = $("#draftAttachment");
    const name = selectedFile?.name || state.planName;
    box.classList.toggle("hidden", !name);
    box.innerHTML = name
      ? "<strong>" +
        esc(name) +
        "</strong><span>" +
        (selectedFile ? "Ready to send" : "Used for follow-up messages") +
        '</span><button type="button" id="removePlan" aria-label="Remove plan">×</button>'
      : "";
  }
  function mobile(view) {
    workspace.dataset.mobileView = view;
    document
      .querySelectorAll("[data-mobile]")
      .forEach((b) => b.classList.toggle("active", b.dataset.mobile === view));
    if (view === "rf") $("#rfBadge").classList.add("hidden");
    sizeDevice();
  }
  function openChat() {
    workspace.classList.remove("chat-collapsed");
    $("#openChat").classList.remove("visible");
    mobile("chat");
    $("#chatInput").focus();
  }
  async function send(text) {
    const value = text ?? $("#chatInput").value;
    if (state.busy || (!value.trim() && !selectedFile)) return;
    const file = selectedFile;
    selectedFile = null;
    $("#fileInput").value = "";
    $("#draftAttachment").innerHTML = "";
    $("#draftAttachment").classList.add("hidden");
    $("#chatInput").value = "";
    await session.send(value, { file });
  }
  function localExample() {
    const task = Flow.emptyTask();
    Object.assign(task, {
      operation: "receiving",
      title: "Pallet receiving",
      steps: Flow.defaults("receiving", false, false),
    });
    Object.assign(task.product, {
      name: "Olive oil · 500 ml",
      pack_label: "Case",
      pack_quantity: 2,
      pack_units: 6,
    });
    const result = {
      type: "E-commerce",
      aisles: 3,
      bays: 4,
      levels: 4,
      defaulted_layout: ["aisles", "bays", "levels"],
      summary: "Local sample: 2 cases of 6 bottles. No AI analysis was used.",
      uncertainties: [],
      rules: [],
      task,
      ready: true,
    };
    session.cancel();
    state.error = "";
    state.proposal = result;
    state.messages.push({
      role: "assistant",
      text: result.summary,
      ready: true,
      proposal: result,
    });
    session.event("Local example selected", "done", "No AI request");
    render();
  }
  function rfAction(action, target) {
    if (action === "chat") return openChat();
    if (action === "menu") {
      state.screen = "main";
      state.menuPage = 0;
      render();
      return;
    }
    if (action === "resume") {
      state.screen = "task";
      render();
      return;
    }
    if (action === "prev" || action === "next") {
      state.menuPage =
        action === "next"
          ? Math.min(1, state.menuPage + 1)
          : Math.max(0, state.menuPage - 1);
      render();
      return;
    }
    if (action === "choose") {
      if (Flow.operations.includes(target.dataset.op)) {
        openChat();
        send("I would like to try " + Flow.labels[target.dataset.op] + ".");
      }
      return;
    }
    if (action === "restart") {
      state.scanDraft = "";
      session.restart();
      return;
    }
    if (action === "sample") {
      state.scanDraft = "";
      session.sample();
      focusScan();
      return;
    }
    if (action === "submit") {
      const value = $("#rf-scan")?.value || "";
      state.scanDraft = value;
      session.submit(value);
      if (!state.run?.error) state.scanDraft = "";
      render();
      focusScan();
    }
  }
  function focusScan() {
    $("#rf-scan")?.focus({ preventScroll: true });
  }
  function hardkey(key) {
    if (state.screen === "main" && /^[1-6]$/.test(key)) {
      const op = Flow.operations[state.menuPage * 6 + Number(key) - 1];
      if (op) return rfAction("choose", { dataset: { op } });
    }
    if (state.screen === "main" && ["ENT", "F2"].includes(key)) {
      const op = Flow.operations[state.menuPage * 6];
      if (op) return rfAction("choose", { dataset: { op } });
    }
    const actions = {
      F1: "chat",
      F2: "submit",
      F3: "sample",
      F4: "restart",
      F5: "menu",
      ENT: "submit",
      ESC: "menu",
      "←": "prev",
      "→": "next",
    };
    if (actions[key]) return rfAction(actions[key]);
    if (key === "TAB" || key === "↑" || key === "↓") return focusScan();
    const field = $("#rf-scan");
    if (field) {
      field.value =
        key === "BKSP"
          ? field.value.slice(0, -1)
          : field.value + (key === "SP" ? " " : key === "·" ? "." : key);
      state.scanDraft = field.value;
      focusScan();
    }
  }
  document.addEventListener("click", (event) => {
    const b = event.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-enquiry"))
      return window.QuarkSetupEnquiry.open(
        state.definition,
        state.activeLayout,
      );
    if (b.hasAttribute("data-cancel")) return session.cancel();
    if (b.hasAttribute("data-retry")) return session.retry();
    if (b.hasAttribute("data-local-example")) return localExample();
    if (b.dataset.reply != null) {
      const choices = state.messages[state.messages.length - 1]?.choices;
      return choices && send(choices[Number(b.dataset.reply)]);
    }
    if (b.dataset.start != null) {
      const p = state.messages[Number(b.dataset.start)]?.proposal;
      if (p) {
        state.scanDraft = "";
        session.start(p);
        mobile("rf");
        focusScan();
      }
      return;
    }
    if (b.dataset.view)
      return session.setView(b.dataset.view === "webrf" ? "webrf" : "terminal");
    if (b.dataset.mobile) return mobile(b.dataset.mobile);
    if (b.dataset.rf) return rfAction(b.dataset.rf, b);
    if (b.dataset.hardkey) return hardkey(b.dataset.hardkey);
    if (b.dataset.format) {
      deviceFormat = b.dataset.format;
      document
        .querySelectorAll("[data-format-button]")
        .forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
      return;
    }
    if (b.id === "sendBtn") return send();
    if (b.id === "resetBtn") {
      session.reset();
      selectedFile = null;
      $("#fileInput").value = "";
      $("#chatInput").value = "";
      $("#draftAttachment").classList.add("hidden");
      return session.send("", { greeting: true });
    }
    if (b.id === "themeBtn") {
      document.body.classList.toggle("dark");
      render();
      return;
    }
    if (b.id === "collapseChat") {
      workspace.classList.add("chat-collapsed");
      $("#openChat").classList.add("visible");
      sizeDevice();
      return;
    }
    if (b.id === "openChat") return openChat();
    if (b.id === "activityToggle") {
      workspace.classList.toggle("show-activity");
      return;
    }
    if (b.id === "attachBtn") return $("#fileInput").click();
    if (b.id === "removePlan") {
      selectedFile = null;
      $("#fileInput").value = "";
      session.clearPlan();
      return;
    }
  });
  $("#chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  $("#rfStage").addEventListener("input", (e) => {
    if (e.target.id === "rf-scan") state.scanDraft = e.target.value;
  });
  $("#rfStage").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.id === "rf-scan") {
      e.preventDefault();
      rfAction("submit");
    } else if (["F1", "F2", "F3", "F4", "F5", "Escape"].includes(e.key)) {
      e.preventDefault();
      hardkey(e.key === "Escape" ? "ESC" : e.key);
    }
  });
  $("#fileInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      file.size > 3 * 1024 * 1024 ||
      !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
    ) {
      state.error = "Choose a JPEG, PNG or PDF up to 3 MB.";
      render();
      return;
    }
    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = () => reject(Error("Could not read this file."));
        reader.readAsDataURL(file);
      });
      selectedFile = { name: file.name, type: file.type, data };
      state.error = "";
      $("#draftAttachment").innerHTML =
        "<strong>" +
        esc(file.name) +
        "</strong><span>" +
        Math.ceil(file.size / 1024) +
        ' KB · sent with your next message</span><button type="button" id="removePlan" aria-label="Remove plan">×</button>';
      $("#draftAttachment").classList.remove("hidden");
      render();
    } catch (error) {
      state.error = error.message;
      render();
    }
  });
  const opts = document.createElement("div");
  opts.className = "device-options";
  opts.innerHTML =
    '<button type="button" data-format-button data-format="handheld" aria-pressed="true">Handheld</button><button type="button" data-format-button data-format="forklift" aria-pressed="false">Forklift</button>';
  $(".view-tabs").after(opts);
  new ResizeObserver(sizeDevice).observe($("#rfStage"));
  if (matchMedia("(prefers-color-scheme: dark)").matches)
    document.body.classList.add("dark");
  render();
  session.send("", { greeting: true });
})();
