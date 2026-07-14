const contentEl = document.querySelector(".content");
const dividerLabelEl = document.querySelector(".divider-label");
let pendingOptionIndex = null;

function sendButton() {
  return document.querySelector(".composer-send");
}

function composerInput() {
  return document.querySelector(".composer-input");
}

function updateComposerSelection(option = null) {
  const input = composerInput();
  const label = document.querySelector(".composer-label");
  if (!input) return;

  if (!option) {
    if (label) label.textContent = "Review your reply";
    input.classList.add("is-placeholder");
    input.textContent = "Choose one option below";
    input.setAttribute("aria-label", "No reply selected. Choose one option below.");
    return;
  }

  if (label) {
    label.textContent = option.interaction === "redact-document"
      ? "Press Edit file to review"
      : "Review your reply";
  }

  const fileName = typeof window.optionFileName === "function" ? window.optionFileName(option) : "";
  const typeLabel = fileName ? (option.interaction === "redact-document" ? "EDIT FILE" : "FILE") : "TEXT";
  const selectedValue = fileName || option.text;

  input.classList.remove("is-placeholder");
  input.innerHTML = `
    <span class="composer-type">${escapeHtml(typeLabel)}</span>
    <span class="composer-selection">${escapeHtml(selectedValue)}</span>
  `;
  input.setAttribute("aria-label", `Selected ${typeLabel.toLowerCase()}: ${selectedValue}`);
}

function setComposerReady(isReady) {
  const button = sendButton();
  const composer = document.querySelector(".composer-shell");
  if (!button || !composer) return;
  button.disabled = !isReady;
  composer.classList.toggle("ready", isReady);
}

function resetPendingReply() {
  pendingOptionIndex = null;
  contentEl?.classList.remove("reply-sent");
  document.querySelectorAll(".option-card").forEach((card) => {
    const selectionControl = card.matches("button") ? card : card.querySelector("[data-select-option]");
    card.classList.remove("draft-selected", "draft-muted");
    selectionControl?.setAttribute("aria-pressed", "false");
  });
  updateComposerSelection();
  setComposerReady(false);
}

function installChatCues() {
  if (dividerLabelEl) {
    dividerLabelEl.classList.add("choice-instruction");
    dividerLabelEl.innerHTML = `
      <span class="choice-copy">
        <strong>Choose one option</strong>
        <span>Click a reply to place it in your message field.</span>
      </span>
    `;
  }

  if (dividerLabelEl && !document.querySelector(".composer-shell")) {
    const composer = document.createElement("div");
    composer.className = "composer-shell";
    composer.setAttribute("aria-label", "Your selected reply");
    composer.innerHTML = `
      <button class="composer-attach" type="button" tabindex="-1" aria-label="File reply indicator">📎</button>
      <div class="composer-main">
        <span class="composer-label">Review your reply</span>
        <div class="composer-input is-placeholder" aria-live="polite">Choose one option below</div>
      </div>
      <button class="composer-send" type="button" disabled aria-label="Send selected reply">
        <span>Send</span>
        <span aria-hidden="true">↑</span>
      </button>
    `;
    dividerLabelEl.insertAdjacentElement("afterend", composer);
  }

  const pendingOption = pendingOptionIndex === null ? null : levels[levelIndex]?.options[pendingOptionIndex];
  const canSendPendingOption = pendingOptionIndex !== null && pendingOption?.interaction !== "redact-document";
  updateComposerSelection(pendingOption);
  setComposerReady(canSendPendingOption);
}

function showAssistantTyping() {
  document.querySelector(".typing-message")?.remove();
  const typing = document.createElement("article");
  typing.className = "typing-message message-ai";
  typing.innerHTML = `
    <span class="avatar ai-avatar">AI</span>
    <div class="bubble ai-bubble typing-bubble">
      <span class="stamp">PrivacyGuard AI · typing</span>
      <div class="typing-copy">
        <span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </div>
  `;
  optionsEl.insertAdjacentElement("afterend", typing);
  typing.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function selectDraftReply(card) {
  pendingOptionIndex = Number(card.dataset.index);
  document.querySelectorAll(".option-card").forEach((optionCard) => {
    const isSelected = optionCard === card;
    const selectionControl = optionCard.matches("button")
      ? optionCard
      : optionCard.querySelector("[data-select-option]");
    optionCard.classList.toggle("draft-selected", isSelected);
    optionCard.classList.toggle("draft-muted", !isSelected);
    selectionControl?.setAttribute("aria-pressed", String(isSelected));
  });
  const selectedOption = levels[levelIndex]?.options[pendingOptionIndex];
  updateComposerSelection(selectedOption);
  setComposerReady(selectedOption?.interaction !== "redact-document");
  document.querySelector(".composer-shell")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideReplyPicker() {
  contentEl?.classList.add("reply-sent");
  dividerLabelEl?.setAttribute("hidden", "");
  optionsEl?.setAttribute("hidden", "");
  document.querySelector(".composer-shell")?.setAttribute("hidden", "");
}

optionsEl.addEventListener("click", (event) => {
  const card = event.target.closest(".option-card");
  const selectionControl = card?.matches("button") ? card : card?.querySelector("[data-select-option]");
  if (!card || selectionControl?.disabled) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  selectDraftReply(card);
}, true);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".composer-send")) return;
  if (pendingOptionIndex === null) return;
  const indexToSend = pendingOptionIndex;
  const selectedOption = levels[levelIndex]?.options[indexToSend];
  if (selectedOption?.interaction === "redact-document") return;
  hideReplyPicker();
  setComposerReady(false);
  window.choose(indexToSend);
});

const originalRender = window.render;
window.render = function renderWithChatCues() {
  originalRender();
  dividerLabelEl?.removeAttribute("hidden");
  optionsEl?.removeAttribute("hidden");
  document.querySelector(".composer-shell")?.removeAttribute("hidden");
  resetPendingReply();
  installChatCues();
};

const originalRemoveFeedback = window.removeFeedback;
window.removeFeedback = function removeFeedbackWithTyping() {
  document.querySelector(".typing-message")?.remove();
  originalRemoveFeedback();
};

const originalRenderFeedback = window.renderFeedback;
window.renderFeedback = function renderFeedbackWithTyping(level, option, feedback) {
  showAssistantTyping();
  window.setTimeout(() => {
    document.querySelector(".typing-message")?.remove();
    originalRenderFeedback(level, option, feedback);
    installChatCues();
  }, 650);
};

installChatCues();
