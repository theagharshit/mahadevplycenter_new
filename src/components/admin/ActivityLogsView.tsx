import React, { useState } from 'react';
import { Clock, Search, ShieldCheck } from 'lucide-react';
import { CMSData } from '../../lib/cmsApi';

interface ActivityLogsViewProps {
  data: CMSData;
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = data.activityLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Admin Audit Activity Logs</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Immutable log of system logins, product edits, blog publications, and quote status updates
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search activity by action, details, admin email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-[#000d22]"
          />
        </div>
        <span className="text-xs text-zinc-500 font-semibold hidden sm:inline">
          {filteredLogs.length} Total Log Events
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Admin Operator</th>
              <th className="py-3.5 px-4">Action Type</th>
              <th className="py-3.5 px-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3.5 px-4 text-xs font-mono text-zinc-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                <td className="py-3.5 px-4">
                  <p className="font-bold text-xs text-zinc-900">{log.adminName}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">{log.adminEmail}</p>
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#000d22] text-[#f2b800] text-[11px] font-bold font-mono">
                    {log.action}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-xs text-zinc-700 leading-relaxed max-w-md">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
