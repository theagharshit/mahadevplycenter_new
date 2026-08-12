import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';
import { Logo } from '../Logo';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to authenticate.');
      }

      if (data.token) {
        localStorage.setItem('admin_token', data.token);
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#775a19]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#000d22]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back Button */}
      <button
        onClick={onBackToWebsite}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-[#000d22] font-medium hover:text-[#775a19] transition-colors bg-white px-4 py-2 rounded-xl border border-[#c4c6cf] shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Storefront
      </button>

      <div className="w-full max-w-md bg-white border border-[#e5e2e1] rounded-2xl shadow-xl p-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-[#fcf9f8] border border-[#e5e2e1] rounded-2xl mb-4">
            <Logo variant="full" className="h-10" />
          </div>
          <h1 className="text-2xl font-bold text-[#000d22] tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#775a19]" />
            Admin CMS Portal
          </h1>
          <p className="text-sm text-[#43474e] mt-1">
            Mahadev Ply Center Central Control System
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#43474e] mb-2">
              Email Address / Username
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mahadevply.com"
                className="w-full bg-white border border-[#c4c6cf] text-[#1c1b1b] pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-[#000d22] focus:border-transparent text-sm outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#43474e] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white border border-[#c4c6cf] text-[#1c1b1b] pl-11 pr-11 py-3 rounded-xl focus:ring-2 focus:ring-[#000d22] focus:border-transparent text-sm outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#000d22]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#43474e]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#c4c6cf] text-[#000d22] focus:ring-[#000d22]"
              />
              Keep me signed in
            </label>
            <span className="text-[#775a19] hover:underline cursor-pointer">Security Policy</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000d22] hover:bg-[#002349] text-white font-medium py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5 text-[#e9c176]" />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e5e2e1] text-center text-xs text-slate-400">
          Protected by Enterprise Session & Audit Logging
        </div>
      </div>
    </div>
  );
};
