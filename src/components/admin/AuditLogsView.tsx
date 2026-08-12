import React, { useState, useEffect } from 'react';
import { Activity, Search, Download, Clock, ShieldAlert, Filter } from 'lucide-react';
import { AuditLog } from '../../types';
import { authFetch } from '../../utils/api';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    authFetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.activityLogs || []);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleExportCSV = () => {
    const headers = ['ID', 'User Email', 'User Name', 'Role', 'Action', 'Details', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      l.userEmail,
      `"${l.userName.replace(/"/g, '""')}"`,
      l.userRole,
      l.action,
      `"${l.details.replace(/"/g, '""')}"`,
      l.timestamp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mahadev_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = (logs || []).filter((l) => {
    const st = (searchTerm || '').toLowerCase();
    return (
      (l.userEmail || '').toLowerCase().includes(st) ||
      (l.userName || '').toLowerCase().includes(st) ||
      (l.action || '').toLowerCase().includes(st) ||
      (l.details || '').toLowerCase().includes(st)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-400" />
            Security & System Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable trace of administrative actions, user logins, data updates, and security events.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV Logs
        </button>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit logs by action, email, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading audit trail...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No activity matching filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Details</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 font-mono text-[11px]">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4 font-sans">
                      <p className="font-bold text-white text-xs">{log.userName}</p>
                      <p className="text-[10px] text-teal-400">{log.userEmail}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans text-slate-300">{log.details}</td>

                    <td className="py-3 px-4 text-slate-400 font-sans text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
