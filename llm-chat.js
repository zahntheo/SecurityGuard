const chatEl = document.querySelector(".chat");
const dividerLabelEl = document.querySelector(".divider-label");

function installChatCues() {
  if (chatEl && !document.querySelector(".chat-shell-cue")) {
    const cue = document.createElement("div");
    cue.className = "chat-shell-cue";
    cue.innerHTML = "<span>PrivacyGuard AI</span><span>secure chat</span>";
    chatEl.insertAdjacentElement("beforebegin", cue);
  }

  if (dividerLabelEl) {
    dividerLabelEl.firstChild.nodeValue = "SUGGESTED REPLIES ";
  }

  if (optionsEl && !document.querySelector(".composer-shell")) {
    const composer = document.createElement("div");
    composer.className = "composer-shell";
    composer.setAttribute("aria-label", "Message composer preview");
    composer.innerHTML = `
      <button class="composer-attach" type="button" tabindex="-1" aria-label="Attach file">📎</button>
      <div class="composer-input">Message PrivacyGuard AI...</div>
      <button class="composer-send" type="button" tabindex="-1" aria-label="Send message">↑</button>
    `;
    optionsEl.insertAdjacentElement("afterend", composer);
  }
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
        <span>Checking privacy risk</span>
        <span class="typing-dots" aria-hidden="true"><span></span><span></span><span></span></span>
      </div>
    </div>
  `;
  optionsEl.insertAdjacentElement("afterend", typing);
  typing.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

const originalRender = window.render;
window.render = function renderWithChatCues() {
  originalRender();
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
