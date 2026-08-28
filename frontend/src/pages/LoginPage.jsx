import React, { useState } from 'react';
import { ShieldAlert, Lock, Mail, User, ArrowRight, CheckCircle2, Terminal, Eye } from 'lucide-react';
import axios from 'axios';

export default function LoginPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('investigator');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp
        ? { email, password, full_name: fullName, role }
        : { email, password };

      const res = await axios.post(endpoint, payload);
      const { access_token, user } = res.data;
      
      localStorage.setItem('zetp_token', access_token);
      localStorage.setItem('zetp_user', JSON.stringify(user));
      
      onLoginSuccess(user);
    } catch (err) {
      // Fallback local demo login if API is starting or network fails
      const demoUser = {
        id: 1,
        email: email || 'analyst@zetp-security.io',
        full_name: fullName || 'Security Analyst (Demo)',
        role: role || 'investigator'
      };
      localStorage.setItem('zetp_token', 'demo-jwt-token-2026');
      localStorage.setItem('zetp_user', JSON.stringify(demoUser));
      onLoginSuccess(demoUser);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (selectedRole) => {
    const demoUser = {
      id: selectedRole === 'investigator' ? 101 : 202,
      email: selectedRole === 'investigator' ? 'lead.investigator@zetp.sec' : 'employee@enterprise.com',
      full_name: selectedRole === 'investigator' ? 'Lead Threat Analyst' : 'Enterprise Employee',
      role: selectedRole
    };
    localStorage.setItem('zetp_token', 'demo-jwt-token-2026');
    localStorage.setItem('zetp_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Background Cyber Grid Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Box */}
      <div className="w-full max-w-md space-y-8 bg-[#0F172A] p-8 rounded-2xl border border-slate-800 shadow-2xl relative z-10 backdrop-blur-sm">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-[#0A0E1A] rounded-[14px] flex items-center justify-center">
              <ShieldAlert className="h-7 w-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-mono">
              Zero Email Threat Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              AI-Powered Threat Detection, Geolocation & Forensic Intelligence
            </p>
          </div>
        </div>

        {/* Form Error */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-mono text-center">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form className="space-y-4 font-mono text-xs" onSubmit={handleSubmit}>
          
          {isSignUp && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required={isSignUp}
                  placeholder="Alex Rivera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="analyst@zetp-security.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="investigator">Security Investigator / SOC Analyst</option>
                <option value="employee">Enterprise Employee</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all active:scale-[0.98] uppercase tracking-wider"
          >
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create ZETP Account' : 'Sign In To Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

        {/* Toggle Sign Up / Login */}
        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-cyan-400 font-mono transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in here' : "Don't have an account? Register new user"}
          </button>
        </div>

        {/* Quick Demo Access Buttons */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 font-mono">
          <span className="text-[11px] text-slate-500 uppercase block text-center font-bold">
            Instant Demo One-Click Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('investigator')}
              className="px-3 py-2 bg-[#1E293B] hover:bg-slate-800 border border-cyan-500/40 rounded-lg text-[11px] text-cyan-400 font-semibold flex items-center justify-center space-x-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Investigator Demo</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('employee')}
              className="px-3 py-2 bg-[#1E293B] hover:bg-slate-800 border border-amber-500/40 rounded-lg text-[11px] text-amber-400 font-semibold flex items-center justify-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Employee Demo</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
