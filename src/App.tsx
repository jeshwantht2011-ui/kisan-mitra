import { useState, useRef, useEffect } from 'react';

// ══════════════════════════════════════
// 🔑 PASTE YOUR FREE GEMINI KEY HERE
// Get FREE at: aistudio.google.com
const API_KEY = '';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

// ── GEMINI AI CALL ──
const callAI = async (
  system: string,
  userContent: string,
  langLabel = 'English'
): Promise<string> => {
  try {
    const fullPrompt = `IMPORTANT: You MUST reply only in ${langLabel} language. No other language allowed.\n\n${system}\n\nUser: ${userContent}`;
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error('Gemini error:', err);
      return `⚠️ API Error: ${
        err?.error?.message || 'Check your API key at aistudio.google.com'
      }`;
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || '⚠️ No response from AI. Please try again.';
  } catch (e) {
    console.error(e);
    return '⚠️ Network error. Check internet connection.';
  }
};

// ── DATA ──
const crops = [
  {
    name: 'Rice',
    emoji: '🌾',
    cardColor: '#E3F2FD',
    border: '#1565C0',
    fertilizer: 'Urea + DAP (3 splits)',
    water: 'High',
    temp: '20–35°C',
    rainfall: '1000–2000 mm/year',
    soil: 'Clay / Loamy',
    sow: 'Jun–Jul',
    harvest: 'Oct–Nov',
    duration: '120–150 days',
    costPerAcre: 12000,
    revenuePerAcre: 28000,
  },
  {
    name: 'Maize',
    emoji: '🌽',
    cardColor: '#E8F5E9',
    border: '#2E7D32',
    fertilizer: 'NPK 14-35-14',
    water: 'Medium',
    temp: '18–27°C',
    rainfall: '500–800 mm/year',
    soil: 'Sandy Loam',
    sow: 'Jun–Jul',
    harvest: 'Sep–Oct',
    duration: '90–110 days',
    costPerAcre: 8000,
    revenuePerAcre: 18000,
  },
  {
    name: 'Cotton',
    emoji: '🌿',
    cardColor: '#F3E5F5',
    border: '#6A1B9A',
    fertilizer: 'NPK 12-32-16',
    water: 'Medium',
    temp: '21–35°C',
    rainfall: '600–1200 mm/year',
    soil: 'Black/Alluvial',
    sow: 'Apr–May',
    harvest: 'Nov–Jan',
    duration: '150–180 days',
    costPerAcre: 15000,
    revenuePerAcre: 32000,
  },
  {
    name: 'Soybean',
    emoji: '🫘',
    cardColor: '#FFF8E1',
    border: '#F57F17',
    fertilizer: 'Rhizobium + SSP',
    water: 'Medium',
    temp: '20–30°C',
    rainfall: '600–1000 mm/year',
    soil: 'Loamy',
    sow: 'Jun–Jul',
    harvest: 'Sep–Oct',
    duration: '90–110 days',
    costPerAcre: 7000,
    revenuePerAcre: 15000,
  },
  {
    name: 'Wheat',
    emoji: '🌻',
    cardColor: '#FBE9E7',
    border: '#BF360C',
    fertilizer: 'DAP + Urea',
    water: 'Low–Medium',
    temp: '10–25°C',
    rainfall: '300–600 mm/year',
    soil: 'Loamy/Clay',
    sow: 'Nov–Dec',
    harvest: 'Mar–Apr',
    duration: '100–120 days',
    costPerAcre: 9000,
    revenuePerAcre: 20000,
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    cardColor: '#E0F2F1',
    border: '#00695C',
    fertilizer: 'NPK 10-26-26 + Urea',
    water: 'Very High',
    temp: '24–38°C',
    rainfall: '1500–2500 mm/year',
    soil: 'Deep Loamy',
    sow: 'Feb–Mar',
    harvest: 'Dec–Feb',
    duration: '270–365 days',
    costPerAcre: 25000,
    revenuePerAcre: 60000,
  },
  {
    name: 'Potato',
    emoji: '🥔',
    cardColor: '#EFEBE9',
    border: '#4E342E',
    fertilizer: 'NPK 15-15-15 + Potash',
    water: 'Medium',
    temp: '10–20°C',
    rainfall: '400–600 mm/year',
    soil: 'Sandy Loam',
    sow: 'Oct–Nov',
    harvest: 'Jan–Feb',
    duration: '70–90 days',
    costPerAcre: 30000,
    revenuePerAcre: 55000,
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    cardColor: '#FFEBEE',
    border: '#C62828',
    fertilizer: 'DAP + MOP + Micro',
    water: 'Medium',
    temp: '18–27°C',
    rainfall: '600–1200 mm/year',
    soil: 'Sandy Loam',
    sow: 'Jun–Jul / Oct–Nov',
    harvest: 'Sep–Oct / Jan–Feb',
    duration: '60–80 days',
    costPerAcre: 35000,
    revenuePerAcre: 70000,
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    cardColor: '#F9FBE7',
    border: '#827717',
    fertilizer: 'SSP + Gypsum',
    water: 'Low–Medium',
    temp: '25–35°C',
    rainfall: '500–1000 mm/year',
    soil: 'Sandy Loam/Red',
    sow: 'Jun–Jul',
    harvest: 'Sep–Oct',
    duration: '100–120 days',
    costPerAcre: 10000,
    revenuePerAcre: 22000,
  },
  {
    name: 'Mustard',
    emoji: '🌼',
    cardColor: '#FFFDE7',
    border: '#F9A825',
    fertilizer: 'DAP + Sulphur + Boron',
    water: 'Low',
    temp: '10–25°C',
    rainfall: '250–500 mm/year',
    soil: 'Loamy/Sandy',
    sow: 'Oct–Nov',
    harvest: 'Feb–Mar',
    duration: '90–110 days',
    costPerAcre: 6000,
    revenuePerAcre: 14000,
  },
  {
    name: 'Chickpea',
    emoji: '🟡',
    cardColor: '#F1F8E9',
    border: '#558B2F',
    fertilizer: 'SSP + Rhizobium',
    water: 'Low',
    temp: '15–25°C',
    rainfall: '300–500 mm/year',
    soil: 'Sandy/Loam',
    sow: 'Oct–Nov',
    harvest: 'Jan–Mar',
    duration: '90–110 days',
    costPerAcre: 5500,
    revenuePerAcre: 12000,
  },
  {
    name: 'Onion',
    emoji: '🧅',
    cardColor: '#FCE4EC',
    border: '#880E4F',
    fertilizer: 'NPK 15-15-15 + Sulphur',
    water: 'Medium',
    temp: '13–24°C',
    rainfall: '650–750 mm/year',
    soil: 'Sandy Loam',
    sow: 'Oct–Nov / Feb–Mar',
    harvest: 'Jan–Feb / May–Jun',
    duration: '90–120 days',
    costPerAcre: 18000,
    revenuePerAcre: 40000,
  },
];

