const contractRedactionFields = [
  { id: "customer-name", label: "Customer name", value: "Theo Beispielmann", sensitive: true, section: "Customer" },
  { id: "customer-address", label: "Home address", value: "Musterstraße 18, 10115 Berlin", sensitive: true, section: "Customer" },
  { id: "customer-number", label: "Customer number", value: "KD-8472-1930", sensitive: true, section: "Customer" },
  { id: "phone-number", label: "Phone number", value: "+49 151 23456789", sensitive: true, section: "Customer" },
  { id: "email-address", label: "Email address", value: "theo.beispiel@example.com", sensitive: true, section: "Customer" },
  { id: "plan-name", label: "Plan", value: "Connect M 30", sensitive: false, section: "Plan terms" },
  { id: "monthly-price", label: "Monthly price", value: "EUR 24.99 / month", sensitive: false, section: "Plan terms" },
  { id: "contract-term", label: "Minimum term", value: "24 months", sensitive: false, section: "Plan terms" },
  { id: "data-volume", label: "Mobile data", value: "30 GB 5G", sensitive: false, section: "Plan terms" },
  { id: "roaming", label: "Roaming", value: "EU roaming included", sensitive: false, section: "Plan terms" },
  { id: "activation-fee", label: "Activation fee", value: "EUR 39.00", sensitive: false, section: "Plan terms" },
  { id: "renewal-price", label: "Price after month 24", value: "EUR 34.99 / month", sensitive: false, section: "Plan terms" },
  { id: "iban", label: "Direct debit account", value: "DE89 3704 0044 0532 0130 00", sensitive: true, section: "Payment and approval" },
  { id: "signature", label: "Customer signature", value: "Theo Beispielmann", sensitive: true, section: "Payment and approval" }
];

let redactionTrigger = null;
let redactionOptionIndex = null;
let redactedFieldIds = new Set();

function contractFieldMarkup(field) {
  return `
    <div class="contract-field">
      <span class="contract-field-label">${escapeHtml(field.label)}</span>
      <button
        class="contract-value"
        type="button"
        data-redaction-id="${escapeHtml(field.id)}"
        aria-pressed="false"
        aria-label="Redact ${escapeHtml(field.label)}: ${escapeHtml(field.value)}"
      >${escapeHtml(field.value)}</button>
    </div>
  `;
}

function contractSectionsMarkup() {
  return [...new Set(contractRedactionFields.map((field) => field.section))].map((section) => `
    <section class="contract-section" aria-labelledby="contract-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
      <h3 id="contract-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${escapeHtml(section)}</h3>
      <div class="contract-fields">
        ${contractRedactionFields.filter((field) => field.section === section).map(contractFieldMarkup).join("")}
      </div>
    </section>
  `).join("");
}

function updateRedactionCounter() {
  const counter = document.querySelector("[data-redaction-count]");
  if (!counter) return;
  const count = redactedFieldIds.size;
  counter.textContent = `${count} ${count === 1 ? "field" : "fields"} redacted`;
}

function closeContractRedaction({ restoreFocus = true } = {}) {
  document.querySelector(".contract-redaction-overlay")?.remove();
  document.body.classList.remove("redaction-open");
  if (restoreFocus) redactionTrigger?.focus();
}

