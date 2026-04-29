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
  total_points: number;
  avg_points: number;
}

interface TeamData {
  team_id: string;
  team_name: string;
  total_points: number;
  team_rank: number;
  team_rank_total: number;
  status: string;
  prelim_count: number;
  bracket_count: number;
  matches: MatchEntry[];
  speakers: Speaker[];
}

interface DashboardData {
  school_name: string;
  tournament_name: string;
  school_rank: number;
  school_rank_total: number;
  total_speaker_points: number;
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

const resultStyle = (result: 'Won' | 'Lost') => {
  if (result === 'Won') return 'bg-emerald-100 text-emerald-700';
  return 'bg-red-100 text-red-600';
};

const MatchRow = ({ m }: { m: MatchEntry }) => {
  const margin = m.team_points - m.opponent_points;
  return (
    <div className="rounded-2xl p-3.5 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{m.match_label}</span>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${resultStyle(m.result)}`}>
          {m.result}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-800">{m.opponent_team}</p>
      <div className="flex items-center gap-3 mt-1.5 text-xs">
        <span className="font-mono font-bold text-gray-600">{m.team_points} – {m.opponent_points}</span>
        <span className={`font-bold ${margin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {margin >= 0 ? `+${margin}` : margin}
        </span>
      </div>
    </div>
  );
};

const TeamCard = ({ team }: { team: TeamData }) => {
  const [expanded, setExpanded] = useState(false);

  const prelimMatches = team.matches.filter(m => m.stage === 'Prelim');
  const bracketMatches = team.matches.filter(m => m.stage !== 'Prelim');
  const wins = team.matches.filter(m => m.result === 'Won').length;
  const winRate = team.matches.length > 0 ? Math.round((wins / team.matches.length) * 100) : 0;

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
              {team.matches.length > 0 && (
                <>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs font-bold text-emerald-600">{winRate}% win ({wins}/{team.matches.length})</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {expanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
      </button>

      {/* Status badge */}
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

              {/* Preliminary rounds — always show section */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">
                  Preliminary Rounds ({team.prelim_count ?? prelimMatches.length} matches)
                </p>
                {prelimMatches.length > 0 ? (
                  <div className="space-y-2">
                    {prelimMatches.map((m, i) => <MatchRow key={i} m={m} />)}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 pl-1 italic">No preliminary match records found.</p>
                )}
              </div>

              {/* Bracket matches */}
              {bracketMatches.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Knockout Stage</p>
                  <div className="space-y-2">
                    {bracketMatches.map((m, i) => <MatchRow key={i} m={m} />)}
                  </div>
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
              <div className="space-y-2">
                {team.speakers.map((s, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white border border-gray-100 shadow-sm">
                    <span className="text-sm font-bold text-gray-800">{s.name}</span>
                    <div className="text-right">
                      <p className="text-base font-black text-gray-900">{s.total_points}</p>
                      <p className="text-xs text-gray-500">avg {s.avg_points}</p>
                    </div>
                  </div>
                ))}
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

  useEffect(() => {
    schoolReportService.getDashboard()
      .then(setData)
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

  const handleLogout = () => {
    navigate('/school-report');
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
        <button onClick={() => navigate('/school-report')} className="text-sm text-blue-400 underline">
          Back to Login
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  const expiresAt = new Date(data.expires_at);
  const timeLeft = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl border-b shadow-sm"
        style={{ background: 'rgba(255,255,255,0.8)', borderColor: 'rgba(226,232,240,0.8)' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-1">{data.tournament_name}</p>
              <h1 className="text-xl font-black text-gray-900 truncate">{data.school_name}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportPDF}
                disabled={exportingPDF}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <FileText size={13} />
                <span className="hidden sm:inline">{exportingPDF ? 'Exporting...' : 'PDF'}</span>
              </button>
              <button
                onClick={handleLogout}
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
        <div className="grid grid-cols-2 gap-4">
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
            <p className="text-xs text-blue-700 font-bold mt-1">Total Points</p>
            <p className="text-xs text-blue-600 mt-0.5">{data.teams.length} teams</p>
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

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 space-y-1 pt-6">
          <p>Generated on {new Date(data.generated_at).toLocaleString()}</p>
          <p className="text-gray-300">Youth Contest · Confidential Report</p>
        </div>
      </div>
    </div>
  );
};

export default SchoolReportDashboard;
