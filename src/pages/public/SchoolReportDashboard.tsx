import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, ChevronDown, ChevronUp, LogOut, Clock, Medal, FileText, TrendingUp, Award, Target } from 'lucide-react';
import schoolReportService from '../../services/schoolReportService';

interface MatchEntry {
  match_label: string;
  stage: string;
  opponent_team: string;
  result: 'Won' | 'Lost';
  team_points: number;
  opponent_points: number;
}

interface Speaker {
  name: string;
  role: string;
  round1: number;
  round2: number;
  round3: number;
  total_points: number;
  avg_points: number;
}

interface TeamData {
  team_id: string;
  team_name: string;
  total_points: number;
  wins: number;
  losses: number;
  team_rank: number;
  team_rank_total: number;
  status: string;
  prelim_count: number;
  bracket_count: number;
  matches: MatchEntry[];
  speakers: Speaker[];
  team_grand_total: number;
}

interface DashboardData {
  school_name: string;
  tournament_name: string;
  school_rank: number;
  school_rank_total: number;
  total_speaker_points: number;
  grand_total_speaker_points: number;
  teams: TeamData[];
  expires_at: string;
  generated_at: string;
}

const statusColor = (status: string) => {
  if (status.includes('Winner')) return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
  if (status.includes('Runner')) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
  if (status.includes('Advanced')) return 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white';
  return 'bg-gray-100 text-gray-500';
};

const resultStyle = (result: 'Won' | 'Lost') =>
  result === 'Won' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600';