function openContractRedaction(index, trigger) {
  closeContractRedaction({ restoreFocus: false });
  redactionTrigger = trigger;
  redactionOptionIndex = index;
  redactedFieldIds = new Set();

  const overlay = document.createElement("div");
  overlay.className = "contract-redaction-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "contract-redaction-title");
  overlay.innerHTML = `
    <article class="contract-redaction-editor">
      <header class="contract-editor-header">
        <div>
          <p class="contract-editor-kicker">Interactive document · Phone contract</p>
          <h2 id="contract-redaction-title">What should the AI not see?</h2>
          <p>Tap every detail that is not needed to compare the phone plan. Tap a blacked-out field again to restore it.</p>
        </div>
        <button class="contract-editor-close" type="button" data-close-contract aria-label="Close contract">×</button>
      </header>

      <div class="contract-editor-body">
        <div class="contract-paper">
          <div class="contract-paper-heading">
            <div>
              <span>Fictional document</span>
              <h3>Mobile service contract</h3>
            </div>
            <span class="contract-number">Contract · MC-2026-0815</span>
          </div>
          ${contractSectionsMarkup()}
          <p class="contract-fine-print">This fictional contract is used only for the PrivacyGuard learning game.</p>
        </div>
      </div>

      <footer class="contract-editor-actions">
        <div class="redaction-status">
          <span class="redaction-status-dot" aria-hidden="true"></span>
          <div>
            <strong data-redaction-count>0 fields redacted</strong>
            <span>Keep useful contract terms readable.</span>
          </div>
        </div>
        <div class="contract-action-buttons">
          <button class="contract-back-button" type="button" data-close-contract>Back</button>
          <button class="contract-share-button" type="button" data-share-redacted>Share reviewed contract →</button>
        </div>
      </footer>
    </article>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("redaction-open");
  overlay.querySelector(".contract-editor-close")?.focus();
}

function gradeContractRedaction() {
  const sensitiveFields = contractRedactionFields.filter((field) => field.sensitive);
  const usefulFields = contractRedactionFields.filter((field) => !field.sensitive);
  const redactedSensitive = sensitiveFields.filter((field) => redactedFieldIds.has(field.id));
  const missedSensitive = sensitiveFields.filter((field) => !redactedFieldIds.has(field.id));
  const overRedacted = usefulFields.filter((field) => redactedFieldIds.has(field.id));

  let key = "risky";
  if (missedSensitive.length === 0 && overRedacted.length === 0) key = "safe";
  else if (redactedSensitive.length >= 5 && missedSensitive.length <= 2) key = "caution";

  const labels = { safe: "SAFE REDACTION", caution: "CHECK AGAIN", risky: "NOT SAFE YET" };
  const summaries = {
    safe: "Excellent — every personal identifier is hidden while the prices and plan terms remain available for comparison.",
    caution: "Good start, but the contract either still contains personal identifiers or hides information the AI needs for the comparison.",
    risky: "The contract still exposes too many personal details. Names, contact details, account numbers and signatures are not needed here."
  };
  const responseText = {
    safe: "I redacted all personal identifiers and kept only the phone-plan terms visible for review.",
    caution: `I redacted ${redactedSensitive.length} sensitive fields, but the document still needs another privacy check.`,
    risky: `I shared the contract after redacting only ${redactedSensitive.length} sensitive ${redactedSensitive.length === 1 ? "field" : "fields"}.`
  };

  return {
    key,
    redactedSensitive,
    missedSensitive,
    overRedacted,
    responseText: responseText[key],
    feedback: {
      key,
      label: labels[key],
      summary: summaries[key],
      modalTitle: key === "safe" ? "You created a useful, privacy-safe contract copy." : "The contract needs a more careful privacy review.",
      lessonLabel: "PRIVACY LESSON · INTERACTIVE REDACTION",
      points: [
        {
          type: redactedSensitive.length >= 5 ? "good" : "risk",
          mark: redactedSensitive.length >= 5 ? "+" : "!",
          title: `${redactedSensitive.length} of ${sensitiveFields.length} sensitive fields hidden`,
          text: missedSensitive.length
            ? `Still visible: ${missedSensitive.map((field) => field.label.toLowerCase()).join(", ")}.`
            : "Name, address, contact details, customer number, IBAN and signature are hidden."
        },
        {
          type: overRedacted.length === 0 ? "good" : "risk",
          mark: overRedacted.length === 0 ? "+" : "!",
          title: overRedacted.length === 0 ? "Useful terms preserved" : "Useful terms were hidden",
          text: overRedacted.length === 0
            ? "The AI can still see the price, term, data allowance, roaming and fees."
            : `Restore: ${overRedacted.map((field) => field.label.toLowerCase()).join(", ")}.`
        }
      ],
      remember: "Hide personal identifiers, but keep the minimum facts needed for the task."
    }
  };
}

function shareRedactedContract() {
  if (redactionOptionIndex === null) return;
  const result = gradeContractRedaction();
  const baseOption = levels[levelIndex].options[redactionOptionIndex];
  const gradedOption = {
    ...baseOption,
    text: result.responseText,
    document: "redacted",
    feedback: result.feedback
  };

  closeContractRedaction({ restoreFocus: false });
  if (typeof window.hideReplyPicker === "function") window.hideReplyPicker();
  if (typeof window.setComposerReady === "function") window.setComposerReady(false);
  window.choose(redactionOptionIndex, gradedOption);
}

optionsEl.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-contract]");
  if (!openButton || openButton.disabled) return;
  const card = openButton.closest(".option-card");
  const index = Number(openButton.dataset.index);
  const option = levels[levelIndex]?.options[index];
  if (!card || option?.interaction !== "redact-contract") return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (typeof window.selectDraftReply === "function") window.selectDraftReply(card);
  openContractRedaction(index, openButton);
}, true);

document.addEventListener("click", (event) => {
  const redactionButton = event.target.closest("[data-redaction-id]");
  if (redactionButton) {
    const id = redactionButton.dataset.redactionId;
    const isRedacted = !redactedFieldIds.has(id);
    if (isRedacted) redactedFieldIds.add(id);
    else redactedFieldIds.delete(id);
    redactionButton.classList.toggle("is-redacted", isRedacted);
    redactionButton.setAttribute("aria-pressed", String(isRedacted));
    const field = contractRedactionFields.find((item) => item.id === id);
    redactionButton.setAttribute("aria-label", `${isRedacted ? "Restore" : "Redact"} ${field.label}: ${field.value}`);
    updateRedactionCounter();
    return;
  }
  if (event.target.closest("[data-share-redacted]")) {
    shareRedactedContract();
    return;
  }
  if (event.target.closest("[data-close-contract]") || event.target.classList.contains("contract-redaction-overlay")) {
    closeContractRedaction();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.querySelector(".contract-redaction-overlay")) {
    closeContractRedaction();
  }
});
