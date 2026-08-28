import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Globe, ShieldAlert, Server } from 'lucide-react';

// Custom Leaflet Markers with Cyber colors
const createCustomIcon = (reputation, hopIndex) => {
  let colorClass = 'bg-cyan-500 border-cyan-300';
  if (reputation === 'CRITICAL' || reputation === 'MALICIOUS') {
    colorClass = 'bg-red-500 border-red-300 animate-bounce';
  } else if (reputation === 'SUSPICIOUS') {
    colorClass = 'bg-amber-500 border-amber-300';
  }

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="h-7 w-7 rounded-full ${colorClass} border-2 text-white font-mono text-xs font-bold flex items-center justify-center shadow-lg">
             ${hopIndex}
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export default function GeolocationMap({ geoData }) {
  const hops = geoData?.hops || [];

  // Filter hops with valid coordinates
  const validHops = hops.filter(h => typeof h.latitude === 'number' && typeof h.longitude === 'number');
  const polylineCoords = validHops.map(h => [h.latitude, h.longitude]);

  const defaultCenter = validHops.length > 0 ? [validHops[0].latitude, validHops[0].longitude] : [35.0, 10.0];

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            Geolocation Intelligence & Transmission Route
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {validHops.length} Transmission Hops Resolved
        </span>
      </div>

      {/* Map Container */}
      <div className="h-72 w-full rounded-xl overflow-hidden border border-slate-800 relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={2}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', backgroundColor: '#0F172A' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Connect hops with polyline */}
          {polylineCoords.length > 1 && (
            <Polyline
              positions={polylineCoords}
              color="#06B6D4"
              weight={2.5}
              dashArray="6, 8"
            />
          )}

          {/* Render Hop Markers */}
          {validHops.map((hop, idx) => (
            <Marker
              key={idx}
              position={[hop.latitude, hop.longitude]}
              icon={createCustomIcon(hop.threat_reputation, hop.hop_index)}
            >
              <Popup>
                <div className="p-1 font-mono text-xs text-slate-200 space-y-1">
                  <div className="font-bold text-cyan-400 border-b border-slate-700 pb-1 flex justify-between">
                    <span>Hop #{hop.hop_index}: {hop.ip_address}</span>
                  </div>
                  <p><span className="text-slate-400">Location:</span> {hop.city}, {hop.country}</p>
                  <p><span className="text-slate-400">ISP:</span> {hop.isp}</p>
                  <p><span className="text-slate-400">Reputation:</span> <span className={`font-bold ${hop.threat_reputation==='CRITICAL'?'text-red-400':hop.threat_reputation==='SUSPICIOUS'?'text-amber-400':'text-emerald-400'}`}>{hop.threat_reputation}</span></p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Threat Intel Sources Hop Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {validHops.slice(0, 3).map((hop, idx) => (
          <div key={idx} className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
              <span className="flex items-center">
                <Server className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Hop #{hop.hop_index} ({hop.ip_address})
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                hop.threat_reputation === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {hop.threat_reputation}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">{hop.city}, {hop.country}</p>
            <p className="text-slate-400 text-[11px] truncate">{hop.isp}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
