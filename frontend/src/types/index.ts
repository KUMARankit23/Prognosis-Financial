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
  riskProfile?: RiskProfile;
  productInterest?: ProductInterest[];
  investmentHorizon?: InvestmentHorizon;
  priority?: 'high' | 'medium' | 'low';
  priorityReason?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  followUpStatus?: 'none' | 'pending' | 'scheduled' | 'completed' | 'escalated';
  followUpCount?: number;
  followUpDate?: string;
  engagementScore?: number;
  advisorEscalationCount?: number;
  totalConversations?: number;
  lastActive?: string;
  notes?: string;
  createdAt?: string;
}

export type InvestmentGoal =
  | 'wealth_creation' | 'retirement' | 'education'
  | 'home' | 'emergency_fund' | 'tax_saving' | 'other';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive' | 'not_specified';

export type InvestmentHorizon = 'short_term' | 'medium_term' | 'long_term' | 'not_specified';

export type ProductInterest =
  | 'sip' | 'mutual_fund' | 'demat' | 'health_insurance'
  | 'term_insurance' | 'goal_planning' | 'wealth_management' | 'other';

export interface FollowUp {
  _id: string;
  leadId: string;
  sessionId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  reason: string;
  status: 'pending' | 'scheduled' | 'completed' | 'escalated' | 'cancelled';
  channel: 'call' | 'email' | 'whatsapp' | 'in_app' | 'other';
  scheduledAt?: string;
  completedAt?: string;
  assignedTo: string;
  notes: string;
  outcome: string;
  createdAt: string;
}

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
  pendingFollowUps: number;
  totalFollowUps: number;
  intentDistribution: { _id: string; count: number }[];
  leadsByPriority: { _id: string; count: number }[];
  leadsByGoal: { _id: string; count: number }[];
}

export interface GoalPlanTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  query: string;
  color: string;
}
