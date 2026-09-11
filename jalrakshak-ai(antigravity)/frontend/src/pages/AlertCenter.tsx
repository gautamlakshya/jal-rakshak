import { useState } from 'react';
import { Copy, Check, ShieldAlert } from 'lucide-react';

const XML_PAYLOAD = `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>JRAI-FL-2026-09-11-001</identifier>
  <sender>ndma.gov.in</sender>
  <sent>2026-09-11T14:30:00+05:30</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>Met</category>
    <event>Flash Flood Warning</event>
    <responseType>Evacuate</responseType>
    <urgency>Immediate</urgency>
    <severity>Extreme</severity>
    <certainty>Observed</certainty>
    <headline>Critical Flash Flood Warning for Singtam</headline>
    <description>Teesta river stage has exceeded Bankfull Capacity (8.5m). Severe inundation expected in Singtam low-lying areas. ST-GNN propagation models predict peak surge in 15 mins.</description>
    <instruction>Evacuate immediately to higher ground. Follow official channels.</instruction>
    <area>
      <areaDesc>Singtam, Sikkim</areaDesc>
      <polygon>27.25,88.48 27.25,88.52 27.21,88.51 27.21,88.47 27.25,88.48</polygon>
    </area>
  </info>
</alert>`;

const localizedMessages = {
  English: {
    headline: "Critical Flash Flood Warning for Singtam",
    desc: "Teesta river stage has exceeded Bankfull Capacity (8.5m). Severe inundation expected in Singtam low-lying areas.",
    action: "Evacuate immediately to higher ground."
  },
  Hindi: {
    headline: "सिंगताम के लिए गंभीर अचानक बाढ़ की चेतावनी",
    desc: "तीस्ता नदी का जलस्तर खतरे के निशान (8.5m) को पार कर गया है। सिंगताम के निचले इलाकों में भारी जलभराव की आशंका है।",
    action: "तुरंत ऊंचे स्थानों पर चले जाएं।"
  },
  Assamese: {
    headline: "সিংটামৰ বাবে গুৰুতৰ বানপানীৰ সতৰ্কবাণী",
    desc: "টিষ্টা নদীৰ জলস্তৰ বিপদসীমা (৮.৫ মিটাৰ) অতিক্ৰম কৰিছে। সিংটামৰ নামনি অঞ্চলত প্ৰবল বানপানীৰ আশংকা।",
    action: "লগে লগে ওখ ঠাইলৈ যাওক।"
  }
};

type Language = 'English' | 'Hindi' | 'Assamese';

export const AlertCenter = () => {
  const [lang, setLang] = useState<Language>('English');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(XML_PAYLOAD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const msg = localizedMessages[lang];

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-6">NDMA CAP v1.2 Broadcast Center</h2>
      
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Left Pane: Formatted UI */}
        <div className="bg-surface border border-slate-700 rounded-lg flex flex-col shadow-lg overflow-hidden">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold flex items-center"><ShieldAlert className="text-red-500 mr-2" /> Broadcast Preview</h3>
            <div className="flex space-x-2">
              {(['English', 'Hindi', 'Assamese'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${lang === l ? 'bg-blue-600 font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  {l === 'Hindi' ? 'हिन्दी' : l === 'Assamese' ? 'অসমীয়া' : l}
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-6 flex-1 flex items-center justify-center bg-slate-900/50">
            <div className="bg-red-900/20 border-l-4 border-red-500 p-6 rounded max-w-md w-full shadow-lg">
              <div className="flex items-center space-x-2 text-red-500 font-bold mb-4">
                <ShieldAlert size={24} />
                <span className="uppercase tracking-wider">Emergency Alert</span>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{msg.headline}</h4>
              <p className="text-slate-300 mb-4">{msg.desc}</p>
              <div className="bg-red-950 p-3 rounded border border-red-900 text-red-200 font-semibold">
                ACTION REQUIRED: {msg.action}
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: XML Payload */}
        <div className="bg-[#0d1117] border border-slate-700 rounded-lg flex flex-col shadow-lg overflow-hidden">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-slate-300 font-mono text-sm">OASIS CAP v1.2 XML Payload</h3>
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-1 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              <span>{copied ? 'Copied' : 'Copy Payload'}</span>
            </button>
          </div>
          <div className="p-4 overflow-auto flex-1">
            <pre className="text-emerald-400 text-sm font-mono whitespace-pre-wrap">
              {XML_PAYLOAD}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
