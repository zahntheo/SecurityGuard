const levels = [
  {
    title: "Write or Polish an Email to Your Supervisor",
    scene: "Scene 04 / CV review · live task chat",
    user: "I need to write an email to my supervisor about a project delay. Can you help me make it clear and professional?",
    prompt: "Absolutely. I can help with tone and structure. What context do you want to provide?",
    context: 42,
    options: [
      {
        label: "Option A",
        text: "I need to explain that the dashboard task will be two days late because a data export is blocked. I want the email to be calm, accountable and propose a new deadline for Friday.",
        score: 10
      },
      {
        label: "Option B",
        text: "Here is the full email thread with my supervisor and teammate. Rewrite my reply.",
        document: "eml",
        score: 2
      },
      {
        label: "Option C",
        text: "I removed names from the thread and uploaded only the latest messages.",
        document: "part",
        score: 8
      }
    ]
  },
  {
    title: "Summarize a Medical Appointment",
    scene: "Scene 05 / health notes · live task chat",
    user: "I want to summarize my appointment notes so I remember what to ask next time.",
    prompt: "I can help. Which version gives enough context without exposing unnecessary medical identifiers?",
    context: 51,
    options: [
      { label: "Option A", text: "Here are my symptoms, the general advice, and the questions I want to ask at the next appointment.", score: 10 },
      { label: "Option B", text: "Here is the full scan with my patient number, birth date and insurance details.", document: "part", score: 0 },
      { label: "Option C", text: "I pasted my doctor's full name and the clinic address so the AI knows where I went.", score: 2 }
    ]
  },
  {
    title: "Compare a Phone Contract",
    scene: "Scene 06 / contract review · live task chat",
    user: "Can you check whether this phone plan is a good deal before I renew it?",
    prompt: "Yes. I only need costs, contract length, included data and renewal terms. How would you like to share it?",
    context: 58,
    options: [
      { label: "Option A", text: "The plan is 24.99 EUR/month for 24 months, includes 30GB 5G data, EU roaming, and a 39 EUR activation fee. Renewal price after month 24 is 34.99 EUR.", score: 10 },
      { label: "Option B", text: "Here is the full contract PDF. Can you check every page?", document: "eml", score: 2 },
      { label: "Option C", text: "I redacted my address and IBAN and attached only the contract pages about fees and term.", document: "part", score: 8 }
    ]
  },
  {
    title: "Plan a Team Feedback Message",
    scene: "Scene 07 / workplace chat · live task chat",
    user: "I need to give feedback to a teammate but I do not want the message to sound harsh.",
    prompt: "Sure. Share the situation and your goal, but keep private coworker details out of it.",
    context: 64,
    options: [
      { label: "Option A", text: "A teammate missed two handoff notes this week. I want to ask for clearer updates and offer to align on a checklist.", score: 10 },
      { label: "Option B", text: "I copied our private Slack thread with names and performance comments.", document: "part", score: 0 },
      { label: "Option C", text: "I anonymized the teammate and included only the behavior, impact and requested change.", score: 10 }
    ]
  },
  {
    title: "Review a Job Application",
    scene: "Scene 08 / CV review · live task chat",
    user: "Can you help me improve my application for a student assistant role?",
    prompt: "Yes. Which material should you share to get useful feedback while protecting your identity?",
    context: 71,
    options: [
      { label: "Option A", text: "A version of my CV with contact details removed and only the relevant experience sections.", document: "part", score: 10 },
      { label: "Option B", text: "My full CV, home address, phone number, references and student ID.", document: "eml", score: 0 },
      { label: "Option C", text: "A short summary of the role, my strongest skills, and the paragraph I want polished.", score: 10 }
    ]
  }
];

