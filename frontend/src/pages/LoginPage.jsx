import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('security@company.com');
  const [password, setPassword] = useState('••••••••••••');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const userObj = {
      username: email.split('@')[0] || 'analyst',
      email: email,
      role: email.includes('employee') ? 'employee' : 'analyst',
      display_name: email.includes('employee') ? 'Corporate Employee' : 'Security Analyst'
    };
    localStorage.setItem('zetp_token', 'demo-token-jwt');
    localStorage.setItem('zetp_user', JSON.stringify(userObj));
    if (onLoginSuccess) onLoginSuccess(userObj);
    if (userObj.role === 'employee') {
      navigate('/employee');
    } else {
      navigate('/investigator');
    }
  };

  const handleDemoAccess = (role) => {
    const userObj = {
      username: role === 'employee' ? 'employee' : 'analyst',
      email: role === 'employee' ? 'employee@company.com' : 'security@company.com',
      role: role,
      display_name: role === 'employee' ? 'Corporate Employee' : 'Lead Security Analyst'
    };
    localStorage.setItem('zetp_token', 'demo-token-jwt');
    localStorage.setItem('zetp_user', JSON.stringify(userObj));
    if (onLoginSuccess) onLoginSuccess(userObj);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white font-mono tracking-wider">ZETP</h1>
          </div>
          <p className="text-gray-400 text-sm font-sans">
            AI-Powered Threat Detection, Geolocation & Forensic Intelligence
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white font-mono text-xs"
                  placeholder="security@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white font-mono text-xs"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors font-mono text-sm shadow-md"
            >
              <span>Sign In To Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-mono">
              Don't have an account? Register new user
            </span>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-800 text-gray-500 font-mono">Instant Demo Access</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/investigator"
              onClick={() => handleDemoAccess('analyst')}
              className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-center text-sm text-blue-400 font-medium transition-all flex items-center justify-center gap-2 group font-mono"
            >
              <User size={16} />
              <span>Investigator</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link
              to="/employee"
              onClick={() => handleDemoAccess('employee')}
              className="px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-center text-sm text-green-400 font-medium transition-all flex items-center justify-center gap-2 group font-mono"
            >
              <User size={16} />
              <span>Employee</span>
              <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500 font-mono">
          <p>Protected by advanced AI threat detection</p>
          <p className="mt-1">© 2026 ZETP - Zero Email Threat Portal</p>
        </div>

      </div>
    </div>
  );
}
