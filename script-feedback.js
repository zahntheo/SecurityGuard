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

function optionFileName(option = {}) {
  if (!option.document) return "";

  const extensions = {
    edit: "pdf",
    mail: "eml",
    part: "pdf",
    pdf: "pdf",
    redacted: "pdf",
    zip: "zip"
  };
  const source = option.documentProfile || option.text || "document";
  const baseName = source
    .toLowerCase()
    .replace(/^full\s+/, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const editSuffix = option.interaction === "redact-document" ? "_editable" : "";

  return `${baseName || "document"}${editSuffix}.${extensions[option.document] || "pdf"}`;
}

function selectedResponse(level, option) {
  if (!option.document) return `<p>${escapeHtml(option.text)}</p>`;
  const fileName = optionFileName(option) || attachmentName(option.document, level);
  return `
    <div class="sent-file-preview" aria-label="Sent file: ${escapeHtml(fileName)}">
      ${documentPreview(option.document)}
      <strong>${escapeHtml(fileName)}</strong>
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
  scoreEl.classList.remove("score-bump");
  levelBadgeEl.classList.remove("level-bump");
  progressFillEl.classList.remove("progress-advance");
}

function restartProgressAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function showProgressReward() {
  const isLast = levelIndex === levels.length - 1;
  const visibleLevel = isLast ? levels.length : levelIndex + 2;

  scoreEl.textContent = score;
  updateProgress(visibleLevel);
  restartProgressAnimation(scoreEl, "score-bump");
  restartProgressAnimation(levelBadgeEl, "level-bump");
  restartProgressAnimation(progressFillEl, "progress-advance");
}

function optionLabel(index) {
  return `OPTION ${String.fromCharCode(65 + index)}`;
}

function shuffledOptions(options = []) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.map((option, index) => {
    const label = optionLabel(index);
    const feedback = option.feedback
      ? {
          ...option.feedback,
          lessonLabel: option.feedback.lessonLabel?.replace(/OPTION\s+[A-Z]+$/i, label)
        }
      : option.feedback;

    return { ...option, label, feedback };
  });
}

function prepareLevelsForGame() {
  levels = (gameConfig.levels || []).map((level) => ({
    ...level,
    options: shuffledOptions(level.options)
  }));
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
  optionsEl.innerHTML = level.options.map((option, index) => {
    const fileName = optionFileName(option);
    const fileHeading = fileName
      ? `<strong class="option-file-name"><span aria-hidden="true">📄</span> ${escapeHtml(fileName)}</strong>`
      : "";
    const cardContent = `
      <span class="option-label">${escapeHtml(option.label)}</span>
      ${fileHeading}
      ${documentPreview(option.document)}
      <p>${escapeHtml(option.text)}</p>
    `;
    if (option.interaction === "redact-document") {
      return `
        <article class="option-card option-card-file option-card-interactive" data-index="${index}">
          <button
            class="option-card-select"
            type="button"
            data-select-option
            aria-pressed="false"
            aria-label="Select ${escapeHtml(fileName || option.documentTitle || "editable document")}"
          >
            ${cardContent}
          </button>
          <button
            class="option-interactive"
            type="button"
            data-open-document
            data-index="${index}"
            aria-label="Open and edit ${escapeHtml(fileName || option.documentTitle || "document")}"
          >
            Edit file
          </button>
        </article>
      `;
    }
    return `
      <button class="option-card${fileName ? " option-card-file" : ""}" type="button" data-index="${index}" aria-pressed="false">
        ${cardContent}
      </button>
    `;
  }).join("");
}

function choose(index, optionOverride = null) {
  const level = levels[levelIndex];
  const option = optionOverride || level.options[index];
  const optionScore = getOptionScore(option);
  const optionStatus = getOptionStatus(option);
  const cards = [...document.querySelectorAll(".option-card")];
  const feedback = option.feedback;
  const feedbackLearningTitle = feedback.key === "safe" ? "Why this was a good choice" : "What to learn from this choice";
  const feedbackLearningType = feedback.key === "safe" ? "good" : "risk";
  const feedbackLearningMark = feedback.key === "safe" ? "+" : "!";
  const feedbackLearning = (feedback.learning?.length
    ? feedback.learning.map((text) => ({ text }))
    : (feedback.points || [])).map((point) => ({
      text: point.text,
      type: point.type || feedbackLearningType,
      mark: point.mark || feedbackLearningMark
    }));
  cards.forEach((card, cardIndex) => {
    const cardOption = cardIndex === index ? option : level.options[cardIndex];
    const cardStatus = getOptionStatus(cardOption);
    card.disabled = true;
    card.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
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
    userMessage: level.user,
    aiMessage: level.prompt,
    selectedOption: selectedResponse(level, option),
    selectedOptionText: option.text || "",
    selectedFileName: optionFileName(option) || "",
    feedbackLabel: feedback.label,
    feedbackSummary: feedback.summary,
    feedbackLearningTitle,
    feedbackLearning,
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
  const learningTitle = feedback.key === "safe" ? "Why this was a good choice" : "What to learn from this choice";
  const learningPoints = feedback.learning?.length
    ? feedback.learning.map((text) => ({ text }))
    : (feedback.points || []);
  const learningType = feedback.key === "safe" ? "good" : "risk";
  const learningMark = feedback.key === "safe" ? "+" : "!";
  const learningCards = learningPoints.map((point) => `
    <li class="feedback-learning-item">
      <span class="point-dot ${escapeHtml(point.type || learningType)}" aria-hidden="true">${escapeHtml(point.mark || learningMark)}</span>
      <p>${escapeHtml(point.text)}</p>
    </li>
  `).join("");
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
        <p class="feedback-summary">${escapeHtml(feedback.summary)}</p>
        <section class="feedback-consequences" aria-label="${escapeHtml(learningTitle)}">
          <p class="feedback-consequences-title">${escapeHtml(learningTitle)}</p>
          <ul class="feedback-learning-list">
            ${learningCards || '<li class="feedback-learning-empty">Keep private information out of AI prompts unless it is essential.</li>'}
          </ul>
        </section>
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
          <p class="lesson-explanation">${escapeHtml(feedback.summary)}</p>
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

function scoreRingTone(percent) {
  if (percent >= 80) return "green";
  if (percent >= 40) return "yellow";
  return "red";
}

function downloadResultLog(grade, totalMaxScore, scoreProgress) {
  const resultLog = {
    exportedAt: new Date().toISOString(),
    game: gameConfig.assistantTitle,
    model: DISPLAY_MODEL,
    summary: {
      score,
      maximumScore: totalMaxScore,
      percentage: scoreProgress,
      grade: grade.grade,
      feedback: grade.copy
    },
    scenarios: sceneResults.map((result) => ({
      scenario: result.index,
      title: result.title,
      status: result.status,
      score: result.score,
      conversation: {
        user: result.userMessage,
        assistant: result.aiMessage,
        selectedChoice: result.selectedOptionText,
        selectedFile: result.selectedFileName || null
      },
      feedback: {
        label: result.feedbackLabel,
        summary: result.feedbackSummary,
        learningTitle: result.feedbackLearningTitle,
        points: result.feedbackLearning
      },
      advice: {
        title: result.adviceTitle,
        text: result.advice
      }
    }))
  };
  const blob = new Blob([JSON.stringify(resultLog, null, 2)], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const timestamp = resultLog.exportedAt.replace(/[:.]/g, "-");
  link.href = downloadUrl;
  link.download = `privacyguard-result-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function openScenarioHistory(resultIndex) {
  const result = sceneResults.find((item) => item.index === resultIndex);
  if (!result) return;
  const status = resultStatus(result.status);
  const learningCards = (result.feedbackLearning || []).map((point) => `
    <li class="feedback-learning-item">
      <span class="point-dot ${escapeHtml(point.type)}" aria-hidden="true">${escapeHtml(point.mark)}</span>
      <p>${escapeHtml(point.text)}</p>
    </li>
  `).join("");
  const modal = document.createElement("div");
  modal.className = "history-modal-backdrop";
  modal.innerHTML = `
    <section class="history-modal" role="dialog" aria-modal="true" aria-labelledby="history-modal-title">
      <header class="history-modal-header">
        <div>
          <p class="history-modal-kicker">Scenario ${result.index} · ${status.label}</p>
          <h2 id="history-modal-title">${escapeHtml(result.title)}</h2>
        </div>
        <button class="history-modal-close" type="button" data-close-history aria-label="Close scenario history">×</button>
      </header>
      <div class="history-conversation">
        <article class="history-message user">
          <span>You</span>
          <p>${escapeHtml(result.userMessage)}</p>
        </article>
        <article class="history-message ai">
          <span>AI</span>
          <p>${escapeHtml(result.aiMessage)}</p>
        </article>
        <article class="history-choice ${status.key}">
          <span>Your choice</span>
          <div>${result.selectedOption}</div>
        </article>
        <article class="history-feedback feedback-card ${status.key}">
          <p class="feedback-label">${escapeHtml(result.feedbackLabel || status.label)}</p>
          <div class="feedback-content">
            <p class="feedback-summary">${escapeHtml(result.feedbackSummary)}</p>
            <section class="feedback-consequences" aria-label="${escapeHtml(result.feedbackLearningTitle)}">
              <p class="feedback-consequences-title">${escapeHtml(result.feedbackLearningTitle)}</p>
              <ul class="feedback-learning-list">
                ${learningCards || '<li class="feedback-learning-empty">Keep private information out of AI prompts unless it is essential.</li>'}
              </ul>
            </section>
          </div>
        </article>
      </div>
    </section>
  `;
  document.body.appendChild(modal);
  modal.querySelector("[data-close-history]")?.focus();
}

function startScenarioLogTutorial() {
  const scenarioLog = document.querySelector("[data-scenario-log-tutorial]");
  if (!scenarioLog) return;

  let hasStarted = false;
  const showTutorial = () => {
    if (hasStarted) return;
    hasStarted = true;
    scenarioLog.classList.add("is-log-tutorial-active");

    window.setTimeout(() => {
      scenarioLog.classList.add("is-log-tutorial-leaving");
    }, 5600);

    window.setTimeout(() => {
      scenarioLog.classList.remove("is-log-tutorial-active", "is-log-tutorial-leaving");
      scenarioLog.querySelector(".scenario-log-tutorial-note")?.remove();
    }, 6300);
  };

  if (!("IntersectionObserver" in window)) {
    showTutorial();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    window.setTimeout(showTutorial, 350);
  }, { threshold: 0.5 });

  observer.observe(scenarioLog);
}

function finish() {
  const grade = gradeForScore(score);
  const totalMaxScore = maxScore();
  const scoreProgress = scorePercent(score);
  const ringTone = scoreRingTone(scoreProgress);
  const riskyMoves = sceneResults.filter((result) => result.status === "risky").length;
  const logs = sceneResults.map((result) => {
    const status = resultStatus(result.status);
    return `
      <button class="log-card ${status.key}" type="button" data-scenario-history data-result-index="${result.index}" aria-haspopup="dialog" aria-label="View choices and history for scenario ${result.index}: ${escapeHtml(result.title)}">
        <span class="log-icon" aria-hidden="true">${result.icon}</span>
        <div>
          <p class="log-kicker">Scenario ${result.index}</p>
          <p class="log-title">${escapeHtml(result.title)}</p>
        </div>
        <span class="status-pill ${status.key}">${status.label}</span>
      </button>
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
        <div class="score-ring ${ringTone}" style="--score: ${scoreProgress}"><strong>${score}</strong><span>/ ${totalMaxScore}</span></div>
        <div class="score-summary">
          <div class="score-grade-row"><span class="score-label">Privacy grade</span><span class="grade-pill ${ringTone}">${grade.grade}</span></div>
          <p class="score-copy">${grade.copy}</p>
        </div>
      </section>
      <section class="result-advice" aria-labelledby="advice-title">
        <h3 class="result-section-title" id="advice-title">Advices</h3>
        <div class="advice-list">${advice}</div>
      </section>
      <section class="scenario-log" data-scenario-log-tutorial aria-labelledby="scenario-log-title">
        <h3 class="result-section-title" id="scenario-log-title">Scenario log</h3>
        <p class="scenario-log-tutorial-note">
          <span aria-hidden="true">↘</span>
          Click a scenario to review your choices and feedback.
        </p>
        <div class="log-list">${logs}</div>
      </section>
    </section>
    <footer class="complete-actions"><button class="exit-game-button" type="button" data-exit-game>Exit Game</button></footer>
  `;
  startScenarioLogTutorial();
  downloadResultLog(grade, totalMaxScore, scoreProgress);
}

function startGame() {
  if (!levels.length) return;
  prepareLevelsForGame();
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
  const historyTrigger = event.target.closest("[data-scenario-history]");
  if (historyTrigger) {
    openScenarioHistory(Number(historyTrigger.dataset.resultIndex));
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
  if (event.target.closest("[data-close-history]") || event.target.classList.contains("history-modal-backdrop")) {
    document.querySelector(".history-modal-backdrop")?.remove();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelector(".history-modal-backdrop")?.remove();
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
