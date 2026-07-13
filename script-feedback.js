const DISPLAY_MODEL = "GPT-5.5";
const DEFAULT_GAME_SETTINGS = {
  optionPoints: {
    safe: 20,
    caution: 10,
    risky: 0
  }
};

let gameSettings = { ...DEFAULT_GAME_SETTINGS, optionPoints: { ...DEFAULT_GAME_SETTINGS.optionPoints } };
let gameConfig = {
  assistantTitle: "PrivacyGuard AI",
  model: DISPLAY_MODEL,
  levels: []
};
let levels = [];

const attentionEl = document.getElementById("attention");
const startGameEl = document.getElementById("start-game");
const gameStageEl = document.getElementById("game-stage");
const appShellEl = document.querySelector(".app-shell");
const exposedCountEl = document.getElementById("exposed-count");
const optionsEl = document.getElementById("options");
const gameProgressEl = document.getElementById("game-progress");
const progressMessageEl = document.getElementById("progress-message");
const screenTitleEl = document.getElementById("screen-title");
const modelNameEl = document.getElementById("model-name");
const levelBadgeEl = document.getElementById("level-badge");
const progressFillEl = document.getElementById("progress-fill");
const scoreEl = document.getElementById("score");
const userPromptEl = document.getElementById("user-prompt");
const aiPromptEl = document.getElementById("ai-prompt");

let levelIndex = 0;
let score = 0;
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

function resultStatus(key = "risky") {
  const labels = {
    safe: "Safe",
    caution: "Caution",
    risky: "Risky"
  };
  return { key, label: labels[key] || "Risky" };
}

