const documentRedactionProfiles = {
  "phone-contract": {
    "kicker": "Interactive document · Phone contract",
    "title": "Mobile service contract",
    "reference": "Contract · MC-2026-0815",
    "instruction": "Tap every detail that is not needed to compare the phone plan. Tap a blacked-out field again to restore it.",
    "usefulSummary": "The AI can still see the price, term, data allowance, roaming and fees.",
    "fields": [
      {
        "id": "customer-name",
        "label": "Customer name",
        "value": "Theo Beispielmann",
        "sensitive": true,
        "section": "Customer"
      },
      {
        "id": "customer-address",
        "label": "Home address",
        "value": "Musterstraße 18, 10115 Berlin",
        "sensitive": true,
        "section": "Customer"
      },
      {
        "id": "customer-number",
        "label": "Customer number",
        "value": "KD-8472-1930",
        "sensitive": true,
        "section": "Customer"
      },
      {
        "id": "phone-number",
        "label": "Phone number",
        "value": "+49 151 23456789",
        "sensitive": true,
        "section": "Customer"
      },
      {
        "id": "email-address",
        "label": "Email address",
        "value": "theo.beispiel@example.com",
        "sensitive": true,
        "section": "Customer"
      },
      {
        "id": "plan-name",
        "label": "Plan",
        "value": "Connect M 30",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "monthly-price",
        "label": "Monthly price",
        "value": "EUR 24.99 / month",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "contract-term",
        "label": "Minimum term",
        "value": "24 months",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "data-volume",
        "label": "Mobile data",
        "value": "30 GB 5G",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "roaming",
        "label": "Roaming",
        "value": "EU roaming included",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "activation-fee",
        "label": "Activation fee",
        "value": "EUR 39.00",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "renewal-price",
        "label": "Price after month 24",
        "value": "EUR 34.99 / month",
        "sensitive": false,
        "section": "Plan terms"
      },
      {
        "id": "iban",
        "label": "Direct debit account",
        "value": "DE89 3704 0044 0532 0130 00",
        "sensitive": true,
        "section": "Payment and approval"
      },
      {
        "id": "signature",
        "label": "Customer signature",
        "value": "Theo Beispielmann",
        "sensitive": true,
        "section": "Payment and approval"
      }
    ]
  },
  "rental-application": {
    "kicker": "Interactive document · Rental application",
    "title": "Apartment application",
    "reference": "Application · RA-2026-204",
    "instruction": "Hide identity and account details that are not needed to assess whether the application is strong.",
    "usefulSummary": "The AI can still see the rent, income range, employment type and move-in date.",
    "fields": [
      {
        "id": "applicant-name",
        "label": "Applicant name",
        "value": "Mira Hoffmann",
        "sensitive": true,
        "section": "Applicant"
      },
      {
        "id": "applicant-address",
        "label": "Current address",
        "value": "Rosenweg 7, 10437 Berlin",
        "sensitive": true,
        "section": "Applicant"
      },
      {
        "id": "applicant-birth",
        "label": "Date of birth",
        "value": "14 February 1998",
        "sensitive": true,
        "section": "Applicant"
      },
      {
        "id": "applicant-email",
        "label": "Email",
        "value": "mira.hoffmann@example.com",
        "sensitive": true,
        "section": "Applicant"
      },
      {
        "id": "applicant-phone",
        "label": "Phone",
        "value": "+49 176 45091283",
        "sensitive": true,
        "section": "Applicant"
      },
      {
        "id": "id-number",
        "label": "ID document number",
        "value": "L01X00T47",
        "sensitive": true,
        "section": "Identity and payment"
      },
      {
        "id": "applicant-iban",
        "label": "Bank account",
        "value": "DE12 1001 0010 9876 5432 10",
        "sensitive": true,
        "section": "Identity and payment"
      },
      {
        "id": "monthly-rent",
        "label": "Monthly warm rent",
        "value": "EUR 1,180",
        "sensitive": false,
        "section": "Application facts"
      },
      {
        "id": "net-income",
        "label": "Net income",
        "value": "About EUR 3,300 / month",
        "sensitive": false,
        "section": "Application facts"
      },
      {
        "id": "employment",
        "label": "Employment",
        "value": "Permanent contract",
        "sensitive": false,
        "section": "Application facts"
      },
      {
        "id": "move-in",
        "label": "Move-in date",
        "value": "1 September 2026",
        "sensitive": false,
        "section": "Application facts"
      }
    ]
  },
  "loan-offer": {
    "kicker": "Interactive document · Loan offer",
    "title": "Personal loan offer",
    "reference": "Offer · LO-8841-26",
    "instruction": "Hide borrower and banking details while keeping the figures needed to compare the loan.",
    "usefulSummary": "The AI can still see the amount, APR, term, payment, fee and repayment conditions.",
    "fields": [
      {
        "id": "borrower-name",
        "label": "Borrower name",
        "value": "Jonas Weber",
        "sensitive": true,
        "section": "Borrower"
      },
      {
        "id": "borrower-address",
        "label": "Home address",
        "value": "Lindenstraße 42, 50674 Köln",
        "sensitive": true,
        "section": "Borrower"
      },
      {
        "id": "bank-customer",
        "label": "Bank customer ID",
        "value": "C-49018372",
        "sensitive": true,
        "section": "Borrower"
      },
      {
        "id": "borrower-iban",
        "label": "Account IBAN",
        "value": "DE44 5001 0517 5407 3249 31",
        "sensitive": true,
        "section": "Financial profile"
      },
      {
        "id": "credit-score",
        "label": "Credit score",
        "value": "SCHUFA 96.8%",
        "sensitive": true,
        "section": "Financial profile"
      },
      {
        "id": "account-balance",
        "label": "Current balance",
        "value": "EUR 6,842.17",
        "sensitive": true,
        "section": "Financial profile"
      },
      {
        "id": "loan-amount",
        "label": "Loan amount",
        "value": "EUR 8,000",
        "sensitive": false,
        "section": "Offer terms"
      },
      {
        "id": "loan-term",
        "label": "Term",
        "value": "36 months",
        "sensitive": false,
        "section": "Offer terms"
      },
      {
        "id": "loan-apr",
        "label": "APR",
        "value": "8.9%",
        "sensitive": false,
        "section": "Offer terms"
      },
      {
        "id": "loan-payment",
        "label": "Monthly payment",
        "value": "EUR 254.10",
        "sensitive": false,
        "section": "Offer terms"
      },
      {
        "id": "loan-fee",
        "label": "Origination fee",
        "value": "EUR 120",
        "sensitive": false,
        "section": "Offer terms"
      },
      {
        "id": "loan-repayment",
        "label": "Early repayment",
        "value": "Free after 12 months",
        "sensitive": false,
        "section": "Offer terms"
      }
    ]
  },
  "cv-profile": {
    "kicker": "Interactive document · CV",
    "title": "Curriculum vitae",
    "reference": "Draft · CV-2026-07",
    "instruction": "Hide direct identifiers while keeping the experience and skills needed for useful CV feedback.",
    "usefulSummary": "The AI can still see the role target, experience, skills and education summary.",
    "fields": [
      {
        "id": "cv-name",
        "label": "Full name",
        "value": "Leonie Fischer",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "cv-address",
        "label": "Home address",
        "value": "Kantstraße 91, 10627 Berlin",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "cv-email",
        "label": "Email",
        "value": "leonie.fischer@example.com",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "cv-phone",
        "label": "Phone",
        "value": "+49 152 77834015",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "cv-birth",
        "label": "Date of birth",
        "value": "3 November 2001",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "cv-linkedin",
        "label": "LinkedIn URL",
        "value": "linkedin.com/in/leonie-fischer-1842",
        "sensitive": true,
        "section": "Personal details"
      },
      {
        "id": "target-role",
        "label": "Target role",
        "value": "Junior backend developer",
        "sensitive": false,
        "section": "Professional profile"
      },
      {
        "id": "experience",
        "label": "Experience",
        "value": "University projects and working-student role",
        "sensitive": false,
        "section": "Professional profile"
      },
      {
        "id": "skills",
        "label": "Core skills",
        "value": "Java, backend development, React basics",
        "sensitive": false,
        "section": "Professional profile"
      },
      {
        "id": "education",
        "label": "Education",
        "value": "BSc Computer Science, expected 2027",
        "sensitive": false,
        "section": "Professional profile"
      }
    ]
  },
  "work-email": {
    "kicker": "Interactive document · Work email",
    "title": "Internal project email",
    "reference": "Thread · PX-17",
    "instruction": "Hide names and confidential project details while keeping only the context needed to draft the reply.",
    "usefulSummary": "The AI can still see the requested tone, review status and general timeline message.",
    "fields": [
      {
        "id": "sender-name",
        "label": "Sender",
        "value": "Nina Berger",
        "sensitive": true,
        "section": "Participants"
      },
      {
        "id": "recipient-names",
        "label": "Recipients",
        "value": "David Klein, Sara Vogt, Luca Stein",
        "sensitive": true,
        "section": "Participants"
      },
      {
        "id": "email-addresses",
        "label": "Email addresses",
        "value": "project-team@northstar.example",
        "sensitive": true,
        "section": "Participants"
      },
      {
        "id": "client-name",
        "label": "Client",
        "value": "Helios Mobility GmbH",
        "sensitive": true,
        "section": "Confidential context"
      },
      {
        "id": "project-code",
        "label": "Project codename",
        "value": "Northstar PX-17",
        "sensitive": true,
        "section": "Confidential context"
      },
      {
        "id": "budget",
        "label": "Internal budget",
        "value": "EUR 420,000",
        "sensitive": true,
        "section": "Confidential context"
      },
      {
        "id": "internal-link",
        "label": "Internal workspace",
        "value": "intranet.example/projects/PX-17",
        "sensitive": true,
        "section": "Confidential context"
      },
      {
        "id": "reply-purpose",
        "label": "Reply purpose",
        "value": "Request one more review round",
        "sensitive": false,
        "section": "Drafting facts"
      },
      {
        "id": "tone",
        "label": "Tone",
        "value": "Concise and collaborative",
        "sensitive": false,
        "section": "Drafting facts"
      },
      {
        "id": "timeline",
        "label": "Timeline message",
        "value": "Do not commit to a date yet",
        "sensitive": false,
        "section": "Drafting facts"
      },
      {
        "id": "status",
        "label": "Current status",
        "value": "Final review still pending",
        "sensitive": false,
        "section": "Drafting facts"
      }
    ]
  }
};

