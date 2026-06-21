import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Calendar, User, Phone } from 'lucide-react';
import { followUpAPI } from '../../services/api';
import { FollowUp } from '../../types';
import { formatDate, getFollowUpStatusColor, truncate } from '../../utils/helpers';

const STATUS_OPTIONS = ['pending', 'scheduled', 'completed', 'escalated', 'cancelled'];

const AdminFollowUps: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await followUpAPI.getAll({ status: statusFilter || undefined, page });
      setFollowUps(res.data.data.followUps);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch {
      setError('Failed to load follow-ups.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await followUpAPI.update(id, { status });
      setFollowUps((prev) => prev.map((f) => f._id === id ? { ...f, status: status as FollowUp['status'] } : f));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Follow-Up Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total follow-up requests</p>
        </div>
        <button onClick={fetchFollowUps} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['', ...STATUS_OPTIONS].map((s) => (
          <button key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              statusFilter === s ? 'bg-navy-500 border-navy-500 text-white' : 'border-gray-200 text-gray-600 hover:border-navy-300 hover:text-navy-600'
            }`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card text-center text-red-500 py-8">{error}</div>
      ) : followUps.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">No follow-ups found.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Reason</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Channel</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Scheduled</th>
                <th className="text-left px-4 py-3 text-gray-500 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {followUps.map((fu) => (
                <tr key={fu._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1 font-medium text-navy-800">
                        <User className="w-3 h-3" />{truncate(fu.userName, 20)}
                      </span>
                      {fu.userPhone && (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <Phone className="w-3 h-3" />{fu.userPhone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{truncate(fu.reason || 'Customer requested callback', 40)}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-gray-600">{fu.channel}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={fu.status}
                      onChange={(e) => handleStatusChange(fu._id, e.target.value)}
                      disabled={updatingId === fu._id}
                      className={`text-xs px-2 py-1 rounded-full font-medium border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:opacity-50 ${getFollowUpStatusColor(fu.status)}`}>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {fu.scheduledAt ? formatDate(fu.scheduledAt) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Calendar className="w-3 h-3" />{formatDate(fu.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

export default AdminFollowUps;
