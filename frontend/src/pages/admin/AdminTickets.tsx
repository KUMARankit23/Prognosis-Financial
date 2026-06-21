import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Calendar, User, MessageSquare } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdvisorTicket } from '../../types';
import { formatDate, truncate, getIntentLabel } from '../../utils/helpers';

const TICKET_STATUSES = ['open', 'assigned', 'in_progress', 'resolved', 'closed'];
const STATUS_COLORS: Record<string, string> = {
  open: 'bg-red-100 text-red-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState<AdvisorTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getTickets({ status: statusFilter || undefined, page });
      setTickets(res.data.data.tickets);
      setTotalPages(res.data.data.pagination.pages);
      setTotal(res.data.data.pagination.total);
    } catch {
      setError('Failed to load advisor tickets.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await adminAPI.updateTicket(id, { status });
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, status: status as AdvisorTicket['status'] } : t));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Advisor Tickets</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total escalation requests</p>
        </div>
        <button onClick={fetchTickets} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['', ...TICKET_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
              statusFilter === s
                ? 'bg-navy-500 border-navy-500 text-white'
                : 'border-gray-200 text-gray-600 hover:border-navy-300 hover:text-navy-600'
            }`}
          >
            {s ? s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card text-center text-red-500 py-8">{error}</div>
      ) : tickets.length === 0 ? (
        <div className="card text-center text-gray-400 py-16">No tickets found.</div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="card p-0 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === ticket._id ? null : ticket._id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-navy-600 font-mono text-xs bg-navy-50 px-2 py-0.5 rounded">
                        {ticket.ticketId}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[ticket.status]}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`badge-${ticket.priority} text-xs`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">{truncate(ticket.query, 80)}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{ticket.userName}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{getIntentLabel(ticket.intent)}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  <select
                    value={ticket.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    disabled={updatingId === ticket._id}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-navy-500 disabled:opacity-50 flex-shrink-0"
                  >
                    {TICKET_STATUSES.map((s) => (
                      <option key={s} value={s}>{s.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Expanded details */}
              {expandedId === ticket._id && (
                <div className="border-t border-gray-100 px-4 py-3 bg-gray-50 space-y-2 text-sm">
                  <p><span className="font-medium text-gray-700">Full Query:</span> <span className="text-gray-600">{ticket.query}</span></p>
                  {ticket.userPhone && <p><span className="font-medium text-gray-700">Phone:</span> <span className="text-gray-600">{ticket.userPhone}</span></p>}
                  {ticket.userEmail && <p><span className="font-medium text-gray-700">Email:</span> <span className="text-gray-600">{ticket.userEmail}</span></p>}
                  {ticket.assignedAdvisor && <p><span className="font-medium text-gray-700">Assigned To:</span> <span className="text-gray-600">{ticket.assignedAdvisor}</span></p>}
                  {ticket.resolvedAt && <p><span className="font-medium text-gray-700">Resolved:</span> <span className="text-gray-600">{formatDate(ticket.resolvedAt)}</span></p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-500 text-sm">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline py-1.5 px-3 text-sm disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-outline py-1.5 px-3 text-sm disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
