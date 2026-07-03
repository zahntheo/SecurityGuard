const chatEl = document.querySelector(".chat");
const contentEl = document.querySelector(".content");
const dividerLabelEl = document.querySelector(".divider-label");
const sceneSubtitleEl = document.getElementById("scene-subtitle");
let pendingOptionIndex = null;

function sendButton() {
  return document.querySelector(".composer-send");
}

function syncHeaderChrome() {
  if (sceneSubtitleEl) sceneSubtitleEl.textContent = "PrivacyGuard AI";
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
    card.classList.remove("draft-selected", "draft-muted");
  });
  setComposerReady(false);
}

function installChatCues() {
  syncHeaderChrome();

  if (chatEl && !document.querySelector(".chat-shell-cue")) {
    const cue = document.createElement("div");
    cue.className = "chat-shell-cue";
    cue.innerHTML = "<span>model: PG.6.7</span>";
    chatEl.insertAdjacentElement("beforebegin", cue);
  }

  if (dividerLabelEl) {
    dividerLabelEl.firstChild.nodeValue = "SUGGESTED REPLIES ";
  }

  if (dividerLabelEl && !document.querySelector(".composer-shell")) {
    const composer = document.createElement("div");
    composer.className = "composer-shell";
    composer.setAttribute("aria-label", "Message composer preview");
    composer.innerHTML = `
      <button class="composer-attach" type="button" tabindex="-1" aria-label="Attach file">📎</button>
      <div class="composer-input">Pick a suggested reply to send...</div>
      <button class="composer-send" type="button" disabled aria-label="Send selected reply">↑</button>
    `;
    dividerLabelEl.insertAdjacentElement("beforebegin", composer);
  }

  setComposerReady(pendingOptionIndex !== null);
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

function selectDraftReply(button) {
  pendingOptionIndex = Number(button.dataset.index);
  document.querySelectorAll(".option-card").forEach((card) => {
    const isSelected = card === button;
    card.classList.toggle("draft-selected", isSelected);
    card.classList.toggle("draft-muted", !isSelected);
  });
  setComposerReady(true);
}

function hideReplyPicker() {
  contentEl?.classList.add("reply-sent");
  dividerLabelEl?.setAttribute("hidden", "");
  optionsEl?.setAttribute("hidden", "");
  document.querySelector(".composer-shell")?.setAttribute("hidden", "");
}

optionsEl.addEventListener("click", (event) => {
  const button = event.target.closest(".option-card");
  if (!button || button.disabled) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  selectDraftReply(button);
}, true);

document.addEventListener("click", (event) => {
  if (!event.target.closest(".composer-send")) return;
  if (pendingOptionIndex === null) return;
  const indexToSend = pendingOptionIndex;
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
