import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, Key, Trash2, X, AlertTriangle } from 'lucide-react';
import { CMSData, cmsApi, AdminUser } from '../../lib/cmsApi';

interface AdminUsersManagerProps {
  data: CMSData;
  currentUser: any;
  onRefreshData: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  data,
  currentUser,
  onRefreshData,
  onShowToast,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'super_admin' | 'editor',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'editor' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingUser) {
        await cmsApi.updateUser(editingUser.id, {
          name: formData.name,
          role: formData.role,
          password: formData.password || undefined,
        });
        onShowToast(`Updated user account for "${formData.name}"`);
      } else {
        if (!formData.email || !formData.password || !formData.name) {
          alert('Name, Email, and Password are required.');
          setIsSaving(false);
          return;
        }
        await cmsApi.createUser(formData);
        onShowToast(`Created new admin account for "${formData.email}"`);
      }
      setIsModalOpen(false);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed saving user account.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete administrator "${email}"?`)) return;
    try {
      await cmsApi.deleteUser(id);
      onShowToast(`Deleted admin user "${email}"`);
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Failed deleting admin user.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Admin Team Accounts</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage administrator accounts, roles (Super Admin vs Editor), and security credentials
          </p>
        </div>

        {currentUser?.role === 'super_admin' && (
          <button
            onClick={handleOpenAdd}
            className="bg-[#000d22] hover:bg-[#0b2240] text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#f2b800]" />
            <span>Create New Admin</span>
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-xs font-bold text-zinc-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Admin Name</th>
              <th className="py-3.5 px-4">Email Address</th>
              <th className="py-3.5 px-4">Role Permission</th>
              <th className="py-3.5 px-4">Last Login</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {data.users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/60 transition-colors">
                <td className="py-3.5 px-4 font-bold text-zinc-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#000d22] text-[#f2b800] flex items-center justify-center text-xs font-black">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>

                <td className="py-3.5 px-4 text-xs font-mono text-zinc-600">{u.email}</td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'super_admin'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {u.role === 'super_admin' ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Super Administrator</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Content Editor</span>
                      </>
                    )}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-xs text-zinc-500 font-mono">
                  {u.lastLogin
                    ? new Date(u.lastLogin).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Never'}
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 text-zinc-600 hover:text-[#000d22] hover:bg-zinc-100 rounded-lg cursor-pointer"
                      title="Edit User or Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    {currentUser?.role === 'super_admin' && u.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-zinc-200 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-lg font-bold text-zinc-900">
                {editingUser ? `Manage Account: ${editingUser.name}` : 'Create New Administrator'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Bimal Maharjan"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              {!editingUser && (
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="editor@mahadevply.com"
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  {editingUser ? 'New Password (leave blank to keep unchanged)' : 'Password *'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Role Permission</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="editor">Content Editor (Manage Products, Blogs, Quotes)</option>
                  <option value="super_admin">Super Administrator (Full System Control)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#000d22] text-white font-bold rounded-xl"
                >
                  {isSaving ? 'Saving...' : 'Save User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
