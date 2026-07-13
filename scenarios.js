window.PRIVACYGUARD_SCENARIOS = {
  assistantTitle: "PrivacyGuard AI",
  model: "PG.5.6",
  levels: [
    {
      title: "Verify Your Phone Contract",
      shortTitle: "Phone contract",
      icon: "mail",
      user: "Can you check whether this phone plan is a good deal before I renew it?",
      prompt:
        "Yes. I only need the costs, contract length and included data or minutes. How would you like to share it?",
      adviceTitle: "Never send the full contract.",
      advice:
        "It contains your bank account, address, ID number and signature - everything an attacker needs.",
      options: [
        {
          label: "OPTION A",
          text: "The plan is EUR 24.99/month for 24 months, includes 30GB 5G data, EU roaming, and a EUR 39 activation fee. Renewal price after month 24 is EUR 34.99.",
          score: 20,
          feedback: {
            key: "safe",
            label: "SAFE",
            summary:
              "Nice - you shared the details needed to compare the contract without exposing your full identity package.",
            modalTitle: "Phone contract help only needs key terms.",
            lessonLabel: "PRIVACY LESSON - OPTION A",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Decision fields only",
                text: "You shared the price, term, data allowance and fees instead of the full contract.",
              },
              {
                type: "good",
                mark: "+",
                title: "No hidden metadata",
                text: "Typed summaries avoid PDF metadata, signatures, addresses, account numbers and customer IDs.",
              },
            ],
            remember: "Share the task facts, not the whole document.",
          },
        },
        {
          label: "OPTION B",
          text: "Open the full phone contract, choose which information to redact, then share the reviewed copy.",
          document: "pdf",
          interaction: "redact-contract",
          score: 0,
          feedback: {
            key: "risky",
            label: "NOT SAFE",
            summary:
              "The full contract must be reviewed carefully before sharing. Personal identifiers should be hidden while useful plan terms remain visible.",
            modalTitle: "Full phone contracts reveal more than the AI needs.",
            lessonLabel: "PRIVACY LESSON - OPTION B",
            points: [
              {
                type: "risk",
                mark: "!",
                title: "Identity data",
                text: "Full contracts often include names, addresses, customer IDs, IBANs, signatures or contact details.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Usage pattern",
                text: "Mobile plan, contract duration and usage preferences can provide insights into your daily habits and relationship with your mobile provider.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Targeted scam",
                text: "Scammers can use this information to create convincing messages, such as fake contract renewal offers or discount promotions that appear to come from your mobile provider.",
              },
            ],
            remember: "Redact personal identifiers before sharing any document.",
          },
        },
        {
          label: "OPTION C",
          text: "I’ll share screenshots of the pages about fees and contract term, but my name and customer number are still visible.",
          document: "part",
          score: 10,
          feedback: {
            key: "caution",
            label: "ALMOST",
            summary:
              "Sharing only relevant pages reduces exposure, but the visible name and customer number still connect the document directly to you.",
            modalTitle: "Relevant pages can still reveal your identity.",
            lessonLabel: "PRIVACY LESSON - OPTION C",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Relevant pages only",
                text: "You limited the upload to the pricing, fee and contract-term pages.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Identifiers remain visible",
                text: "Your name and customer number connect the screenshots to your provider account.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Targeted scam risk",
                text: "Account-linked details can make fake renewal messages or support calls more convincing.",
              },
            ],
            remember:
              "Relevant pages still need every unnecessary identifier removed.",
          },
        },
      ],
    },
    {
      title: "Evaluate your rental application",
      shortTitle: "Rental Application",
      icon: "link",
      user: "I want to apply for an apartment. Can you tell me if my application looks strong enough?",
      prompt:
        "I can help you assess the application. What details would you like to share?",
      adviceTitle: "Your rental application is a full identity package.",
      advice:
        "Documents often include your income, employer, address, credit score... Summarize only the details relevant to your question.",
      options: [
        {
          label: "OPTION A",
          text: "The rent is EUR 980 cold / EUR 1,180 warm. My net income is about EUR 3,300, I have a permanent contract, can move in from September, and I want the message to sound reliable and concise.",
          score: 20,
          feedback: {
            key: "safe",
            label: "SAFE",
            summary:
              "Nice - you only shared the key financial and timing details needed.",
            modalTitle:
              "Rental application advice can work from summary facts.",
            lessonLabel: "PRIVACY LESSON - OPTION A",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Minimal profile only",
                text: "Rent, income range, contract type and move-in date are enough for useful feedback.",
              },
              {
                type: "good",
                mark: "+",
                title: "No document bundle",
                text: "You avoided uploading IDs, payslips, address history or bank information.",
              },
            ],
            remember:
              "Summarize the application instead of uploading the package.",
          },
        },
        {
          label: "OPTION B",
          text: "Here's my full rental application package. Can you check if everything looks convincing?",
          document: "zip",
          score: 0,
          feedback: {
            key: "risky",
            label: "NOT SAFE",
            summary:
              "A full rental package can expose income, employer, address, identity documents and financial history at once.",
            modalTitle:
              "Full rental applications contain all identity profiles.",
            lessonLabel: "PRIVACY LESSON - OPTION B",
            points: [
              {
                type: "risk",
                mark: "!",
                title: "Identity bundle",
                text: "These documents reveal your financial situation, rental history, and personal background.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Too much context",
                text: "The AI does not need the full package to help with wording or completeness.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Financial fraud",
                text: "Attackers may attempt unauthorized transactions or create convincing financial scams.",
              },
            ],
            remember: "Never upload a full application package to AI tools.",
          },
        },
        {
          label: "OPTION C",
          text: "I removed my ID number and bank account and uploaded cropped screenshots showing only my income and employment details.",
          document: "screenshot",
          score: 10,
          feedback: {
            key: "caution",
            label: "ALMOST",
            summary:
              "Better - some direct identifiers are removed. But cropped screenshots can still leak sensitive housing and income context.",
            modalTitle: "Screenshots still carry hidden personal context.",
            lessonLabel: "PRIVACY LESSON - OPTION C",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Some identifiers removed",
                text: "Hiding ID and bank numbers is a useful first step.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Residual sensitive context",
                text: "Employer, income, address, dates and document structure can still point back to you.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Social engineering",
                text: "Scammers use personal information to gain your trust and persuade you to take unsafe actions.",
              },
            ],
            remember: "Redaction helps, but summaries are safer.",
          },
        },
      ],
    },
    {
      title: "Review Your Loan Offer",
      shortTitle: "Bank Loan",
      icon: "document",
      user: "I got a personal loan offer. Can you help me understand whether the terms are reasonable?",
      prompt:
        "Sure. I can compare the key terms if you share the amount, APR, fees, term and monthly payment.",
      adviceTitle: "Loan documents reveal your financial fingerprint.",
      advice:
        "Credit tier, debt level, and income can all be inferred from a single offer. Summarize - never upload.",
      options: [
        {
          label: "OPTION A",
          text: "The loan amount is EUR 8,000 over 36 months, APR is 8.9%, monthly payment is EUR 254.10, origination fee is EUR 120, and early repayment is free after 12 months.",
          score: 20,
          feedback: {
            key: "safe",
            label: "SAFE",
            summary:
              "Nice - the AI can compare the loan terms from the numbers without seeing the full financial document.",
            modalTitle: "Loan review can work from key terms.",
            lessonLabel: "PRIVACY LESSON - OPTION A",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Financial facts only",
                text: "Amount, APR, fee, term and payment are enough to reason about the offer.",
              },
              {
                type: "good",
                mark: "+",
                title: "No bank document",
                text: "You avoided uploading statements, credit checks, account IDs and signatures.",
              },
            ],
            remember: "Summarize financial terms, not sharing loan files.",
          },
        },
        {
          label: "OPTION B",
          text: "Here's the full loan offer, bank statement and credit check. Please review the offer.",
          document: "pdf",
          score: 0,
          feedback: {
            key: "risky",
            label: "NOT SAFE",
            summary:
              "Full loan and banking files can expose account history, income signals, credit data and identity details.",
            modalTitle: "Full loan packages reveal your financial profile.",
            lessonLabel: "PRIVACY LESSON - OPTION B",
            points: [
              {
                type: "risk",
                mark: "!",
                title: "Banking exposure",
                text: "You revealed sensitive financial information, including your income, savings, debts, and credit score. These details provide a comprehensive picture of your financial health.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Identity risk",
                text: "Names, addresses, signatures and reference numbers often appear in loan documents.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Targeted scam",
                text: "Scammers may send fake loan refinancing or debt relief offers that appear relevant to your financial situation.",
              },
            ],
            remember: "Never share full financial documents directly to AI.",
          },
        },
        {
          label: "OPTION C",
          text: "I used OCR to extract the text from the loan offer and pasted only the loan terms and repayment details into the chat.",
          document: "txt",
          score: 10,
          feedback: {
            key: "caution",
            label: "ALMOST",
            summary:
              "Better - OCR extraction helps readability, but pasting extracted text still exposes financial context.",
            modalTitle: "Redacted text still carry financial context.",
            lessonLabel: "PRIVACY LESSON - OPTION C",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Direct identifiers masked",
                text: "Hiding name, IBAN and signature reduces obvious identity risk.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Financial fingerprint",
                text: "You revealed repayment schedule, monthly installments, loan costs, and borrowing conditions. These details provide information about your financial commitments and borrowing habits.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Profiling",
                text: "Your loan information can reveal your financial situation and spending patterns when combined with other personal data.",
              },
            ],
            remember:
              "Filter and summarize the content what you want to share.",
          },
        },
      ],
    },
    {
      title: "Optimize Your CV Content and Layout",
      shortTitle: "CV",
      icon: "document",
      user: "I'm applying to a tech company. Can you help me improve the content and layout of my CV?",
      prompt:
        "Of course. I can help with structure, wording and prioritization. How would you like to share your CV details?",
      adviceTitle: "Your CV contains more than work experience.",
      advice:
        "Name, phone, location, employer, and life history are all on one page. Describe it, do not upload it.",
      options: [
        {
          label: "OPTION A",
          text: "I have software development experience from university projects and a working-student role. My strongest areas are Java, backend development and some frontend work. I want the CV to feel clearer, more scannable and more relevant for a junior developer role.",
          score: 20,
          feedback: {
            key: "safe",
            label: "SAFE",
            summary:
              "Nice - you shared only relevant skills and experience needed for improvement without uploading your full profile.",
            modalTitle: "CV advice can work from a role-focused summary.",
            lessonLabel: "PRIVACY LESSON - OPTION A",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Role-focused context",
                text: "Skills, experience type and target role are enough to improve positioning.",
              },
              {
                type: "good",
                mark: "+",
                title: "No full personal profile",
                text: "You avoided sharing name, phone, address, employers and exact career timeline.",
              },
            ],
            remember: "Describe the CV goal instead of uploading the full CV.",
          },
        },
        {
          label: "OPTION B",
          text: "I exported my complete LinkedIn profile and uploaded it for you to rewrite.",
          document: "zip",
          score: 0,
          feedback: {
            key: "risky",
            label: "NOT SAFE",
            summary:
              "A full profile package gives the AI your identity, contact details, education history, connections and metadata.",
            modalTitle: "Your CV is a complete identity timeline.",
            lessonLabel: "PRIVACY LESSON - OPTION B",
            points: [
              {
                type: "risk",
                mark: "!",
                title: "Personal identifiers",
                text: "CVs often include name, phone, email, location and links.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Life timeline",
                text: "Employers, education and dates can create a detailed profile of you.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Phishing",
                text: "Attackers may pretend to be recruiters or companies you trust to trick you into revealing more information or clicking malicious links.",
              },
            ],
            remember: "Do not upload a full CV when a summary will work.",
          },
        },
        {
          label: "OPTION C",
          text: "Here's the experience section with personal details hidden. Can you improve the layout and wording?",
          document: "part",
          score: 10,
          feedback: {
            key: "caution",
            label: "ALMOST",
            summary:
              "Better - personal details are hidden. But experience text can still identify you through employers, dates and unique projects.",
            modalTitle: "Redacted CV sections can still be identifying.",
            lessonLabel: "PRIVACY LESSON - OPTION C",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Direct details removed",
                text: "Removing name and contact information is a useful privacy step.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Unique history remains",
                text: "Specific roles, dates, companies and projects can still identify a person.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Profiling",
                text: "Combining your information to creates a detailed profile that can be used to identify or track you across different websites.",
              },
            ],
            remember:
              "Share anonymized examples, not a document section, when possible.",
          },
        },
      ],
    },
    {
      title: "Draft a Work Email",
      shortTitle: "Work Email",
      icon: "mail",
      user: "Can you help me write a clearer response to a coworker about this project decision?",
      prompt:
        "Yes. Share the goal, audience and tone. Avoid names or internal details unless they are necessary.",
      adviceTitle: "Summarize the situation, not the conversation.",
      advice:
        "Project names, internal decisions, and real people's roles can leak professional data. Ask for templates instead.",
      options: [
        {
          label: "OPTION A",
          text: "Please draft a polite update that says we need one more review round before committing to the timeline. Keep it concise and collaborative.",
          score: 20,
          feedback: {
            key: "safe",
            label: "SAFE",
            summary:
              "Nice - you asked for wording help without exposing names, internal project details or the full thread.",
            modalTitle: "Work email help can use intent and tone.",
            lessonLabel: "PRIVACY LESSON - OPTION A",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Intent over transcript",
                text: "You gave the communication goal instead of the private conversation.",
              },
              {
                type: "good",
                mark: "+",
                title: "No internal details",
                text: "Names, project codes, timelines and decision history stayed out of the prompt.",
              },
            ],
            remember:
              "Ask for a template or tone rewrite without sharing the full thread.",
          },
        },
        {
          label: "OPTION B",
          text: "Here is the full email thread with names, internal project details and the decision history. Can you rewrite my reply?",
          document: "mail",
          score: 0,
          feedback: {
            key: "risky",
            label: "NOT SAFE",
            summary:
              "A full work thread can expose colleagues, internal decisions, project timelines and confidential business context.",
            modalTitle: "Full email threads leak workplace context.",
            lessonLabel: "PRIVACY LESSON - OPTION B",
            points: [
              {
                type: "risk",
                mark: "!",
                title: "People and roles",
                text: "Names, titles and responsibilities can reveal private workplace relationships.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Confidential information exposure",
                text: "Internal project details or deadlines may not be public and could unintentionally expose sensitive business information.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Phishing",
                text: "Someone could use these details to create convincing emails that appear to come from your colleagues.",
              },
            ],
            remember: "Never share real workplace threads with AI.",
          },
        },
        {
          label: "OPTION C",
          text: "I pasted the Slack conversation that led to the decision so you can help me draft a reply.",
          document: "chat",
          score: 10,
          feedback: {
            key: "caution",
            label: "ALMOST",
            summary:
              "Better - Sharing partial chat helps context, but still exposes internal decisions and relationship context.",
            modalTitle:
              "Even partial chat logs can still expose workplace context.",
            lessonLabel: "PRIVACY LESSON - OPTION C",
            points: [
              {
                type: "good",
                mark: "+",
                title: "Names and project details removed",
                text: "That reduces direct exposure of colleagues and projects.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Decision context remains",
                text: "Even limited chat can still reveal internal discussions, conflicts or timelines.",
              },
              {
                type: "risk",
                mark: "!",
                title: "Reputation impact",
                text: "If confidential information is leaked, it could damage your reputation and trust, or lead to financial or legal consequences.",
              },
            ],
            remember:
              "Summarize the workplace situation without pasting real conversations.",
          },
        },
      ],
    },
  ],
};
