# PrivacyGuard

PrivacyGuard is a static browser game for the USEC Project SS26. It teaches safer AI prompting by asking players how they would share sensitive real-world information with an LLM, then gives immediate feedback on the privacy risk of each choice.

The current implementation is based on the Figma `ss2026` prototype and is designed as a full-screen, responsive chat-like experience that can run without a build step.
Tets

## What The Game Teaches

Players move through five privacy scenarios:

1. Phone contract review
2. Rental application review
3. Loan offer review
4. CV optimization
5. Workplace email drafting

Each scenario presents an AI chat prompt and three suggested replies:

- Safe: share only the task-relevant facts.
- Caution: redact direct identifiers, but still share a document or sensitive context.
- Risky: upload a full document, package, or thread.

After the player sends a reply, the game shows a scored result, short feedback, and a deeper `View More` privacy lesson.

## Features

- Full-screen responsive game layout
- Two-step attention screen before the game starts
- LLM-style chat presentation
- Suggested reply selection and send flow
- Per-option feedback with detailed privacy lessons
- Configurable scenario timer and scoring
- Configurable idle warning and automatic reset
- In-game cancel confirmation
- Score tracking across all scenarios
- Final result screen with scenario summary
- Static deployment with no build step

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Main HTML shell and script/style loading order |
| `game-config.js` / `game-config.json` | Runtime settings for timers, idle behavior, and scoring |
| `scenarios.js` / `scenarios.json` | Scenario content, options, feedback, and lessons |
| `script-feedback.js` | Core game state, scoring, feedback, lessons, and result rendering |
| `llm-chat.js` | Chat-style reply picker behavior and send flow |
| `app-utils.js` | Shared DOM, dialog, config, and navigation helpers used by feature modules |
| `attention-flow.js` | Two-step intro screen navigation |
| `game-cancel.js` | In-game cancel confirmation behavior |
| `idle-warning.js` | Idle warning and automatic reset behavior |
| `styles.css` | Core game layout, intro screen, option cards, and result screen styling |
| `fullscreen.css` | Full-screen scaling and large-display layout support |
| `feedback.css` | Feedback cards, lesson overlay, and result states |
| `feedback-layout-fix.css` | Layout fixes for feedback positioning under selected options |
| `llm-chat.css` | LLM chat cues, composer, typing indicator, and reply selection states |
| `attention-flow.css` | Second attention screen layout |
| `game-cancel.css` | Cancel button and confirmation dialog styling |
| `idle-warning.css` | Idle warning dialog styling |
| `result.css` | Final result screen refinements |

## Configuration

Timing and scoring live in `game-config.json` and are mirrored in `game-config.js` as the static fallback:

- `scenarioSeconds`: countdown per scenario
- `idleWarningSeconds`: inactivity time before the warning dialog appears
- `idleResetSeconds`: inactivity time before the app returns to the start screen
- `optionPoints`: score values for safe, caution, and risky choices

Scenario text, answer options, scoring feedback, and lesson details live in `scenarios.json` and are mirrored in `scenarios.js` as the static fallback.

## Code Organization

The project intentionally stays framework-free. Keep reusable behavior in small feature modules instead of adding one large script:

- Put shared DOM helpers, reusable dialogs, and app-level navigation in `app-utils.js`.
- Keep game state and scenario rendering in `script-feedback.js`.
- Keep independent UI features in their own files, such as `attention-flow.js`, `game-cancel.js`, and `idle-warning.js`.
- Keep text and game data in JSON whenever possible so content can change without touching rendering logic.

## Run Locally

Because this is a static project, no dependencies are required.

Open `index.html` directly in a browser, or serve the folder with a local static server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy To GitHub Pages

1. Push the project to the default branch of `zahntheo/SecurityGuard`.
2. Open the repository on GitHub.
3. Go to `Settings -> Pages`.
4. Select `Deploy from a branch`.
5. Choose the default branch and `/root`.
6. Save the settings and wait for the Pages deployment to finish.

## Roadmap And Milestones

Use these milestones to keep the remaining work focused.

### Milestone 1: UI Stability

Goal: make the game feel polished on normal laptop screens, mobile screens, and the required 2160 x 3840 display size.

Recommended issues:

- Feedback alignment under selected options
- Final score screen alignment
- Wrong option highlighting after answer
- Remove unnecessary header or decorative UI elements

Definition of done:

- No overlapping feedback, options, score, or header elements
- Game uses the available browser viewport instead of looking like a small embedded window
- Layout remains usable at 2160 x 3840 and common desktop/mobile sizes

### Milestone 2: Scenario And Feedback Quality

Goal: make all scenario, option, and feedback copy clear, realistic, and consistent with the PrivacyGuard learning goal.

Recommended issues:

- Clarify scenario wording
- Clarify option wording
- Improve feedback wording and consequences

Definition of done:

- Every scenario has a clear user need and an AI response
- Every option maps cleanly to safe, caution, or risky behavior
- Feedback explains why the choice matters and what the user should do instead

### Milestone 3: Presentation Ready

Goal: prepare the project for demo, submission, and review.

Recommended issues:

- Confirm all open UI cleanup issues are resolved or intentionally deferred
- Verify the game flow from intro to final result
- Confirm README, issue tracker, and deployment instructions are accurate

Definition of done:

- A reviewer can understand, run, and test the project from the README alone
- The issue tracker clearly shows remaining work and priorities
- The deployed version matches the current intended design

## Issue Writing Standard

A good issue in this repository should include:

- Problem: what is wrong or unclear
- Expected behavior: what should happen instead
- Steps to reproduce or scope: where to look
- Acceptance criteria: what must be true before closing
- Relevant files or screens when known

## Design Source

Primary design reference: Figma `ss2026` prototype.

Relevant implemented design areas:

- Full-screen game layout
- LLM-style chat flow
- Per-option feedback and `View More` lesson pattern
- Scenario-based privacy education
