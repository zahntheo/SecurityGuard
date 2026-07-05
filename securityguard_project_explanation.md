# SecurityGuard / PrivacyGuard Project Explanation

Repository: `zahntheo/SecurityGuard`  
Current app name in the code: `PrivacyGuard`

## 1. Project Overview

`SecurityGuard` contains a static browser game called **PrivacyGuard**. The game teaches users how to share information safely with AI systems. It presents everyday privacy scenarios, asks the player to choose one of three possible replies, then gives feedback about whether that choice was safe, risky, or somewhere in between.

The project is intentionally framework-free. It uses:

- HTML for the page structure
- CSS for responsive full-screen layout and feature styling
- JavaScript for game state, scenario rendering, scoring, feedback, modals, timers, and interaction flow
- JSON for editable scenario and configuration data

Because there is no build step, the app can be opened directly through `index.html` or served with a basic static server.

## 2. High-Level File Structure

```text
SecurityGuard/
├── index.html
├── README.md
├── .gitignore
├── game-config.json
├── game-config.js
├── scenarios.json
├── scenarios.js
├── script-feedback.js
├── llm-chat.js
├── app-utils.js
├── attention-flow.js
├── game-cancel.js
├── idle-warning.js
├── styles.css
├── fullscreen.css
├── feedback.css
├── feedback-layout-fix.css
├── llm-chat.css
├── attention-flow.css
├── game-cancel.css
├── idle-warning.css
└── result.css
```

The project is organized around small feature files. The main game logic lives in `script-feedback.js`, while independent behavior such as the intro flow, chat composer, cancel dialog, and idle warning each has its own JavaScript and CSS file.

## 3. File-by-File Explanation

### `index.html`

This is the main entry point of the app. It defines:

- the first attention screen
- the second guide screen
- the game stage
- the chat-style scenario area
- the answer option container
- the score bar
- stylesheet loading order
- script loading order

Important structure:

```html
<section class="attention" id="attention">...</section>
<main class="stage" id="game-stage" hidden>...</main>
<div class="options" id="options"></div>
```

The `attention` section is shown first. The `game-stage` is hidden until the player starts. The `options` container is filled dynamically by JavaScript.

The script order matters. `game-config.js` and `scenarios.js` load first as fallback data. `script-feedback.js` then creates the core game behavior. The later feature scripts extend that behavior.

### `README.md`

The README explains the purpose of the game, the main privacy scenarios, local running instructions, GitHub Pages deployment, and milestone ideas. It is already a useful orientation document for new contributors.

### `.gitignore`

Currently ignores macOS `.DS_Store` files.

### `game-config.json`

This is the preferred editable configuration file. It controls:

- seconds per scenario
- idle warning timing
- idle reset timing
- points for each answer type

Example structure:

```json
{
  "scenarioSeconds": 22,
  "optionPoints": {
    "safe": 20,
    "caution": 10,
    "risky": 0
  }
}
```

Use this file when changing gameplay timing or scoring.

### `game-config.js`

This is the JavaScript fallback version of the config. It assigns the same kind of settings to `window.PRIVACYGUARD_GAME_CONFIG`.

This fallback is useful when the browser cannot load `game-config.json`, for example when the project is opened directly from the filesystem and `fetch()` is restricted.

### `scenarios.json`

This is the preferred editable content file. It contains:

- assistant title
- model label
- all game levels
- user prompt for each scenario
- AI prompt for each scenario
- three possible replies
- score and feedback data
- detailed privacy lesson content

Each level follows this pattern:

```json
{
  "title": "Verify Your Phone Contract",
  "shortTitle": "Verify phone contract",
  "user": "...",
  "prompt": "...",
  "options": [...]
}
```

Each option includes the displayed reply text, optional document type, score, and feedback. The feedback object drives both the small result card and the detailed lesson modal.

### `scenarios.js`

This is the JavaScript fallback version of the scenario data. It assigns the scenario content to `window.PRIVACYGUARD_SCENARIOS`.

Like `game-config.js`, this exists so the app still has data if JSON loading fails.

### `script-feedback.js`

This is the core game engine. It manages:

- DOM references
- scenario loading
- config loading
- game state
- timer state
- score calculation
- answer rendering
- answer selection
- feedback rendering
- detailed lesson modal
- final result screen

Important state variables:

```js
let levelIndex = 0;
let score = 0;
let sceneResults = [];
let currentLesson = null;
```

These variables track the current scenario, total points, completed scenario results, and the currently selected lesson.

