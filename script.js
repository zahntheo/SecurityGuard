const levels = [
  {
    prompt: "Yes. I only need the costs, contract length and included data or minutes. How would you like to share it?",
    options: [
      {
        label: "Option A",
        text: "The plan is €24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a €39 activation fee. Renewal price after month 24 is €34.99.",
        score: 1
      },
      {
        label: "Option B",
        text: "Here is the full contract PDF. Can you check every page?",
        document: "safe",
        score: 0
      },
      {
        label: "Option C",
        text: "I redacted my address and IBAN and attached the contract pages about fees and term.",
        document: "warn",
        score: 2
      }
    ]
  },
  {
    prompt: "Great. Before sharing a document, remove direct identifiers and only keep the contract terms I need.",
    options: [
      { label: "Option A", text: "Upload the entire PDF, including signature and billing address.", document: "warn", score: 0 },
      { label: "Option B", text: "Share only price, duration, included data, roaming terms, and renewal price.", score: 2 },
      { label: "Option C", text: "Paste the customer number so the AI can look up the contract.", score: 0 }
    ]
  },
  {
    prompt: "Now check for hidden costs. Which detail should be verified before comparing offers?",
    options: [
      { label: "Option A", text: "Activation fee, renewal price, speed limits, roaming limits, and cancellation deadline.", score: 2 },
      { label: "Option B", text: "Only the advertised monthly price.", score: 0 },
      { label: "Option C", text: "The provider logo and color of the tariff flyer.", document: "safe", score: 0 }
    ]
  },
  {
    prompt: "A better offer appears online. What is the safest next action?",
    options: [
      { label: "Option A", text: "Click the ad immediately and enter payment details.", score: 0 },
      { label: "Option B", text: "Compare the legal price sheet and provider imprint before switching.", document: "safe", score: 2 },
      { label: "Option C", text: "Send the full contract to a public forum for advice.", score: 0 }
    ]
  },
  {
    prompt: "Final check: what should be stored after the decision?",
    options: [
      { label: "Option A", text: "A short summary of decision criteria and no unnecessary personal data.", score: 2 },
      { label: "Option B", text: "The unredacted PDF forever, just in case.", document: "warn", score: 0 },
      { label: "Option C", text: "Screenshots of all account pages and payment details.", score: 0 }
    ]
  }
];

const optionsEl = document.getElementById("options");
const levelPillEl = document.getElementById("level-pill");
const progressFillEl = document.getElementById("progress-fill");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const aiBubbleText = document.querySelector(".ai-bubble p");

let levelIndex = 0;
let score = 0;
let seconds = 22;
let timerId = null;

function documentPreview(kind) {
  if (!kind) return "";
  const tagClass = kind === "warn" ? "doc-tag warn" : "doc-tag";
  const tagText = kind === "warn" ? "WAIT" : "SAFE";
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

function render() {
  const level = levels[levelIndex];
  levelPillEl.textContent = `Level ${levelIndex + 1} / ${levels.length}`;
  progressFillEl.style.width = `${((levelIndex + 1) / levels.length) * 100}%`;
  scoreEl.textContent = score;
  aiBubbleText.textContent = level.prompt;
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
    if (level.options[cardIndex].score === 2) card.classList.add("correct");
  });
  cards[index].classList.add(option.score === 2 ? "correct" : "wrong");
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
  levelPillEl.textContent = "Complete";
  progressFillEl.style.width = "100%";
  aiBubbleText.textContent = score >= 8
    ? "Nice work. You shared only the relevant contract facts and protected sensitive data."
    : "Good try. Review which details are necessary before sharing contract documents.";
  optionsEl.innerHTML = `
    <button class="option-card correct" type="button" data-restart>
      <span class="option-label">Result</span>
      <p>Your final score is ${score}/10. Click to try the PrivacyGuard challenge again.</p>
    </button>
  `;
}

optionsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-restart")) {
    levelIndex = 0;
    score = 0;
    render();
    return;
  }
  choose(Number(button.dataset.index));
});

render();
