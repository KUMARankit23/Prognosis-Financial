import { v4 as uuidv4 } from 'uuid';

export const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem('pf_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('pf_session_id', sessionId);
  }
  return sessionId;
};

export const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim()
    .substring(0, 2000);
};

export const getIntentLabel = (intent: string): string => {
  const labels: Record<string, string> = {
    sip_query: 'SIP',
    mutual_fund_query: 'Mutual Fund',
    demat_query: 'Demat',
    insurance_query: 'Insurance',
    goal_planning_query: 'Goal Planning',
    wealth_creation_query: 'Wealth Creation',
    general_query: 'General',
    advisor_escalation: 'Advisor Escalation',
    greeting: 'Greeting',
  };
  return labels[intent] || intent;
};

export const getInvestmentGoalLabel = (goal: string): string => {
  const labels: Record<string, string> = {
    wealth_creation: 'Wealth Creation',
    retirement: 'Retirement Planning',
    education: 'Education Fund',
    home: 'Home Purchase',
    emergency_fund: 'Emergency Fund',
    tax_saving: 'Tax Saving',
    other: 'Other',
  };
  return labels[goal] || goal;
};

export const truncate = (str: string, max: number): string => {
  return str.length > max ? str.substring(0, max) + '…' : str;
};