Important function groups:

- `loadGameData()` loads JSON data with fallback support.
- `render()` displays the current scenario and answer cards.
- `choose(index)` handles the selected answer.
- `renderFeedback(...)` shows the feedback panel after an answer.
- `renderLessonModal()` opens the deeper privacy lesson.
- `goNext()` moves to the next scenario or finishes the game.
- `finish()` replaces the game view with the final score screen.

The scoring logic prefers configured scores:

```js
const configuredScore = Number(gameSettings.optionPoints[getOptionStatus(option)]);
```

That means the score is based on the feedback status (`safe`, `caution`, `risky`) and the current config, rather than being hardcoded into each scenario.

The JSON loading logic is defensive:

```js
const response = await fetch(path, { cache: "no-store" });
return await response.json();
```

If that fails, the code returns the JavaScript fallback data.

### `llm-chat.js`

This file adds a more realistic chat interaction on top of the core answer-selection system.

Instead of immediately submitting an option when the player clicks it, this module:

- lets the player select a draft reply
- highlights the selected reply
- enables a send button
- hides the picker after sending
- shows a short AI typing indicator
- then calls the original game answer logic

Important concept:

```js
let pendingOptionIndex = null;
```

The selected option is stored temporarily until the player presses send.

This file also wraps existing global functions:

```js
window.render = function renderWithChatCues() { ... };
window.renderFeedback = function renderFeedbackWithTyping(...) { ... };
```

That approach lets the chat layer extend the base game without rewriting the whole core engine.

### `app-utils.js`

This file creates a shared utility object:

```js
window.PrivacyGuard = (() => { ... })();
```

It provides reusable helpers for:

- selecting elements
- showing and hiding elements
- creating DOM elements
- validating positive numbers
- checking whether the game is active
- returning to the start screen
- showing confirmation dialogs

The most important helper is `showConfirmationDialog(...)`, because both cancel-like flows can use the same accessible dialog pattern instead of duplicating modal logic.

### `attention-flow.js`

This controls the two-step intro:

1. first screen: dramatic privacy warning
2. second screen: short instructions before starting

It hides the first intro screen, shows the guide screen, and moves focus to the start button.

### `game-cancel.js`

This adds the in-game cancel button behavior.

When the player clicks cancel, it opens a confirmation dialog. If confirmed, the app reloads and returns to the start screen.

The file uses `PrivacyGuard.showConfirmationDialog(...)`, so the dialog behavior stays consistent with the shared utility approach.

### `idle-warning.js`

This handles inactivity during the game.

It listens for activity events such as pointer, keyboard, touch, and wheel input. If the player is inactive:

- a warning dialog appears after the configured warning time
- the game returns to the start screen after the configured reset time

Important timing idea:

```js
warningTimerId = window.setTimeout(showWarning, warningSeconds * 1000);
resetTimerId = window.setTimeout(returnToStartScreen, resetSeconds * 1000);
```

The warning timer and reset timer run together. Activity clears and reschedules them.

### `styles.css`

This is the base visual design file. It defines:

- CSS variables
- body background
- attention screen styling
- game shell layout
- header
- chat bubbles
- avatars
- option cards
- document preview cards
- score bar

Important design foundation:

```css
:root {
  --ink: #0e1726;
  --primary: #06c9a0;
  --secondary: #7b61ff;
}
```

The CSS variables make the color system reusable across all other CSS files.

### `fullscreen.css`

This overrides the base layout to make the app fill the entire viewport.

It changes the app shell from a centered card into a full-screen experience:

```css
.app-shell {
  width: 100%;
  height: 100dvh;
  border-radius: 0;
}
```

It also uses many `clamp(...)` values so spacing, font sizes, cards, and modals scale across small screens and very large displays.

### `feedback.css`

This styles:

- the selected reply area
- feedback cards
- safe/caution/risky colors
- the "view more" lesson modal
- lesson points
- remember rule box
- next scenario button

The feedback states are color-coded:

```css
.feedback-card.safe { ... }
.feedback-card.caution { ... }
.feedback-card.risky { ... }
```

This makes feedback visually immediate.

### `feedback-layout-fix.css`

This file contains targeted layout fixes for the state after an answer is selected.

It reduces option height, dims unselected options, and ensures the feedback panel sits correctly beneath the selected options.

It uses modern `:has(...)` selectors:

```css
.options:has(.option-card:disabled) { ... }
```

That lets the layout react when option cards become disabled after a choice.

### `llm-chat.css`

