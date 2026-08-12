import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, Trash2, Edit2, Key, CheckCircle, XCircle, Search, Lock } from 'lucide-react';
import { AdminUser, UserRole } from '../../types';
import { authFetch } from '../../utils/api';

export const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    role: 'editor' as UserRole,
    password: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        role: user.role,
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        name: '',
        phone: '',
        role: 'editor',
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed saving user account.');

      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to revoke and delete this admin user?')) return;
    try {
      const res = await authFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed deleting user.');
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            Admin Users & Role Access Management (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision user accounts, assign permission roles, and reset administrative credentials.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Provision Admin User
        </button>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading user accounts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
                <tr>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Active</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <p className="text-[11px] text-teal-400 font-mono">{user.email}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full border ${
                          user.role === 'super_admin'
                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                            : user.role === 'admin'
                            ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {user.active !== false ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                          <XCircle className="w-3.5 h-3.5" /> Deactivated
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Never logged in'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="p-1.5 text-slate-300 hover:text-teal-300 hover:bg-slate-700 rounded transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingUser ? 'Edit User Credentials' : 'Provision New Admin User'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Permission Level</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                >
                  <option value="editor">Editor (Products, Blogs, Catalogues)</option>
                  <option value="manager">Manager (Inquiries, Leads)</option>
                  <option value="admin">Admin (All CMS except user provision)</option>
                  <option value="super_admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-white p-2.5 rounded-lg outline-none focus:border-teal-500"
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg shadow"
                >
                  Save User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
