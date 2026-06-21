import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, UserCheck, Ticket, TrendingUp, Star, RefreshCw, Bell, Target } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/api';
import { AdminStats } from '../../types';
import { getIntentLabel, getInvestmentGoalLabel } from '../../utils/helpers';

const COLORS = ['#1a3a6b', '#c9a227', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const PRIORITY_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

const StatCard: React.FC<{
  title: string; value: number | string; icon: React.ElementType;
  color: string; subtitle?: string; highlight?: boolean;
}> = ({ title, value, icon: Icon, color, subtitle, highlight }) => (
  <div className={`card flex items-center gap-4 ${highlight ? 'ring-2 ring-red-200' : ''}`}>
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-navy-900 text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true); setError('');
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch { setError('Failed to load dashboard stats.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-red-500">{error}</p>
      <button onClick={fetchStats} className="btn-primary">Retry</button>
    </div>
  );

  const intentData = (stats?.intentDistribution || []).map((d) => ({ name: getIntentLabel(d._id), value: d.count }));
  const priorityData = (stats?.leadsByPriority || []).map((d) => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1), value: d.count,
    fill: PRIORITY_COLORS[d._id] || '#1a3a6b',
  }));
  const goalData = (stats?.leadsByGoal || []).slice(0, 6).map((d) => ({
    name: getInvestmentGoalLabel(d._id).split(' ')[0], value: d.count,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">CIP — Prognosis Financial AI Assistant Overview</p>
        </div>
        <button onClick={fetchStats} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-navy-500" subtitle="Unique sessions" />
        <StatCard title="Total Messages" value={stats?.totalMessages || 0} icon={MessageSquare} color="bg-blue-500" subtitle="User messages sent" />
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={UserCheck} color="bg-green-500" subtitle="Leads captured" />
        <StatCard title="Open Tickets" value={stats?.openTickets || 0} icon={Ticket} color="bg-orange-500" subtitle="Awaiting advisor" highlight={(stats?.openTickets || 0) > 5} />
      </div>

      {/* Stat Cards Row 2 — CIP Additions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard title="High Priority Leads" value={stats?.highPriorityLeads || 0} icon={Star} color="bg-red-500" subtitle="Needs immediate attention" highlight={(stats?.highPriorityLeads || 0) > 0} />
        <StatCard title="Pending Follow-Ups" value={stats?.pendingFollowUps || 0} icon={Bell} color="bg-yellow-500" subtitle="Awaiting action" />
        <StatCard title="Leads Today" value={stats?.todayLeads || 0} icon={TrendingUp} color="bg-gold-500" subtitle="Captured today" />
      </div>

      {/* CIP Priority Compliance Banner */}
      {(stats?.highPriorityLeads || 0) > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-3 flex items-center gap-3 mb-6">
          <Star className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-red-700 font-semibold text-sm">
              {stats?.highPriorityLeads} High Priority Lead{(stats?.highPriorityLeads || 0) > 1 ? 's' : ''} need immediate attention
            </p>
            <p className="text-red-500 text-xs">These include retirement planning, wealth creation, and large investment queries.</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intent Distribution */}
        <div className="card">
          <h2 className="text-navy-900 font-bold text-base mb-4">Query Intent Distribution</h2>
          {intentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={intentData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {intentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [v, 'Messages']} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data yet</div>}
        </div>

        {/* Lead Priority */}
        <div className="card">
          <h2 className="text-navy-900 font-bold text-base mb-4">Lead Priority (CIP)</h2>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={priorityData} barSize={40}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No leads yet</div>}
        </div>

        {/* Goals Distribution */}
        <div className="card">
          <h2 className="text-navy-900 font-bold text-base mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-navy-500" /> Investment Goals
          </h2>
          {goalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={goalData} barSize={32} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={70} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" fill="#1a3a6b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No goal data yet</div>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