let redactionTrigger = null;
let redactionOptionIndex = null;
let activeRedactionProfile = null;
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
  return [...new Set(activeRedactionProfile.fields.map((field) => field.section))].map((section) => `
    <section class="contract-section" aria-labelledby="contract-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">
      <h3 id="contract-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}">${escapeHtml(section)}</h3>
      <div class="contract-fields">
        ${activeRedactionProfile.fields.filter((field) => field.section === section).map(contractFieldMarkup).join("")}
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

function getRedactionProfile(index) {
  const profileKey = levels[levelIndex]?.options[index]?.documentProfile;
  return documentRedactionProfiles[profileKey] || documentRedactionProfiles["phone-contract"];
}

function openContractRedaction(index, trigger) {
  closeContractRedaction({ restoreFocus: false });
  redactionTrigger = trigger;
  redactionOptionIndex = index;
  redactedFieldIds = new Set();
  activeRedactionProfile = getRedactionProfile(index);

  const overlay = document.createElement("div");
  overlay.className = "contract-redaction-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "contract-redaction-title");
  overlay.innerHTML = `
    <article class="contract-redaction-editor">
      <header class="contract-editor-header">
        <div>
          <p class="contract-editor-kicker">${escapeHtml(activeRedactionProfile.kicker)}</p>
          <h2 id="contract-redaction-title">What should the AI not see?</h2>
          <p>${escapeHtml(activeRedactionProfile.instruction)} Tap a blacked-out field again to restore it.</p>
        </div>
        <button class="contract-editor-close" type="button" data-close-contract aria-label="Close document">×</button>
      </header>

      <div class="contract-editor-body">
        <div class="contract-paper">
          <div class="contract-paper-heading">
            <div>
              <span>Fictional document</span>
              <h3>${escapeHtml(activeRedactionProfile.title)}</h3>
            </div>
            <span class="contract-number">${escapeHtml(activeRedactionProfile.reference)}</span>
          </div>
          ${contractSectionsMarkup()}
          <p class="contract-fine-print">This fictional document is used only for the PrivacyGuard learning game.</p>
        </div>
      </div>

      <footer class="contract-editor-actions">
        <div class="redaction-status">
          <span class="redaction-status-dot" aria-hidden="true"></span>
          <div>
            <strong data-redaction-count>0 fields redacted</strong>
            <span>Keep useful task information readable.</span>
          </div>
        </div>
        <div class="contract-action-buttons">
          <button class="contract-back-button" type="button" data-close-contract>Back</button>
          <button class="contract-share-button" type="button" data-share-redacted>Share reviewed document →</button>
        </div>
      </footer>
    </article>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("redaction-open");
  overlay.querySelector(".contract-editor-close")?.focus();
}

