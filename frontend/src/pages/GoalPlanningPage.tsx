import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, GraduationCap, Shield, Home, PiggyBank, Target, ArrowRight, Info } from 'lucide-react';

const GOAL_TOPICS = [
  {
    id: 'retirement',
    title: 'Retirement Planning',
    icon: PiggyBank,
    color: 'from-purple-500 to-purple-600',
    description: 'Plan your financial independence and retire comfortably.',
    query: 'How to plan for retirement in India? What corpus do I need?',
    keyFacts: [
      'Start early — every 10 years of delay doubles the savings required',
      'Rule of thumb: Retire with 25× your annual expenses',
      'SIPs in equity funds are ideal for long-term retirement corpus',
      'Consider NPS (National Pension Scheme) for tax benefits',
      'Inflation must be factored in — ₹1 crore today ≠ ₹1 crore in 20 years',
    ],
  },
  {
    id: 'education',
    title: 'Child Education Planning',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    description: 'Secure your child\'s education with disciplined investing.',
    query: 'How to plan for child education fund in India?',
    keyFacts: [
      'Education inflation is ~10-12% per year in India',
      'Start a dedicated SIP from child\'s birth',
      'A ₹5,000/month SIP for 15 years can build ₹25+ lakh corpus',
      'Equity mutual funds are best for 10+ year education goals',
      'Consider Sukanya Samriddhi Yojana for girl child education + marriage',
    ],
  },
  {
    id: 'wealth_creation',
    title: 'Wealth Creation',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    description: 'Grow your wealth systematically through disciplined investing.',
    query: 'How to create wealth through long-term investing in India?',
    keyFacts: [
      'Power of compounding: ₹10,000/month SIP at 12% = ₹2.3 Cr in 20 years',
      'Diversify across equity, debt, and gold for balanced growth',
      'Stay invested through market cycles — time in market beats timing the market',
      'Equity mutual funds historically deliver 12-15% CAGR over long periods',
      'Review portfolio annually, not monthly — avoid emotional decisions',
    ],
  },
  {
    id: 'emergency_fund',
    title: 'Emergency Fund Planning',
    icon: Shield,
    color: 'from-orange-500 to-orange-600',
    description: 'Build a financial safety net for unexpected events.',
    query: 'How to build an emergency fund? How much should I save?',
    keyFacts: [
      'Ideal emergency fund = 6 months of monthly expenses',
      'Keep it in liquid mutual funds or savings account — NOT in equity',
      'Do this BEFORE any other investment',
      'Automate monthly transfer to emergency fund SIP',
      'Replenish immediately if you use it',
    ],
  },
  {
    id: 'home',
    title: 'Home Purchase Planning',
    icon: Home,
    color: 'from-red-500 to-red-600',
    description: 'Plan your down payment and home loan smartly.',
    query: 'How to plan for home purchase? How much down payment should I save?',
    keyFacts: [
      'Save 20-25% of home value as down payment to reduce EMI burden',
      'Use a mix of FD and debt mutual funds for 3-5 year home saving goal',
      'Home loan EMI should not exceed 30-40% of monthly income',
      'Factor in registration, stamp duty (6-8% of property value)',
      'Pre-EMI payments during construction phase must be planned',
    ],
  },
];

const GoalPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<typeof GOAL_TOPICS[0] | null>(null);

  const handleAskBot = (query: string) => {
    sessionStorage.setItem('pf_initial_query', query);
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-navy-200 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          <span className="text-white font-semibold">Goal Planning</span>
        </div>
        <div className="w-16" />
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Plan Your Financial Goals
          </h1>
          <p className="text-navy-200 text-base max-w-xl mx-auto">
            Learn about goal-based investing. Educational information only — for personalized advice, speak to our advisors.
          </p>
          <div className="inline-flex items-center gap-2 mt-3 bg-amber-500/20 border border-amber-400/30 rounded-full px-4 py-1.5">
            <Info className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-amber-200 text-xs">Educational content only. Not personalized investment advice.</span>
          </div>
        </div>

        {!selectedGoal ? (
          /* Goal Selection Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GOAL_TOPICS.map((goal) => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className={`group bg-gradient-to-br ${goal.color} p-5 rounded-2xl text-white text-left shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
                >
                  <Icon className="w-8 h-8 mb-3 opacity-90" />
                  <h3 className="font-bold text-base mb-1">{goal.title}</h3>
                  <p className="text-white/80 text-sm leading-snug">{goal.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-white/70 text-xs group-hover:text-white transition-colors">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Goal Detail View */
          <div className="animate-fade-in">
            <button onClick={() => setSelectedGoal(null)}
              className="flex items-center gap-1.5 text-navy-300 hover:text-white mb-6 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> All Goals
            </button>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${selectedGoal.color} text-white px-4 py-2 rounded-xl mb-5`}>
                <selectedGoal.icon className="w-5 h-5" />
                <span className="font-bold">{selectedGoal.title}</span>
              </div>

              <h2 className="text-navy-900 font-bold text-xl mb-2">{selectedGoal.title}</h2>
              <p className="text-gray-600 text-sm mb-5">{selectedGoal.description}</p>

              <h3 className="text-navy-800 font-semibold text-sm mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-navy-500" /> Key Educational Points
              </h3>

              <ul className="space-y-2.5 mb-6">
                {selectedGoal.keyFacts.map((fact, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-700">
                    <span className="text-navy-500 font-bold mt-0.5 flex-shrink-0">{i + 1}.</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleAskBot(selectedGoal.query)}
                  className="btn-primary flex items-center justify-center gap-2 flex-1"
                >
                  Ask AI Assistant <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleAskBot(`I want to talk to a financial advisor about ${selectedGoal.title}`)}
                  className="btn-outline flex items-center justify-center gap-2 flex-1"
                >
                  Talk to Advisor
                </button>
              </div>

              <p className="text-center text-amber-600 text-xs mt-3">
                ⚠️ This is educational information only. For personalized advice, consult our certified financial advisors.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalPlanningPage;
