import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Shield, Target, PiggyBank,
  BarChart2, UserCheck, ArrowRight, Star, CheckCircle
} from 'lucide-react';

const quickActions = [
  { label: 'SIP Information', icon: TrendingUp, color: 'from-blue-500 to-blue-600', query: 'What is SIP and how does it work?' },
  { label: 'Mutual Funds', icon: BarChart2, color: 'from-indigo-500 to-indigo-600', query: 'Explain mutual funds to me' },
  { label: 'Demat Account', icon: PiggyBank, color: 'from-purple-500 to-purple-600', query: 'How do I open a Demat account?' },
  { label: 'Insurance', icon: Shield, color: 'from-green-500 to-green-600', query: 'Explain health and term insurance' },
  { label: 'Goal Planning', icon: Target, color: 'from-orange-500 to-orange-600', goal: true },
  { label: 'Talk to Advisor', icon: UserCheck, color: 'from-gold-500 to-yellow-600', query: 'I want to talk to a financial advisor' },
];

const features = [
  'Instant answers to financial queries',
  'SIP & Mutual Fund education',
  'Insurance product guidance',
  'Goal-based investment concepts',
  'Escalation to certified advisors',
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: { query?: string; goal?: boolean }) => {
    if (action.goal) {
      navigate('/goal-planning');
      return;
    }
    if (action.query) {
      sessionStorage.setItem('pf_initial_query', action.query);
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Prognosis Financial</h1>
            <p className="text-gold-300 text-xs">Wealth Management</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin/login')}
          className="text-navy-200 hover:text-white text-sm transition-colors duration-200"
        >
          Admin
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-400/30 rounded-full px-4 py-1.5 mb-6">
          <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
          <span className="text-gold-300 text-xs font-medium">AI-Powered Financial Assistant</span>
        </div>

        {/* Main Title */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
          AI Financial
          <span className="text-gold-400 block">Assistant</span>
        </h2>

        <p className="text-navy-200 text-lg md:text-xl mb-8 max-w-2xl leading-relaxed">
          Instant answers for your investment-related queries. Learn about SIPs, Mutual Funds,
          Insurance, and more — powered by AI.
        </p>

        {/* Features list */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-navy-200 text-sm">
              <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
          {quickActions.map(({ label, icon: Icon, color, query, goal }) => (
            <button
              key={label}
              onClick={() => handleQuickAction({ query, goal })}
              className={`group bg-gradient-to-br ${color} p-4 rounded-2xl text-white text-left shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95`}
            >
              <Icon className="w-7 h-7 mb-2 opacity-90" />
              <p className="font-semibold text-sm leading-snug">{label}</p>
              <ArrowRight className="w-4 h-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/chat')}
          className="btn-gold text-base px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-gold-500/30 transition-all duration-200"
        >
          Start a Conversation
          <ArrowRight className="w-5 h-5 ml-2 inline-block" />
        </button>

        <p className="text-navy-300 text-xs mt-4">
          Free • No login required • SEBI compliant guidelines
        </p>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-navy-400 text-xs">
        © 2024 Prognosis Financial. AI responses are for informational purposes only.{' '}
        <span className="text-gold-500">Not personalized financial advice.</span>
      </footer>
    </div>
  );
};

export default LandingPage;
