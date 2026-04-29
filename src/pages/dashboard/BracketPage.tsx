import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import bracketService from '../../services/bracketService';
import matchService from '../../services/matchService';
import { useSocket } from '../../context/SocketContext';
import { RefreshCcw, Trophy, Zap, RotateCcw, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/common/Toast';

interface Team { _id: string; name: string; totalPoints: number; members?: { _id: string; fullName: string; speakerOrder: number }[]; }
interface Match {
  _id: string;
  teamA: Team;
  teamB: Team;
  winner: Team | null;
  status: string;
  stage: string;
  bracketSlot?: number;
  teamASpeakerScores?: { memberId: string; points: number }[];
  teamBSpeakerScores?: { memberId: string; points: number }[];
}

// Backend enum values
const STAGES = ['R16', 'QF', 'SF', 'Final'] as const;
const STAGE_LABELS: Record<string, string> = {
  R16: 'Round of 16',
  QF: 'Quarter Finals',
  SF: 'Semi Finals',
  Final: 'Grand Final',
};
const STAGE_MATCH_COUNT: Record<string, number> = { R16: 8, QF: 4, SF: 2, Final: 1 };

const isCompleted = (status: string) => status?.toLowerCase().includes('completed');

const BracketPage = () => {
  const { eventId } = useParams();
  const [bracket, setBracket] = useState<Record<string, Match[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [_searchParams] = useSearchParams();
  const { socket } = useSocket();
  const { toast } = useToast();

  // Score modal
  const [scoreModal, setScoreModal] = useState<{ match: Match; title: string } | null>(null);
  const [scoreForm, setScoreForm] = useState<{
    winner: 'A' | 'B';
    aScores: { memberId: string; fullName: string; points: number }[];
    bScores: { memberId: string; fullName: string; points: number }[];
  }>({ winner: 'A', aScores: [], bScores: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBracket();
    if (!socket) return;
    socket.emit('joinEvent', eventId);
    socket.on('bracket:generated', fetchBracket);
    socket.on('bracket:updated', fetchBracket);
    socket.on('match:updated', fetchBracket);
    return () => {
      socket.off('bracket:generated');
      socket.off('bracket:updated');
      socket.off('match:updated');
    };
  }, [eventId, socket]);

  const fetchBracket = async () => {
    if (!eventId) return;
    try {
      const data = await bracketService.getBracket(eventId);
      setBracket(data);
    } catch { toast('Failed to load bracket', 'error'); }
    finally { setIsLoading(false); }
  };

  const generateBracket = async () => {
    if (!eventId) return;
    setIsGenerating(true);
    try {
      await bracketService.generateBracket(eventId);
      toast('Bracket generated!');
      await fetchBracket();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to generate bracket', 'error');
    } finally { setIsGenerating(false); }
  };

  const buildScores = (team: Team, existing?: { memberId: string; points: number }[]) =>
    (team?.members ?? []).map(m => ({
      memberId: m._id,
      fullName: m.fullName || `Speaker ${m.speakerOrder}`,
      points: existing?.find(s => s.memberId === m._id)?.points ?? 0,
    }));

  const openScoreModal = (match: Match, title: string) => {
    const aWon = match.winner?._id === match.teamA?._id;
    setScoreForm({
      winner: aWon ? 'A' : 'B',
      aScores: buildScores(match.teamA, match.teamASpeakerScores),
      bScores: buildScores(match.teamB, match.teamBSpeakerScores),
    });
    setScoreModal({ match, title });
  };

  const saveScore = async () => {
    if (!scoreModal) return;
    const { match } = scoreModal;
    setSaving(true);
    try {
      const winnerId = scoreForm.winner === 'A' ? match.teamA._id : match.teamB._id;
      const loserId = scoreForm.winner === 'A' ? match.teamB._id : match.teamA._id;
      await matchService.enterResult(match._id, {
        winnerId,
        loserId,
        teamASpeakerScores: scoreForm.aScores.map(s => ({ memberId: s.memberId, points: s.points })),
        teamBSpeakerScores: scoreForm.bScores.map(s => ({ memberId: s.memberId, points: s.points })),
      });
      toast('Result saved — winner advances');
      setScoreModal(null);
      await fetchBracket();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to save result', 'error');
    } finally { setSaving(false); }
  };

  const isEmpty = STAGES.every(s => !bracket[s] || bracket[s].length === 0);
  const hasR16 = bracket['R16'] && bracket['R16'].length > 0;

  const renderStage = (stageName: string) => {
    const matches = bracket[stageName] || [];
    const count = STAGE_MATCH_COUNT[stageName] ?? 1;
    const isLast = stageName === 'Final';

    return (
      <div className="flex-shrink-0 w-72">
        <div className="text-center mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 py-2 border-y border-primary/5">
            {STAGE_LABELS[stageName]}
          </h3>
        </div>

        <div className="space-y-6">
          {Array.from({ length: count }).map((_, i) => {
            const match = matches.find(m => m.bracketSlot === i) ?? matches[i];
            const completed = match && isCompleted(match.status);

            return (
              <div key={match?._id ?? i} className="relative">
                {!isLast && (
                  <div className="absolute -right-8 top-1/2 w-8 h-px bg-border" />
                )}

                <div className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${completed ? 'border-accent shadow-lg shadow-accent/10' : 'border-border shadow-sm'}`}>
                  {([0, 1] as const).map(posIdx => {
                    const team = posIdx === 0 ? match?.teamA : match?.teamB;
                    const isWinner = completed && match?.winner?._id === team?._id;

                    return (
                      <div key={posIdx}>
                        {posIdx === 1 && <div className="h-px bg-border/40 mx-4" />}
                        <div
                          className={`flex items-center justify-between px-4 py-3.5 transition-all ${isWinner ? 'bg-accent/5' : ''} ${match && match.teamA && match.teamB && !completed ? 'hover:bg-secondary/50 cursor-pointer' : ''}`}
                          onClick={() => match && match.teamA && match.teamB && !completed && openScoreModal(match, `${STAGE_LABELS[stageName]} — Match ${i + 1}`)}
                        >
                          {team ? (
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] flex-shrink-0 ${isWinner ? 'bg-accent text-white' : 'bg-secondary text-primary/30'}`}>
                                {isWinner ? '✓' : posIdx + 1}
                              </div>
                              <div className="min-w-0">
                                <p className={`font-black text-xs truncate ${isWinner ? 'text-accent' : 'text-primary'}`}>{team.name}</p>
                                <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{team.totalPoints} pts</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 opacity-30">
                              <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center font-black text-[10px] text-primary/30">{posIdx + 1}</div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">
                                {match ? 'Waiting...' : 'TBD'}
                              </p>
                            </div>
                          )}
                          {match && match.teamA && match.teamB && !completed && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-accent/60 flex-shrink-0 ml-2">Score →</span>
                          )}
                          {isWinner && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-accent flex-shrink-0 ml-2">Winner</span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Edit result button if completed */}
                  {completed && (
                    <button
                      onClick={() => openScoreModal(match!, `${STAGE_LABELS[stageName]} — Match ${i + 1}`)}
                      className="w-full py-2 text-[9px] font-black uppercase tracking-widest text-primary/30 hover:text-accent hover:bg-accent/5 transition-colors border-t border-border/30"
                    >
                      Edit Result
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[9px] font-black uppercase tracking-widest">
            Live Tournament
          </span>
          <h1 className="text-5xl font-black tracking-tighter text-primary mt-2">
            Knockout <span className="text-primary/20">Bracket</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchBracket} className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary/30 hover:text-accent transition-all">
            <RotateCcw size={20} />
          </button>
          {isEmpty && (
            <button
              onClick={generateBracket}
              disabled={isGenerating}
              className="btn-accent py-4 px-8 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-accent/20 disabled:opacity-50"
            >
              {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <Zap size={18} />}
              {isGenerating ? 'Generating...' : 'Auto-Seed Bracket'}
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 bg-white/60 rounded-[3rem] animate-pulse" />
      ) : isEmpty ? (
        <div className="bg-white border-2 border-dashed border-border rounded-[3rem] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center text-primary/20 mb-6">
            <Trophy size={40} />
          </div>
          <h3 className="text-2xl font-black text-primary mb-2">No Bracket Yet</h3>
          <p className="text-primary/40 font-medium text-sm mb-8">Complete preliminary rounds first, then generate the bracket from the Match Console.</p>
          <button onClick={generateBracket} disabled={isGenerating} className="btn-accent py-4 px-10 rounded-2xl font-black text-sm">
            {isGenerating ? 'Generating...' : 'Auto-Seed Bracket'}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto pb-10">
          <div className="flex gap-16 items-start min-w-max px-4 pt-4">
            {hasR16 && renderStage('R16')}
            <div className={hasR16 ? 'pt-16' : ''}>{renderStage('QF')}</div>
            <div className={hasR16 ? 'pt-40' : 'pt-24'}>{renderStage('SF')}</div>
            <div className={hasR16 ? 'pt-[168px]' : 'pt-48'}>{renderStage('Final')}</div>

            {/* Champion column */}
            <div className={`flex-shrink-0 w-64 flex flex-col items-center ${hasR16 ? 'pt-[280px]' : 'pt-64'}`}>
              <div className="text-center mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent py-2 border-y border-accent/10">Champion</h3>
              </div>
              {bracket['Final']?.[0]?.winner ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
                  <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full" />
                  <div className="relative bg-white p-10 rounded-[3rem] border-4 border-accent shadow-2xl flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-accent rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-accent/30">
                      <Trophy size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-primary tracking-tighter mb-1">{bracket['Final'][0].winner.name}</h2>
                    <p className="text-accent font-black text-[10px] uppercase tracking-[0.2em]">Grand Champion</p>
                  </div>
                </motion.div>
              ) : (
                <div className="w-56 h-56 border-4 border-dashed border-border/20 rounded-[3rem] flex flex-col items-center justify-center opacity-20">
                  <Trophy size={36} className="mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Final</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Score Entry Modal */}
      <AnimatePresence>
        {scoreModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setScoreModal(null)} />
            <motion.div initial={{ y: 20, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 20, opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-border">

              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-xl font-black text-primary">{scoreModal.title}</h3>
                  <p className="text-xs text-primary/40 font-medium mt-1">{scoreModal.match.teamA?.name} vs {scoreModal.match.teamB?.name}</p>
                </div>
                <button onClick={() => setScoreModal(null)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary/40 hover:bg-border transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {(['A', 'B'] as const).map(side => {
                  const team = side === 'A' ? scoreModal.match.teamA : scoreModal.match.teamB;
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

                      {scores.length > 0 ? (
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
                      ) : (
                        <p className="text-[10px] text-primary/30 font-bold italic">No members registered</p>
                      )}

                      <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Total</span>
                        <span className={`text-lg font-black ${isWinner ? 'text-emerald-600' : 'text-primary'}`}>{total} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button onClick={() => setScoreModal(null)} className="px-5 py-2.5 rounded-xl border border-border text-primary/50 hover:text-primary text-xs font-black transition-colors">Cancel</button>
                <button disabled={saving} onClick={saveScore} className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-accent text-xs font-black transition-colors disabled:opacity-50 flex items-center gap-2">
                  {saving ? 'Saving...' : 'Save & advance winner'} <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BracketPage;
