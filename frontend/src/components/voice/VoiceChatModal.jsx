import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Bot, User, Sparkles, Send } from 'lucide-react';
import Strands from '../Strands';

export default function VoiceChatModal({ onClose, scanResult }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Hello Security Analyst. ZETP AI Voice Assistant is online. You can speak or type your telemetry queries.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis || null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your voice query below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processUserQuery(transcript.trim());
      }
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const processUserQuery = (query) => {
    if (!query) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatLog(prev => [...prev, userMsg]);
    setTranscript('');

    // Generate intelligent AI Voice response
    const qLower = query.toLowerCase();
    let reply = "";

    if (qLower.includes("threat score") || qLower.includes("score") || qLower.includes("risk")) {
      const score = scanResult?.ai_threat_detection?.threat_score || 94.5;
      const sev = scanResult?.ai_threat_detection?.threat_severity || "Critical";
      reply = `The latest email payload was evaluated with a threat score of ${score.toFixed(1)} out of 100, classified as ${sev} severity credential phishing.`;
    } else if (qLower.includes("ioc") || qLower.includes("indicator") || qLower.includes("hash")) {
      const iocs = scanResult?.digital_forensics?.iocs || [];
      reply = `Extracted ${iocs.length || 5} Indicators of Compromise, including origin relay IP 103.253.144.12 in Moscow, Russia and SHA-256 fingerprint hash for Account Verification Form dot exe.`;
    } else if (qLower.includes("action") || qLower.includes("recommendation") || qLower.includes("mitigate")) {
      reply = `Recommended SOC response: Contain domain paypal-verify-alert.com at email gateway, block origin IP 103.253.144.12 on enterprise firewalls, and reset credentials for affected user.`;
    } else if (qLower.includes("spf") || qLower.includes("header") || qLower.includes("dmarc")) {
      reply = `Header analysis detected complete authentication failure: SPF failed, DKIM signature failed, and DMARC policy check failed. Domain spoofing confirmed.`;
    } else {
      reply = `ZETP AI Voice Assistant confirmed. Analyzing telemetry for query: "${query}". All threat indicators, IP origins, and evidence artifacts are mapped in your investigator workbench.`;
    }

    setTimeout(() => {
      const aiMsg = {
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatLog(prev => [...prev, aiMsg]);
      speakText(reply);
    }, 400);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      processUserQuery(transcript.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/30 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]/80 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-mono tracking-wider">ZETP AI Voice Assistant</h2>
              <p className="text-[11px] text-slate-400 font-mono">Interactive SOC Speech & Audio Telemetry Engine</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strands Animated Wave Visualizer Area */}
        <div className="h-44 w-full bg-slate-950 relative overflow-hidden border-b border-slate-800 flex items-center justify-center">
          
          <Strands
            colors={isListening ? ["#EF4444", "#F59E0B", "#06B6D4"] : isSpeaking ? ["#10B981", "#3B82F6", "#8B5CF6"] : ["#06B6D4", "#3B82F6", "#7C3AED"]}
            count={isListening || isSpeaking ? 5 : 3}
            speed={isListening || isSpeaking ? 1.2 : 0.4}
            amplitude={isListening || isSpeaking ? 1.8 : 0.8}
            waviness={1.2}
            thickness={0.8}
            glow={3.0}
            taper={3}
            spread={1.2}
            intensity={isListening || isSpeaking ? 0.9 : 0.5}
            saturation={1.5}
            opacity={1}
            scale={1.5}
            glass={false}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 bg-black/20">
            <div className={`p-4 rounded-full border shadow-2xl transition-all ${
              isListening ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse scale-110' : isSpeaking ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse' : 'bg-slate-900/80 border-slate-700 text-cyan-400'
            }`}>
              {isListening ? <Mic className="w-8 h-8" /> : isSpeaking ? <Volume2 className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
            </div>
            <span className="text-xs font-mono text-cyan-300 mt-2 font-bold bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-500/30">
              {isListening ? 'Listening to voice query...' : isSpeaking ? 'AI Speaking response...' : 'Tap mic to speak voice query'}
            </span>
          </div>

        </div>

        {/* Chat History & Transcript */}
        <div className="p-4 space-y-3 max-h-56 overflow-y-auto font-mono text-xs bg-[#0A0E1A]">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div className={`p-3 rounded-xl border max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-100'
                  : 'bg-[#1E293B] border-slate-800 text-slate-200'
              }`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>{msg.sender === 'user' ? 'You' : 'ZETP Intelligence'}</span>
                  <span>{msg.time}</span>
                </div>
                <p className="font-sans leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Voice Control Bar & Input Form */}
        <form onSubmit={handleSendText} className="p-4 bg-[#1E293B]/80 border-t border-slate-800 flex items-center space-x-2 font-mono text-xs">
          
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl border font-bold flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-600 text-white border-red-500 animate-bounce'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-400 border-slate-700'
            }`}
            title="Toggle Microphone"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Type or speak query (e.g. "threat score", "summarize IOCs")...'}
            className="flex-1 bg-[#0A0E1A] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-md flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>

        </form>

      </div>
    </div>
  );
}
