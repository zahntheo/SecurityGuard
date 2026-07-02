const levels = [
  {
    title: "Verify Your Phone Contract",
    scene: "SCENE 01 / VERIFY YOUR PHONE CONTRACT",
    total: 0,
    user: "Can you check whether this phone plan is a good deal before I renew it?",
    prompt: "Yes. I only need the costs, contract length and included data or minutes. How would you like to share it?",
    options: [
      {
        label: "OPTION A",
        text: "The plan is EUR 24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a EUR 39 activation fee. Renewal price after month 24 is EUR 34.99.",
        score: 20
      },
      {
        label: "OPTION B",
        text: "Here's the full contract PDF. Can you check every page?",
        document: "pdf",
        score: 0
      },
      {
        label: "OPTION C",
        text: "I redacted my address and IBAN and attached the contract pages about fees and term.",
        document: "part",
        score: 10
      }
    ]
  },
  {
    title: "Evaluate your rental application",
    scene: "SCENE 02 / EVALUATE YOUR RENTAL APPLICATION",
    total: 20,
    user: "I want to apply for an apartment. Can you tell me if my application looks strong enough?",
    prompt: "I can help you assess the application. What details would you like to share?",
    options: [
      {
        label: "OPTION A",
        text: "The rent is EUR 980 cold / EUR 1,180 warm. My net income is about EUR 3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise.",
        score: 20
      },
      {
        label: "OPTION B",
        text: "Here's my full rental application package. Can you check if everything looks convincing?",
        document: "zip",
        score: 0
      },
      {
        label: "OPTION C",
        text: "I removed my ID number and bank account from the application package before uploading it.",
        document: "part",
        score: 10
      }
    ]
  },
  {
    title: "Review Your Loan Offer",
    scene: "SCENE 03 / FINANCE & BANKING",
    total: 20,
    user: "I got a personal loan offer. Can you help me understand whether the terms are reasonable?",
    prompt: "Sure. I can compare the key terms if you share the amount, APR, fees, term and monthly payment.",
    options: [
      {
        label: "OPTION A",
        text: "The loan amount is EUR 8,000 over 36 months, APR is 8.9%, monthly payment is EUR 254.10, origination fee is EUR 120, and early repayment is free after 12 months.",
        score: 20
      },
      {
        label: "OPTION B",
        text: "Here's the full loan offer, bank statement and credit check. Please review the offer.",
        document: "pdf",
        score: 0
      },
      {
        label: "OPTION C",
        text: "I hid my name, IBAN and signature on the loan offer before uploading it.",
        document: "part",
        score: 10
      }
    ]
  },
  {
    title: "Optimize Your CV Content and Layout",
    scene: "SCENE 04 / CAREER & EDUCATION",
    total: 30,
    user: "I'm applying to a tech company. Can you help me improve the content and layout of my CV?",
    prompt: "Of course. I can help with structure, wording and prioritization. How would you like to share your CV details?",
    options: [
      {
        label: "OPTION A",
        text: "I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role.",
        score: 20
      },
      {
        label: "OPTION B",
        text: "Here's the full PDF. Can you optimize the content and layout?",
        document: "pdf",
        score: 0
      },
      {
        label: "OPTION C",
        text: "Here's the experience section with personal details hidden. Can you improve the layout and wording?",
        document: "part",
        score: 10
      }
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
const aiPromptEl = document.getElementById("ai-prompt");

let levelIndex = 0;
let score = 0;
let seconds = 22;
let timerId = null;
let exposed = 0;

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

function render() {
  const level = levels[levelIndex];
  screenTitleEl.textContent = level.title;
  sceneSubtitleEl.textContent = level.scene;
  userPromptEl.textContent = level.user;
  aiPromptEl.textContent = level.prompt;
  score = level.total;
  scoreEl.textContent = score;
  progressFillEl.style.width = `${Math.round(((levelIndex + 1) / levels.length) * 70)}%`;
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

  cards.forEach((card, cardIndex) => {
    card.disabled = true;
    if (level.options[cardIndex].score === 20) card.classList.add("correct");
    if (level.options[cardIndex].score === 10) card.classList.add("partial");
  });

  if (option.score === 0) cards[index].classList.add("wrong");
  score = level.total + option.score;
  scoreEl.textContent = score;

  setTimeout(() => {
    if (levelIndex < levels.length - 1) {
      levelIndex += 1;
      render();
      return;
    }
    finish();
  }, 900);
}

function finish() {
  clearInterval(timerId);
  screenTitleEl.textContent = "Safety score";
  sceneSubtitleEl.textContent = "FINAL / PRIVACY SHARING RESULT";
  userPromptEl.textContent = "I finished all four sharing decisions.";
  aiPromptEl.textContent = score >= 70
    ? "Strong result. You shared useful context while keeping unnecessary personal data out."
    : "Review the risky choices. Useful context is enough; full documents often expose more than the task needs.";
  progressFillEl.style.width = "100%";
  optionsEl.innerHTML = `
    <button class="option-card result-card correct" type="button" data-restart>
      <span class="option-label">RESULT</span>
      <p>Your final score is ${score}/80. Click to play again.</p>
    </button>
  `;
}

function startGame() {
  attentionEl.hidden = true;
  gameStageEl.hidden = false;
  levelIndex = 0;
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
    render();
    return;
  }
  choose(Number(button.dataset.index));
});

tickExposure();
setInterval(tickExposure, 1200);
