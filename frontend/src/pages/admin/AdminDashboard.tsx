import React, { useEffect, useState } from 'react';
import { Users, MessageSquare, UserCheck, Ticket, TrendingUp, Star, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { adminAPI } from '../../services/api';
import { AdminStats } from '../../types';
import { getIntentLabel } from '../../utils/helpers';

const COLORS = ['#1a3a6b', '#c9a227', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
const PRIORITY_COLORS: Record<string, string> = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

const StatCard: React.FC<{
  title: string; value: number | string; icon: React.ElementType;
  color: string; subtitle?: string;
}> = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="card flex items-center gap-4">
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
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getStats();
      setStats(res.data.data);
    } catch {
      setError('Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
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

  const intentData = (stats?.intentDistribution || []).map((d) => ({
    name: getIntentLabel(d._id),
    value: d.count,
  }));

  const priorityData = (stats?.leadsByPriority || []).map((d) => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    value: d.count,
    fill: PRIORITY_COLORS[d._id] || '#1a3a6b',
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview of Prognosis Financial AI Assistant</p>
        </div>
        <button onClick={fetchStats} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="bg-navy-500" subtitle="Unique sessions" />
        <StatCard title="Total Messages" value={stats?.totalMessages || 0} icon={MessageSquare} color="bg-blue-500" subtitle="User messages sent" />
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon={UserCheck} color="bg-green-500" subtitle="Leads captured" />
        <StatCard title="Open Tickets" value={stats?.openTickets || 0} icon={Ticket} color="bg-orange-500" subtitle="Awaiting advisor" />
        <StatCard title="High Priority Leads" value={stats?.highPriorityLeads || 0} icon={Star} color="bg-red-500" subtitle="Needs immediate attention" />
        <StatCard title="Leads Today" value={stats?.todayLeads || 0} icon={TrendingUp} color="bg-gold-500" subtitle="Captured today" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intent Distribution */}
        <div className="card">
          <h2 className="text-navy-900 font-bold text-lg mb-4">Query Intent Distribution</h2>
          {intentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={intentData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {intentData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Messages']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Lead Priority */}
        <div className="card">
          <h2 className="text-navy-900 font-bold text-lg mb-4">Leads by Priority</h2>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityData} barSize={48}>
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="value" name="Leads" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No leads yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
