import React from 'react';
import { Mail, Globe, Server, Link2, FileCode, Hash, ArrowRight } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';

export default function RelationshipGraph({ graphData }) {
  const nodes = graphData?.nodes || [
    { id: "1", label: "Email Payload", type: "Email", sublabel: "Urgent Account Verification", severity: "High" },
    { id: "2", label: "Sender Domain", type: "Domain", sublabel: "paypal-verify-alert.com", severity: "Critical" },
    { id: "3", label: "Origin Hop IP", type: "IP Address", sublabel: "103.253.144.12", severity: "Critical" },
    { id: "4", label: "Relay Infrastructure", type: "Infrastructure", sublabel: "Moscow, Russia (StormHost)", severity: "High" },
    { id: "5", label: "Phishing Target URL", type: "URL", sublabel: "suspicious-login-example.com", severity: "Critical" },
    { id: "6", label: "Attachment Payload", type: "Attachment", sublabel: "Account_Verification.exe", severity: "Critical" },
    { id: "7", label: "File Fingerprint Hash", type: "File Hash", sublabel: "e3b0c44298fc1c14...", severity: "Critical" }
  ];

  const getNodeIcon = (type) => {
    switch (type) {
      case 'Email': return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'Domain': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'IP Address': return <Server className="w-4 h-4 text-orange-400" />;
      case 'Infrastructure': return <Server className="w-4 h-4 text-red-400" />;
      case 'URL': return <Link2 className="w-4 h-4 text-amber-400" />;
      case 'Attachment': return <FileCode className="w-4 h-4 text-purple-400" />;
      case 'File Hash': return <Hash className="w-4 h-4 text-emerald-400" />;
      default: return <Globe className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
            Artifact Relationship Correlation Graph
          </h3>
          <p className="text-xs text-slate-400">
            Interactive correlation graph tracing email headers to infrastructural indicators and binary payloads
          </p>
        </div>
        <span className="text-xs text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 font-mono font-bold">
          {nodes.length} Connected Artifacts
        </span>
      </div>

      {/* Structured Nodes & Edges Graph Visualization */}
      <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max py-4 px-2">
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              
              {/* Node Card */}
              <div className="bg-[#1E293B] border border-slate-700/80 rounded-xl p-3 w-48 shadow-lg space-y-2 hover:border-cyan-500/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {getNodeIcon(node.type)}
                    <span className="text-[11px] font-bold text-slate-300 font-mono uppercase">{node.type}</span>
                  </div>
                  <SeverityBadge severity={node.severity} size="small" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white truncate" title={node.label}>{node.label}</p>
                  <p className="text-[11px] text-cyan-300 font-mono truncate" title={node.sublabel}>{node.sublabel}</p>
                </div>
              </div>

              {/* Edge Arrow */}
              {idx < nodes.length - 1 && (
                <div className="flex flex-col items-center justify-center px-1 text-slate-500 font-mono text-[10px]">
                  <span className="text-[9px] text-slate-400 mb-0.5 font-sans uppercase">Correlates</span>
                  <ArrowRight className="w-4 h-4 text-cyan-500" />
                </div>
              )}

            </React.Fragment>
          ))}
        </div>
      </div>

    </div>
  );
}