This styles the chat-composer layer added by `llm-chat.js`.

It includes:

- compact header adjustments
- timer pill styling
- model pill
- composer shell
- attachment button
- send button
- draft-selected and draft-muted option states
- AI typing dots animation

The selected draft state is handled through classes:

```css
.option-card.draft-selected { ... }
.option-card.draft-muted { ... }
```

### `attention-flow.css`

This styles the second intro guide screen.

It lays out the five guide items in a grid on desktop and switches to a single column on small screens.

### `game-cancel.css`

This styles:

- the cancel button in the header
- the cancel confirmation overlay
- the confirmation dialog
- yes/no buttons
- responsive behavior for narrow screens

### `idle-warning.css`

This styles the idle warning overlay and dialog.

It matches the cancel dialog style but uses warning-oriented copy and colors.

### `result.css`

This styles the final score screen.

It includes:

- final header
- score ring
- privacy grade pill
- scenario log cards
- advice cards
- exit button area

The score ring uses a conic gradient:

```css
background: conic-gradient(#10b981 calc(var(--score) * 1%), #c9f5e8 0);
```

The JavaScript sets `--score` to the final percentage, and CSS turns that value into a circular progress display.

## 4. Runtime Flow

The app flow is:

1. Browser loads `index.html`.
2. CSS files load the base layout and feature-specific styles.
3. Fallback config and fallback scenario data load from `.js` files.
4. `script-feedback.js` initializes game state and tries to fetch `game-config.json` and `scenarios.json`.
5. If JSON loading succeeds, JSON data replaces fallback data.
6. The intro attention screen is shown.
7. User clicks `Next`.
8. `attention-flow.js` shows the guide screen.
9. User clicks `Start Game`.
10. `script-feedback.js` renders the first scenario.
11. `llm-chat.js` lets the player pick a draft reply and press send.
12. `choose(index)` scores the answer.
13. Feedback appears with optional detailed lesson modal.
14. User continues through all scenarios.
15. `finish()` renders the final score and advice screen.

## 5. Data Model

The game is driven mostly by scenario data. Each scenario contains:

- `title`: full scenario name
- `shortTitle`: compact label for logs and attachments
- `icon`: symbolic icon type
- `user`: user message in the chat
- `prompt`: AI response asking how the user wants to share data
- `adviceTitle`: final advice headline
- `advice`: final advice body
- `options`: the three possible player replies

Each option contains:

- `label`: option label, such as `OPTION A`
- `text`: player reply text
- `document`: optional attachment type
- `score`: legacy per-option score
- `feedback`: detailed feedback object

The feedback object contains:

- `key`: `safe`, `caution`, or `risky`
- `label`: short feedback label
- `summary`: immediate feedback text
- `modalTitle`: detailed lesson heading
- `lessonLabel`: modal label
- `points`: list of lesson points
- `remember`: final rule to remember

## 6. Important Code Snippets and Meaning

### Fallback Data Pattern

```js
window.PRIVACYGUARD_GAME_CONFIG = { ... };
window.PRIVACYGUARD_SCENARIOS = { ... };
```

These globals give the app data even if JSON fetches fail. This is important for static hosting and local file usage.

### JSON-First Loading

```js
applyGameSettings(await loadJson("game-config.json", window.PRIVACYGUARD_GAME_CONFIG));
```

The app prefers JSON because JSON is easier to edit for content and settings. The JavaScript global is only the fallback.

### Rendering Options

```js
optionsEl.innerHTML = level.options.map((option, index) => `...`).join("");
```

The answer cards are generated from scenario data. This keeps the HTML fixed while allowing scenarios to change through JSON.

### Score From Feedback Status

```js
gameSettings.optionPoints[getOptionStatus(option)]
```

The score comes from the answer status. This is better than hardcoding points everywhere because changing `optionPoints` updates scoring across all scenarios.

### Selected Answer State

```js
card.disabled = true;
card.classList.add("selected", optionStatus);
```

After the player answers, all cards are disabled and the selected card gets state classes. CSS then shows whether it was safe, caution, or risky.

### Lesson Modal Rendering

```js
overlay.setAttribute("role", "dialog");
overlay.setAttribute("aria-modal", "true");
```

The modal is created dynamically and includes accessibility attributes so screen readers understand it as a dialog.

### Chat Composer Extension

```js
window.render = function renderWithChatCues() { ... };
```

`llm-chat.js` wraps the existing `render()` function to add chat-specific UI after each scenario render. This is a lightweight extension pattern.

