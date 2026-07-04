window.PRIVACYGUARD_SCENARIOS = {
  "assistantTitle": "PrivacyGuard AI",
  "model": "PG.5.6",
  "levels": [
    {
      "title": "Verify Your Phone Contract",
      "shortTitle": "Verify phone contract",
      "icon": "mail",
      "user": "Can you check whether this phone plan is a good deal before I renew it?",
      "prompt": "Yes. I only need the costs, contract length and included data or minutes. How would you like to share it?",
      "adviceTitle": "Never upload a full contract PDF.",
      "advice": "It contains your bank account, address, ID number and signature - everything an attacker needs.",
      "options": [
        { "label": "OPTION A", "text": "The plan is EUR 24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a EUR 39 activation fee. Renewal price after month 24 is EUR 34.99.", "score": 20,
          "feedback": { "key": "safe", "label": "SAFE", "summary": "Nice - you shared the details needed to compare the contract without exposing your full identity package.", "modalTitle": "Phone contract help only needs key terms.", "lessonLabel": "PRIVACY LESSON - OPTION A", "points": [ { "type": "good", "mark": "+", "title": "Decision fields only", "text": "You shared the price, term, data allowance and fees instead of the full contract." }, { "type": "good", "mark": "+", "title": "No hidden metadata", "text": "Typed summaries avoid PDF metadata, signatures, addresses, account numbers and customer IDs." } ], "remember": "Share the task facts, not the whole document." } },
        { "label": "OPTION B", "text": "Here's the full contract PDF. Can you check every page?", "document": "pdf", "score": 0,
          "feedback": { "key": "risky", "label": "NOT SAFE", "summary": "A full phone contract can reveal account details, address data, signatures and provider metadata far beyond this request.", "modalTitle": "Full phone contracts reveal more than the AI needs.", "lessonLabel": "PRIVACY LESSON - OPTION B", "points": [ { "type": "risk", "mark": "!", "title": "Account and identity data", "text": "Full contracts often include names, addresses, customer IDs, IBANs, signatures or contact details." }, { "type": "risk", "mark": "!", "title": "Private context", "text": "The AI may receive billing history and plan details that are irrelevant to the comparison." }, { "type": "risk", "mark": "!", "title": "Metadata trail", "text": "File metadata and timestamps can reveal where the document came from and who handled it." } ], "remember": "Never upload a full contract PDF." } },
        { "label": "OPTION C", "text": "I redacted my address and IBAN and attached the contract pages about fees and term.", "document": "part", "score": 10,
          "feedback": { "key": "caution", "label": "ALMOST", "summary": "Better - direct identifiers are hidden. But redacted contract pages can still expose metadata and sensitive context.", "modalTitle": "Redacted contract pages can still expose context.", "lessonLabel": "PRIVACY LESSON - OPTION C", "points": [ { "type": "good", "mark": "+", "title": "Direct identifiers masked", "text": "Removing your address and IBAN reduces the most obvious risk." }, { "type": "risk", "mark": "!", "title": "Metadata remains", "text": "Document IDs, timestamps and file names may still identify the contract or customer account." }, { "type": "risk", "mark": "!", "title": "Typing is safer", "text": "If the question only needs price, term and fees, type those details instead of uploading pages." } ], "remember": "If you can type the relevant details, do that instead of uploading a file." } }
      ]
    },
    {
      "title": "Evaluate your rental application",
      "shortTitle": "Rental Application",
      "icon": "link",
      "user": "I want to apply for an apartment. Can you tell me if my application looks strong enough?",
      "prompt": "I can help you assess the application. What details would you like to share?",
      "adviceTitle": "Your rental application is a full identity package.",
      "advice": "Income, employer, credit score, and address - all in one file. Never upload it directly to AI.",
      "options": [
        { "label": "OPTION A", "text": "The rent is EUR 980 cold / EUR 1,180 warm. My net income is about EUR 3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise.", "score": 20,
          "feedback": { "key": "safe", "label": "SAFE", "summary": "Nice - you gave the facts needed to judge affordability and tone without sharing the full application package.", "modalTitle": "Rental application advice can work from summary facts.", "lessonLabel": "PRIVACY LESSON - OPTION A", "points": [ { "type": "good", "mark": "+", "title": "Relevant details only", "text": "Rent, income range, contract type and move-in date are enough for useful feedback." }, { "type": "good", "mark": "+", "title": "No document bundle", "text": "You avoided uploading IDs, payslips, address history or bank information." } ], "remember": "Summarize the application instead of uploading the package." } },
        { "label": "OPTION B", "text": "Here's my full rental application package. Can you check if everything looks convincing?", "document": "zip", "score": 0,
          "feedback": { "key": "risky", "label": "NOT SAFE", "summary": "A full rental package can expose income, employer, address, identity documents and financial history at once.", "modalTitle": "Full rental applications are high-risk uploads.", "lessonLabel": "PRIVACY LESSON - OPTION B", "points": [ { "type": "risk", "mark": "!", "title": "Identity bundle", "text": "Application packages often combine ID scans, payslips, bank data and addresses." }, { "type": "risk", "mark": "!", "title": "Financial profiling", "text": "Income and employment details can be used to profile or target you." }, { "type": "risk", "mark": "!", "title": "Too much context", "text": "The AI does not need the full package to help with wording or completeness." } ], "remember": "Never upload a full rental application package." } },
        { "label": "OPTION C", "text": "I removed my ID number and bank account from the application package before uploading it.", "document": "part", "score": 10,
          "feedback": { "key": "caution", "label": "ALMOST", "summary": "Better - some direct identifiers are removed. But the remaining application still contains sensitive housing and income context.", "modalTitle": "Redacted rental files can still reveal identity context.", "lessonLabel": "PRIVACY LESSON - OPTION C", "points": [ { "type": "good", "mark": "+", "title": "Some identifiers removed", "text": "Hiding ID and bank numbers is a useful first step." }, { "type": "risk", "mark": "!", "title": "Context still identifies", "text": "Employer, income, address, dates and document structure can still point back to you." }, { "type": "risk", "mark": "!", "title": "Use a summary", "text": "Typed summaries usually answer the same question with less exposure." } ], "remember": "Redaction helps, but summaries are safer." } }
      ]
    },
    {
      "title": "Review Your Loan Offer",
      "shortTitle": "Bank Loan",
      "icon": "document",
      "user": "I got a personal loan offer. Can you help me understand whether the terms are reasonable?",
      "prompt": "Sure. I can compare the key terms if you share the amount, APR, fees, term and monthly payment.",
      "adviceTitle": "Loan documents reveal your financial fingerprint.",
      "advice": "Credit tier, debt level, and income can all be inferred from a single offer. Summarize - never upload.",
      "options": [
        { "label": "OPTION A", "text": "The loan amount is EUR 8,000 over 36 months, APR is 8.9%, monthly payment is EUR 254.10, origination fee is EUR 120, and early repayment is free after 12 months.", "score": 20,
          "feedback": { "key": "safe", "label": "SAFE", "summary": "Nice - the AI can compare the loan terms from the numbers without seeing the full financial document.", "modalTitle": "Loan review can work from key terms.", "lessonLabel": "PRIVACY LESSON - OPTION A", "points": [ { "type": "good", "mark": "+", "title": "Financial facts only", "text": "Amount, APR, fee, term and payment are enough to reason about the offer." }, { "type": "good", "mark": "+", "title": "No bank document", "text": "You avoided uploading statements, credit checks, account IDs and signatures." } ], "remember": "Share loan terms, not loan files." } },
        { "label": "OPTION B", "text": "Here's the full loan offer, bank statement and credit check. Please review the offer.", "document": "pdf", "score": 0,
          "feedback": { "key": "risky", "label": "NOT SAFE", "summary": "Full loan and banking files can expose account history, income signals, credit data and identity details.", "modalTitle": "Full loan packages reveal your financial profile.", "lessonLabel": "PRIVACY LESSON - OPTION B", "points": [ { "type": "risk", "mark": "!", "title": "Banking exposure", "text": "Statements and credit checks can reveal transactions, income, debt and account identifiers." }, { "type": "risk", "mark": "!", "title": "Identity risk", "text": "Names, addresses, signatures and reference numbers often appear in loan documents." }, { "type": "risk", "mark": "!", "title": "Unneeded detail", "text": "The AI only needs the offer terms to compare the deal." } ], "remember": "Never upload full loan files or bank statements." } },
        { "label": "OPTION C", "text": "I hid my name, IBAN and signature on the loan offer before uploading it.", "document": "part", "score": 10,
          "feedback": { "key": "caution", "label": "ALMOST", "summary": "Better - direct identifiers are hidden. But the loan file still reveals financial context and document metadata.", "modalTitle": "Redacted loan offers still carry financial context.", "lessonLabel": "PRIVACY LESSON - OPTION C", "points": [ { "type": "good", "mark": "+", "title": "Direct identifiers masked", "text": "Hiding name, IBAN and signature reduces obvious identity risk." }, { "type": "risk", "mark": "!", "title": "Financial fingerprint", "text": "The terms can still imply credit tier, debt load and personal financial situation." }, { "type": "risk", "mark": "!", "title": "Metadata remains", "text": "Document IDs and timestamps can remain even when visible text is redacted." } ], "remember": "Type the relevant numbers instead of uploading a redacted file." } }
      ]
    },
    {
      "title": "Optimize Your CV Content and Layout",
      "shortTitle": "CV Optimization",
      "icon": "document",
      "user": "I'm applying to a tech company. Can you help me improve the content and layout of my CV?",
      "prompt": "Of course. I can help with structure, wording and prioritization. How would you like to share your CV details?",
      "adviceTitle": "A CV is the most complete profile you can hand over.",
      "advice": "Name, phone, location, employer, and life history are all on one page. Describe it, do not upload it.",
      "options": [
        { "label": "OPTION A", "text": "I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role.", "score": 20,
          "feedback": { "key": "safe", "label": "SAFE", "summary": "Nice - you shared the career context needed for advice without uploading your full profile.", "modalTitle": "CV advice can work from a role-focused summary.", "lessonLabel": "PRIVACY LESSON - OPTION A", "points": [ { "type": "good", "mark": "+", "title": "Role-focused context", "text": "Skills, experience type and target role are enough to improve positioning." }, { "type": "good", "mark": "+", "title": "No full personal profile", "text": "You avoided sharing name, phone, address, employers and exact career timeline." } ], "remember": "Describe the CV goal instead of uploading the full CV." } },
        { "label": "OPTION B", "text": "Here's the full PDF. Can you optimize the content and layout?", "document": "pdf", "score": 0,
          "feedback": { "key": "risky", "label": "NOT SAFE", "summary": "A full CV gives the AI your identity, contact details, career path and education history in one file.", "modalTitle": "Full CV uploads expose a complete personal profile.", "lessonLabel": "PRIVACY LESSON - OPTION B", "points": [ { "type": "risk", "mark": "!", "title": "Personal identifiers", "text": "CVs often include name, phone, email, location and links." }, { "type": "risk", "mark": "!", "title": "Life timeline", "text": "Employers, education and dates can create a detailed profile of you." }, { "type": "risk", "mark": "!", "title": "File history", "text": "PDF metadata may reveal author names, software and revision information." } ], "remember": "Do not upload a full CV when a summary will work." } },
        { "label": "OPTION C", "text": "Here's the experience section with personal details hidden. Can you improve the layout and wording?", "document": "part", "score": 10,
          "feedback": { "key": "caution", "label": "ALMOST", "summary": "Better - personal details are hidden. But experience text can still identify you through employers, dates and unique projects.", "modalTitle": "Redacted CV sections can still be identifying.", "lessonLabel": "PRIVACY LESSON - OPTION C", "points": [ { "type": "good", "mark": "+", "title": "Direct details removed", "text": "Removing contact information is a useful privacy step." }, { "type": "risk", "mark": "!", "title": "Unique history remains", "text": "Specific roles, dates, companies and projects can still identify a person." }, { "type": "risk", "mark": "!", "title": "Summaries are enough", "text": "The AI can improve wording from anonymized bullet examples or a role summary." } ], "remember": "Share anonymized examples, not a document section, when possible." } }
      ]
    },
    {
      "title": "Draft a Work Email",
      "shortTitle": "Work Email",
      "icon": "mail",
      "user": "Can you help me write a clearer response to a coworker about this project decision?",
      "prompt": "Yes. Share the goal, audience and tone. Avoid names or internal details unless they are necessary.",
      "adviceTitle": "Work emails contain context AI should not have.",
      "advice": "Project names, internal decisions, and real people's roles can leak professional data. Ask for templates instead.",
      "options": [
        { "label": "OPTION A", "text": "Please draft a polite update that says we need one more review round before committing to the timeline. Keep it concise and collaborative.", "score": 20,
          "feedback": { "key": "safe", "label": "SAFE", "summary": "Nice - you asked for wording help without exposing names, internal project details or the full thread.", "modalTitle": "Work email help can use intent and tone.", "lessonLabel": "PRIVACY LESSON - OPTION A", "points": [ { "type": "good", "mark": "+", "title": "Intent over transcript", "text": "You gave the communication goal instead of the private conversation." }, { "type": "good", "mark": "+", "title": "No internal details", "text": "Names, project codes, timelines and decision history stayed out of the prompt." } ], "remember": "Ask for a template or tone rewrite without sharing the full thread." } },
        { "label": "OPTION B", "text": "Here is the full email thread with names, internal project details and the decision history. Can you rewrite my reply?", "document": "mail", "score": 0,
          "feedback": { "key": "risky", "label": "NOT SAFE", "summary": "A full work thread can expose colleagues, internal decisions, project timelines and confidential business context.", "modalTitle": "Full email threads leak workplace context.", "lessonLabel": "PRIVACY LESSON - OPTION B", "points": [ { "type": "risk", "mark": "!", "title": "People and roles", "text": "Names, titles and responsibilities can reveal private workplace relationships." }, { "type": "risk", "mark": "!", "title": "Business context", "text": "Project codes, decisions and timelines may be confidential." }, { "type": "risk", "mark": "!", "title": "Thread history", "text": "Forwarded messages include more context than the AI needs to write a reply." } ], "remember": "Never paste a full internal email thread into AI." } },
        { "label": "OPTION C", "text": "I removed names and project codes from the thread before sharing the parts about tone and next steps.", "document": "part", "score": 10,
          "feedback": { "key": "caution", "label": "ALMOST", "summary": "Better - names and codes are removed. But even redacted threads can reveal internal decisions and relationship context.", "modalTitle": "Redacted email threads can still expose workplace context.", "lessonLabel": "PRIVACY LESSON - OPTION C", "points": [ { "type": "good", "mark": "+", "title": "Names and codes removed", "text": "That reduces direct exposure of colleagues and projects." }, { "type": "risk", "mark": "!", "title": "Decision context remains", "text": "The thread can still reveal internal priorities, conflicts or timelines." }, { "type": "risk", "mark": "!", "title": "Use a request summary", "text": "Describe the desired tone and next step instead of sharing the thread." } ], "remember": "Summarize the workplace situation without pasting the thread." } }
      ]
    }
  ]
};
