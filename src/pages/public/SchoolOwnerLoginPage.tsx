import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Mail, Hash } from 'lucide-react';
import schoolReportService from '../../services/schoolReportService';

const SchoolOwnerLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);

  const handleLogin = async () => {
    setError('');
    if (!email || !code) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    try {
      await schoolReportService.login(email, code);
      navigate('/school-report/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or code, or access has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  // Field wrapper style — uses CSS focus-within so no JS state needed
  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    transition: 'box-shadow 0.15s',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }} />

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">

        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 shadow-2xl overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e40af, #7c3aed)' }}>
            <img src="/LOGO.jpeg" alt="Youth Contest" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs font-bold tracking-[0.25em] text-blue-400 uppercase mb-2">Youth Contest</p>
          <h1 className="text-3xl font-black text-white leading-tight">School Report</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto leading-relaxed">
            Enter the credentials from your access email to view your school's tournament results.
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm">
          <div className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>

            <div className="p-7 space-y-4">

              {/* Email */}
              <div style={fieldStyle} className="focus-within:[box-shadow:0_0_0_2px_rgba(59,130,246,0.5)]">
                <div className="flex items-center px-4 pt-3 pb-1 gap-3">
                  <Mail size={15} className="shrink-0 text-slate-500" />
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Email</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  className="w-full bg-transparent px-4 pb-3 pt-1 text-white text-base font-medium placeholder-slate-600 focus:outline-none"
                  autoComplete="email"
                />
              </div>

              {/* Code */}
              <div style={fieldStyle} className="focus-within:[box-shadow:0_0_0_2px_rgba(139,92,246,0.5)]">
                <div className="flex items-center px-4 pt-3 pb-1 gap-3">
                  <Hash size={15} className="shrink-0 text-slate-500" />
                  <span className="text-xs font-bold tracking-widest text-slate-500 uppercase">Access Code</span>
                </div>
                <input
                  ref={codeRef}
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. A7K2P9"
                  maxLength={8}
                  className="w-full bg-transparent px-4 pb-3 pt-1 text-white text-xl font-black tracking-[0.3em] placeholder-slate-600 focus:outline-none uppercase"
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-red-300">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white text-base transition-all duration-200 disabled:opacity-50 active:scale-95"
                style={{ background: loading ? 'rgba(59,130,246,0.5)' : 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>View My Report <ArrowRight size={18} /></>
                )}
              </button>
            </div>

            <div className="px-7 pb-6 text-center">
              <p className="text-xs text-slate-600">No code? Contact your tournament administrator.</p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">🔒 Your access is time-limited and secure</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolOwnerLoginPage;
