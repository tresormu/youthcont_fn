import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import matchService from '../../services/matchService';
import schoolService from '../../services/schoolService';
import { useSocket } from '../../context/SocketContext';
import { Sword, RefreshCcw, CheckCircle2, RotateCcw, Zap, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface Team { _id: string; name: string; totalPoints: number; }
interface Match { _id: string; teamA: Team; teamB: Team; winner: string | null; status: 'PENDING' | 'COMPLETED'; }
interface Matchup { _id: string; schoolA: { name: string; _id: string }; schoolB: { name: string; _id: string } | null; matches: Match[]; }

const MatchmakingPage = () => {
  const { eventId } = useParams();
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualSelection, setManualSelection] = useState({ schoolA: '', schoolB: '' });
  const [winnerConfirm, setWinnerConfirm] = useState<{ matchId: string; winnerId: string; teamName: string } | null>(null);
  const [voidConfirm, setVoidConfirm] = useState<{ matchId: string } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'auto';
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    fetchMatchups();
    fetchSchools();
    if (socket) {
      socket.emit('joinEvent', eventId);
      socket.on('matchups:created', fetchMatchups);

      socket.on('match:updated', fetchMatchups);
      return () => { socket.off('matchups:created'); socket.off('match:updated'); };
    }
  }, [eventId, socket]);

  const fetchMatchups = async () => {
    if (!eventId) return;
    try {
      const matchupsData = await matchService.getMatchups(eventId);
      const withMatches = await Promise.all(
        matchupsData.map(async (m: any) => {
          const matchesData = await matchService.getMatches(m._id);
          return { ...m, matches: matchesData };
        })
      );
      setMatchups(withMatches);
    } catch { toast('Failed to load matchups', 'error'); }
    finally { setIsLoading(false); }
  };

  const fetchSchools = async () => {
    if (!eventId) return;
    try {
      const data = await schoolService.getSchools(eventId);
      setSchools(data);
    } catch {}
  };

  const handleAutoAssign = async () => {
    if (!eventId) return;
    setIsGenerating(true);
    try {
      await matchService.autoAssign(eventId);
      toast('Matchups generated!');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to auto-assign', 'error');
    } finally { setIsGenerating(false); }
  };

  const handleManualPair = async () => {
    if (!eventId || !manualSelection.schoolA || !manualSelection.schoolB) {
      toast('Please select both schools', 'warning');
      return;
    }
    try {
      await matchService.createMatchup(eventId, {
        schoolAId: manualSelection.schoolA,
        schoolBId: manualSelection.schoolB,
        stage: 'PRELIMINARY'
      });
      setShowManualModal(false);
      setManualSelection({ schoolA: '', schoolB: '' });
      fetchMatchups();
      toast('Matchup created!');
    } catch { toast('Failed to create matchup', 'error'); }
  };

  const confirmSetWinner = async () => {
    if (!winnerConfirm) return;
    setActionLoading(true);
    try {
      await matchService.enterResult(winnerConfirm.matchId, { winnerId: winnerConfirm.winnerId });
      toast(`${winnerConfirm.teamName} marked as winner — 3 points awarded`);
    } catch { toast('Failed to set winner', 'error'); }
    finally { setActionLoading(false); setWinnerConfirm(null); }
  };

  const confirmVoid = async () => {
    if (!voidConfirm) return;
    setActionLoading(true);
    try {
      await matchService.voidResult(voidConfirm.matchId);
      toast('Result voided — points reverted');
    } catch { toast('Failed to void result', 'error'); }
    finally { setActionLoading(false); setVoidConfirm(null); }
  };


  const unassignedSchools = useMemo(() => {
    const assignedIds = new Set([
      ...matchups.map(m => m.schoolA._id),
      ...matchups.map(m => m.schoolB?._id).filter(Boolean)
    ]);
    return schools.filter(s => !assignedIds.has(s._id));
  }, [schools, matchups]);

  const handleReset = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/events/${eventId}/matchups`);
      setMatchups([]);
      toast('All matchups reset');
    } catch { toast('Failed to reset matchups', 'error'); }
    finally { setActionLoading(false); setResetConfirm(false); }
  };

  const handleFinishPairing = async () => {
    if (unassignedSchools.length > 0) {
      toast(`${unassignedSchools.length} schools still unassigned`, 'warning');
      return;
    }
    toast('All schools paired! Proceeding to Scoring...');
    navigate(`/dashboard/events/${eventId}/matchmaking?mode=scoring`);
  };

  const canGenerate = matchups.length === 0 && !isGenerating;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Match Console</h1>
          <p className="text-primary/40 font-medium mt-1">Manage preliminary matchups and score results in real-time</p>
        </div>
        <div className="flex gap-3">
          {mode === 'manual' && (
            <button
              onClick={handleFinishPairing}
              disabled={unassignedSchools.length > 0}
              className="btn-accent py-3.5 px-6 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 disabled:opacity-40"
            >
              Finish Pairing & Proceed
            </button>
          )}
          {matchups.length > 0 && (
            <button
              onClick={() => setResetConfirm(true)}
              className="px-5 py-3.5 rounded-2xl font-black text-xs text-destructive hover:bg-destructive/5 transition-all flex items-center gap-2 border border-destructive/20"
            >
              <RotateCcw size={15} />
              Reset All
            </button>
          )}
          {mode === 'manual' && (
            <button
              disabled={unassignedSchools.length < 2}
              onClick={() => setShowManualModal(true)}
              className="px-5 py-3.5 rounded-2xl font-black text-xs text-primary/60 hover:bg-white hover:text-accent border border-border transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <Plus size={15} />
              Pair Schools
            </button>
          )}
        </div>
      </div>

      {mode === 'manual' && unassignedSchools.length > 0 && (
        <div className="bg-accent/5 border border-accent/20 p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-primary flex items-center gap-3">
              <Sword size={20} className="text-accent" />
              Unassigned Schools ({unassignedSchools.length})
            </h2>
            <p className="text-primary/40 text-xs font-bold italic">Select and pair these schools to proceed</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {unassignedSchools.map(school => (
              <div key={school._id} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center font-black text-primary/30 mb-2">
                  {school.name.charAt(0)}
                </div>
                <p className="text-[10px] font-black text-primary truncate w-full">{school.name}</p>
                <p className="text-[8px] font-bold text-primary/20 uppercase tracking-widest mt-1">{school.region}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/60 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : matchups.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-border rounded-[3rem] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center text-primary/20 mb-6">
            <Sword size={40} />
          </div>
          <h3 className="text-2xl font-black text-primary mb-2">No Matchups Yet</h3>
          <p className="text-primary/40 font-medium max-w-sm">
            {mode === 'manual' ? 'Start pairing schools manually above.' : 'Generate random pairings automatically.'}
          </p>
          {mode === 'auto' && (
            <button
              onClick={handleAutoAssign}
              className="mt-8 btn-accent py-4 px-10 rounded-2xl font-black text-sm shadow-xl shadow-accent/20"
            >
              Auto-Generate Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {matchups.map((matchup) => (
            <motion.div
              key={matchup._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-border/50 shadow-xl shadow-black/5 overflow-hidden"
            >
              {/* Matchup header */}
              <div className="bg-primary p-7 text-white flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">School A</p>
                    <h3 className="text-xl font-black">{matchup.schoolA.name}</h3>
                  </div>
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center font-black text-xs italic shadow-lg shadow-accent/30">VS</div>
                  <div className="text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">School B</p>
                    <h3 className="text-xl font-black">{matchup.schoolB?.name || 'BYE'}</h3>
                  </div>
                </div>
                <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[9px] font-black uppercase tracking-widest">
                  {matchup.matches.filter(m => m.status === 'COMPLETED').length}/{matchup.matches.length} Scored
                </span>
              </div>

              {/* Individual matches */}
              <div className="p-6 space-y-3">
                {matchup.matches.map((match, idx) => (
                  <div
                    key={match._id}
                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${match.status === 'COMPLETED' ? 'bg-secondary/30 border-transparent' : 'bg-white border-border'}`}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-xs font-black text-primary/30">
                        {idx + 1}
                      </div>

                      <div className={`flex-1 ${match.winner === match.teamA?._id ? 'text-accent' : ''}`}>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">{matchup.schoolA.name}</p>
                        <h4 className="text-sm font-black">{match.teamA?.name}</h4>
                      </div>

                      <div className="px-3">
                        {match.status === 'COMPLETED'
                          ? <CheckCircle2 size={18} className="text-accent" />
                          : <div className="w-5 h-px bg-border" />}
                      </div>

                      <div className={`flex-1 text-right ${match.winner === match.teamB?._id ? 'text-accent' : ''}`}>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">{matchup.schoolB?.name}</p>
                        <h4 className="text-sm font-black">{match.teamB?.name || '---'}</h4>
                      </div>
                    </div>

                    <div className="ml-8 pl-8 border-l border-border flex items-center gap-2">
                      {match.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => setWinnerConfirm({ matchId: match._id, winnerId: match.teamA._id, teamName: match.teamA.name })}
                            className="px-4 py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-wider hover:bg-accent transition-all"
                          >
                            Win A
                          </button>
                          {match.teamB && (
                            <button
                              onClick={() => setWinnerConfirm({ matchId: match._id, winnerId: match.teamB._id, teamName: match.teamB.name })}
                              className="px-4 py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-wider hover:bg-accent transition-all"
                            >
                              Win B
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => setVoidConfirm({ matchId: match._id })}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive/8 text-destructive text-[9px] font-black uppercase tracking-wider hover:bg-destructive hover:text-white transition-all"
                        >
                          <RotateCcw size={11} />
                          Void
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Manual Pairing Modal */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowManualModal(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              <h2 className="text-2xl font-black text-primary mb-1">Manual Matchup</h2>
              <p className="text-primary/40 font-medium text-sm mb-8">Select two schools to create a qualification matchup.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-primary/30 mb-2 ml-1">School A</label>
                  <select
                    className="w-full bg-secondary px-5 py-4 rounded-2xl font-bold text-sm outline-none appearance-none"
                    value={manualSelection.schoolA}
                    onChange={(e) => setManualSelection({ ...manualSelection, schoolA: e.target.value })}
                  >
                    <option value="">Choose school...</option>
                    {unassignedSchools.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="flex justify-center">
                  <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-black text-xs italic">VS</div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-primary/30 mb-2 ml-1">School B</label>
                  <select
                    className="w-full bg-secondary px-5 py-4 rounded-2xl font-bold text-sm outline-none appearance-none"
                    value={manualSelection.schoolB}
                    onChange={(e) => setManualSelection({ ...manualSelection, schoolB: e.target.value })}
                  >
                    <option value="">Choose school...</option>
                    {unassignedSchools.filter(s => s._id !== manualSelection.schoolA).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowManualModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all">
                    Cancel
                  </button>
                  <button onClick={handleManualPair}
                    className="flex-[2] btn-accent py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20">
                    Confirm Matchup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!winnerConfirm}
        onClose={() => setWinnerConfirm(null)}
        onConfirm={confirmSetWinner}
        loading={actionLoading}
        variant="confirm"
        title="Declare Winner"
        message={`Mark "${winnerConfirm?.teamName}" as the winner? They will receive 3 points and this result will be recorded.`}
        confirmLabel="Confirm Win"
      />

      <ConfirmModal
        open={!!voidConfirm}
        onClose={() => setVoidConfirm(null)}
        onConfirm={confirmVoid}
        loading={actionLoading}
        variant="danger"
        title="Void Match Result"
        message="Are you sure you want to void this result? The 3 points will be reverted and the match will return to Pending status."
        confirmLabel="Yes, Void Result"
      />

      <ConfirmModal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleReset}
        loading={actionLoading}
        variant="danger"
        title="Reset All Matchups"
        message="This will delete all preliminary matchups and results. This action cannot be undone."
        confirmLabel="Yes, Reset All"
      />
    </div>
  );
};

export default MatchmakingPage;