function gradeContractRedaction() {
  const sensitiveFields = activeRedactionProfile.fields.filter((field) => field.sensitive);
  const usefulFields = activeRedactionProfile.fields.filter((field) => !field.sensitive);
  const redactedSensitive = sensitiveFields.filter((field) => redactedFieldIds.has(field.id));
  const missedSensitive = sensitiveFields.filter((field) => !redactedFieldIds.has(field.id));
  const overRedacted = usefulFields.filter((field) => redactedFieldIds.has(field.id));

  let key = "risky";
  if (missedSensitive.length === 0 && overRedacted.length === 0) key = "safe";
  else if (redactedSensitive.length >= 5 && missedSensitive.length <= 2) key = "caution";

  const labels = { safe: "SAFE REDACTION", caution: "CHECK AGAIN", risky: "NOT SAFE YET" };
  const summaries = {
    safe: "Excellent — every personal or confidential detail is hidden while the useful task information remains available.",
    caution: "Good start, but the document either still contains sensitive details or hides information the AI needs for the task.",
    risky: "The document still exposes too many personal or confidential details that are not needed for this task."
  };
  const responseText = {
    safe: "I redacted all personal and confidential details and kept only the information needed for the task.",
    caution: `I redacted ${redactedSensitive.length} sensitive fields, but the document still needs another privacy check.`,
    risky: `I shared the document after redacting only ${redactedSensitive.length} sensitive ${redactedSensitive.length === 1 ? "field" : "fields"}.`
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
      modalTitle: key === "safe" ? "You created a useful, privacy-safe document copy." : "The document needs a more careful privacy review.",
      lessonLabel: "PRIVACY LESSON · INTERACTIVE REDACTION",
      points: [
        {
          type: redactedSensitive.length >= 5 ? "good" : "risk",
          mark: redactedSensitive.length >= 5 ? "+" : "!",
          title: `${redactedSensitive.length} of ${sensitiveFields.length} sensitive fields hidden`,
          text: missedSensitive.length
            ? `Still visible: ${missedSensitive.map((field) => field.label.toLowerCase()).join(", ")}.`
            : "All marked personal and confidential fields are hidden."
        },
        {
          type: overRedacted.length === 0 ? "good" : "risk",
          mark: overRedacted.length === 0 ? "+" : "!",
          title: overRedacted.length === 0 ? "Useful terms preserved" : "Useful terms were hidden",
          text: overRedacted.length === 0
            ? activeRedactionProfile.usefulSummary
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
  const openButton = event.target.closest("[data-open-document]");
  if (!openButton || openButton.disabled) return;
  const card = openButton.closest(".option-card");
  const index = Number(openButton.dataset.index);
  const option = levels[levelIndex]?.options[index];
  if (!card || option?.interaction !== "redact-document") return;
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
    const field = activeRedactionProfile.fields.find((item) => item.id === id);
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
