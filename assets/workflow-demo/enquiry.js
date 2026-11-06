/* Explicit, consented setup enquiry. Conversation, plans and serials never enter this payload. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkSetupEnquiry = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  function payload(email, company, definition, layout) {
    const p = definition.product;
    return {
      email: email.trim(),
      company: company.trim(),
      consent: "yes",
      warehouse: {
        type: layout.type,
        aisles: layout.aisles,
        bays: layout.bays,
        levels: layout.levels,
      },
      process: {
        operation: definition.operation,
        product: p.name,
        pack_label: p.pack_label,
        pack_quantity: p.pack_quantity,
        pack_units: p.pack_units,
        serialized: p.serialized,
      },
    };
  }
  function open(definition, layout, translate = (value) => value) {
    if (!definition || !layout) return;
    const dialog = document.createElement("dialog");
    dialog.className = "setup-enquiry";
    dialog.setAttribute("aria-labelledby", "enquiry-title");
    dialog.innerHTML =
      '<form><button type="button" class="enquiry-close" aria-label="Close">×</button><h2 id="enquiry-title">Continue with your warehouse setup</h2><p>Send this example to the Quark team. We will follow up about your warehouse.</p><label>Work email<input name="email" type="email" autocomplete="email" maxlength="254" required></label><label>Company<input name="company" autocomplete="organization" maxlength="160" required></label><label class="enquiry-consent"><input name="consent" type="checkbox" required><span>Send my contact details and this demo setup to Quark for follow-up. <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy policy</a></span></label><p class="enquiry-status" role="status"></p><button class="start-task" type="submit">Send my setup to Quark →</button></form>';
    dialog.querySelector(".enquiry-close").onclick = () => dialog.close();
    dialog.addEventListener("close", () => dialog.remove());
    dialog.querySelector("form").onsubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.reportValidity()) return;
      const button = form.querySelector("[type=submit]"),
        status = form.querySelector(".enquiry-status");
      button.disabled = true;
      status.textContent = translate("Sending…");
      try {
        const response = await fetch("/api/engine-enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            payload(
              form.elements.email.value,
              form.elements.company.value,
              definition,
              layout,
            ),
          ),
          signal: AbortSignal.timeout(15000),
        });
        if (!response.headers.get("content-type")?.includes("application/json"))
          throw Error("Unexpected response. Please retry.");
        const body = await response.json();
        if (!response.ok || !body.ok)
          throw Error(body.error || "Could not send the setup.");
        status.textContent = translate(
          "Your setup was accepted. Thank you — the Quark team will follow up.",
        );
        button.textContent = translate("Sent");
      } catch (error) {
        status.textContent = translate(
          error.name === "TimeoutError"
            ? "The request timed out. Please check before resending."
            : "Could not send this setup. Please retry or email hello@quark.build.",
        );
        button.disabled = false;
      }
    };
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  return { payload, open };
});
