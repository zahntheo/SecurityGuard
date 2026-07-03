const levels = [
  {
    title: "Verify Your Phone Contract",
    scene: "SCENE 01 / VERIFY YOUR PHONE CONTRACT",
    shortTitle: "Verify phone contract",
    icon: "📨",
    user: "Can you check whether this phone plan is a good deal before I renew it?",
    prompt: "Yes. I only need the costs, contract length and included data or minutes. How would you like to share it?",
    adviceTitle: "Never upload a full contract PDF.",
    advice: "It contains your bank account, address, ID number and signature - everything an attacker needs.",
    options: [
      { label: "OPTION A", text: "The plan is EUR 24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a EUR 39 activation fee. Renewal price after month 24 is EUR 34.99.", score: 20 },
      { label: "OPTION B", text: "Here's the full contract PDF. Can you check every page?", document: "pdf", score: 0 },
      { label: "OPTION C", text: "I redacted my address and IBAN and attached the contract pages about fees and term.", document: "part", score: 10 }
    ]
  },
  {
    title: "Evaluate your rental application",
    scene: "SCENE 02 / EVALUATE YOUR RENTAL APPLICATION",
    shortTitle: "Rental Application",
    icon: "🔗",
    user: "I want to apply for an apartment. Can you tell me if my application looks strong enough?",
    prompt: "I can help you assess the application. What details would you like to share?",
    adviceTitle: "Your rental application is a full identity package.",
    advice: "Income, employer, credit score, and address - all in one file. Never upload it directly to AI.",
    options: [
      { label: "OPTION A", text: "The rent is EUR 980 cold / EUR 1,180 warm. My net income is about EUR 3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise.", score: 20 },
      { label: "OPTION B", text: "Here's my full rental application package. Can you check if everything looks convincing?", document: "zip", score: 0 },
      { label: "OPTION C", text: "I removed my ID number and bank account from the application package before uploading it.", document: "part", score: 10 }
    ]
  },
  {
    title: "Review Your Loan Offer",
    scene: "SCENE 03 / FINANCE & BANKING",
    shortTitle: "Bank Loan",
    icon: "📄",
    user: "I got a personal loan offer. Can you help me understand whether the terms are reasonable?",
    prompt: "Sure. I can compare the key terms if you share the amount, APR, fees, term and monthly payment.",
    adviceTitle: "Loan documents reveal your financial fingerprint.",
    advice: "Credit tier, debt level, and income can all be inferred from a single offer. Summarize - never upload.",
    options: [
      { label: "OPTION A", text: "The loan amount is EUR 8,000 over 36 months, APR is 8.9%, monthly payment is EUR 254.10, origination fee is EUR 120, and early repayment is free after 12 months.", score: 20 },
      { label: "OPTION B", text: "Here's the full loan offer, bank statement and credit check. Please review the offer.", document: "pdf", score: 0 },
      { label: "OPTION C", text: "I hid my name, IBAN and signature on the loan offer before uploading it.", document: "part", score: 10 }
    ]
  },
  {
    title: "Optimize Your CV Content and Layout",
    scene: "SCENE 04 / CAREER & EDUCATION",
    shortTitle: "CV Optimization",
    icon: "📄",
    user: "I'm applying to a tech company. Can you help me improve the content and layout of my CV?",
    prompt: "Of course. I can help with structure, wording and prioritization. How would you like to share your CV details?",
    adviceTitle: "A CV is the most complete profile you can hand over.",
    advice: "Name, phone, location, employer, and life history are all on one page. Describe it, do not upload it.",
    options: [
      { label: "OPTION A", text: "I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role.", score: 20 },
      { label: "OPTION B", text: "Here's the full PDF. Can you optimize the content and layout?", document: "pdf", score: 0 },
      { label: "OPTION C", text: "Here's the experience section with personal details hidden. Can you improve the layout and wording?", document: "part", score: 10 }
    ]
  },
  {
    title: "Draft a Work Email",
    scene: "SCENE 05 / WORKPLACE CONTEXT",
    shortTitle: "Work Email",
    icon: "📨",
    user: "Can you help me write a clearer response to a coworker about this project decision?",
    prompt: "Yes. Share the goal, audience and tone. Avoid names or internal details unless they are necessary.",
    adviceTitle: "Work emails contain context AI should not have.",
    advice: "Project names, internal decisions, and real people's roles can leak professional data. Ask for templates instead.",
    options: [
      { label: "OPTION A", text: "Please draft a polite update that says we need one more review round before committing to the timeline. Keep it concise and collaborative.", score: 20 },
      { label: "OPTION B", text: "Here is the full email thread with names, internal project details and the decision history. Can you rewrite my reply?", document: "mail", score: 0 },
      { label: "OPTION C", text: "I removed names and project codes from the thread before sharing the parts about tone and next steps.", document: "part", score: 10 }
    ]
  }
];

