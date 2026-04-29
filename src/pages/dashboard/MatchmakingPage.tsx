import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import matchService from '../../services/matchService';
import schoolService from '../../services/schoolService';
import teamService from '../../services/teamService';
import bracketService from '../../services/bracketService';
import { useSocket } from '../../context/SocketContext';
import { Sword, RotateCcw, ArrowRight, Trophy, Sparkles, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface TeamMember { _id: string; fullName: string; speakerOrder: number; }
interface Team { _id: string; name: string; totalPoints: number; members?: TeamMember[]; }
interface Match {
  _id: string;
  teamA: Team;
  teamB: Team;
  winner: string | null;
  status: string;
  winnerSpeakerPoints?: number;
  loserSpeakerPoints?: number;
  teamASpeakerScores?: { memberId: string; points: number }[];
  teamBSpeakerScores?: { memberId: string; points: number }[];
}
interface TeamSchedule {
  _id: string; 
  team: Team;
  matches: Match[];
}

const MatchmakingPage = () => {
  const { eventId } = useParams();
  const [schedules, setSchedules] = useState<TeamSchedule[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { toast } = useToast();

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Score Modal for Preliminary Match
  const [scoreModalMatch, setScoreModalMatch] = useState<{match: Match, teamIndex: number} | null>(null);
  const [scoreForm, setScoreForm] = useState<{
    winner: 'A' | 'B';
    aScores: { memberId: string; fullName: string; points: number }[];
    bScores: { memberId: string; fullName: string; points: number }[];
  }>({ winner: 'A', aScores: [], bScores: [] });
  const [savingScore, setSavingScore] = useState(false);

  // Knockout Score Modal
  const [knockoutModalMatch, setKnockoutModalMatch] = useState<{match: Match, title: string} | null>(null);
  const [knockoutForm, setKnockoutForm] = useState<{
    winner: 'A' | 'B';
    aScores: { memberId: string; fullName: string; points: number }[];
    bScores: { memberId: string; fullName: string; points: number }[];
  }>({ winner: 'A', aScores: [], bScores: [] });

  const [showBest8Pipeline, setShowBest8Pipeline] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'sorting' | 'top8' | 'done'>('idle');
  const [top8, setTop8] = useState<Team[]>([]);
  
  const [bracket, setBracket] = useState<Record<string, Match[]>>({});

  const isCompleted = (status?: string) => String(status || '').toUpperCase().includes('COMPLETED');

  useEffect(() => {
    fetchSchedules();
    fetchSchools();
    if (socket) {
      socket.emit('joinEvent', eventId);
      socket.on('matchups:created', fetchSchedules);
      socket.on('match:updated', fetchSchedules);
      return () => { socket.off('matchups:created'); socket.off('match:updated'); };
    }
  }, [eventId, socket]);

  useEffect(() => {
    if (pipelineStep === 'done') {
      fetchBracket();
    }
  }, [pipelineStep]);

  const fetchSchedules = async () => {
    if (!eventId) return;
    try {
      const matchupsData = await matchService.getMatchups(eventId);
      setSchedules(matchupsData);
      if (!selectedTeamId && matchupsData.length > 0) setSelectedTeamId(matchupsData[0]._id);
    } catch { toast('Failed to load schedules', 'error'); }
    finally { setIsLoading(false); }
  };

  const fetchSchools = async () => {
    if (!eventId) return;
    try {
      const data = await schoolService.getSchools(eventId);
      setSchools(data);
    } catch {
      toast('Failed to load schools', 'error');
    }
  };

  const fetchBracket = async () => {
    if (!eventId) return;
    try {
      const data = await bracketService.getBracket(eventId);
      setBracket(data);
    } catch {
      // toast('Failed to load bracket', 'error');
    }
  };

  const handleAutoAssign = async () => {
    if (!eventId) return;
    setIsGenerating(true);
    try {
      await matchService.autoAssign(eventId);
      toast('Matchups generated!');
      fetchSchedules();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to auto-assign', 'error');
    } finally { setIsGenerating(false); }
  };

  const buildScores = (team: Team, existing?: { memberId: string; points: number }[]) =>
    (team.members ?? []).map(m => ({
      memberId: m._id,
      fullName: m.fullName || `Speaker ${m.speakerOrder}`,
      points: existing?.find(s => s.memberId === m._id)?.points ?? 0,
    }));

  const openScoreModal = (match: Match, teamIndex: number) => {
    const aWon = match.winner === match.teamA?._id;
    setScoreForm({
      winner: aWon ? 'A' : 'B',
      aScores: buildScores(match.teamA, match.teamASpeakerScores),
      bScores: buildScores(match.teamB, match.teamBSpeakerScores),
    });
    setScoreModalMatch({ match, teamIndex });
  };

  const saveScoreModal = async () => {
    if (!scoreModalMatch) return;
    const { match } = scoreModalMatch;
    setSavingScore(true);
    try {
      const winnerId = scoreForm.winner === 'A' ? match.teamA._id : match.teamB._id;
      const loserId = scoreForm.winner === 'A' ? match.teamB._id : match.teamA._id;
      await matchService.enterResult(match._id, {
        winnerId,
        loserId,
        teamASpeakerScores: scoreForm.aScores.map(s => ({ memberId: s.memberId, points: s.points })),
        teamBSpeakerScores: scoreForm.bScores.map(s => ({ memberId: s.memberId, points: s.points })),
      });
      toast('Match score saved');
      setScoreModalMatch(null);
      await fetchSchedules();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to save score', 'error');
    } finally { setSavingScore(false); }
  };

  const openKnockoutModal = (match: Match, title: string) => {
    const aWon = match.winner === match.teamA?._id;
    setKnockoutForm({
      winner: aWon ? 'A' : 'B',
      aScores: buildScores(match.teamA, match.teamASpeakerScores),
      bScores: buildScores(match.teamB, match.teamBSpeakerScores),
    });
    setKnockoutModalMatch({ match, title });
  };

  const saveKnockoutModal = async () => {
    if (!knockoutModalMatch) return;
    const { match } = knockoutModalMatch;
    setSavingScore(true);
    try {
      const winnerId = knockoutForm.winner === 'A' ? match.teamA._id : match.teamB._id;
      const loserId = knockoutForm.winner === 'A' ? match.teamB._id : match.teamA._id;
      await matchService.enterResult(match._id, {
        winnerId,
        loserId,
        teamASpeakerScores: knockoutForm.aScores.map(s => ({ memberId: s.memberId, points: s.points })),
        teamBSpeakerScores: knockoutForm.bScores.map(s => ({ memberId: s.memberId, points: s.points })),
      });
      toast('Match score saved & winner advanced');
      setKnockoutModalMatch(null);
      await fetchBracket();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to save knockout score', 'error');
    } finally { setSavingScore(false); }
  };

  const handleReset = async () => {
    if (!eventId) return;
    setActionLoading(true);
    try {
      await matchService.cancelPrelims(eventId);
      setSchedules([]);
      setSelectedTeamId(null);
      toast('All matchups reset');
    } catch { toast('Failed to reset matchups', 'error'); }
    finally { setActionLoading(false); setResetConfirm(false); }
  };

  const selectedSchedule = useMemo(
    () => schedules.find((s) => s._id === selectedTeamId) || schedules[0] || null,
    [schedules, selectedTeamId]
  );

  const scheduleDone = (s: TeamSchedule) => s.matches.length > 0 && s.matches.every((m) => isCompleted(m.status));

  const allPrelimScored = useMemo(
    () => schedules.length > 0 && schedules.every((s) => scheduleDone(s)),
    [schedules]
  );

  const totalTeamsRanked = useMemo(() => schools.length * 3, [schools.length]);
  const useRoundOf16 = schools.length > 18;
  const advanceCount = useRoundOf16 ? 16 : 8;

  const runBest8Pipeline = async () => {
    if (!eventId) return;
    setShowBest8Pipeline(true);
    setPipelineStep('sorting');
    try {
      const rankings = await teamService.getRankings(eventId);
      const best = rankings.slice(0, advanceCount);
      setTop8(best);
      
      // Auto generate bracket seeds for R16 or QF directly on the backend
      await matchService.generateBracket(eventId, best.map((t: Team) => t._id));

      setTimeout(() => setPipelineStep('top8'), 1200);
      setTimeout(() => setPipelineStep('done'), 2400);
    } catch {
      toast(`Failed to compute best ${advanceCount}`, 'error');
      setShowBest8Pipeline(false);
      setPipelineStep('idle');
    }
  };

  const proceedToKnockout = () => {
    if (!eventId) return;
    navigate(`/dashboard/events/${eventId}/bracket?mode=auto`);
  };

  const r16Matches = bracket['R16'] || [];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Match Console</h1>
          <p className="text-primary/40 font-medium mt-1">Select a team to view their preliminary match nodes.</p>
        </div>
        <div className="flex gap-3">
          {schedules.length > 0 && (
            <button onClick={() => setResetConfirm(true)} className="px-5 py-3.5 rounded-2xl font-black text-xs text-destructive hover:bg-destructive/5 transition-all flex items-center gap-2 border border-destructive/20"><RotateCcw size={15} /> Reset All</button>
          )}
        </div>
      </div>

      {allPrelimScored && (
        <div className="rounded-[2rem] border border-accent/20 bg-accent/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-primary">All preliminary rounds complete — {totalTeamsRanked} teams ranked.</p>
              <p className="text-xs text-primary/40 font-bold">Ready to identify the top {advanceCount} and generate knockout nodes.</p>
            </div>
            {pipelineStep === 'idle' && (
              <button onClick={runBest8Pipeline} className="btn-accent px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2">
                <Sparkles size={16} /> ⚡ Get best {advanceCount} teams
              </button>
            )}
          </div>
        </div>
      )}

      {showBest8Pipeline && (
        <div className="rounded-[2rem] border border-primary/15 bg-slate-900 p-8 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
          <div className="relative flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between min-w-[900px] overflow-x-auto pb-6">
              {/* Stage 1: All Teams */}
              <div className="flex-shrink-0 w-64">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/50 mb-4 text-center">All Teams ({totalTeamsRanked})</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-200">T{i + 1}</motion.div>
                  ))}
                  <div className="w-8 h-8 rounded-lg border border-dashed border-blue-500/20 flex items-center justify-center text-[10px] text-blue-200/40">+{totalTeamsRanked - 12}</div>
                </div>
              </div>

              <div className="text-blue-500/30 px-4"><ArrowRight size={24} /></div>

              {/* Stage 2: Sorting Engine */}
              <div className="flex-shrink-0 w-48 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/50 mb-4">Processing</p>
                <motion.div 
                  animate={{ 
                    scale: pipelineStep === 'sorting' ? [1, 1.05, 1] : 1,
                    boxShadow: pipelineStep === 'sorting' ? ['0 0 0px #3b82f6', '0 0 30px #3b82f6', '0 0 0px #3b82f6'] : 'none'
                  }} 
                  transition={{ repeat: pipelineStep === 'sorting' ? Infinity : 0, duration: 1 }}
                  className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-[2px] mx-auto w-32"
                >
                  <div className="bg-slate-900 rounded-2xl py-4 px-2">
                    <p className="text-xs font-black text-white">Ranking Engine</p>
                    <p className="text-[9px] text-blue-200 mt-1">Sorting Points...</p>
                  </div>
                </motion.div>
              </div>

              <div className="text-blue-500/30 px-4"><ArrowRight size={24} /></div>

              {/* Stage 3: Top N Finalists */}
              <div className="flex-grow">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300/50 mb-4">Top {advanceCount} Finalists</p>
                <div className={`grid gap-3 ${useRoundOf16 ? 'grid-cols-4' : 'grid-cols-4'}`}>
                  {top8.map((team, idx) => (
                    <motion.div 
                      key={team._id} 
                      initial={{ x: -40, opacity: 0, scale: 0.9 }} 
                      animate={{ 
                        x: pipelineStep === 'top8' || pipelineStep === 'done' ? 0 : -40, 
                        opacity: pipelineStep === 'top8' || pipelineStep === 'done' ? 1 : 0,
                        scale: pipelineStep === 'top8' || pipelineStep === 'done' ? 1 : 0.9,
                        boxShadow: pipelineStep === 'top8' || pipelineStep === 'done' ? '0 4px 20px rgba(59,130,246,0.2)' : 'none'
                      }} 
                      transition={{ 
                        delay: idx * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }} 
                      className="relative overflow-hidden rounded-xl bg-blue-950/40 border border-blue-400/30 p-3"
                    >
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: (idx * 0.1) + 0.2, duration: 0.8 }}
                        className="absolute inset-0 bg-blue-400/20 mix-blend-overlay"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-black uppercase text-blue-300 bg-blue-900/50 px-1.5 py-0.5 rounded">Rank {idx + 1}</span>
                        <p className="text-[10px] font-black text-emerald-400">{team.totalPoints} pts</p>
                      </div>
                      <p className="text-xs font-black text-white truncate">{team.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {pipelineStep === 'done' && !useRoundOf16 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex gap-4">
                  <button onClick={proceedToKnockout} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-blue-900/50">Proceed to Knockout Bracket →</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {useRoundOf16 && pipelineStep === 'done' && r16Matches.length > 0 && (
        <div className="mt-12 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-primary flex items-center gap-2">
              <Sword className="text-accent" />
              Round of 16
            </h2>
            <p className="text-sm font-medium text-primary/40 mt-1">Since there are {schools.length} schools, the top 16 play an intermediate knockout round.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {r16Matches.map((m, idx) => {
              const isScored = isCompleted(m.status);
              return (
                <div key={m._id} className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Match {idx + 1}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${isScored ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {isScored ? 'Scored' : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center bg-secondary/30 p-2 rounded-lg">
                      <span className={`text-xs font-bold ${m.winner === m.teamA?._id ? 'text-primary' : 'text-primary/60'}`}>{m.teamA?.name}</span>
                      {isScored && <span className="text-xs font-black">{m.winner === m.teamA?._id ? m.winnerSpeakerPoints : m.loserSpeakerPoints}</span>}
                    </div>
                    <div className="flex justify-between items-center bg-secondary/30 p-2 rounded-lg">
                      <span className={`text-xs font-bold ${m.winner === m.teamB?._id ? 'text-primary' : 'text-primary/60'}`}>{m.teamB?.name}</span>
                      {isScored && <span className="text-xs font-black">{m.winner === m.teamB?._id ? m.winnerSpeakerPoints : m.loserSpeakerPoints}</span>}
                    </div>
                  </div>
                  <button onClick={() => openKnockoutModal(m, `Round of 16 — Match ${idx + 1}`)} className="w-full py-2.5 rounded-xl border border-primary/20 text-xs font-black text-primary hover:bg-primary hover:text-white transition-colors">
                    {isScored ? 'Edit Result' : 'Enter Result'}
                  </button>
                </div>
              );
            })}
          </div>

          {r16Matches.every(m => isCompleted(m.status)) && (
            <div className="flex justify-center pt-6">
              <button onClick={proceedToKnockout} className="px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black shadow-xl shadow-primary/20 hover:-translate-y-1 transition-transform">
                Seed Quarter-Finals & Proceed →
              </button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/60 rounded-[2rem] animate-pulse" />)}</div>
      ) : schedules.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-border rounded-[3rem] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center text-primary/20 mb-6"><Sword size={40} /></div>
          <h3 className="text-2xl font-black text-primary mb-2">No Matchups Yet</h3>
          {<button onClick={handleAutoAssign} disabled={isGenerating} className="mt-8 btn-accent py-4 px-10 rounded-2xl font-black text-sm">{isGenerating ? 'Generating...' : 'Auto-Generate Now'}</button>}
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-border/60 bg-white/40 overflow-hidden">
          {/* Two-column layout: fixed left panel + scrollable graph */}
          <div className="flex h-[600px]">

            {/* Left Panel: fixed width, independent scroll */}
            <div className="w-72 flex-shrink-0 border-r border-border/50 flex flex-col bg-white">
              <div className="px-4 pt-4 pb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/30">Team Schedules</p>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
                {schedules.map((schedule) => {
                  const isActive = selectedSchedule?._id === schedule._id;
                  const done = scheduleDone(schedule);
                  const scoredCount = schedule.matches.filter(m => isCompleted(m.status)).length;
                  return (
                    <button
                      key={schedule._id}
                      onClick={() => setSelectedTeamId(schedule._id)}
                      className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                          : 'bg-white border-border hover:border-accent/30'
                      }`}
                    >
                      <h3 className="text-xs font-black truncate">{schedule.team.name}</h3>
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          done
                            ? isActive ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-700'
                            : isActive ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {done && <CheckCircle2 size={10} />}
                          {scoredCount}/3 Scored
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Graph Area: fills remaining width, scrolls horizontally */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden bg-secondary/20">
              <div className="h-full flex items-center px-8">
                {selectedSchedule ? (
                  <div className="flex items-center gap-5 min-w-max">
                    {selectedSchedule.matches.map((match, i) => {
                      const isScored = isCompleted(match.status);
                      const opponent = match.teamA._id === selectedSchedule.team._id ? match.teamB : match.teamA;
                      return (
                        <div key={match._id} className="flex items-center gap-5">
                          <div className="w-56 bg-white rounded-2xl shadow-sm border border-border/80 overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform">
                            <div className="p-4 border-b border-border/50">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">NODE #{i + 1}</span>
                                <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                                  isScored ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {isScored ? 'SCORED' : 'PENDING'}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-primary leading-tight">vs {opponent?.name || '---'}</h4>
                            </div>
                            <button
                              onClick={() => openScoreModal(match, i + 1)}
                              className="p-3 bg-secondary/30 hover:bg-primary hover:text-white transition-colors text-center"
                            >
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary group-hover:text-white">
                                {isScored ? 'View / Edit Score' : 'Enter Score'}
                              </span>
                            </button>
                          </div>
                          {i < 2 && <ArrowRight size={18} className="text-primary/20 flex-shrink-0" />}
                        </div>
                      );
                    })}
                    <ArrowRight size={18} className="text-primary/20 flex-shrink-0 ml-1" />
                    <div className="w-14 h-14 rounded-full bg-amber-100 border-4 border-white shadow-lg flex items-center justify-center text-amber-500 flex-shrink-0">
                      <Trophy size={22} />
                    </div>
                  </div>
                ) : (
                  <p className="text-primary/40 font-bold">Select a team to view their matches.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Preliminary Score Entry Modal */}
      <AnimatePresence>
        {scoreModalMatch && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setScoreModalMatch(null)} />
            <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-border">

              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-xl font-black text-primary">Node {scoreModalMatch.teamIndex} — Score Entry</h3>
                  <p className="text-xs text-primary/40 font-medium mt-1">{scoreModalMatch.match.teamA?.name} vs {scoreModalMatch.match.teamB?.name}</p>
                </div>
                <button onClick={() => setScoreModalMatch(null)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary/40 hover:bg-border transition-colors"><X size={16}/></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Team A */}
                {(['A', 'B'] as const).map(side => {
                  const team = side === 'A' ? scoreModalMatch.match.teamA : scoreModalMatch.match.teamB;
                  const scores = side === 'A' ? scoreForm.aScores : scoreForm.bScores;
                  const total = scores.reduce((s, m) => s + (m.points || 0), 0);
                  const isWinner = scoreForm.winner === side;
                  return (
                    <div key={side} className={`p-4 rounded-2xl border-2 transition-all ${isWinner ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-secondary/20'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-black text-primary truncate">{team?.name}</p>
                        <div className="flex bg-white rounded-lg p-0.5 border border-border">
                          <button
                            onClick={() => setScoreForm(f => ({ ...f, winner: side }))}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${isWinner ? 'bg-emerald-500 text-white' : 'text-primary/40 hover:text-primary'}`}
                          >Won</button>
                          <button
                            onClick={() => setScoreForm(f => ({ ...f, winner: side === 'A' ? 'B' : 'A' }))}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${!isWinner ? 'bg-red-400 text-white' : 'text-primary/40 hover:text-primary'}`}
                          >Lost</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {scores.map((member, idx) => (
                          <div key={member.memberId} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-white border border-border flex items-center justify-center text-[9px] font-black text-primary/40 flex-shrink-0">{idx + 1}</div>
                            <span className="flex-1 text-xs font-bold text-primary truncate">{member.fullName}</span>
                            <input
                              type="number" min={0}
                              value={member.points || ''}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                if (side === 'A') setScoreForm(f => ({ ...f, aScores: f.aScores.map((s, i) => i === idx ? { ...s, points: val } : s) }));
                                else setScoreForm(f => ({ ...f, bScores: f.bScores.map((s, i) => i === idx ? { ...s, points: val } : s) }));
                              }}
                              className="w-16 bg-white border border-border rounded-lg px-2 py-1.5 text-primary font-black text-xs text-center focus:outline-none focus:ring-2 focus:ring-accent/30"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Total</span>
                        <span className={`text-lg font-black ${isWinner ? 'text-emerald-600' : 'text-primary'}`}>{total} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setScoreModalMatch(null)} className="px-5 py-2.5 rounded-xl border border-border text-primary/50 hover:text-primary text-xs font-black transition-colors">Cancel</button>
                <button disabled={savingScore} onClick={saveScoreModal} className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-accent text-xs font-black transition-colors disabled:opacity-50">
                  {savingScore ? 'Saving...' : 'Save result'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Knockout Score Entry Modal */}
      <AnimatePresence>
        {knockoutModalMatch && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setKnockoutModalMatch(null)} />
            <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-border">

              <div className="mb-5 border-b border-border pb-4">
                <h3 className="text-xl font-black text-primary">{knockoutModalMatch.title}</h3>
                <p className="text-xs text-primary/40 font-medium mt-1">{knockoutModalMatch.match.teamA?.name} vs {knockoutModalMatch.match.teamB?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(['A', 'B'] as const).map(side => {
                  const team = side === 'A' ? knockoutModalMatch.match.teamA : knockoutModalMatch.match.teamB;
                  const scores = side === 'A' ? knockoutForm.aScores : knockoutForm.bScores;
                  const total = scores.reduce((s, m) => s + (m.points || 0), 0);
                  const isWinner = knockoutForm.winner === side;
                  return (
                    <div key={side} className={`p-4 rounded-2xl border-2 transition-all ${isWinner ? 'border-emerald-300 bg-emerald-50' : 'border-border bg-secondary/20'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-black text-primary truncate">{team?.name}</p>
                        <div className="flex bg-white rounded-lg p-0.5 border border-border">
                          <button
                            onClick={() => setKnockoutForm(f => ({ ...f, winner: side }))}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${isWinner ? 'bg-emerald-500 text-white' : 'text-primary/40 hover:text-primary'}`}
                          >Won</button>
                          <button
                            onClick={() => setKnockoutForm(f => ({ ...f, winner: side === 'A' ? 'B' : 'A' }))}
                            className={`px-2 py-1 rounded-md text-[10px] font-black transition-all ${!isWinner ? 'bg-red-400 text-white' : 'text-primary/40 hover:text-primary'}`}
                          >Lost</button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {scores.map((member, idx) => (
                          <div key={member.memberId} className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-white border border-border flex items-center justify-center text-[9px] font-black text-primary/40 flex-shrink-0">{idx + 1}</div>
                            <span className="flex-1 text-xs font-bold text-primary truncate">{member.fullName}</span>
                            <input
                              type="number" min={0}
                              value={member.points || ''}
                              onChange={e => {
                                const val = parseInt(e.target.value) || 0;
                                if (side === 'A') setKnockoutForm(f => ({ ...f, aScores: f.aScores.map((s, i) => i === idx ? { ...s, points: val } : s) }));
                                else setKnockoutForm(f => ({ ...f, bScores: f.bScores.map((s, i) => i === idx ? { ...s, points: val } : s) }));
                              }}
                              className="w-16 bg-white border border-border rounded-lg px-2 py-1.5 text-primary font-black text-xs text-center focus:outline-none focus:ring-2 focus:ring-accent/30"
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Total</span>
                        <span className={`text-lg font-black ${isWinner ? 'text-emerald-600' : 'text-primary'}`}>{total} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setKnockoutModalMatch(null)} className="px-6 py-3 rounded-xl border border-border text-primary/50 hover:text-primary text-sm font-black transition-colors">Cancel</button>
                <button disabled={savingScore} onClick={saveKnockoutModal} className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-accent text-sm font-black transition-colors disabled:opacity-50 flex items-center gap-2">
                  {savingScore ? 'Saving...' : 'Save & advance winner'} <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal open={resetConfirm} onClose={() => setResetConfirm(false)} onConfirm={handleReset} loading={actionLoading} variant="danger" title="Reset All Matchups" message="This will delete all preliminary matchups and results." confirmLabel="Yes, Reset" />

    </div>
  );
};

export default MatchmakingPage;
