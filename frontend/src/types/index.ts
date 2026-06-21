export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  intent?: string;
  escalated?: boolean;
  timestamp: Date;
  ticket?: { ticketId: string; status: string } | null;
}

export interface Lead {
  _id?: string;
  sessionId: string;
  name: string;
  phone: string;
  email: string;
  investmentGoal: InvestmentGoal;
  priority?: 'high' | 'medium' | 'low';
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt?: string;
}

export type InvestmentGoal =
  | 'wealth_creation'
  | 'retirement'
  | 'education'
  | 'home'
  | 'emergency_fund'
  | 'tax_saving'
  | 'other';

export interface AdvisorTicket {
  _id: string;
  ticketId: string;
  sessionId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  query: string;
  intent: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  assignedAdvisor: string;
  notes: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalMessages: number;
  totalLeads: number;
  openTickets: number;
  highPriorityLeads: number;
  todayLeads: number;
  intentDistribution: { _id: string; count: number }[];
  leadsByPriority: { _id: string; count: number }[];
}

export interface ChatContextType {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  leadCaptured: boolean;
  sendMessage: (message: string) => Promise<void>;
  setLeadCaptured: (value: boolean) => void;
}

export interface QuickAction {
  label: string;
  icon: string;
  category: string;
  query: string;
}
