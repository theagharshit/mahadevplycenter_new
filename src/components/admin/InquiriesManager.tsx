import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/api';
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';
import { InquiryItem } from '../../types';

export const InquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [notesInput, setNotesInput] = useState('');

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error('Failed loading inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const res = await authFetch(`/api/admin/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });

      if (!res.ok) throw new Error('Failed updating inquiry status.');
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status, notes: notes ?? selectedInquiry.notes });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      const res = await authFetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed deleting inquiry.');
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      fetchInquiries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'City', 'Category', 'Quantity', 'Project Type', 'Status', 'Date', 'Message'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.phone.replace(/"/g, '""')}"`,
      `"${i.city.replace(/"/g, '""')}"`,
      `"${i.category.replace(/"/g, '""')}"`,
      `"${i.quantity.replace(/"/g, '""')}"`,
      `"${i.projectType.replace(/"/g, '""')}"`,
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
      `"${i.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mahadev_inquiries_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = (inquiries || []).filter((i) => {
    const st = (searchTerm || '').toLowerCase();
    const matchesSearch =
      (i.name || '').toLowerCase().includes(st) ||
      (i.phone || '').includes(searchTerm) ||
      (i.city || '').toLowerCase().includes(st) ||
      (i.category || '').toLowerCase().includes(st);
    const matchesStatus = selectedStatus === 'All' || i.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-400" />
            Customer Inquiries & Quote Leads
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and process quote requests submitted by builders, carpenters, and homeowners.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl border border-slate-600 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV Leads
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by customer name, phone number, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New Lead</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Main Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading customer leads...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">No customer inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Material / Quantity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filtered.map((inq) => (
                    <tr
                      key={inq.id}
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setNotesInput(inq.notes || '');
                      }}
                      className={`cursor-pointer transition ${
                        selectedInquiry?.id === inq.id
                          ? 'bg-teal-950/40 border-l-4 border-teal-500'
                          : 'hover:bg-slate-700/30'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-sm">{inq.name}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" /> {inq.phone} • {inq.city}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-teal-300">{inq.category}</p>
                        <p className="text-[11px] text-slate-400">Qty: {inq.quantity}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${
                            inq.status === 'New'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : inq.status === 'In Progress'
                              ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(inq.createdAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1">
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition"
                            title="Reply via WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Lead Inspector Drawer */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-sm">
          {selectedInquiry ? (
            <div className="space-y-5 text-xs text-slate-300">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="font-bold text-white text-base">Inquiry #{selectedInquiry.id}</h3>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">Customer Details</p>
                <p className="text-sm font-bold text-white mt-1">{selectedInquiry.name}</p>
                <p className="text-teal-400 font-mono mt-0.5">{selectedInquiry.phone}</p>
                <p className="text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> {selectedInquiry.city}
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-700/60 space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-semibold">Requested Quote Spec</p>
                <p className="font-semibold text-white">{selectedInquiry.category}</p>
                <p className="text-slate-300">Quantity: {selectedInquiry.quantity}</p>
                <p className="text-slate-400">Project Type: {selectedInquiry.projectType}</p>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold mb-1">Customer Message</p>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 italic text-slate-200">
                  "{selectedInquiry.message || 'No additional note provided.'}"
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold mb-1.5">Change Lead Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {['New', 'In Progress', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedInquiry.id, st, notesInput)}
                      className={`py-2 px-2 rounded-lg font-semibold border transition text-center text-[11px] ${
                        selectedInquiry.status === st
                          ? 'bg-teal-600 text-white border-teal-500 shadow'
                          : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-[10px] uppercase font-semibold mb-1">Internal Admin Notes</p>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Called customer on 10am, offered CenturyPly Club Prime @ Rs. 145/sq.ft..."
                  className="w-full bg-slate-900 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500 text-xs"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, selectedInquiry.status, notesInput)}
                  className="mt-2 w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-xs transition"
                >
                  Save Internal Note
                </button>
              </div>

              <div className="pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-center flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" /> Reply via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="font-semibold text-slate-300">Select an inquiry row</p>
              <p>Click any customer row to inspect quote details and send WhatsApp replies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
