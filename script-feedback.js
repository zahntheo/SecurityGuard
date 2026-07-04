let gameConfig = {
  assistantTitle: "PrivacyGuard AI",
  model: "PG.5.6",
  levels: []
};
let levels = [];

const attentionEl = document.getElementById("attention");
const startGameEl = document.getElementById("start-game");
const gameStageEl = document.getElementById("game-stage");
const appShellEl = document.querySelector(".app-shell");
const exposedCountEl = document.getElementById("exposed-count");
const optionsEl = document.getElementById("options");
const screenTitleEl = document.getElementById("screen-title");
const modelNameEl = document.getElementById("model-name");
const levelBadgeEl = document.getElementById("level-badge");
const progressFillEl = document.getElementById("progress-fill");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const userPromptEl = document.getElementById("user-prompt");
const aiPromptEl = document.getElementById("ai-prompt");

let levelIndex = 0;
let score = 0;
let seconds = 22;
let timerId = null;
let exposed = 0;
let sceneResults = [];
let currentLesson = null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function iconFor(name) {
  const icons = { document: "📄", link: "🔗", mail: "📨" };
  return icons[name] || name || "📄";
}

function documentPreview(kind) {
  if (!kind) return "";
  const tagText = kind.toUpperCase();
  const tagClass = kind === "part" ? "doc-tag warn" : "doc-tag";
  return `
    <div class="document-preview" aria-hidden="true">
      <span class="${tagClass}">${tagText}</span>
      <span class="doc-line dark"></span>
      <span class="doc-line"></span>
      <span class="doc-line short"></span>
      <span class="doc-line pale"></span>
      <span class="doc-line"></span>
      <span class="doc-line short"></span>
    </div>
  `;
}

function resultStatus(points) {
  if (points === 20) return { key: "safe", label: "Safe" };
  if (points === 10) return { key: "caution", label: "Caution" };
  return { key: "risky", label: "Risky" };
}

function attachmentName(kind, level) {
  const base = level.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  if (kind === "part") return `${base}_redacted.pdf · selected pages`;
  if (kind === "mail") return `${base}_thread.eml · full thread`;
  if (kind === "zip") return `${base}_package.zip · full package`;
  return `${base}_full.pdf · full document`;
}

function selectedResponse(level, option) {
  if (!option.document) return `<p>${escapeHtml(option.text)}</p>`;
  return `
    <div class="upload-row">
      ${documentPreview(option.document)}
      <div class="upload-copy">
        <p>${escapeHtml(option.text)}</p>
        <p class="attachment-line">📎 ${escapeHtml(attachmentName(option.document, level))}</p>
      </div>
    </div>
  `;
}

function syncAssistantChrome() {
  screenTitleEl.textContent = gameConfig.assistantTitle;
  modelNameEl.textContent = `model:${gameConfig.model}`;
}

function removeFeedback() {
  document.querySelector(".feedback-panel")?.remove();
  document.querySelector(".lesson-overlay")?.remove();
  currentLesson = null;
}

function render() {
  const level = levels[levelIndex];
  if (!level) return;
  removeFeedback();
  syncAssistantChrome();
  levelBadgeEl.textContent = `Level ${levelIndex + 1} / ${levels.length}`;
  userPromptEl.textContent = level.user;
  aiPromptEl.textContent = level.prompt;
  scoreEl.textContent = score;
  progressFillEl.style.width = `${Math.round(((levelIndex + 1) / levels.length) * 70)}%`;
  optionsEl.innerHTML = level.options.map((option, index) => `
    <button class="option-card" type="button" data-index="${index}">
      <span class="option-label">${escapeHtml(option.label)}</span>
      ${documentPreview(option.document)}
      <p>${escapeHtml(option.text)}</p>
    </button>
  `).join("");
  resetTimer();
}

function resetTimer() {
  clearInterval(timerId);
  seconds = 22;
  timerEl.textContent = `${seconds}s`;
  timerId = setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    timerEl.textContent = `${seconds}s`;
    if (seconds === 0) clearInterval(timerId);
  }, 1000);
}

