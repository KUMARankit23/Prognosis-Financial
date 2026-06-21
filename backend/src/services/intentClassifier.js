/**
 * Intent Classifier — CIP Enhanced Version
 * Classifies user messages. Supports goal planning, follow-up, and extended escalation.
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
  /fund\s+selection/i,
  /invest.*lakh/i,
  /invest.*crore/i,
  /personalized.*advice/i,
  /specific.*recommendation/i,
];

const INTENT_PATTERNS = {
  sip_query: [
    /\bsip\b/i,
    /systematic\s+investment/i,
    /sip\s+(amount|date|calculator|return|benefit|advantage|stop|pause|start)/i,
    /monthly\s+investment/i,
    /recurring\s+investment/i,
  ],
  mutual_fund_query: [
    /mutual\s+fund/i,
    /\bmf\b/i,
    /\bnav\b/i,
    /\bamc\b/i,
    /\bnfo\b/i,
    /equity\s+fund/i,
    /debt\s+fund/i,
    /hybrid\s+fund/i,
    /\belss\b/i,
    /fund\s+(house|manager|category|type)/i,
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
    /\bpremium\b/i,
    /sum\s+assured/i,
    /claim\s+(process|settle|file)/i,
    /\bulip\b/i,
    /policy\s+(lapse|renewal|maturity)/i,
  ],
  goal_planning_query: [
    /goal.*(plan|invest|save)/i,
    /plan.*goal/i,
    /child.*education/i,
    /education.*fund/i,
    /child.*future/i,
    /retirement\s+(corpus|fund|saving|goal)/i,
    /house.*down.*payment/i,
    /marriage.*fund/i,
    /emergency\s+fund/i,
    /saving.*for/i,
    /financial\s+goal/i,
    /wealth\s+goal/i,
  ],
  wealth_creation_query: [
    /wealth\s+creation/i,
    /wealth\s+management/i,
    /long\s+term.*invest/i,
    /compounding/i,
    /grow.*money/i,
    /financial\s+freedom/i,
    /passive\s+income/i,
    /build.*wealth/i,
  ],
  follow_up_query: [
    /follow.?up/i,
    /call\s+me\s+back/i,
    /remind\s+me/i,
    /schedule\s+a\s+call/i,
    /speak\s+to\s+someone/i,
    /contact\s+me/i,
    /get\s+back\s+to\s+me/i,
    /arrange\s+a\s+meeting/i,
  ],
  greeting: [
    /^(hi|hello|hey|good\s+(morning|afternoon|evening)|namaste|hii|helo)\b/i,
    /^(what\s+can\s+you\s+do|help\s+me|start)\b/i,
  ],
};

// CIP Lead Priority Rules
const HIGH_PRIORITY_KEYWORDS = [
  'retirement', 'wealth creation', 'wealth management',
  'invest 5 lakh', 'invest 10 lakh', 'invest 20 lakh', 'invest 50 lakh', 'invest 1 crore',
  '5 lakh', '10 lakh', '50 lakh', '1 crore', 'portfolio', 'portfolio discussion',
  'long term', 'financial independence', 'corpus', 'lakh', 'crore',
];

const MEDIUM_PRIORITY_KEYWORDS = [
  'sip', 'mutual fund', 'insurance', 'demat', 'goal', 'returns',
  'invest', 'saving', 'plan', 'health insurance', 'term insurance',
];

function classifyIntent(message) {
  const sanitized = message.toLowerCase().trim();

  // Check escalation first
  if (ESCALATION_PATTERNS.some((p) => p.test(sanitized))) {
    return { intent: 'advisor_escalation', escalate: true, priority: 'high', priorityReason: 'User asked for personalized financial advice or fund recommendation' };
  }

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some((p) => p.test(sanitized))) {
      const priority = scorePriority(sanitized);
      return { intent, escalate: false, ...priority };
    }
  }

  const priority = scorePriority(sanitized);
  return { intent: 'general_query', escalate: false, ...priority };
}

function scorePriority(message) {
  const lower = message.toLowerCase();

  // CIP HIGH: retirement, wealth creation, investment > ₹5 Lakh, portfolio discussions
  for (const kw of HIGH_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) {
      return { priority: 'high', priorityReason: `High-value keyword: "${kw}"` };
    }
  }

  // CIP MEDIUM: SIP, Mutual Fund, Insurance queries
  for (const kw of MEDIUM_PRIORITY_KEYWORDS) {
    if (lower.includes(kw)) {
      return { priority: 'medium', priorityReason: `Product interest: "${kw}"` };
    }
  }

  // CIP LOW: FAQ-only interactions
  return { priority: 'low', priorityReason: 'FAQ-only exploration' };
}

// Calculate engagement score based on conversation metrics
function calculateEngagementScore({ totalMessages = 0, escalationCount = 0, followUpCount = 0, priority = 'low' }) {
  let score = 0;
  score += Math.min(totalMessages * 5, 40);    // Max 40 pts for messages
  score += escalationCount * 15;               // 15 pts per escalation
  score += followUpCount * 10;                 // 10 pts per follow-up
  if (priority === 'high') score += 25;
  else if (priority === 'medium') score += 10;
  return Math.min(score, 100);
}

module.exports = { classifyIntent, scorePriority, calculateEngagementScore };