### Shared Utility Namespace

```js
window.PrivacyGuard = (() => { ... })();
```

This keeps helper functions under one global namespace instead of creating many unrelated global functions.

### Idle Reset

```js
document.addEventListener(eventName, handleActivity, { capture: true, passive: true });
```

The app watches common interaction events and resets idle timers whenever the player is active.

### Full-Screen Layout

```css
.stage {
  height: 100dvh;
}
```

The app uses the dynamic viewport height unit, which behaves better on modern mobile browsers than older `100vh` layouts.

## 7. Main Responsibilities by Layer

### Content Layer

Files:

- `scenarios.json`
- `scenarios.js`
- `game-config.json`
- `game-config.js`

Responsibility: store editable game content and settings.

### Core Logic Layer

Files:

- `script-feedback.js`

Responsibility: run the game, render scenarios, score answers, show feedback, and finish the session.

### Feature Logic Layer

Files:

- `llm-chat.js`
- `app-utils.js`
- `attention-flow.js`
- `game-cancel.js`
- `idle-warning.js`

Responsibility: add focused behavior around the core game.

### Presentation Layer

Files:

- `styles.css`
- `fullscreen.css`
- `feedback.css`
- `feedback-layout-fix.css`
- `llm-chat.css`
- `attention-flow.css`
- `game-cancel.css`
- `idle-warning.css`
- `result.css`

Responsibility: control layout, visual states, responsiveness, dialogs, final results, and feature-specific styling.

## 8. How to Change Common Things

### Add or edit a scenario

Edit `scenarios.json` first. Keep the same structure:

- scenario metadata
- user prompt
- AI prompt
- three options
- feedback for each option

Then mirror the same change in `scenarios.js` if you want the fallback data to stay current.

### Change timer length

Edit `scenarioSeconds` in `game-config.json`.

Also update `game-config.js` if the fallback should match.

### Change scoring

Edit:

```json
"optionPoints": {
  "safe": 20,
  "caution": 10,
  "risky": 0
}
```

Because the game reads scores from `gameSettings.optionPoints`, all scenarios will follow the new scoring rules.

### Change final grade thresholds

Edit `gradeForScore(total)` in `script-feedback.js`.

Current grade logic is based on percentage:

- 90% or more: A
- 60% or more: B
- 40% or more: C
- below 40%: D

### Change intro behavior

Edit:

- `index.html` for intro content
- `attention-flow.js` for screen switching behavior
- `attention-flow.css` and `styles.css` for intro styling

### Change the final result screen

Edit:

- `finish()` in `script-feedback.js` for rendered content
- `result.css` for visual layout

## 9. Notable Design Choices

### No Framework

The code uses plain HTML, CSS, and JavaScript. This keeps deployment simple but means contributors must be careful with global variables and script loading order.

### JSON Content With JavaScript Fallbacks

The data exists twice: JSON for normal use, JavaScript globals for fallback. This improves static reliability, but contributors should remember to keep both versions synchronized.

### Feature-Based Files

Instead of one very large script and one very large stylesheet, the project separates independent features into their own files. This makes it easier to work on one feature without touching unrelated code.

### Dynamic Rendering

Most changing UI is generated by JavaScript from scenario data. This makes it easy to add new scenarios without duplicating HTML.

### Accessibility Awareness

Dialogs include `role="dialog"`, `aria-modal`, `aria-labelledby`, focus management, and Escape handling. The app also uses buttons rather than generic clickable elements for main actions.

## 10. Things to Watch Out For

1. `llm-chat.js` wraps global functions from `script-feedback.js`. If function names change in the core engine, the chat layer must be updated too.
2. JSON and JavaScript fallback files can drift apart. Content updates should be applied to both.
3. `feedback-layout-fix.css` uses `:has(...)`, which is modern CSS. It works in current major browsers but may not work in older browsers.
4. The app uses `window.location.reload()` to reset. This is simple and reliable, but it resets the whole page instead of resetting state internally.
5. There is no automated test suite in the current structure. Manual browser testing is important after changing flow, layout, or scoring.

## 11. Quick Contributor Summary

If you are new to the project:

- Start with `index.html` to understand the screen structure.
- Read `script-feedback.js` to understand the game engine.
- Edit `scenarios.json` for content changes.
- Edit `game-config.json` for timing and scoring.
- Use the matching `.js` fallback files when static fallback support must remain accurate.
- Use the feature-specific JS/CSS files for isolated UI behavior.
- Test the full flow from intro to final score after every meaningful change.
