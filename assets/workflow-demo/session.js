/* Shared conversation + RF session. Both terminal renderers read this single state. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkWorkflowSession = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  function create({ Flow, request, onChange = () => {} }) {
    const state = {
      messages: [],
      events: [],
      proposal: null,
      definition: null,
      run: null,
      busy: false,
      error: "",
      view: "webrf",
      screen: "main",
      menuPage: 0,
    };
    let generation = 0,
      controller = null,
      lastRequest = null,
      retainedFile = null;
    function event(title, tone = "done", detail = "") {
      const record = { title, tone, detail, time: new Date().toISOString() };
      state.events.push(record);
      state.events = state.events.slice(-100);
      return record;
    }
    function cancel() {
      generation++;
      controller?.abort();
      controller = null;
      if (state.busy) {
        state.events
          .filter((e) => e.tone === "running")
          .forEach((e) => (e.tone = "waiting"));
        event("AI request cancelled", "waiting");
      }
      state.busy = false;
      onChange();
    }
    async function send(
      text,
      { file = null, greeting = false, retry = false } = {},
    ) {
      if (state.busy || (!greeting && !text.trim() && !file)) return;
      state.error = "";
      state.busy = true;
      const serial = ++generation;
      controller = new AbortController();
      const active = controller;
      if (!retry && !greeting)
        state.messages.push({
          role: "user",
          text: text.trim() || "Please analyse this warehouse plan.",
          fileName: file?.name,
        });
      if (file) {
        retainedFile = file;
        state.planName = file.name;
      }
      const conversation = state.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(0, greeting ? 0 : -1)
        .slice(-14)
        .map(({ role, text }) => ({ role, text: text.slice(0, 3000) }));
      while (conversation.reduce((n, t) => n + t.text.length, 0) > 16000)
        conversation.shift();
      const body = { consent: true, greeting, text: text.trim(), conversation };
      if (retainedFile && !greeting)
        body.file = { type: retainedFile.type, data: retainedFile.data };
      if (state.proposal && !greeting) {
        const p = state.proposal;
        body.setup = {
          type: p.type || "E-commerce",
          aisles: p.aisles,
          bays: p.bays,
          levels: p.levels,
          task: p.task,
          previous_summary: p.summary,
          confirmed: ["type", "aisles", "bays", "levels"].filter(
            (k) => p[k] != null && !(p.defaulted_layout || []).includes(k),
          ),
        };
      }
      lastRequest = { text, options: { file, greeting, retry: true } };
      const pending = event(
        greeting ? "Starting setup conversation" : "AI analysis requested",
        "running",
        retainedFile && !greeting
          ? "Description and selected plan"
          : "Conversation context",
      );
      onChange();
      try {
        const result = await request(body, active.signal);
        if (serial !== generation) return;
        Flow.validateTask(result.task, result);
        pending.tone = "done";
        state.proposal = result;
        state.messages.push({
          role: "assistant",
          text: result.assistant_message,
          choices: result.quick_replies || [],
          ready: result.ready,
          proposal: result.ready ? result : null,
        });
        event(
          result.ready
            ? "Workflow validated: " + Flow.labels[result.task.operation]
            : "Assistant replied",
          result.ready ? "done" : "waiting",
          result.ready ? "RF example ready to start" : "Waiting for your reply",
        );
      } catch (error) {
        if (serial !== generation) return;
        pending.tone = "error";
        state.error =
          error.name === "AbortError"
            ? "The request was cancelled. You can retry."
            : error.message;
        event("AI request did not finish", "error", state.error);
      } finally {
        if (serial === generation) {
          state.busy = false;
          controller = null;
          onChange();
        }
      }
    }
    function start(proposal = state.proposal) {
      if (!proposal?.ready)
        throw Error("Finish the conversation before starting the task.");
      const definition = Flow.resolve(proposal.task, proposal);
      state.definition = definition;
      state.run = Flow.create(definition);
      state.screen = "task";
      state.proposal = proposal;
      state.activeLayout = {
        type: proposal.type || "E-commerce",
        aisles: proposal.aisles,
        bays: proposal.bays,
        levels: proposal.levels,
        defaulted_layout: proposal.defaulted_layout || [],
      };
      event(
        "RF workflow loaded",
        "done",
        Flow.labels[definition.operation] +
          " · " +
          definition.steps.length +
          " screens",
      );
      onChange();
    }
    function submit(value) {
      if (!state.run || state.run.completed) return;
      state.run = Flow.submit(state.definition, state.run, value);
      if (state.run.error) event("Scan rejected", "error", state.run.error);
      else
        for (const detail of state.run.events)
          event("Accepted warehouse action", "done", detail);
      if (state.run.completed)
        event(
          "Task completed",
          "done",
          state.definition.product.name +
            " · " +
            state.definition.total_units +
            " base units",
        );
      onChange();
    }
    function setView(view) {
      if (!["webrf", "terminal"].includes(view)) return;
      state.view = view;
      onChange();
    }
    function reset() {
      cancel();
      retainedFile = null;
      lastRequest = null;
      Object.assign(state, {
        messages: [],
        events: [],
        proposal: null,
        definition: null,
        run: null,
        error: "",
        screen: "main",
        menuPage: 0,
        planName: null,
        activeLayout: null,
      });
      event(
        "Demo session started",
        "done",
        "Local RF simulation; no warehouse connection",
      );
      onChange();
    }
    reset();
    return {
      state,
      send,
      start,
      submit,
      setView,
      cancel,
      reset,
      event,
      retry() {
        if (lastRequest) return send(lastRequest.text, lastRequest.options);
      },
      sample() {
        if (state.run && !state.run.completed)
          submit(Flow.expected(state.definition, state.run));
      },
      restart() {
        if (state.definition) {
          state.run = Flow.create(state.definition);
          state.screen = "task";
          event("RF task restarted");
          onChange();
        }
      },
      clearPlan() {
        retainedFile = null;
        state.planName = null;
        event("Plan removed from subsequent AI requests");
        onChange();
      },
    };
  }
  return { create };
});