const attentionEl = document.getElementById("attention");
const startGameEl = document.getElementById("start-game");
const gameStageEl = document.getElementById("game-stage");
const exposedCountEl = document.getElementById("exposed-count");
const optionsEl = document.getElementById("options");
const screenTitleEl = document.getElementById("screen-title");
const sceneSubtitleEl = document.getElementById("scene-subtitle");
const progressFillEl = document.getElementById("progress-fill");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const userPromptEl = document.getElementById("user-prompt");
const aiBubbleText = document.querySelector(".ai-bubble p");
const contextPillEl = document.querySelector(".pill.context");

let levelIndex = 0;
let score = 0;
let seconds = 222;
let timerId = null;
let exposed = 0;

function documentPreview(kind) {
  if (!kind) return "";
  const tagClass = kind === "part" ? "doc-tag warn" : "doc-tag";
  const tagText = kind === "part" ? "PART" : "EML";
  return `
    <div class="document-preview" aria-hidden="true">
      <span class="${tagClass}">${tagText}</span>
      <span class="doc-line dark"></span>
      <span class="doc-line"></span>
      <span class="doc-line short"></span>
      <span class="doc-line"></span>
      <span class="doc-line short"></span>
    </div>
  `;
}

function formatTime(value) {
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const secs = (value % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function render() {
  const level = levels[levelIndex];
  screenTitleEl.textContent = level.title;
  sceneSubtitleEl.textContent = level.scene;
  userPromptEl.textContent = level.user;
  aiBubbleText.textContent = level.prompt;
  contextPillEl.textContent = `Context: ${level.context}% used`;
  progressFillEl.style.width = `${((levelIndex + 1) / levels.length) * 100}%`;
  scoreEl.textContent = score;
  optionsEl.innerHTML = level.options.map((option, index) => `
    <button class="option-card" type="button" data-index="${index}">
      <span class="option-label">${option.label}</span>
      ${documentPreview(option.document)}
      <p>${option.text}</p>
    </button>
  `).join("");
  resetTimer();
}

function resetTimer() {
  clearInterval(timerId);
  seconds = 222;
  timerEl.textContent = formatTime(seconds);
  timerId = setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    timerEl.textContent = formatTime(seconds);
    if (seconds === 0) clearInterval(timerId);
  }, 1000);
}

function choose(index) {
  const level = levels[levelIndex];
  const option = level.options[index];
  const cards = [...document.querySelectorAll(".option-card")];
  cards.forEach((card, cardIndex) => {
    card.disabled = true;
    if (level.options[cardIndex].score >= 8) card.classList.add("correct");
  });
  cards[index].classList.add(option.score >= 8 ? "correct" : "wrong");
  score += option.score;
  scoreEl.textContent = score;

  setTimeout(() => {
    if (levelIndex < levels.length - 1) {
      levelIndex += 1;
      render();
      return;
    }
    finish();
  }, 850);
}

function finish() {
  clearInterval(timerId);
  screenTitleEl.textContent = "Privacy Instinct Complete";
  sceneSubtitleEl.textContent = "Final score · AI sharing decisions";
  progressFillEl.style.width = "100%";
  aiBubbleText.textContent = score >= 42
    ? "Strong result. You gave useful context while keeping private details out of the prompt."
    : "Good try. Review which details are necessary before sharing documents or conversations with AI.";
  optionsEl.innerHTML = `
    <button class="option-card correct" type="button" data-restart>
      <span class="option-label">Result</span>
      <p>Your final score is ${score}/50. Click to play again.</p>
    </button>
  `;
}

function startGame() {
  attentionEl.hidden = true;
  gameStageEl.hidden = false;
  levelIndex = 0;
  score = 40;
  render();
}

function tickExposure() {
  exposed += Math.floor(17 + Math.random() * 43);
  exposedCountEl.textContent = exposed.toLocaleString("en-US");
}

startGameEl.addEventListener("click", startGame);

optionsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-restart")) {
    levelIndex = 0;
    score = 40;
    render();
    return;
  }
  choose(Number(button.dataset.index));
});

tickExposure();
setInterval(tickExposure, 1200);
