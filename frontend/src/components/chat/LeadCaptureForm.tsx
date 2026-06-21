import React, { useState } from 'react';
import { User, Phone, Mail, Target, ArrowRight, X } from 'lucide-react';
import { leadAPI } from '../../services/api';
import { InvestmentGoal } from '../../types';
import { sanitizeInput } from '../../utils/helpers';

interface Props {
  sessionId: string;
  onComplete: (data: { name: string; phone: string; email: string; investmentGoal: InvestmentGoal }) => void;
  onSkip?: () => void;
}

const GOALS: { value: InvestmentGoal; label: string }[] = [
  { value: 'wealth_creation', label: 'Wealth Creation' },
  { value: 'retirement', label: 'Retirement Planning' },
  { value: 'education', label: 'Child Education' },
  { value: 'home', label: 'Home Purchase' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'tax_saving', label: 'Tax Saving' },
  { value: 'other', label: 'Other' },
];

const LeadCaptureForm: React.FC<Props> = ({ sessionId, onComplete, onSkip }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', investmentGoal: 'other' as InvestmentGoal });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<typeof form> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');

    try {
      await leadAPI.create({
        sessionId,
        name: sanitizeInput(form.name),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        investmentGoal: form.investmentGoal,
      });
      onComplete({
        name: form.name,
        phone: form.phone,
        email: form.email,
        investmentGoal: form.investmentGoal,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setApiError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mx-2 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-navy-900 font-bold text-lg">Let's get to know you</h3>
          <p className="text-gray-500 text-sm mt-0.5">To personalize your experience and connect you with the right advisor</p>
        </div>
        {onSkip && (
          <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        {/* Name */}
        <div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`input-field pl-10 ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
              maxLength={100}
              autoComplete="name"
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              placeholder="Mobile Number (10 digits)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').substring(0, 10) })}
              className={`input-field pl-10 ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
              autoComplete="tel"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1 pl-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1 pl-1">{errors.email}</p>}
        </div>

        {/* Investment Goal */}
        <div>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={form.investmentGoal}
              onChange={(e) => setForm({ ...form, investmentGoal: e.target.value as InvestmentGoal })}
              className="input-field pl-10 appearance-none bg-white"
            >
              {GOALS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-red-600 text-sm">
            {apiError}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <span className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          ) : (
            <>Continue <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </form>

      <p className="text-center text-gray-400 text-xs mt-3">
        🔒 Your information is secure and will never be shared without consent.
      </p>
    </div>
  );
};

export default LeadCaptureForm;