const CROP_CONTEXT = crops
  .map(
    (c) =>
      `${c.name}: fertilizer=${c.fertilizer}, water=${c.water}, temp=${c.temp}, rainfall=${c.rainfall}, soil=${c.soil}, sow=${c.sow}, harvest=${c.harvest}`
  )
  .join('\n');

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', mic: 'en-IN' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳', mic: 'hi-IN' },
  { code: 'mr', label: 'मराठी', flag: '🟠', mic: 'mr-IN' },
  { code: 'ta', label: 'தமிழ்', flag: '🟡', mic: 'ta-IN' },
  { code: 'te', label: 'తెలుగు', flag: '🔵', mic: 'te-IN' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🟢', mic: 'gu-IN' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🟣', mic: 'pa-IN' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🔴', mic: 'kn-IN' },
];

const TABS = [
  { id: 'crops', icon: '🌱', label: 'Crops' },
  { id: 'ai', icon: '🤖', label: 'AI Chat' },
  { id: 'doctor', icon: '👨‍⚕️', label: 'Doctor' },
  { id: 'market', icon: '📈', label: 'Market' },
  { id: 'weather', icon: '🌦️', label: 'Weather' },
  { id: 'calendar', icon: '📅', label: 'Calendar' },
  { id: 'profit', icon: '📊', label: 'Profit' },
  { id: 'disease', icon: '🐛', label: 'Disease' },
  { id: 'soil', icon: '🧪', label: 'Soil Test' },
  { id: 'scheme', icon: '🏛️', label: 'Schemes' },
];

const waterColor: Record<string, string> = {
  Low: '#2E7D32',
  'Low–Medium': '#388E3C',
  Medium: '#1565C0',
  High: '#0277BD',
  'Very High': '#01579B',
};

