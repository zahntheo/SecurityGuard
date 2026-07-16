# PrivacyGuard

PrivacyGuard is a static browser game for the USEC Project SS26. It teaches players how to give an AI enough useful context for a good answer without exposing unnecessary personal, financial, or professional information.

The project is a working interactive prototype based on the Figma `ss2026` design. It is framework-free, responsive, and runs without a build step.

## Current Status

The complete five-level game flow is implemented:

- An animated two-screen introduction explains the privacy challenge and the rules.
- Every scenario opens as an animated AI conversation.
- The player chooses between three randomized text, file, or editable-document replies.
- The safest answer earns 20 points; partially safe and risky answers earn fewer points.
- Submitted text is shown in full, while submitted files use a compact file preview.
- Feedback identifies the specific information that was exposed and gives a separate learning point for each type of sensitive data.
- Editable documents are graded from the fields that remain visible after redaction.
- The final screen shows the total score, privacy grade, advice, and a reviewable history for all five scenarios.
- A JSON result log is downloaded when the game is completed.
- Idle warnings, automatic reset, game cancellation, and reduced-motion support are included.

## How the Game Works

1. Read the conversation and understand what the AI needs.
2. Choose a response that provides enough task-relevant information.
3. Keep private and sensitive information out of the response.
4. Edit or redact a document before sharing it when necessary.
5. Send the answer and review the privacy feedback.
6. Complete all five levels and review the final score.

### Scoring

| Answer status | Points |
| --- | ---: |
| Safe | 20 |
| Caution | 10 |
| Risky | 0 |

With five levels, the maximum score is 100 points.

## Scenarios

| Level | Scenario | Examples of sensitive information |
| --- | --- | --- |
| 1 | Phone contract review | Name, address, customer number, phone number, email, IBAN, signature |
| 2 | Rental application review | Name, address, date of birth, contact details, ID number, bank account |
| 3 | Loan offer review | Name, address, customer ID, IBAN, credit score, account balance |
| 4 | CV optimization | Name, address, email, phone number, date of birth, LinkedIn URL |
| 5 | Workplace email drafting | Employee names, email addresses, internal project details, confidential business information |

The answer cards are shuffled each time a game starts, so a safe answer is not always in the same position. Some text answers also contain sensitive information and must be evaluated as carefully as file uploads.

## Animated Chat Flow

Each scenario begins with no visible conversation:

1. The user's initial message appears.
2. The AI displays a typing indicator.
3. The AI response appears.
4. The answer options and composer are revealed.

After the player sends a response, the submitted user message appears with the user avatar. The AI then displays the typing indicator before the feedback is shown.

## Interactive Document Redaction

Every scenario includes an editable document option:

- Click a field to redact or restore it.
- A one-time tutorial appears the first time the player opens any redaction editor.
- The tutorial demonstrates redaction on one field and then restores it.
- The editor keeps useful task information visible while allowing identifiers and sensitive fields to be removed.
- Selecting **Save** submits the reviewed document.
- Feedback is generated from the sensitive fields that are still visible.

## Feedback

Feedback is displayed directly in the conversation and uses the same visual scale as the chat text.

- Safe choices explain that only task-relevant information was shared.
- Caution and risky choices name the specific visible data, such as an IBAN, personal email address, ID number, or customer number.
- Each exposed data type receives its own learning sentence and a possible consequence.
- The final scenario log can be opened to review the conversation, selected answer, and feedback again.

## Project Structure

| File | Purpose |
| --- | --- |
| `index.html` | Main HTML shell and script/style loading order |
| `scenarios.json` | Primary scenario content, options, feedback, and lessons |
| `scenarios.js` | Static fallback scenario data used when JSON cannot be fetched |
| `game-config.json` | Primary idle and scoring configuration |
| `game-config.js` | Static fallback configuration |
| `script-feedback.js` | Game state, scoring, feedback, final results, and scenario history |
| `llm-chat.js` | Scenario entrance animation, answer selection, composer, and send flow |
| `contract-redaction.js` | Editable document profiles, tutorial, field grading, and submission |
| `attention-cloud.js` | Animated data-cloud attention catcher |
| `attention-flow.js` | Introduction navigation and staged explanation |
| `app-utils.js` | Shared DOM, dialog, configuration, and navigation helpers |
| `game-cancel.js` | In-game cancel confirmation |
| `idle-warning.js` | Idle warning and automatic reset |
| `styles.css` | Core layout and component styling |
| `fullscreen.css` | Full-screen and large-display layout support |
| `feedback.css` | Feedback, lesson, and result states |
| `feedback-layout-fix.css` | Feedback positioning refinements |
| `llm-chat.css` | Chat, composer, typing, and option states |
| `contract-redaction.css` | Document editor and tutorial styling |
| `attention-flow.css` | Introduction layout and animation styling |
| `game-cancel.css` | Cancel button and dialog styling |
| `idle-warning.css` | Idle warning dialog styling |
| `result.css` | Final result screen styling |

## Configuration

The primary runtime settings are in `game-config.json`:

- `idleWarningSeconds`: inactivity time before the warning dialog appears.
- `idleResetSeconds`: inactivity time before the game returns to the start screen.
- `optionPoints`: point values for safe, caution, and risky choices.

Scenario text, answer options, file metadata, feedback, and learning points are stored in `scenarios.json`.

The `.js` versions provide fallback data for browsers that cannot fetch local JSON files. When scenario or configuration content changes, update both versions so direct-file and server-based runs behave consistently.

## Run Locally

No dependencies are required. Running a local server is recommended so the browser loads the primary JSON files:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

You can also open `index.html` directly. In that mode, most browsers block local `fetch()` requests, so the game uses `scenarios.js` and `game-config.js` instead. If a fallback file is behind its JSON source, the text or settings may differ.

## Deploy to GitHub Pages

1. Push the project to the default branch of `zahntheo/SecurityGuard`.
2. Open the repository on GitHub.
3. Go to `Settings -> Pages`.
4. Select `Deploy from a branch`.
5. Choose the default branch and `/root`.
6. Save and wait for the Pages deployment to finish.

## Known Maintenance Work

- Keep the JSON data and JavaScript fallback files synchronized.
- Add automated tests for scoring, option selection, and redaction grading.
- Continue visual testing on mobile, common laptop sizes, and the required 2160 × 3840 presentation display.

## Design Source

Primary design reference: Figma `ss2026` prototype.
