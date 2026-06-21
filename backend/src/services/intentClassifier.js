/**
 * Intent Classifier
 * Classifies user messages into predefined intents without calling OpenAI
 * Acts as a fast pre-filter before full AI response generation
 */

const ESCALATION_PATTERNS = [
  /which\s+(mutual\s+fund|stock|mf|scheme)/i,
  /suggest\s+(me|a|best|good)/i,
  /recommend(ation)?/i,
  /best\s+(fund|stock|portfolio|plan|scheme|policy)/i,
  /should\s+i\s+invest/i,
  /where\s+should\s+i\s+invest/i,
  /portfolio\s+(allocation|advice|suggest|recommend|review)/i,
  /tax\s+(saving|benefit|advice|planning|deduction)/i,
  /retirement\s+(plan|advice|suggest|portfolio)/i,
  /financial\s+(plan|advice|planning\s+for)/i,
  /how\s+much\s+should\s+i\s+invest/i,
  /asset\s+allocation/i,
  /which\s+is\s+better.*fund/i,
  /invest.*lakh/i,
  /invest.*crore/i,
];

const INTENT_PATTERNS = {
  sip_query: [
    /\bsip\b/i,
    /systematic\s+investment/i,
    /sip\s+(amount|date|calculator|return|benefit|advantage)/i,
    /monthly\s+investment/i,
    /recurring\s+investment/i,
  ],
  mutual_fund_query: [
    /mutual\s+fund/i,
    /\bmf\b/i,
    /nav\b/i,
    /amc\b/i,
    /nfo\b/i,
    /equity\s+fund/i,
    /debt\s+fund/i,
    /hybrid\s+fund/i,
    /elss/i,
    /fund\s+(house|manager|category)/i,
  ],
  demat_query: [
    /demat/i,
    /trading\s+account/i,
    /depository/i,
    /nsdl|cdsl/i,
    /share(s)?\s+(buy|sell|hold)/i,
    /stock\s+(market|trading|broker)/i,
    /open.*demat/i,
    /demat.*documents/i,
    /demat.*kyc/i,
  ],
  insurance_query: [
    /insurance/i,
    /\bterm\s+(plan|insurance|policy)\b/i,
    /health\s+(insurance|cover|policy|plan)/i,
    /life\s+insurance/i,
    /premium/i,
    /sum\s+assured/i,
    /claim\s+(process|settle|file)/i,
    /ulip/i,
    /policy\s+(lapse|renewal|maturity)/i,
  ],
  goal_planning_query: [
    /goal.*(plan|invest|save)/i,
    /plan.*goal/i,
    /child.*education.*fund/i,
    /house.*down.*payment/i,
    /marriage.*fund/i,
    /emergency\s+fund/i,
    /saving.*for/i,
  ],
  wealth_creation_query: [
    /wealth\s+creation/i,
    /wealth\s+management/i,
    /long\s+term.*invest/i,
    /compounding/i,
    /grow.*money/i,
    /financial\s+freedom/i,
    /passive\s+income/i,
  ],
  greeting: [
    /^(hi|hello|hey|good\s+(morning|afternoon|evening)|namaste|hii|helo)\b/i,
    /^(what\s+can\s+you\s+do|help\s+me|start)\b/i,
  ],
};

/**
 * HIGH priority scoring keywords
 */
const HIGH_PRIORITY_KEYWORDS = [
  'retirement', 'wealth creation', 'invest 5 lakh', 'invest 10 lakh',
  'invest 20 lakh', 'invest 50 lakh', 'invest 1 crore', 'portfolio',
  'long term', 'financial independence', 'corpus', 'lakh', 'crore',
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'sip', 'mutual fund', 'insurance', 'demat', 'goal', 'returns',
  'invest', 'saving', 'plan',
];

/**
 * Classify the intent of a user message
 * @param {string} message
 * @returns {{ intent: string, escalate: boolean, priority: string, priorityReason: string }}
 */
function classifyIntent(message) {
  const sanitizedMessage = message.toLowerCase().trim();

  // Check escalation first
  const shouldEscalate = ESCALATION_PATTERNS.some((pattern) => pattern.test(sanitizedMessage));
  if (shouldEscalate) {
    return {
      intent: 'advisor_escalation',
      escalate: true,
      priority: 'high',
      priorityReason: 'User asked for personalized financial advice or investment recommendation',
    };
  }

  // Match intents
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some((p) => p.test(sanitizedMessage))) {
      const priority = scorePriority(sanitizedMessage);
      return { intent, escalate: false, ...priority };
    }
  }

  // Default
  const priority = scorePriority(sanitizedMessage);
  return { intent: 'general_query', escalate: false, ...priority };
}

/**
 * Score lead priority from message content
 */
function scorePriority(message) {
  const lower = message.toLowerCase();

  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) {
      return { priority: 'high', priorityReason: `User mentioned high-value keyword: "${kw}"` };
    }
  }

  for (const kw of MEDIUM_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) {
      return { priority: 'medium', priorityReason: `User expressed interest in: "${kw}"` };
    }
  }

  return { priority: 'low', priorityReason: 'General FAQ exploration' };
}

module.exports = { classifyIntent, scorePriority };