const attentionEl = document.getElementById("attention");
const startGameEl = document.getElementById("start-game");
const gameStageEl = document.getElementById("game-stage");
const appShellEl = document.querySelector(".app-shell");
const exposedCountEl = document.getElementById("exposed-count");
const optionsEl = document.getElementById("options");
const screenTitleEl = document.getElementById("screen-title");
const sceneSubtitleEl = document.getElementById("scene-subtitle");
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

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
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

function feedbackFor(level, option, optionIndex) {
  const optionLetter = String.fromCharCode(65 + optionIndex);
  if (option.score === 20) {
    return {
      key: "safe",
      label: "✓ SAFE",
      summary: "Nice - you shared the details needed to solve the task without exposing unnecessary personal data.",
      modalTitle: `${level.shortTitle} can work from key terms.`,
      lessonLabel: `PRIVACY LESSON · OPTION ${optionLetter}`,
      points: [
        { type: "good", mark: "✓", title: "Decision fields only", text: "You provided the facts needed for useful AI help without uploading a full identity package." },
        { type: "good", mark: "✓", title: "No hidden metadata", text: "Typed summaries do not carry PDF metadata, signatures, account numbers or original file history." }
      ],
      remember: "Share the task facts, not the whole document."
    };
  }
  if (option.score === 10) {
    return {
      key: "caution",
      label: "! ALMOST",
      summary: `Better - direct identifiers are hidden. But ${level.shortTitle.toLowerCase()} files can still reveal metadata and sensitive context.`,
      modalTitle: `Redacted ${level.shortTitle.toLowerCase()} files can still expose context.`,
      lessonLabel: `PRIVACY LESSON · OPTION ${optionLetter}`,
      points: [
        { type: "good", mark: "✓", title: "Direct identifiers masked", text: "Removing names, account numbers and signatures is a useful first step." },
        { type: "risk", mark: "!", title: "Metadata remains", text: "Document IDs, timestamps, file names and hidden structure can still identify you or your situation." },
        { type: "risk", mark: "!", title: "Context is sensitive", text: "Financial, housing, career and workplace details can be personal even without a name." }
      ],
      remember: "If you can type the relevant details, do that instead of uploading a redacted file."
    };
  }
  return {
    key: "risky",
    label: "✕ NOT SAFE",
    summary: "The full package can leak account details, identity data, metadata and private context far beyond this request.",
    modalTitle: `Full ${level.shortTitle.toLowerCase()} packages reveal more than the AI needs.`,
    lessonLabel: `PRIVACY LESSON · OPTION ${optionLetter}`,
    points: [
      { type: "risk", mark: "!", title: "Account and identity data", text: "Full files often include names, IDs, addresses, signatures, account numbers or contact details." },
      { type: "risk", mark: "!", title: "Private context", text: "The AI may receive income, employer, credit, housing, workplace or transaction context that was not needed." },
      { type: "risk", mark: "!", title: "Metadata trail", text: "File metadata, document IDs and timestamps can reveal where the document came from and who handled it." }
    ],
    remember: level.adviceTitle
  };
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

function removeFeedback() {
  document.querySelector(".feedback-panel")?.remove();
  document.querySelector(".lesson-overlay")?.remove();
  currentLesson = null;
}

function render() {
  const level = levels[levelIndex];
  removeFeedback();
  screenTitleEl.textContent = level.title;
  sceneSubtitleEl.textContent = level.scene;
  levelBadgeEl.textContent = `Level ${levelIndex + 1} / ${levels.length}`;
  userPromptEl.textContent = level.user;
  aiPromptEl.textContent = level.prompt;
  scoreEl.textContent = score;
  progressFillEl.style.width = `${Math.round(((levelIndex + 1) / levels.length) * 70)}%`;
  optionsEl.innerHTML = level.options.map((option, index) => `
    <button class="option-card" type="button" data-index="${index}">
      <span class="option-label">${option.label}</span>
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
  const feedback = feedbackFor(level, option, index);
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
  sceneResults.push({ index: levelIndex + 1, title: level.shortTitle, icon: level.icon, score: option.score, adviceTitle: level.adviceTitle, advice: level.advice });
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
      <p class="feedback-label">${feedback.label}</p>
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
                <span class="point-dot ${point.type}">${point.mark}</span>
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

tickExposure();
setInterval(tickExposure, 1200);
