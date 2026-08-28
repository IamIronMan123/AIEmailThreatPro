import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ShieldAlert, AlertTriangle, CheckCircle, Flame, Cpu } from 'lucide-react';

export default function AIThreatScoreGauge({ threatData }) {
  const {
    threat_score = 0,
    threat_risk = 'LOW',
    phishing_probability = 0,
    spam_probability = 0,
    legitimate_probability = 100,
    suspicious_indicators = []
  } = threatData || {};

  const probChartData = [
    { name: 'Phishing', value: phishing_probability, color: '#EF4444' },
    { name: 'Spam', value: spam_probability, color: '#F59E0B' },
    { name: 'Legitimate', value: legitimate_probability, color: '#10B981' },
  ];

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Module Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            AI Threat Detection & Classification
          </h2>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border font-mono font-bold tracking-wider ${getRiskBadgeColor(threat_risk)}`}>
          RISK: {threat_risk}
        </span>
      </div>

      {/* Main Threat Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Threat Score Metric Gauge */}
        <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-xs uppercase font-mono text-slate-400 mb-1">Overall Threat Score</span>
          <div className="relative flex items-center justify-center my-2">
            <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
              {threat_score.toFixed(1)}
              <span className="text-sm font-normal text-slate-400"> / 100</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-700 ${
                threat_score >= 80 ? 'bg-red-500' : threat_score >= 50 ? 'bg-orange-500' : threat_score >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${threat_score}%` }}
            />
          </div>
        </div>

        {/* Probability Breakdown (Phish / Spam / Legit) */}
        <div className="col-span-2 bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
          <span className="text-xs uppercase font-mono text-slate-400 block mb-3">AI Probability Matrix</span>
          
          <div className="space-y-2.5">
            {/* Phishing */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-red-400 font-semibold flex items-center">
                  <Flame className="w-3.5 h-3.5 mr-1" /> Phishing Probability
                </span>
                <span className="text-red-400 font-bold">{phishing_probability}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${phishing_probability}%` }} />
              </div>
            </div>

            {/* Spam */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-400 font-semibold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Spam Probability
                </span>
                <span className="text-amber-400 font-bold">{spam_probability}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${spam_probability}%` }} />
              </div>
            </div>

            {/* Legitimate */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-semibold flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Legitimate Probability
                </span>
                <span className="text-emerald-400 font-bold">{legitimate_probability}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${legitimate_probability}%` }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Suspicious Indicators Panel */}
      <div className="bg-[#161F32] p-4 rounded-xl border border-slate-800">
        <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center">
          <ShieldAlert className="w-4 h-4 text-cyan-400 mr-2" />
          Suspicious Indicators Triggered ({suspicious_indicators.length})
        </h3>
        <ul className="space-y-1.5 font-mono text-xs">
          {suspicious_indicators.map((ind, idx) => (
            <li key={idx} className="flex items-start text-slate-300 bg-[#0F172A] p-2 rounded border border-slate-800/80">
              <span className="text-cyan-400 font-bold mr-2">›</span>
              <span>{ind}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
