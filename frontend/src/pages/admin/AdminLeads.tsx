import React, { useEffect, useState, useCallback } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, Phone, Mail, Calendar } from 'lucide-react';
import { leadAPI } from '../../services/api';
import { Lead } from '../../types';
import { formatDate, getInvestmentGoalLabel, truncate } from '../../utils/helpers';

const PRIORITY_FILTER_OPTIONS = ['', 'high', 'medium', 'low'];
const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost'];

const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await leadAPI.getAll({ priority: priority || undefined, page, search: search || undefined });
      setLeads(res.data.data.leads);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch {
      setError('Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [priority, page, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchLeads(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await leadAPI.update(id, { status });
      setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status: status as Lead['status'] } : l));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Leads</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total leads captured</p>
        </div>
        <button onClick={fetchLeads} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          className="input-field py-2 text-sm w-full sm:w-44"
        >
          <option value="">All Priorities</option>
          {PRIORITY_FILTER_OPTIONS.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card text-center text-red-500 py-8">{error}</div>
      ) : leads.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">No leads found.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Contact</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Goal</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Priority</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-navy-800">{truncate(lead.name, 24)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 text-gray-600"><Phone className="w-3 h-3" />{lead.phone}</span>
                      <span className="flex items-center gap-1 text-gray-500 text-xs"><Mail className="w-3 h-3" />{truncate(lead.email, 22)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getInvestmentGoalLabel(lead.investmentGoal)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge-${lead.priority || 'medium'}`}>
                      {(lead.priority || 'medium').charAt(0).toUpperCase() + (lead.priority || 'medium').slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status || 'new'}
                      onChange={(e) => lead._id && handleStatusChange(lead._id, e.target.value)}
                      disabled={updatingId === lead._id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(lead.createdAt || new Date().toISOString())}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1 px-3 text-sm disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1 px-3 text-sm disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminLeads;