// ── CROP CARDS ──
function CropCards({ list }: { list: typeof crops }) {
  const [exp, setExp] = useState<number | null>(null);
  return (
    <>
      {list.map((c, i) => {
        const open = exp === i;
        return (
          <div
            key={i}
            onClick={() => setExp(open ? null : i)}
            style={{
              background: c.cardColor,
              borderLeft: `6px solid ${c.border}`,
              borderRadius: 12,
              padding: '14px 16px',
              marginBottom: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div
                style={{ fontSize: 18, fontWeight: 'bold', color: '#1b5e20' }}
              >
                {c.emoji} {c.name}
              </div>
              <span style={{ color: '#888' }}>{open ? '▲' : '▼'}</span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginTop: 8,
              }}
            >
              <span
                style={{
                  background: '#fff3e0',
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontSize: 11,
                  color: '#e65100',
                  fontWeight: 'bold',
                }}
              >
                🟠 {c.fertilizer}
              </span>
              <span
                style={{
                  background: '#e3f2fd',
                  borderRadius: 20,
                  padding: '3px 10px',
                  fontSize: 11,
                  color: waterColor[c.water] || '#1565c0',
                  fontWeight: 'bold',
                }}
              >
                💧 {c.water}
              </span>
            </div>
            {open && (
              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {(
                  [
                    ['🌡️', 'TEMP', c.temp, '#FFF3E0', '#BF360C'],
                    ['🌧️', 'RAINFALL', c.rainfall, '#E3F2FD', '#0277BD'],
                    ['🪱', 'SOIL', c.soil, '#F1F8E9', '#33691E'],
                    ['🌱', 'SOW', c.sow, '#F3E5F5', '#6A1B9A'],
                    ['🌾', 'HARVEST', c.harvest, '#FFF8E1', '#F57F17'],
                  ] as string[][]
                ).map(([ic, lb, vl, bg, col], j) => (
                  <div
                    key={j}
                    style={{
                      background: bg,
                      borderRadius: 10,
                      padding: '9px 13px',
                      flex: '1 1 120px',
                    }}
                  >
                    <div
                      style={{ fontSize: 10, color: col, fontWeight: 'bold' }}
                    >
                      {ic} {lb}
                    </div>
                    <div style={{ fontSize: 12, color: '#333', marginTop: 3 }}>
                      {vl}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

const WELCOME: Record<string, string> = {
  en: '🙏 Jai Kisan! Ask me anything about crops, soil, fertilizer or farming!',
  hi: '🙏 जय किसान! फसल, मिट्टी, खाद या खेती के बारे में कुछ भी पूछो!',
  mr: '🙏 जय शेतकरी! पीक, माती, खते किंवा शेतीबद्दल काहीही विचारा!',
  ta: '🙏 வணக்கம்! பயிர், மண், உரம் பற்றி எதுவும் கேளுங்கள்!',
  te: '🙏 జై కిసాన్! పంట, మట్టి, ఎరువు గురించి ఏదైనా అడగండి!',
  gu: '🙏 જય કિસાન! પાક, જમીન, ખાતર વિશે કંઈ પણ પૂછો!',
  pa: '🙏 ਜੈ ਕਿਸਾਨ! ਫ਼ਸਲ, ਮਿੱਟੀ, ਖਾਦ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ!',
  kn: '🙏 ಜೈ ಕಿಸಾನ್! ಬೆಳೆ, ಮಣ್ಣು, ಗೊಬ್ಬರದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ!',
};

const PLACEHOLDER: Record<string, string> = {
  en: 'Ask about crops...',
  hi: 'फसल के बारे में पूछो...',
  mr: 'पिकाबद्दल विचारा...',
  ta: 'பயிர் பற்றி கேளுங்கள்...',
  te: 'పంట గురించి అడగండి...',
  gu: 'પાક વિશે પૂછો...',
  pa: 'ਫ਼ਸਲ ਬਾਰੇ ਪੁੱਛੋ...',
  kn: 'ಬೆಳೆ ಬಗ್ಗೆ ಕೇಳಿ...',
};

const SEND_BTN: Record<string, string> = {
  en: 'Send 🚀',
  hi: 'भेजो 🚀',
  mr: 'पाठवा 🚀',
  ta: 'அனுப்பு 🚀',
  te: 'పంపు 🚀',
  gu: 'મોકલો 🚀',
  pa: 'ਭੇਜੋ 🚀',
  kn: 'ಕಳುಹಿಸಿ 🚀',
};

const THINKING: Record<string, string> = {
  en: '🌱 Thinking...',
  hi: '🌱 सोच रहा हूं...',
  mr: '🌱 विचार करतोय...',
  ta: '🌱 யோசிக்கிறேன்...',
  te: '🌱 ఆలోచిస్తున్నాను...',
  gu: '🌱 વિચારું છું...',
  pa: '🌱 ਸੋਚ ਰਿਹਾ ਹਾਂ...',
  kn: '🌱 ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ...',
};

const SUGGESTIONS: Record<string, string[]> = {
  en: [
    'Crop for black soil?',
    'Low rainfall crop?',
    'Rice fertilizer?',
    'Best crop at 30°C?',
  ],
  hi: [
    'काली मिट्टी के लिए फसल?',
    'कम बारिश में फसल?',
    'धान की खाद?',
    '30°C पर फसल?',
  ],
  mr: [
    'काळ्या मातीसाठी पीक?',
    'कमी पावसात पीक?',
    'भाताची खते?',
    '30°C ला पीक?',
  ],
  ta: [
    'கருப்பு மண்ணுக்கு பயிர்?',
    'குறைந்த மழைக்கு பயிர்?',
    'நெல் உரம்?',
    '30°C க்கு பயிர்?',
  ],
  te: [
    'నల్ల మట్టికి పంట?',
    'తక్కువ వర్షానికి పంట?',
    'వరి ఎరువు?',
    '30°C కి పంట?',
  ],
  gu: ['કાળી જમીન માટે પાક?', 'ઓછા વરસાદ માટે?', 'ડાંગર ખાતર?', '30°C પર પાક?'],
  pa: [
    'ਕਾਲੀ ਮਿੱਟੀ ਲਈ ਫ਼ਸਲ?',
    'ਘੱਟ ਮੀਂਹ ਫ਼ਸਲ?',
    'ਝੋਨੇ ਦੀ ਖਾਦ?',
    '30°C ਤੇ ਫ਼ਸਲ?',
  ],
  kn: [
    'ಕಪ್ಪು ಮಣ್ಣಿಗೆ ಬೆಳೆ?',
    'ಕಡಿಮೆ ಮಳೆಗೆ ಬೆಳೆ?',
    'ಭತ್ತದ ಗೊಬ್ಬರ?',
    '30°C ಗೆ ಬೆಳೆ?',
  ],
};

// ── AI CHAT ──
function AiChat({ lang }: { lang: string }) {
  const langObj = LANGUAGES.find((l) => l.code === lang)!;
  const [msgs, setMsgs] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [micErr, setMicErr] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // Reset chat & show welcome in correct language when lang changes
  useEffect(() => {
    setMsgs([{ role: 'assistant', text: WELCOME[lang] || WELCOME.en }]);
    setInput('');
  }, [lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  const startMic = () => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      setMicErr('Mic not supported.');
      return;
    }
    const rec = new SR();
    rec.lang = langObj.mic;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e: any) => {
      setListening(false);
      setMicErr('Mic: ' + e.error);
    };
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recRef.current = rec;
    rec.start();
  };

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    const updated = [...msgs, { role: 'user', text: q }];
    setMsgs(updated);
    setInput('');
    setLoading(true);
    const history = updated
      .filter((m, i) => !(m.role === 'assistant' && i === 0))
      .map((m) => `${m.role === 'user' ? 'Farmer' : 'Kisan Mitra'}: ${m.text}`)
      .join('\n');
    const system = `You are Kisan Mitra, a friendly AI assistant for Indian farmers. You MUST reply in ${langObj.label} language only. Use emojis. Be warm and practical.\n\nCROP DATABASE:\n${CROP_CONTEXT}\n\nConversation so far:\n${history}\n\nNow reply as Kisan Mitra in ${langObj.label}:`;
    const reply = await callAI(system, q, langObj.label);
    setMsgs((p) => [...p, { role: 'assistant', text: reply }]);
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '10px 14px',
          background: '#f9fbe7',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: '#558B2F',
            fontWeight: 'bold',
            marginBottom: 6,
          }}
        >
          💡
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(SUGGESTIONS[lang] || SUGGESTIONS.en).map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              style={{
                background: '#e8f5e9',
                border: '1px solid #a5d6a7',
                borderRadius: 20,
                padding: '3px 10px',
                fontSize: 11,
                cursor: 'pointer',
                color: '#2e7d32',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
      <div
        style={{
          height: 300,
          overflowY: 'auto',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              gap: 6,
            }}
          >
            {m.role === 'assistant' && (
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  background: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                🌾
              </div>
            )}
            <div
              style={{
                maxWidth: '78%',
                padding: '9px 13px',
                borderRadius:
                  m.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                background:
                  m.role === 'user'
                    ? 'linear-gradient(135deg,#2e7d32,#4caf50)'
                    : '#f1f8e9',
                color: m.role === 'user' ? 'white' : '#1b5e20',
                fontSize: 13,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.role === 'assistant' && (
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: 10,
                    marginBottom: 3,
                    color: '#558B2F',
                  }}
                >
                  🤖 Kisan Mitra
                </div>
              )}
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 6 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              🌾
            </div>
            <div
              style={{
                background: '#f1f8e9',
                borderRadius: '18px 18px 18px 4px',
                padding: '9px 14px',
                color: '#558B2F',
                fontSize: 13,
              }}
            >
              {THINKING[lang] || THINKING.en}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {micErr && (
        <div
          style={{
            background: '#ffebee',
            color: '#c62828',
            fontSize: 11,
            padding: '4px 14px',
            textAlign: 'center',
          }}
        >
          {micErr}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '10px',
          borderTop: '1px solid #e0e0e0',
          background: '#fafafa',
          alignItems: 'center',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder={
            listening ? '🎤...' : PLACEHOLDER[lang] || PLACEHOLDER.en
          }
          style={{
            flex: 1,
            padding: '9px 13px',
            borderRadius: 24,
            border: `2px solid ${listening ? '#f44336' : '#a5d6a7'}`,
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={
            listening
              ? () => {
                  recRef.current?.stop();
                  setListening(false);
                }
              : startMic
          }
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: listening ? '#f44336' : '#e8f5e9',
            color: listening ? 'white' : '#2e7d32',
            fontSize: 17,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {listening ? '⏹' : '🎤'}
        </button>
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background:
              loading || !input.trim()
                ? '#ccc'
                : 'linear-gradient(135deg,#2e7d32,#4caf50)',
            color: 'white',
            border: 'none',
            borderRadius: 24,
            padding: '9px 14px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 12,
            flexShrink: 0,
          }}
        >
          {SEND_BTN[lang] || SEND_BTN.en}
        </button>
      </div>
    </div>
  );
}

// ── KISAN DOCTOR ──
function KisanDoctor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const questions = [
    {
      key: 'crop',
      q: 'Which crop is affected?',
      opts: crops.map((c) => c.emoji + ' ' + c.name),
    },
    {
      key: 'part',
      q: 'Which part of the plant?',
      opts: [
        '🌿 Leaves',
        '🌱 Stem',
        '🌸 Flowers',
        '🍎 Fruit/Grain',
        '🪴 Roots',
        '🌾 Whole plant',
      ],
    },
    {
      key: 'symptom',
      q: 'What do you see?',
      opts: [
        '🟡 Yellowing',
        '🟤 Brown spots',
        '⬛ Black patches',
        '🔴 Red/Purple',
        '💧 Wilting',
        '🍂 Drying',
        '🐛 Insects/Holes',
        '🍄 White powder',
      ],
    },
    {
      key: 'spread',
      q: 'How fast is it spreading?',
      opts: [
        '🐢 Slow (weeks)',
        '⚡ Fast (days)',
        '🔵 Only 1-2 plants',
        '🌊 Most of field',
      ],
    },
  ];
  const diagnose = async () => {
    setLoading(true);
    setResult('');
    const prompt = `You are Dr. Kisan, expert plant pathologist for Indian farms.\nCrop: ${answers.crop}, Affected part: ${answers.part}, Symptoms: ${answers.symptom}, Spread: ${answers.spread}.\nGive: 1)Disease name & cause 2)Severity 3)Immediate treatment 4)Organic remedy 5)Chemical remedy 6)Prevention. Use emojis.`;
    setResult(await callAI('', prompt));
    setLoading(false);
  };

  if (result)
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 14,
          padding: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            👨‍⚕️
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1b5e20' }}>
              Dr. Kisan's Diagnosis
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>
              AI Plant Doctor Report
            </div>
          </div>
        </div>
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 16,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            marginBottom: 14,
          }}
        >
          {result}
        </div>
        <button
          onClick={() => {
            setStep(0);
            setAnswers({});
            setResult('');
          }}
          style={{
            width: '100%',
            padding: 12,
            background: '#e8f5e9',
            color: '#2e7d32',
            border: 'none',
            borderRadius: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          🔄 New Diagnosis
        </button>
      </div>
    );

  if (step < questions.length) {
    const q = questions[step];
    return (
      <div
        style={{
          background: 'white',
          borderRadius: 14,
          padding: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}
          >
            👨‍⚕️
          </div>
          <div>
            <div style={{ fontWeight: 'bold', color: '#1b5e20' }}>
              Dr. Kisan
            </div>
            <div style={{ fontSize: 11, color: '#888' }}>AI Plant Doctor</div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              background: '#e8f5e9',
              borderRadius: 20,
              padding: '4px 12px',
              fontSize: 11,
              color: '#2e7d32',
              fontWeight: 'bold',
            }}
          >
            Step {step + 1}/{questions.length}
          </div>
        </div>
        <div
          style={{
            background: '#f9fbe7',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 16,
            fontSize: 15,
            fontWeight: 'bold',
            color: '#1b5e20',
          }}
        >
          🩺 {q.q}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => {
                setAnswers((p) => ({ ...p, [q.key]: opt }));
                setStep((s) => s + 1);
              }}
              style={{
                padding: '9px 14px',
                background: '#f1f8e9',
                border: '2px solid #a5d6a7',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 13,
                color: '#1b5e20',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 50, marginBottom: 10 }}>👨‍⚕️</div>
      <div
        style={{
          fontWeight: 'bold',
          color: '#1b5e20',
          fontSize: 16,
          marginBottom: 6,
        }}
      >
        Ready to Diagnose!
      </div>
      <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
        {Object.entries(answers).map(([k, v]) => (
          <div key={k}>✅ {v}</div>
        ))}
      </div>
      <button
        onClick={diagnose}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontWeight: 'bold',
          fontSize: 15,
          cursor: 'pointer',
        }}
      >
        {loading ? '🔬 Diagnosing...' : '🩺 Get Diagnosis'}
      </button>
    </div>
  );
}

// ── MARKET PRICES ──
function MarketPrices() {
  const [location, setLocation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const d = await r.json();
          setLocation(
            `${
              d.address?.city ||
              d.address?.town ||
              d.address?.village ||
              'your area'
            }, ${d.address?.state || 'India'}`
          );
        } catch {
          setLocation('India');
        }
        setLocLoading(false);
      },
      () => {
        setLocation('India');
        setLocLoading(false);
      }
    );
  };

  const fetchPrices = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setResult('');
    setResult(
      await callAI(
        'You are a market price expert for Indian agriculture. Give realistic current mandi prices.',
        `Give current mandi prices for major crops near ${location}. Include Rice, Wheat, Tomato, Onion, Cotton, Maize, Soybean, Potato, Mustard. Format: crop name, price per quintal in rupees, trend (↑↓→), best nearby mandi to sell.`
      )
    );
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 4px', color: '#1b5e20' }}>
        📈 Market Prices Near You
      </h3>
      <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px' }}>
        Get mandi rates & best selling locations
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city / district..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #a5d6a7',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          onClick={getLocation}
          disabled={locLoading}
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            border: '2px solid #a5d6a7',
            background: '#f1f8e9',
            cursor: 'pointer',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {locLoading ? '⏳' : '📍'}
        </button>
      </div>
      <button
        onClick={fetchPrices}
        disabled={loading || !location.trim()}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 14,
        }}
      >
        {loading ? '📊 Fetching...' : '🔍 Get Market Prices'}
      </button>
      {result && (
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 16,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>
            ⚠️ AI estimates. Verify at local mandi before selling.
          </div>
          {result}
        </div>
      )}
    </div>
  );
}

