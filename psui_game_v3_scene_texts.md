# PrivacyGuard / PSUI Game v3 — corrected scene text pack

This text pack follows the corrected scene themes:

- Scene 01 · Verify Your Phone Contract
- Scene 02 · Evaluate your rental application
- Scene 03 · FINANCE & BANKING / Review Your Loan Offer
- Scene 04 · Optimize Your CV Content and Layout
- Scene 05 · Write or Polish an Email to Your Supervisor

Each scene uses the same Choose & Reveal structure: safe typed summary, unsafe full upload, and almost-safe redacted upload.

## Common UI text

| Key | Text |
|---|---|
| Brand | PrivacyGuard |
| Level | Level 2 / 5 |
| Choose label | Choose how to share |
| Score label | SCORE |
| Modal remember label | REMEMBER |
| View more button | view more › |
| Next button | next scenario → |
| Retry button | ↺ try another option |
| Close label | close |
| AI avatar | AI |
| User avatar | U |
| Safe badge | ✓ SAFE |
| Unsafe badge | ✕ NOT SAFE |
| Almost badge | ! ALMOST |
| Initial score | 800 |
| Safe score | 1000 |
| Unsafe score | −200 |
| Almost score | +150 |

## Scene 01 · Verify Your Phone Contract

### Header and setup

| Key | Text |
|---|---|
| Scene label | Scene 01 · VERIFY YOUR PHONE CONTRACT |
| Timer | ⏱ 22s |
| Progress | 20% |
| Headline | Verify Your Phone Contract |
| User eyebrow | YOU · 09:42 |
| User setup | Can you check whether this phone plan is a good deal before I renew it? |
| AI eyebrow | AI · 09:42 |
| AI setup | Yes. I only need the costs, contract length and included data or minutes. How would you like to share it? |

### Choices and reveal states

| Option | Card text | Chosen reply text | Attachment text |
|---|---|---|---|
| OPTION A | The plan is €24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a €39 activation fee. Renewal price after month 24 is €34.99. | The plan is €24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a €39 activation fee. Renewal price after month 24 is €34.99. | — |
| OPTION B | Upload full contract PDF | Here's the full contract PDF. Can you check every page? | 📎 mobile_contract_full.pdf · 7 pages |
| OPTION C | Share fee & term only from a redacted PDF | I redacted my address and IBAN and attached the contract pages about fees and term. | 📎 phone_contract_redacted.pdf · 2 pages |

### Feedback

| Option | Badge | Message | Score |
|---|---|---|---|
| OPTION A | ✓ SAFE | Perfect — you shared only price, duration and plan details. That's enough to compare the contract. | 1000 |
| OPTION B | ✕ NOT SAFE | The full PDF can leak your name, address, customer number, IBAN and signature. | −200 |
| OPTION C | ! ALMOST | Better — you removed obvious identifiers. But contract pages can still reveal customer IDs, barcodes and metadata. | +150 |

### View more modal text

#### OPTION A

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION A |
| Title | Contract decisions usually need only a few fields. |
| Point 1 | Price and duration — Monthly fee, contract length and renewal price are the key facts. |
| Point 2 | No customer identity — Name, address, IBAN and customer number never leave your device. |
| Rule | Extract the decision fields yourself. Do not send the whole contract. |

#### OPTION B

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION B |
| Title | A full contract contains long-lived identifiers. |
| Point 1 | Billing identity — Address, birth date and customer number can identify you precisely. |
| Point 2 | Payment details — IBAN or payment references can appear in contract documents. |
| Point 3 | Signature and barcodes — These can be reused or linked across service systems. |
| Rule | Full contracts are for providers and legal review — not for quick AI comparisons. |

#### OPTION C

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION C |
| Title | A redacted contract is safer, but still not ideal. |
| Point 1 | Obvious identifiers removed — Hiding address and IBAN lowers direct exposure. |
| Point 2 | Hidden identifiers remain — Customer numbers, QR codes and page metadata are easy to miss. |
| Point 3 | More pages mean more risk — Every extra page adds another chance to leak something. |
| Rule | If you can summarize fee, term and limits, skip the upload entirely. |