function choose(index) {
  const level = levels[levelIndex];
  const option = level.options[index];
  const cards = [...document.querySelectorAll(".option-card")];
  const feedback = option.feedback;
  clearInterval(timerId);

  cards.forEach((card, cardIndex) => {
    card.disabled = true;
    if (cardIndex === index) card.classList.add("selected", feedback.key);
    if (level.options[cardIndex].score === 20) card.classList.add("correct");
    if (level.options[cardIndex].score === 10) card.classList.add("partial");
  });
  if (option.score === 0) cards[index].classList.add("wrong");

  score += option.score;
  scoreEl.textContent = score;
  sceneResults.push({
    index: levelIndex + 1,
    title: level.shortTitle,
    icon: iconFor(level.icon),
    score: option.score,
    adviceTitle: level.adviceTitle,
    advice: level.advice
  });
  currentLesson = { level, option, feedback };
  renderFeedback(level, option, feedback);
}

function renderFeedback(level, option, feedback) {
  removeFeedback();
  currentLesson = { level, option, feedback };
  const isLast = levelIndex === levels.length - 1;
  const panel = document.createElement("section");
  panel.className = "feedback-panel";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <article class="selected-response message-user">
      <div class="bubble user-bubble">
        <span class="stamp">YOU · 09:43</span>
        ${selectedResponse(level, option)}
      </div>
      <span class="avatar user-avatar">U</span>
    </article>
    <article class="feedback-card ${feedback.key}">
      <p class="feedback-label">${escapeHtml(feedback.label)}</p>
      <div class="feedback-content">
        <p>${escapeHtml(feedback.summary)}</p>
        <button class="view-more-button" type="button" data-view-more>view more ›</button>
      </div>
    </article>
    <div class="next-wrap">
      <button class="next-button" type="button" data-next-step>${isLast ? "view final score →" : "next scenario →"}</button>
    </div>
  `;
  optionsEl.insertAdjacentElement("afterend", panel);
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function renderLessonModal() {
  if (!currentLesson) return;
  document.querySelector(".lesson-overlay")?.remove();
  const { option, feedback } = currentLesson;
  const overlay = document.createElement("div");
  overlay.className = "lesson-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "lesson-title");
  overlay.innerHTML = `
    <article class="lesson-modal">
      <header class="lesson-header">
        <p>${escapeHtml(feedback.lessonLabel)}</p>
        <button class="lesson-close" type="button" data-close-lesson aria-label="Close lesson">×</button>
      </header>
      <div class="lesson-body">
        <h2 class="lesson-title" id="lesson-title">${escapeHtml(feedback.modalTitle)}</h2>
        <div class="lesson-content">
          ${documentPreview(option.document || "part")}
          <div class="lesson-points">
            ${feedback.points.map((point) => `
              <div class="lesson-point">
                <span class="point-dot ${point.type}">${escapeHtml(point.mark)}</span>
                <div class="point-copy">
                  <strong>${escapeHtml(point.title)}</strong>
                  <p>${escapeHtml(point.text)}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="remember-rule">
          <span>REMEMBER</span>
          <strong>${escapeHtml(feedback.remember)}</strong>
        </div>
      </div>
    </article>
  `;
  document.body.appendChild(overlay);
}

function goNext() {
  removeFeedback();
  if (levelIndex < levels.length - 1) {
    levelIndex += 1;
    render();
    return;
  }
  finish();
}

function gradeForScore(total) {
  if (total >= 90) return { grade: "A - SAFE", copy: "Excellent result. You shared useful context while keeping personal and professional data out of the prompt." };
  if (total >= 60) return { grade: "B - CAUTIOUS", copy: "You spotted most risks, but some choices exposed more than necessary. Remember - summaries work just as well as full documents." };
  if (total >= 40) return { grade: "C - REVIEW", copy: "You caught several risks, but full documents still leaked too much personal context. Share only the exact facts the task needs." };
  return { grade: "D - RISKY", copy: "Too many uploads exposed sensitive details. Before using AI, strip identifiers and summarize the request in your own words." };
}

function finish() {
  clearInterval(timerId);
  const grade = gradeForScore(score);
  const riskyMoves = sceneResults.filter((result) => result.score === 0).length;
  const logs = sceneResults.map((result) => {
    const status = resultStatus(result.score);
    return `
      <article class="log-card ${status.key}">
        <span class="log-icon" aria-hidden="true">${result.icon}</span>
        <div>
          <p class="log-kicker">Scenario ${result.index}</p>
          <p class="log-title">${escapeHtml(result.title)}</p>
        </div>
        <span class="status-pill ${status.key}">${status.label}</span>
      </article>
    `;
  }).join("");
  const advice = sceneResults.map((result) => `
    <article class="advice-card">
      <span class="advice-number">${String(result.index).padStart(2, "0")}</span>
      <div>
        <strong>${escapeHtml(result.adviceTitle)}</strong>
        <p>${escapeHtml(result.advice)}</p>
      </div>
    </article>
  `).join("");

  appShellEl.classList.add("complete-mode");
  appShellEl.setAttribute("aria-labelledby", "complete-title");
  appShellEl.innerHTML = `
    <header class="complete-header">
      <div class="complete-topline">
        <p class="complete-kicker">Scenario complete</p>
        <button class="complete-close" type="button" data-exit-game aria-label="Exit game">x</button>
      </div>
      <h1 class="complete-title" id="complete-title">All scenarios completed</h1>
      <p class="complete-meta">${levels.length} scenes · ${riskyMoves} risky moves</p>
    </header>
    <section class="complete-body">
      <p class="complete-eyebrow">Scenario · Daily life</p>
      <h2 class="complete-heading">Your safety score</h2>
      <section class="result-score-card" aria-label="Privacy grade">
        <div class="score-ring" style="--score: ${score}"><strong>${score}</strong><span>/ 100</span></div>
        <div class="score-summary">
          <div class="score-grade-row"><span class="score-label">Privacy grade</span><span class="grade-pill">${grade.grade}</span></div>
          <p class="score-copy">${grade.copy}</p>
        </div>
      </section>
      <section class="scenario-log" aria-labelledby="scenario-log-title">
        <h3 class="result-section-title" id="scenario-log-title">Scenario log</h3>
        <div class="log-list">${logs}</div>
      </section>
      <section aria-labelledby="advice-title">
        <h3 class="result-section-title" id="advice-title">Advice for this scenario</h3>
        <div class="advice-list">${advice}</div>
      </section>
    </section>
    <footer class="complete-actions"><button class="exit-game-button" type="button" data-exit-game>Exit Game</button></footer>
  `;
}

function startGame() {
  if (!levels.length) return;
  attentionEl.hidden = true;
  gameStageEl.hidden = false;
  levelIndex = 0;
  score = 0;
  sceneResults = [];
  render();
}

function tickExposure() {
  exposed += Math.floor(17 + Math.random() * 43);
  exposedCountEl.textContent = exposed.toLocaleString("en-US");
}

function applyScenarioConfig(config) {
  gameConfig = config || gameConfig;
  levels = gameConfig.levels || [];
  syncAssistantChrome();
  startGameEl.disabled = levels.length === 0;
  startGameEl.textContent = levels.length ? "Start Game" : "Scenario data missing";
}

async function loadScenarios() {
  startGameEl.disabled = true;
  startGameEl.textContent = "Loading...";
  try {
    const response = await fetch("scenarios.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load scenarios.json (${response.status})`);
    applyScenarioConfig(await response.json());
  } catch (error) {
    console.warn("Falling back to bundled scenario data.", error);
    if (window.PRIVACYGUARD_SCENARIOS) {
      applyScenarioConfig(window.PRIVACYGUARD_SCENARIOS);
      return;
    }
    console.error(error);
    startGameEl.textContent = "Scenario data missing";
  }
}

startGameEl.addEventListener("click", startGame);

gameStageEl.addEventListener("click", (event) => {
  if (event.target.closest("[data-exit-game]")) {
    window.location.reload();
    return;
  }
  if (event.target.closest("[data-view-more]")) {
    renderLessonModal();
    return;
  }
  if (event.target.closest("[data-next-step]")) {
    goNext();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-close-lesson]") || event.target.classList.contains("lesson-overlay")) {
    document.querySelector(".lesson-overlay")?.remove();
  }
});

optionsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  choose(Number(button.dataset.index));
});

syncAssistantChrome();
loadScenarios();
tickExposure();
setInterval(tickExposure, 1200);