const MatchRow = ({ m }: { m: MatchEntry }) => {
  const margin = m.team_points - m.opponent_points;
  const isBye = m.opponent_team === 'BYE';
  return (
    <div className="rounded-2xl p-3.5 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{m.match_label}</span>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isBye ? 'bg-blue-100 text-blue-700' : resultStyle(m.result)}`}>
          {isBye ? 'Practice WIN' : m.result}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-800">{isBye ? 'Practice Round (BYE)' : m.opponent_team}</p>
      {!isBye && (
        <div className="flex items-center gap-3 mt-1.5 text-xs">
          <span className="font-mono font-bold text-gray-600">{m.team_points} – {m.opponent_points}</span>
          <span className={`font-bold ${margin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {margin >= 0 ? `+${margin}` : margin}
          </span>
        </div>
      )}
      {isBye && (
        <p className="text-xs text-blue-500 mt-1">Score: {m.team_points} pts (max)</p>
      )}
    </div>
  );
};

const TeamCard = ({ team }: { team: TeamData }) => {
  const [expanded, setExpanded] = useState(false);
  const prelimMatches = team.matches.filter(m => m.stage === 'Prelim');
  const bracketMatches = team.matches.filter(m => m.stage !== 'Prelim');

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', border: '1px solid #e2e8f0' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-5 hover:bg-gray-50/50 transition-all"
      >
        <div className="flex items-center gap-4 text-left flex-1">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg"
            style={{ background: team.team_rank <= 3 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            #{team.team_rank}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-base truncate">{team.team_name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-bold text-blue-600">{team.total_points} pts</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-500">Rank {team.team_rank}/{team.team_rank_total}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs font-bold text-emerald-600">{team.wins}W</span>
              <span className="text-xs font-bold text-red-500">{team.losses}L</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>

      <div className="px-5 pb-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${statusColor(team.status)}`}>
          <Award size={12} />
          {team.status}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-6 bg-gray-50/30">

          {/* Match history */}
          {team.matches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target size={14} className="text-blue-600" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-600">Match History</p>
              </div>
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Preliminary Rounds ({team.prelim_count} matches)
                </p>
                {prelimMatches.length > 0 ? (
                  <div className="space-y-2">{prelimMatches.map((m, i) => <MatchRow key={i} m={m} />)}</div>
                ) : (
                  <p className="text-xs text-gray-400 pl-1 italic">No preliminary match records found.</p>
                )}
              </div>
              {bracketMatches.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Knockout Stage</p>
                  <div className="space-y-2">{bracketMatches.map((m, i) => <MatchRow key={i} m={m} />)}</div>
                </div>
              )}
            </div>
          )}

          {/* Speaker breakdown */}
          {team.speakers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-purple-600" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-600">Speaker Performance</p>
              </div>

              {/* Table header */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="grid grid-cols-7 bg-gray-800 px-4 py-2">
                  {['Name', 'Role', 'R1', 'R2', 'R3', 'Total', 'Avg'].map(h => (
                    <p key={h} className="text-[9px] font-black uppercase tracking-widest text-gray-300">{h}</p>
                  ))}
                </div>
                {team.speakers.map((s, i) => (
                  <div key={i} className={`grid grid-cols-7 px-4 py-3 items-center ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <p className="text-sm font-bold text-gray-800 truncate col-span-1">{s.name}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${s.role === 'Public Speaker' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                      {s.role === 'Public Speaker' ? 'Public' : 'Speaker'}
                    </span>
                    <p className="text-sm font-bold text-gray-700 text-center">{s.round1 || '—'}</p>
                    <p className="text-sm font-bold text-gray-700 text-center">{s.round2 || '—'}</p>
                    <p className="text-sm font-bold text-gray-700 text-center">{s.round3 || '—'}</p>
                    <p className="text-base font-black text-blue-700 text-center">{s.total_points}</p>
                    <p className="text-xs text-gray-500 text-center">{s.avg_points}</p>
                  </div>
                ))}
                {/* Team speaker total row */}
                <div className="grid grid-cols-7 px-4 py-2.5 bg-blue-50 border-t border-blue-100">
                  <p className="text-xs font-black text-blue-700 col-span-5">Team Speaker Total</p>
                  <p className="text-sm font-black text-blue-800 text-center">{team.team_grand_total}</p>
                  <p></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SchoolReportDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    schoolReportService.getDashboard()
      .then(d => {
        setData(d);
        const expires = new Date(d.expires_at).getTime();
        setTimeLeft(Math.max(0, Math.floor((expires - Date.now()) / (1000 * 60 * 60))));
      })
      .catch(err => {
        if (err.response?.status === 401) navigate('/school-report');
        else setError(err.response?.data?.message || 'Failed to load report');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = async () => {
    setExportingPDF(true);
    try {
      const blob = await schoolReportService.exportPDF();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `school-report-${data?.school_name ?? 'report'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch { /* silently fail */ }
    finally { setExportingPDF(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm font-medium">Loading your report...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="text-center space-y-4">
        <p className="text-red-400 font-bold">{error}</p>
        <button onClick={() => navigate('/school-report')} className="text-sm text-blue-400 underline">Back to Login</button>
      </div>
    </div>
  );

  if (!data) return null;

  const expiresAt = new Date(data.expires_at);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl border-b shadow-sm"
        style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(226,232,240,0.8)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-0.5">{data.tournament_name}</p>
              <h1 className="text-xl font-black text-gray-900 truncate">{data.school_name}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <FileText size={13} />
                <span className="hidden sm:inline">{exportingPDF ? 'Exporting...' : 'Download PDF'}</span>
              </button>
              <button
                onClick={() => navigate('/school-report')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-12">

        {/* Expiry notice */}
        <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm shadow-sm"
          style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1px solid #fbbf24' }}>
          <Clock size={16} className="text-amber-700 shrink-0" />
          <span className="text-amber-900 font-medium">
            Access expires in <strong>{timeLeft}h</strong> · {expiresAt.toLocaleString()}
          </span>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl p-5 text-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '1px solid #fbbf24' }}>
            <Medal size={24} className="mx-auto text-amber-600 mb-2" />
            <p className="text-4xl font-black text-amber-900">#{data.school_rank}</p>
            <p className="text-xs text-amber-700 font-bold mt-1">School Rank</p>
            <p className="text-xs text-amber-600 mt-0.5">out of {data.school_rank_total}</p>
          </div>
          <div className="rounded-3xl p-5 text-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', border: '1px solid #3b82f6' }}>
            <Trophy size={24} className="mx-auto text-blue-600 mb-2" />
            <p className="text-4xl font-black text-blue-900">{data.total_speaker_points}</p>
            <p className="text-xs text-blue-700 font-bold mt-1">Team Points Total</p>
            <p className="text-xs text-blue-600 mt-0.5">{data.teams.length} teams</p>
          </div>
          <div className="rounded-3xl p-5 text-center shadow-lg col-span-2 sm:col-span-1"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)', border: '1px solid #22c55e' }}>
            <TrendingUp size={24} className="mx-auto text-emerald-600 mb-2" />
            <p className="text-4xl font-black text-emerald-900">{data.grand_total_speaker_points}</p>
            <p className="text-xs text-emerald-700 font-bold mt-1">Grand Speaker Total</p>
            <p className="text-xs text-emerald-600 mt-0.5">all members combined</p>
          </div>
        </div>

        {/* Teams */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-purple-600" />
            <h2 className="text-lg font-black text-gray-900">Your Teams</h2>
          </div>
          <div className="space-y-4">
            {data.teams.map(team => (
              <TeamCard key={team.team_id} team={team} />
            ))}
          </div>
        </div>

        {/* School grand total banner */}
        <div className="rounded-3xl p-6 text-center shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', border: '1px solid #475569' }}>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Grand Total — All Speaker Points for {data.school_name}</p>
          <p className="text-5xl font-black text-white">{data.grand_total_speaker_points}</p>
          <p className="text-slate-400 text-sm mt-2">across all teams and all rounds</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1 pt-2">
          <p>Generated on {new Date(data.generated_at).toLocaleString()}</p>
          <p className="text-gray-300">THEYOUTHCONTEST · Confidential Report</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolReportDashboard;