## Scene 02 · Evaluate your rental application

### Header and setup

| Key | Text |
|---|---|
| Scene label | Scene 02 · EVALUATE YOUR RENTAL APPLICATION |
| Timer | ⏱ 22s |
| Progress | 40% |
| Headline | Evaluate your rental application |
| User eyebrow | YOU · 09:42 |
| User setup | I want to apply for an apartment. Can you tell me if my application looks strong enough? |
| AI eyebrow | AI · 09:42 |
| AI setup | I can help you assess the application. What details would you like to share? |

### Choices and reveal states

| Option | Card text | Chosen reply text | Attachment text |
|---|---|---|---|
| OPTION A | The rent is €980 cold / €1,180 warm. My net income is about €3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise. | The rent is €980 cold / €1,180 warm. My net income is about €3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise. | — |
| OPTION B | Here's my full rental application package. Can you check if everything looks convincing? | Here's my full rental application package. Can you check if everything looks convincing? | 📎 rental_application_full.zip · 12 files |
| OPTION C | I removed my ID number and bank account from the application package before uploading it. | I removed my ID number and bank account from the application package before uploading it. | 📎 rental_application_redacted.pdf · 5 pages |

### Feedback

| Option | Badge | Message | Score |
|---|---|---|---|
| OPTION A | ✓ SAFE | Good — you shared the decision facts without exposing identity documents, salary slips or bank data. | 1000 |
| OPTION B | ✕ NOT SAFE | A full rental package can reveal your ID, address history, payslips, bank details, employer and references. | −200 |
| OPTION C | ! ALMOST | Better — some direct identifiers are hidden. But the package can still reveal employer, income, current address and reference details. | +150 |

### View more modal text

#### OPTION A

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION A |
| Title | A rental application can be evaluated from a summary. |
| Point 1 | Relevant facts only — Rent, income ratio, job status and move-in timing are enough for feedback. |
| Point 2 | No document upload — ID scans, payslips and bank statements stay private. |
| Rule | For housing advice, type the facts the AI needs. Keep official documents off the chat. |

#### OPTION B

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION B |
| Title | A full rental dossier exposes your life admin. |
| Point 1 | Identity documents — Passport or ID scans can be copied or misused. |
| Point 2 | Financial proof — Payslips and statements reveal salary, employer, taxes and spending patterns. |
| Point 3 | Third-party references — Landlord or employer letters include other people's contact details too. |
| Rule | Never upload an entire rental application package for general AI feedback. |

#### OPTION C

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION C |
| Title | Redaction helps, but housing files are dense with identifiers. |
| Point 1 | Some identifiers removed — Hiding ID and bank numbers reduces the most direct risk. |
| Point 2 | Context still identifies you — Employer, address, salary and dates can still point back to you. |
| Point 3 | Packages are hard to clean — One forgotten page or file name can undo the redaction. |
| Rule | Summarize the application strength instead of sharing the package. |

## Scene 03 · FINANCE & BANKING / Review Your Loan Offer

### Header and setup

| Key | Text |
|---|---|
| Scene label | Scene 03 · FINANCE & BANKING |
| Timer | ⏱ 22s |
| Progress | 60% |
| Headline | Review Your Loan Offer |
| User eyebrow | YOU · 09:42 |
| User setup | I got a personal loan offer. Can you help me understand whether the terms are reasonable? |
| AI eyebrow | AI · 09:42 |
| AI setup | Sure. I can compare the key terms if you share the amount, APR, fees, term and monthly payment. |

### Choices and reveal states

| Option | Card text | Chosen reply text | Attachment text |
|---|---|---|---|
| OPTION A | The loan amount is €8,000 over 36 months, APR is 8.9%, monthly payment is €254.10, origination fee is €120, and early repayment is free after 12 months. | The loan amount is €8,000 over 36 months, APR is 8.9%, monthly payment is €254.10, origination fee is €120, and early repayment is free after 12 months. | — |
| OPTION B | Here's the full loan offer, bank statement and credit check. Please review the offer. | Here's the full loan offer, bank statement and credit check. Please review the offer. | 📎 loan_offer_full_package.pdf · 10 pages |
| OPTION C | I hid my name, IBAN and signature on the loan offer before uploading it. | I hid my name, IBAN and signature on the loan offer before uploading it. | 📎 loan_offer_redacted.pdf · 3 pages |