// ── WEATHER SUGGEST ──
function WeatherSuggest() {
  const [form, setForm] = useState({ temp: '', rainfall: '', soil: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const suggest = async () => {
    if (!form.temp || !form.rainfall || !form.soil) return;
    setLoading(true);
    setResult('');
    setResult(
      await callAI(
        `You are Kisan Mitra. Suggest top 3 best crops from this database:\n${CROP_CONTEXT}\nFor each crop give: name, why it fits these conditions, and one key farming tip. Use emojis.`,
        `Temperature: ${form.temp}°C, Annual Rainfall: ${form.rainfall}mm, Soil Type: ${form.soil}`
      )
    );
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 14px', color: '#1b5e20' }}>
        🌦️ Weather-Based Crop Suggestion
      </h3>
      {(
        [
          ['Average Temperature (°C)', 'temp', '🌡️'],
          ['Annual Rainfall (mm)', 'rainfall', '🌧️'],
          ['Soil Type', 'soil', '🪱'],
        ] as string[][]
      ).map(([ph, key, ic]) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              color: '#558B2F',
              display: 'block',
              marginBottom: 4,
            }}
          >
            {ic} {ph}
          </label>
          <input
            value={(form as any)[key]}
            onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
            placeholder={`Enter ${ph.toLowerCase()}`}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '2px solid #a5d6a7',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      ))}
      <button
        onClick={suggest}
        disabled={loading || !form.temp || !form.rainfall || !form.soil}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 14,
        }}
      >
        {loading ? '🌱 Finding crops...' : '🔍 Suggest Crops'}
      </button>
      {result && (
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 16,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ── CROP CALENDAR ──
function CropCalendar() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const mIdx: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const [sel, setSel] = useState<number | null>(null);
  const gm = (s: string) => {
    const m = s.split(/[–,/\s]+/)[0].trim();
    return mIdx[m] ?? -1;
  };
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 18,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 4px', color: '#1b5e20' }}>
        📅 Crop Sowing & Harvest Calendar
      </h3>
      <p style={{ fontSize: 11, color: '#888', margin: '0 0 12px' }}>
        Tap any crop for details
      </p>
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {months.map((m) => (
          <div
            key={m}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 8,
              fontWeight: 'bold',
              color: '#558B2F',
            }}
          >
            {m}
          </div>
        ))}
      </div>
      {crops.map((c, i) => {
        const sm = gm(c.sow),
          hm = gm(c.harvest),
          open = sel === i;
        return (
          <div
            key={i}
            style={{ marginBottom: 5, cursor: 'pointer' }}
            onClick={() => setSel(open ? null : i)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 'bold',
                  color: '#333',
                  width: 68,
                  flexShrink: 0,
                }}
              >
                {c.emoji} {c.name}
              </span>
              <div style={{ flex: 1, display: 'flex', gap: 2 }}>
                {months.map((_, mi) => {
                  const isSow = mi === sm,
                    isHarv = mi === hm,
                    grow = sm <= hm ? mi > sm && mi < hm : mi > sm || mi < hm;
                  return (
                    <div
                      key={mi}
                      style={{
                        flex: 1,
                        height: 12,
                        borderRadius: 2,
                        background: isSow
                          ? '#2e7d32'
                          : isHarv
                          ? '#f57f17'
                          : grow
                          ? '#a5d6a7'
                          : '#f0f0f0',
                      }}
                    />
                  );
                })}
              </div>
            </div>
            {open && (
              <div
                style={{
                  background: c.cardColor,
                  borderRadius: 8,
                  padding: '8px 10px',
                  marginLeft: 72,
                  marginTop: 4,
                  fontSize: 11,
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <span>
                  🌱 Sow: <b>{c.sow}</b>
                </span>
                <span>
                  🌾 Harvest: <b>{c.harvest}</b>
                </span>
                <span>
                  ⏱ <b>{c.duration}</b>
                </span>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 10 }}>
        {(
          [
            ['#2e7d32', 'Sow'],
            ['#a5d6a7', 'Growing'],
            ['#f57f17', 'Harvest'],
          ] as string[][]
        ).map(([bg, lb]) => (
          <span key={lb}>
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                background: bg,
                borderRadius: 2,
                verticalAlign: 'middle',
                marginRight: 3,
              }}
            />
            {lb}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── PROFIT CALC ──
function ProfitCalc() {
  const [ci, setCi] = useState(0);
  const [acres, setAcres] = useState(1);
  const c = crops[ci];
  const cost = c.costPerAcre * acres;
  const rev = c.revenuePerAcre * acres;
  const profit = rev - cost;
  const margin = ((profit / rev) * 100).toFixed(0);
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 14px', color: '#1b5e20' }}>
        📊 Crop Profit Calculator
      </h3>
      <label
        style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: '#558B2F',
          display: 'block',
          marginBottom: 6,
        }}
      >
        🌱 Select Crop
      </label>
      <select
        value={ci}
        onChange={(e) => setCi(+e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: '2px solid #a5d6a7',
          fontSize: 13,
          marginBottom: 14,
          outline: 'none',
        }}
      >
        {crops.map((c, i) => (
          <option key={i} value={i}>
            {c.emoji} {c.name}
          </option>
        ))}
      </select>
      <label
        style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: '#558B2F',
          display: 'block',
          marginBottom: 6,
        }}
      >
        🌍 Acres: <b style={{ color: '#1b5e20' }}>{acres}</b>
      </label>
      <input
        type="range"
        min={1}
        max={50}
        value={acres}
        onChange={(e) => setAcres(+e.target.value)}
        style={{ width: '100%', marginBottom: 18, accentColor: '#2e7d32' }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 8,
          marginBottom: 14,
        }}
      >
        {(
          [
            ['💸 Cost', `₹${cost.toLocaleString()}`, '#FFEBEE', '#c62828'],
            ['💰 Revenue', `₹${rev.toLocaleString()}`, '#E8F5E9', '#2e7d32'],
            [
              '📈 Profit',
              `₹${profit.toLocaleString()}`,
              profit > 0 ? '#E3F2FD' : '#FFF3E0',
              profit > 0 ? '#1565C0' : '#e65100',
            ],
          ] as string[][]
        ).map(([lb, vl, bg, col], i) => (
          <div
            key={i}
            style={{
              background: bg,
              borderRadius: 10,
              padding: '10px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, color: col, fontWeight: 'bold' }}>
              {lb}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: col,
                marginTop: 5,
              }}
            >
              {vl}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: '#f9fbe7',
          borderRadius: 10,
          padding: '10px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            marginBottom: 5,
          }}
        >
          <span style={{ color: '#558B2F' }}>Profit Margin</span>
          <b style={{ color: '#1b5e20' }}>{margin}%</b>
        </div>
        <div
          style={{
            background: '#e0e0e0',
            borderRadius: 10,
            height: 8,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(+margin, 100)}%`,
              height: '100%',
              background: 'linear-gradient(90deg,#4caf50,#2e7d32)',
              borderRadius: 10,
            }}
          />
        </div>
        <p style={{ fontSize: 10, color: '#aaa', margin: '6px 0 0' }}>
          * Based on avg Indian market rates
        </p>
      </div>
    </div>
  );
}

// ── DISEASE CHECKER ──
function DiseaseChecker() {
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    const r = new FileReader();
    r.onload = (e) => setImage(e.target?.result as string);
    r.readAsDataURL(f);
  };

  const analyze = async () => {
    if (!symptoms.trim() && !image) return;
    setLoading(true);
    setResult('');
    setResult(
      await callAI(
        'You are Dr. Kisan, expert plant pathologist for Indian farms.',
        `Symptoms: ${
          symptoms || 'described visually'
        }. Diagnose: 1)Disease name 2)Cause 3)Severity 4)Organic remedy 5)Chemical treatment 6)Prevention. Use emojis. Be practical.`
      )
    );
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 4px', color: '#1b5e20' }}>
        🐛 Crop Disease Checker
      </h3>
      <p style={{ fontSize: 11, color: '#888', margin: '0 0 14px' }}>
        Upload photo or describe symptoms
      </p>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed #a5d6a7',
          borderRadius: 12,
          padding: 16,
          textAlign: 'center',
          cursor: 'pointer',
          background: '#f9fbe7',
          marginBottom: 12,
        }}
      >
        {image ? (
          <img
            src={image}
            alt="crop"
            style={{ maxWidth: '100%', maxHeight: 160, borderRadius: 8 }}
          />
        ) : (
          <div>
            <div style={{ fontSize: 32 }}>📷</div>
            <div style={{ color: '#558B2F', fontWeight: 'bold', fontSize: 13 }}>
              Tap to upload crop photo
            </div>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </div>
      {image && (
        <button
          onClick={() => setImage(null)}
          style={{
            background: '#ffebee',
            color: '#c62828',
            border: 'none',
            borderRadius: 8,
            padding: '5px 10px',
            fontSize: 11,
            cursor: 'pointer',
            marginBottom: 10,
          }}
        >
          ✕ Remove
        </button>
      )}
      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Describe: yellowing leaves, white spots, wilting..."
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: '2px solid #a5d6a7',
          fontSize: 13,
          minHeight: 65,
          outline: 'none',
          resize: 'vertical',
          boxSizing: 'border-box',
          marginBottom: 12,
        }}
      />
      <button
        onClick={analyze}
        disabled={loading || (!image && !symptoms.trim())}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 12,
        }}
      >
        {loading ? '🔬 Analyzing...' : '🔍 Check Disease'}
      </button>
      {result && (
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 14,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ── SOIL TEST ──
function SoilTest() {
  const [vals, setVals] = useState({
    ph: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organic: '',
    texture: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult('');
    setResult(
      await callAI(
        'You are a soil scientist for Indian farms. Analyze soil results and give practical advice.',
        `Soil test results: pH=${vals.ph}, Nitrogen=${vals.nitrogen}kg/ha, Phosphorus=${vals.phosphorus}kg/ha, Potassium=${vals.potassium}kg/ha, Organic Matter=${vals.organic}%, Texture=${vals.texture}. Give: 1)Soil health score out of 10 2)What is good 3)What is deficient 4)Fertilizer recommendations 5)Best crops to grow 6)Soil improvement tips. Use emojis.`
      )
    );
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 4px', color: '#1b5e20' }}>
        🧪 Soil Health Analyzer
      </h3>
      <p style={{ fontSize: 11, color: '#888', margin: '0 0 14px' }}>
        Enter your soil test values for AI analysis
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          marginBottom: 14,
        }}
      >
        {(
          [
            ['pH Level (0-14)', 'ph', '⚗️'],
            ['Nitrogen (kg/ha)', 'nitrogen', '🟢'],
            ['Phosphorus (kg/ha)', 'phosphorus', '🟠'],
            ['Potassium (kg/ha)', 'potassium', '🟣'],
            ['Organic Matter (%)', 'organic', '🟤'],
            ['Soil Texture', 'texture', '🪱'],
          ] as string[][]
        ).map(([ph, key, ic]) => (
          <div key={key}>
            <label
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#558B2F',
                display: 'block',
                marginBottom: 4,
              }}
            >
              {ic} {ph}
            </label>
            <input
              value={(vals as any)[key]}
              onChange={(e) =>
                setVals((p) => ({ ...p, [key]: e.target.value }))
              }
              placeholder={ph}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 8,
                border: '2px solid #a5d6a7',
                fontSize: 12,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={analyze}
        disabled={loading || !vals.ph}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 14,
        }}
      >
        {loading ? '🔬 Analyzing soil...' : '🧪 Analyze My Soil'}
      </button>
      {result && (
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 14,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ── GOVT SCHEMES ──
function GovtSchemes() {
  const [state, setState] = useState('');
  const [crop, setCrop] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetch_ = async () => {
    setLoading(true);
    setResult('');
    setResult(
      await callAI(
        'You are an expert on Indian government agricultural schemes and subsidies.',
        `State: ${state || 'Any state in India'}, Crop: ${
          crop || 'General farming'
        }. List top 5-7 most beneficial current government schemes with: scheme name, benefit amount or subsidy percentage, who is eligible, how to apply, and any important deadline. Use emojis. Be specific and practical.`
      )
    );
    setLoading(false);
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: 20,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 4px', color: '#1b5e20' }}>
        🏛️ Government Schemes & Subsidies
      </h3>
      <p style={{ fontSize: 11, color: '#888', margin: '0 0 14px' }}>
        Find schemes, subsidies & loans for farmers
      </p>
      <div style={{ marginBottom: 12 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: '#558B2F',
            display: 'block',
            marginBottom: 4,
          }}
        >
          🗺️ Your State
        </label>
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Maharashtra, Punjab, UP..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #a5d6a7',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: '#558B2F',
            display: 'block',
            marginBottom: 4,
          }}
        >
          🌱 Your Crop (optional)
        </label>
        <input
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="e.g. Rice, Cotton, Wheat..."
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 10,
            border: '2px solid #a5d6a7',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <button
        onClick={fetch_}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: 'linear-gradient(135deg,#2e7d32,#4caf50)',
          color: 'white',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: 14,
        }}
      >
        {loading ? '🔍 Finding schemes...' : '🏛️ Find My Schemes'}
      </button>
      {result && (
        <div
          style={{
            background: '#f1f8e9',
            borderRadius: 12,
            padding: 14,
            fontSize: 13,
            color: '#1b5e20',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
          }}
        >
          {result}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════
// ── MAIN APP ──
// ══════════════════════════════════════
export default function KisanMitra() {
  const [tab, setTab] = useState('crops');
  const [lang, setLang] = useState('en');
  const [showLang, setShowLang] = useState(false);
  const [search, setSearch] = useState('');
  const filtered = crops.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const curLang = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div
      style={{
        fontFamily: 'Arial',
        background: '#f0f7f0',
        minHeight: '100vh',
        padding: '14px',
      }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* HEADER */}
        <div
          style={{
            background: 'linear-gradient(135deg,#1b5e20,#4caf50)',
            borderRadius: 16,
            padding: '16px',
            marginBottom: 12,
            textAlign: 'center',
            color: 'white',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <button
              onClick={() => setShowLang(!showLang)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 20,
                padding: '4px 10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            >
              {curLang.flag} {curLang.label} ▾
            </button>
            {showLang && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 32,
                  background: 'white',
                  borderRadius: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  zIndex: 100,
                  overflow: 'hidden',
                  minWidth: 150,
                }}
              >
                {LANGUAGES.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setShowLang(false);
                    }}
                    style={{
                      padding: '8px 14px',
                      cursor: 'pointer',
                      background: lang === l.code ? '#e8f5e9' : 'white',
                      color: lang === l.code ? '#1b5e20' : '#333',
                      fontWeight: lang === l.code ? 'bold' : 'normal',
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    {l.flag} {l.label}{' '}
                    {lang === l.code && (
                      <span style={{ marginLeft: 'auto', color: '#4caf50' }}>
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: 36 }}>🌾</div>
          <h1 style={{ margin: '3px 0 1px', fontSize: 22 }}>Kisan Mitra</h1>
          <p
            style={{
              margin: '0 0 8px',
              fontSize: 10,
              opacity: 0.8,
              fontStyle: 'italic',
            }}
          >
            किसान मित्र — India's Smartest Farming App
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap',
            }}
          >
            {[
              '🤖 AI',
              '🎤 Voice',
              '👨‍⚕️ Doctor',
              '📈 Market',
              '🧪 Soil',
              '🏛️ Schemes',
              '🌦️ Weather',
              '📅 Calendar',
              '📊 Profit',
              '🐛 Disease',
            ].map((b, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  borderRadius: 20,
                  padding: '2px 7px',
                  fontSize: 9,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* TABS */}
        <div
          style={{
            display: 'flex',
            gap: 5,
            marginBottom: 12,
            overflowX: 'auto',
            paddingBottom: 2,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: '0 0 auto',
                padding: '7px 12px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: 11,
                background: tab === t.id ? '#2e7d32' : '#c8e6c9',
                color: tab === t.id ? 'white' : '#1b5e20',
                borderRadius: 20,
                whiteSpace: 'nowrap',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        {tab === 'crops' && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Search crop..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 10,
                border: '2px solid #a5d6a7',
                fontSize: 13,
                marginBottom: 12,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#888', padding: 40 }}>
                No crops found.
              </div>
            ) : (
              <CropCards list={filtered} />
            )}
          </>
        )}
        {tab === 'ai' && <AiChat lang={lang} />}
        {tab === 'doctor' && <KisanDoctor />}
        {tab === 'market' && <MarketPrices />}
        {tab === 'weather' && <WeatherSuggest />}
        {tab === 'calendar' && <CropCalendar />}
        {tab === 'profit' && <ProfitCalc />}
        {tab === 'disease' && <DiseaseChecker />}
        {tab === 'soil' && <SoilTest />}
        {tab === 'scheme' && <GovtSchemes />}

        <div
          style={{
            textAlign: 'center',
            color: '#aaa',
            fontSize: 10,
            marginTop: 12,
          }}
        >
          🌾 Kisan Mitra · किसान मित्र · 🇮🇳 Jai Kisan
        </div>
      </div>
    </div>
  );
}
