import React, { useState } from 'react';
import { Globe, Server, ShieldAlert, Activity, Info, MapPin } from 'lucide-react';
import GeolocationMap from '../components/GeolocationMap';
import SeverityBadge from '../components/common/SeverityBadge';

export default function GeolocationModule({ scanResult }) {
  const geoData = scanResult?.geolocation_intelligence || {};
  const hops = geoData.hops || [
    { hop_index: 1, ip_address: '103.253.144.12', country: 'Russia', city: 'Moscow', latitude: 55.7558, longitude: 37.6173, isp: 'StormHost High-Risk Infrastructure', asn: 'AS205100', threat_score: 98, threat_reputation: 'CRITICAL', timestamp: '27 Aug 2026 14:20 UTC' },
    { hop_index: 2, ip_address: '185.220.101.5', country: 'Germany', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, isp: 'Tor Exit Relay Network', asn: 'AS62240', threat_score: 84, threat_reputation: 'MALICIOUS', timestamp: '27 Aug 2026 14:20 UTC' },
    { hop_index: 3, ip_address: '209.85.220.41', country: 'United States', city: 'Mountain View, CA', latitude: 37.4056, longitude: -122.0775, isp: 'Google Gateway LLC', asn: 'AS15169', threat_score: 2, threat_reputation: 'CLEAN', timestamp: '27 Aug 2026 14:22 UTC' }
  ];

  const [selectedIp, setSelectedIp] = useState(hops[0] || {});

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white font-mono tracking-wide">Geolocation Intelligence</h1>
        <p className="text-xs text-slate-400">Analyze IP addresses, observed infrastructure locations and email transmission paths</p>
      </div>

      {/* Main Geolocation Dark Map */}
      <GeolocationMap geoData={{ hops }} />

      {/* Transmission Route Timeline Below Map */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-100 font-mono flex items-center">
            <Server className="w-4 h-4 text-cyan-400 mr-2" />
            Transmission Route & Observed Infrastructure Hops
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Note: Locations represent observed relay infrastructure, not physical attacker identity.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {hops.map((hop, i) => (
            <div
              key={i}
              onClick={() => setSelectedIp(hop)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedIp.ip_address === hop.ip_address
                  ? 'bg-slate-800 border-cyan-500 shadow-lg'
                  : 'bg-[#1E293B]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-bold">Hop #{hop.hop_index}</span>
                <SeverityBadge severity={hop.threat_reputation === 'CRITICAL' ? 'Critical' : hop.threat_reputation === 'MALICIOUS' ? 'High' : 'Low'} size="small" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">{hop.ip_address}</p>
                <p className="text-slate-300 font-sans text-xs mt-0.5">{hop.city}, {hop.country}</p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 space-y-0.5">
                <p><span className="text-slate-500">ISP:</span> {hop.isp}</p>
                <p><span className="text-slate-500">ASN:</span> {hop.asn || 'AS205100'}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Selected IP Intelligence Detail Inspector */}
      {selectedIp && (
        <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center">
              <Globe className="w-4 h-4 text-cyan-400 mr-2" />
              IP Infrastructure Telemetry: {selectedIp.ip_address}
            </h3>
            <span className="text-xs font-mono text-cyan-400">Abuse Confidence: 94%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Observed Location</span>
              <p className="text-slate-200 font-bold">{selectedIp.city}, {selectedIp.country}</p>
            </div>
            <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">ASN / Network</span>
              <p className="text-slate-200 font-bold">{selectedIp.asn || 'AS205100'}</p>
            </div>
            <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Hosting Provider / ISP</span>
              <p className="text-slate-200 font-bold truncate">{selectedIp.isp}</p>
            </div>
            <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase">Reputation Status</span>
              <p className="text-red-400 font-bold">{selectedIp.threat_reputation}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