### Feedback

| Option | Badge | Message | Score |
|---|---|---|---|
| OPTION A | ✓ SAFE | Nice — you shared the numbers needed to evaluate the offer without exposing your banking identity. | 1000 |
| OPTION B | ✕ NOT SAFE | The full package can leak your account details, income, credit score, address, debts and transaction history. | −200 |
| OPTION C | ! ALMOST | Better — direct identifiers are hidden. But loan PDFs can still reveal application IDs, bank metadata, credit data and financial context. | +150 |

### View more modal text

#### OPTION A

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION A |
| Title | Loan advice can work from key terms. |
| Point 1 | Decision fields only — Amount, APR, term, fees and payment are enough to reason about cost. |
| Point 2 | No banking identity — IBAN, credit score, address and transaction history stay private. |
| Rule | Share loan terms, not loan documents. |

#### OPTION B

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION B |
| Title | Full finance packages reveal more than a loan offer. |
| Point 1 | Account and identity data — Bank details, address and application IDs can identify you directly. |
| Point 2 | Credit profile — Scores, debts and repayment history are sensitive financial data. |
| Point 3 | Transaction trail — Statements reveal income, rent, subscriptions and spending habits. |
| Rule | Never upload a full loan package when the AI only needs the offer terms. |

#### OPTION C

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION C |
| Title | Redacted loan offers can still expose financial context. |
| Point 1 | Direct identifiers masked — Hiding name, IBAN and signature is a useful first step. |
| Point 2 | Metadata remains — Application numbers, bank branch, timestamps and document IDs can still identify you. |
| Point 3 | Financial facts are sensitive — Credit amount, rate and debt context can be personal even without a name. |
| Rule | If you can type the offer terms, do that instead of uploading the PDF. |

## Scene 04 · Optimize Your CV Content and Layout

### Header and setup

| Key | Text |
|---|---|
| Scene label | Scene 04 · CAREER & EDUCATION |
| Timer | ⏱ 22s |
| Progress | 80% |
| Headline | Optimize Your CV Content and Layout |
| User eyebrow | YOU · 09:42 |
| User setup | I'm applying to a tech company. Can you help me improve the content and layout of my CV? |
| AI eyebrow | AI · 09:42 |
| AI setup | Of course. I can help with structure, wording and prioritization. How would you like to share your CV details? |

### Choices and reveal states

| Option | Card text | Chosen reply text | Attachment text |
|---|---|---|---|
| OPTION A | I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role. | I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role. | — |
| OPTION B | Here's the full PDF. Can you optimize the content and layout? | Here's the full PDF. Can you optimize the content and layout? | 📎 Anna_Müller_CV.pdf · 2 pages |
| OPTION C | Here's the experience section with personal details hidden. Can you improve the layout and wording? | Here's the experience section with personal details hidden. Can you improve the layout and wording? | 📎 CV_experience_redacted.pdf · 1 page |

### Feedback

| Option | Badge | Message | Score |
|---|---|---|---|
| OPTION A | ✓ SAFE | Well done — you shared goals, skills and target role without exposing personal identifiers. | 1000 |
| OPTION B | ✕ NOT SAFE | The full CV can leak your name, address, phone, photo, birth date and signature — far more than layout feedback needs. | −200 |
| OPTION C | ! ALMOST | Better — you hid personal details. But a redacted CV can still identify you through employers, dates, rare projects and layout metadata. | +150 |

### View more modal text

#### OPTION A

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION A |
| Title | A written summary gives enough CV context. |
| Point 1 | No identity attached — Name, photo, address and birth date never leave your device. |
| Point 2 | Only the relevant facts — Skills, experience, target role and layout goals are exactly what the AI needs. |
| Rule | For CV feedback, describe the role, skills and goals before uploading any file. |