function attachmentName(kind, level) {
  const base = level.shortTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  if (kind === "redacted") return `${base}_redacted.pdf · reviewed copy`;
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

function normalizeSettings(config = {}) {
  return {
    optionPoints: {
      ...DEFAULT_GAME_SETTINGS.optionPoints,
      ...(config.optionPoints || {})
    }
  };
}

function getOptionStatus(option) {
  return option.feedback?.key || "risky";
}

function getOptionScore(option) {
  const configuredScore = Number(gameSettings.optionPoints[getOptionStatus(option)]);
  if (Number.isFinite(configuredScore)) return configuredScore;
  const legacyScore = Number(option.score);
  return Number.isFinite(legacyScore) ? legacyScore : 0;
}

function maxOptionScore() {
  const scores = Object.values(gameSettings.optionPoints).map(Number).filter(Number.isFinite);
  return Math.max(0, ...scores);
}

function maxScore() {
  return levels.length * maxOptionScore();
}

function scorePercent(total = score) {
  const max = maxScore();
  return max > 0 ? Math.round((total / max) * 100) : 0;
}

function syncAssistantChrome() {
  screenTitleEl.textContent = gameConfig.assistantTitle;
  modelNameEl.textContent = `model: ${DISPLAY_MODEL}`;
}

function removeFeedback() {
  document.querySelector(".feedback-panel")?.remove();
  document.querySelector(".lesson-overlay")?.remove();
  document.querySelector(".contract-redaction-overlay")?.remove();
  document.body.classList.remove("redaction-open");
  currentLesson = null;
}

function updateProgress(levelNumber = levelIndex + 1) {
  const visibleLevel = Math.min(levels.length, Math.max(1, levelNumber));
  levelBadgeEl.textContent = `${visibleLevel} / ${levels.length}`;
  progressFillEl.style.width = `${Math.round((visibleLevel / levels.length) * 100)}%`;
}

function resetProgressReward() {
  progressMessageEl.className = "progress-message is-empty";
  progressMessageEl.setAttribute("aria-hidden", "true");
  progressMessageEl.innerHTML = "";
  scoreEl.classList.remove("score-bump");
  levelBadgeEl.classList.remove("level-bump");
  progressFillEl.classList.remove("progress-advance");
}

function progressionCopy(points, status) {
  if (status === "safe") {
    return {
      kicker: `+${points} points`,
      title: "Nice work — keep going!",
      text: "You shared only what was needed and protected the details that should stay private."
    };
  }
  if (status === "caution") {
    return {
      kicker: `+${points} points`,
      title: "Good step — you’re getting sharper!",
      text: "You spotted part of the risk. Sharing a little less would make this answer even safer."
    };
  }
  return {
    kicker: "0 points",
    title: "No worries — mistakes are human.",
    text: "Pause and think about which personal details could be exposed before you share next time."
  };
}

function restartProgressAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function showProgressReward(points, status) {
  const isLast = levelIndex === levels.length - 1;
  const visibleLevel = isLast ? levels.length : levelIndex + 2;
  const copy = progressionCopy(points, status);
  const levelText = isLast ? "All levels complete" : `Level ${visibleLevel} unlocked`;

  scoreEl.textContent = score;
  updateProgress(visibleLevel);
  progressMessageEl.className = `progress-message ${status}`;
  progressMessageEl.innerHTML = `
    <span class="reward-symbol" aria-hidden="true">${status === "safe" ? "★" : status === "caution" ? "↑" : "↻"}</span>
    <div class="reward-copy">
      <span class="reward-kicker">${escapeHtml(copy.kicker)}</span>
      <strong>${escapeHtml(copy.title)}</strong>
      <p>${escapeHtml(copy.text)}</p>
    </div>
    <span class="reward-level">${escapeHtml(levelText)}</span>
  `;
  progressMessageEl.removeAttribute("aria-hidden");
  restartProgressAnimation(progressMessageEl, "reward-in");
  restartProgressAnimation(scoreEl, "score-bump");
  restartProgressAnimation(levelBadgeEl, "level-bump");
  restartProgressAnimation(progressFillEl, "progress-advance");
}

function render() {
  const level = levels[levelIndex];
  if (!level) return;
  removeFeedback();
  resetProgressReward();
  syncAssistantChrome();
  updateProgress();
  userPromptEl.textContent = level.user;
  aiPromptEl.textContent = level.prompt;
  scoreEl.textContent = score;
  optionsEl.innerHTML = level.options.map((option, index) => `
    <button class="option-card" type="button" data-index="${index}">
      <span class="option-label">${escapeHtml(option.label)}</span>
      ${option.interaction === "redact-contract" ? '<span class="option-interactive">Open & redact</span>' : ""}
      ${documentPreview(option.document)}
      <p>${escapeHtml(option.text)}</p>
    </button>
  `).join("");
}

function choose(index, optionOverride = null) {
  const level = levels[levelIndex];
  const option = optionOverride || level.options[index];
  const optionScore = getOptionScore(option);
  const optionStatus = getOptionStatus(option);
  const cards = [...document.querySelectorAll(".option-card")];
  const feedback = option.feedback;
  cards.forEach((card, cardIndex) => {
    const cardOption = cardIndex === index ? option : level.options[cardIndex];
    const cardStatus = getOptionStatus(cardOption);
    card.disabled = true;
    if (cardIndex === index) card.classList.add("selected", optionStatus);
    if (cardStatus === "safe") card.classList.add("correct");
    if (cardStatus === "caution") card.classList.add("partial");
  });
  if (optionStatus === "risky") cards[index].classList.add("wrong");

  score += optionScore;
  scoreEl.textContent = score;
  sceneResults.push({
    index: levelIndex + 1,
    title: level.shortTitle,
    icon: iconFor(level.icon),
    score: optionScore,
    status: optionStatus,
    adviceTitle: level.adviceTitle,
    advice: level.advice
  });
  showProgressReward(optionScore, optionStatus);
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
  const percent = scorePercent(total);
  if (percent >= 90) return { grade: "A - SAFE", copy: "Excellent result. You shared useful context while keeping personal and professional data out of the prompt." };
  if (percent >= 60) return { grade: "B - CAUTIOUS", copy: "You spotted most risks, but some choices exposed more than necessary. Remember - summaries work just as well as full documents." };
  if (percent >= 40) return { grade: "C - REVIEW", copy: "You caught several risks, but full documents still leaked too much personal context. Share only the exact facts the task needs." };
  return { grade: "D - RISKY", copy: "Too many uploads exposed sensitive details. Before using AI, strip identifiers and summarize the request in your own words." };
}

function finish() {
  const grade = gradeForScore(score);
  const totalMaxScore = maxScore();
  const scoreProgress = scorePercent(score);
  const riskyMoves = sceneResults.filter((result) => result.status === "risky").length;
  const logs = sceneResults.map((result) => {
    const status = resultStatus(result.status);
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
        <div class="score-ring" style="--score: ${scoreProgress}"><strong>${score}</strong><span>/ ${totalMaxScore}</span></div>
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

function applyGameSettings(config) {
  gameSettings = normalizeSettings(config);
}

function applyScenarioConfig(config) {
  gameConfig = { ...(config || gameConfig), model: DISPLAY_MODEL };
  levels = gameConfig.levels || [];
  syncAssistantChrome();
  startGameEl.disabled = levels.length === 0;
  startGameEl.textContent = levels.length ? "Start Game" : "Scenario data missing";
}

async function loadJson(path, fallbackValue) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${path} (${response.status})`);
    return await response.json();
  } catch (error) {
    console.warn(`Falling back from ${path}.`, error);
    return fallbackValue;
  }
}

async function loadGameData() {
  startGameEl.disabled = true;
  startGameEl.textContent = "Loading...";

  applyGameSettings(await loadJson("game-config.json", window.PRIVACYGUARD_GAME_CONFIG));
  const scenarioConfig = await loadJson("scenarios.json", window.PRIVACYGUARD_SCENARIOS);

  if (scenarioConfig) {
    applyScenarioConfig(scenarioConfig);
    return;
  }

  startGameEl.textContent = "Scenario data missing";
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
applyGameSettings(window.PRIVACYGUARD_GAME_CONFIG);
loadGameData();
tickExposure();
setInterval(tickExposure, 1200);
