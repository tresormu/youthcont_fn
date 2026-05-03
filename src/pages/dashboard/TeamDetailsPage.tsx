import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, User, Calendar, CheckCircle2, XCircle, Mic2 } from 'lucide-react';

export default function TeamDetailsPage() {
  const { eventId, teamId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const res = await api.get(`/events/${eventId}/teams/${teamId}/details`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDetails();
  }, [eventId, teamId]);

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-primary/40 font-bold">Loading team details...</div>;
  }

  if (!data || !data.team) {
    return <div className="p-10 text-center text-red-500 font-bold">Team not found</div>;
  }

  const { team, matches, speakerScores } = data;

  // Build per-member score lookup: memberId -> { round1, round2, round3, total, matchCount }
  const memberScoreMap: Record<string, { r1: number; r2: number; r3: number; total: number; matchCount: number }> = {};
  team.members.forEach((m: any) => {
    memberScoreMap[m._id] = { r1: 0, r2: 0, r3: 0, total: 0, matchCount: 0 };
  });
  speakerScores.forEach((s: any) => {
    const entry = memberScoreMap[s.memberId];
    if (!entry) return;
    if (s.roundNumber === 1) entry.r1 = s.pointsScored;
    if (s.roundNumber === 2) entry.r2 = s.pointsScored;
    if (s.roundNumber === 3) entry.r3 = s.pointsScored;
    entry.total += s.pointsScored;
    entry.matchCount += 1;
  });

  // Sort members by total descending
  const sortedMembers = [...team.members].sort((a: any, b: any) => {
    const totA = memberScoreMap[a._id]?.total ?? 0;
    const totB = memberScoreMap[b._id]?.total ?? 0;
    return totB - totA;
  });

  const matchesPlayed = team.matchesPlayed || 0;
  const matchesWon = team.matchesWon || 0;
  const matchesLost = matchesPlayed - matchesWon;

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary/50 hover:text-primary transition-colors font-bold text-sm"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-[2rem] border border-border p-8 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary">{team.name}</h1>
            <p className="text-primary/50 font-bold mt-1 tracking-wide uppercase text-sm">{team.school?.name}</p>
          </div>
          <div className="flex gap-3 text-center flex-wrap">
            <div className="bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl border border-emerald-100">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Wins</p>
              <p className="text-2xl font-black">{matchesWon}</p>
            </div>
            <div className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl border border-red-100">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Losses</p>
              <p className="text-2xl font-black">{matchesLost}</p>
            </div>
            <div className="bg-secondary/50 text-primary px-5 py-3 rounded-2xl border border-border">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">Points</p>
              <p className="text-2xl font-black">{team.totalPoints || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Match History */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-primary flex items-center gap-2">
          <Calendar className="text-blue-500" size={20} />
          Match History
        </h2>
        {matches.length === 0 ? (
          <p className="text-sm text-primary/40 font-bold">No matches found.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match: any) => {
              const isTeamA = match.teamA?._id?.toString() === team._id?.toString();
              const opponent = isTeamA ? match.teamB : match.teamA;
              const isWinner = match.winner?.toString() === team._id?.toString();
              const isScored = match.status?.toUpperCase().includes('COMPLETED');
              const myPoints = isTeamA
                ? (isWinner ? match.winnerSpeakerPoints : match.loserSpeakerPoints)
                : (isWinner ? match.winnerSpeakerPoints : match.loserSpeakerPoints);
              const oppPoints = isTeamA
                ? (isWinner ? match.loserSpeakerPoints : match.winnerSpeakerPoints)
                : (isWinner ? match.loserSpeakerPoints : match.winnerSpeakerPoints);

              return (
                <div
                  key={match._id}
                  className={`bg-white rounded-2xl border p-5 flex items-center justify-between ${
                    match.isByePractice ? 'border-blue-200 bg-blue-50/30' : 'border-border'
                  }`}
                >
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1">
                      Round {match.round || '—'} · {match.stage}
                    </p>
                    <p className="font-bold text-primary text-sm">
                      {match.isByePractice ? 'Practice Round (BYE)' : `vs ${opponent?.name || '---'}`}
                      {!match.isByePractice && opponent?.school?.name && (
                        <span className="text-primary/30 text-xs ml-2">({opponent.school.name})</span>
                      )}
                    </p>
                    {isScored && !match.isByePractice && (
                      <p className="text-xs text-primary/40 mt-0.5">
                        Score: {myPoints ?? '—'} — {oppPoints ?? '—'}
                      </p>
                    )}
                    {isScored && match.isByePractice && (
                      <p className="text-xs text-blue-500 mt-0.5">Score: {match.winnerSpeakerPoints ?? '—'} (max)</p>
                    )}
                  </div>
                  <div>
                    {!isScored ? (
                      <span className="text-xs font-black text-amber-500 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">Pending</span>
                    ) : match.isByePractice ? (
                      <span className="text-xs font-black text-blue-600 bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Practice WIN
                      </span>
                    ) : isWinner ? (
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 size={12} /> WIN
                      </span>
                    ) : (
                      <span className="text-xs font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1">
                        <XCircle size={12} /> LOSS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Members & Speaker Points Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-primary flex items-center gap-2">
          <User className="text-accent" size={20} />
          Members &amp; Speaker Points
        </h2>
        <div className="bg-white rounded-[2rem] border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  {['Name', 'Role', 'Round 1', 'Round 2', 'Round 3', 'Total', 'Average'].map(h => (
                    <th key={h} className="px-5 py-4 text-[9px] font-black uppercase tracking-widest text-primary/30 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sortedMembers.map((member: any) => {
                  const sc = memberScoreMap[member._id] ?? { r1: 0, r2: 0, r3: 0, total: 0, matchCount: 0 };
                  const avg = sc.matchCount > 0 ? (sc.total / sc.matchCount).toFixed(1) : '—';
                  const isPublicSpeaker = member.speakerOrder > 3;
                  return (
                    <tr key={member._id} className={`hover:bg-secondary/20 transition-colors ${isPublicSpeaker ? 'bg-purple-50/30' : ''}`}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-primary text-sm">{member.fullName || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                          isPublicSpeaker
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-secondary text-primary/50'
                        }`}>
                          {isPublicSpeaker ? 'Public Speaker' : 'Speaker'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-black text-primary">{sc.r1 || '—'}</td>
                      <td className="px-5 py-4 text-sm font-black text-primary">{sc.r2 || '—'}</td>
                      <td className="px-5 py-4 text-sm font-black text-primary">{sc.r3 || '—'}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-black text-accent">{sc.total}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-black text-primary/60">{avg}</span>
                      </td>
                    </tr>
                  );
                })}
                {sortedMembers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-primary/30 font-bold text-sm">No members found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Public Speakers note */}
      <div className="flex items-center gap-2 text-xs text-primary/40 font-bold">
        <Mic2 size={14} className="text-purple-400" />
        <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">Purple</span>
        rows indicate Public Speakers
      </div>
    </div>
  );
}