#### OPTION B

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION B |
| Title | A full CV leaks far more than the AI needs. |
| Point 1 | Identity block — Name, photo, full address, phone and email sit in the header of many CVs. |
| Point 2 | Personal timeline — Education dates, employers and locations create a detailed profile. |
| Point 3 | Signature or references — These can be copied, linked or reused outside your control. |
| Rule | Never upload a full CV when a role-focused summary would do. |

#### OPTION C

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION C |
| Title | Redacting helps — but a partial CV still carries risk. |
| Point 1 | Sensitive fields masked — Hiding contact details is a good instinct. |
| Point 2 | Career clues remain — Employer names, dates and rare projects can re-identify you. |
| Point 3 | Easy to miss hidden text — PDFs can retain metadata or selectable text behind redaction. |
| Rule | Redaction is a fallback. A clean written summary is safer for layout and content advice. |

## Scene 05 · Write or Polish an Email to Your Supervisor

### Header and setup

| Key | Text |
|---|---|
| Scene label | Scene 05 · WORKPLACE COMMUNICATION |
| Timer | ⏱ 22s |
| Progress | 100% |
| Headline | Write or Polish an Email to Your Supervisor |
| User eyebrow | YOU · 09:42 |
| User setup | I need to write an email to my supervisor about a project delay. Can you help me make it clear and professional? |
| AI eyebrow | AI · 09:42 |
| AI setup | Absolutely. I can help with tone and structure. What context do you want to provide? |

### Choices and reveal states

| Option | Card text | Chosen reply text | Attachment text |
|---|---|---|---|
| OPTION A | I need to explain that the dashboard task will be two days late because a data export is blocked. I want the email to be calm, accountable and propose a new deadline for Friday. | I need to explain that the dashboard task will be two days late because a data export is blocked. I want the email to be calm, accountable and propose a new deadline for Friday. | — |
| OPTION B | Here's the full email thread with my supervisor and teammate. Rewrite my reply. | Here's the full email thread with my supervisor and teammate. Rewrite my reply. | 📎 supervisor_thread_full.eml · 18 messages |
| OPTION C | I removed names from the thread and uploaded only the latest messages. | I removed names from the thread and uploaded only the latest messages. | 📎 supervisor_thread_redacted.pdf · 3 pages |

### Feedback

| Option | Badge | Message | Score |
|---|---|---|---|
| OPTION A | ✓ SAFE | Nice — you shared the goal, tone and key facts without exposing a private workplace thread. | 1000 |
| OPTION B | ✕ NOT SAFE | The full thread can expose colleagues' names, emails, internal project details, timestamps and confidential decisions. | −200 |
| OPTION C | ! ALMOST | Better — names are removed. But project details, writing style, dates and email metadata can still identify people and teams. | +150 |

### View more modal text

#### OPTION A

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION A |
| Title | A workplace email can be drafted from a summary. |
| Point 1 | Goal and tone only — The AI needs the message purpose, facts and desired tone. |
| Point 2 | No private thread — Colleagues' words, emails and internal context stay private. |
| Rule | For email help, summarize the situation and ask for wording — don't paste the thread. |

#### OPTION B

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION B |
| Title | Full workplace threads can expose confidential context. |
| Point 1 | Other people's messages — Colleagues did not consent to their emails being uploaded. |
| Point 2 | Internal information — Roadmaps, blockers, clients and decisions may be confidential. |
| Point 3 | Metadata — Email addresses, timestamps and signatures identify people and teams. |
| Rule | Never upload a full workplace email chain for a simple rewrite. |

#### OPTION C

| Key | Text |
|---|---|
| Eyebrow | PRIVACY LESSON · OPTION C |
| Title | Redacted email threads can still be recognizable. |
| Point 1 | Names removed — Redaction lowers the direct exposure of people in the thread. |
| Point 2 | Context remains — Project names, deadlines and writing style can still reveal the team. |
| Point 3 | Email metadata persists — Headers, signatures and quoted text are easy to miss. |
| Rule | Convert the thread into a short neutral brief before asking the AI to draft. |
