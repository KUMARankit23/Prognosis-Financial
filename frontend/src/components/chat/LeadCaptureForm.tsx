import React, { useState } from 'react';
import { User, Phone, Mail, Target, Shield, Clock, ArrowRight, X } from 'lucide-react';
import { leadAPI } from '../../services/api';
import { InvestmentGoal, RiskProfile, InvestmentHorizon } from '../../types';
import { sanitizeInput } from '../../utils/helpers';

interface Props {
  sessionId: string;
  onComplete: (data: { name: string; phone: string; email: string; investmentGoal: InvestmentGoal }) => void;
  onSkip?: () => void;
}

const GOALS: { value: InvestmentGoal; label: string }[] = [
  { value: 'wealth_creation', label: '💰 Wealth Creation' },
  { value: 'retirement', label: '🏖️ Retirement Planning' },
  { value: 'education', label: '🎓 Child Education' },
  { value: 'home', label: '🏠 Home Purchase' },
  { value: 'emergency_fund', label: '🛡️ Emergency Fund' },
  { value: 'tax_saving', label: '📊 Tax Saving' },
  { value: 'other', label: '📌 Other' },
];

const RISK_PROFILES: { value: RiskProfile; label: string }[] = [
  { value: 'conservative', label: '🟢 Conservative — Safety first' },
  { value: 'moderate', label: '🟡 Moderate — Balanced approach' },
  { value: 'aggressive', label: '🔴 Aggressive — High growth' },
  { value: 'not_specified', label: '❓ Not sure yet' },
];

const HORIZONS: { value: InvestmentHorizon; label: string }[] = [
  { value: 'short_term', label: 'Short Term (< 3 years)' },
  { value: 'medium_term', label: 'Medium Term (3–7 years)' },
  { value: 'long_term', label: 'Long Term (7+ years)' },
  { value: 'not_specified', label: 'Not decided yet' },
];

const LeadCaptureForm: React.FC<Props> = ({ sessionId, onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    investmentGoal: 'other' as InvestmentGoal,
    riskProfile: 'not_specified' as RiskProfile,
    investmentHorizon: 'not_specified' as InvestmentHorizon,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    try {
      await leadAPI.create({
        sessionId,
        name: sanitizeInput(form.name),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        investmentGoal: form.investmentGoal,
        riskProfile: form.riskProfile,
        investmentHorizon: form.investmentHorizon,
      });
      onComplete({ name: form.name, phone: form.phone, email: form.email, investmentGoal: form.investmentGoal });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 mx-2 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-navy-900 font-bold text-base">
            {step === 1 ? "Let's get to know you" : 'Your Investment Profile'}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">Step {step} of 2 • Takes 30 seconds</p>
        </div>
        {onSkip && (
          <button onClick={onSkip} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-5">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-navy-500' : 'bg-gray-100'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          {/* Name */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Your Full Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input-field pl-10 text-sm ${errors.name ? 'border-red-400' : ''}`} maxLength={100} />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" placeholder="Mobile Number (10 digits)" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').substring(0, 10) })}
                className={`input-field pl-10 text-sm ${errors.phone ? 'border-red-400' : ''}`} />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1 pl-1">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" placeholder="Email Address" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`input-field pl-10 text-sm ${errors.email ? 'border-red-400' : ''}`} />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
          </div>

          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Investment Goal */}
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
              <Target className="w-3.5 h-3.5" /> Investment Goal
            </label>
            <select value={form.investmentGoal} onChange={(e) => setForm({ ...form, investmentGoal: e.target.value as InvestmentGoal })}
              className="input-field text-sm bg-white">
              {GOALS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {/* Risk Profile */}
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
              <Shield className="w-3.5 h-3.5" /> Risk Profile
            </label>
            <select value={form.riskProfile} onChange={(e) => setForm({ ...form, riskProfile: e.target.value as RiskProfile })}
              className="input-field text-sm bg-white">
              {RISK_PROFILES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {/* Investment Horizon */}
          <div>
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5" /> Investment Horizon
            </label>
            <select value={form.investmentHorizon} onChange={(e) => setForm({ ...form, investmentHorizon: e.target.value as InvestmentHorizon })}
              className="input-field text-sm bg-white">
              {HORIZONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-xs">{apiError}</div>
          )}

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 text-sm py-2">Back</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
              {loading ? '...' : <><ArrowRight className="w-4 h-4" /> Save</>}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-gray-400 text-xs mt-3">🔒 Your data is secure and never shared without consent.</p>
    </div>
  );
};

export default LeadCaptureForm;
