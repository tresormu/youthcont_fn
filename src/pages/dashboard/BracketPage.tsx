import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import bracketService from '../../services/bracketService';
import teamService from '../../services/teamService';
import matchService from '../../services/matchService';
import { useSocket } from '../../context/SocketContext';
import { RefreshCcw, Trophy, Zap, Medal, RotateCcw, Sword } from 'lucide-react';
import { motion } from 'framer-motion';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface Team { _id: string; name: string; totalPoints: number; }
interface Match { _id: string; teamA: Team; teamB: Team; winner: Team | null; status: 'PENDING' | 'COMPLETED'; stage: string; }

const STAGE_LABELS: Record<string, string> = {
  QUARTER_FINAL: 'Quarter Finals',
  SEMI_FINAL: 'Semi Finals',
  FINAL: 'Grand Final',
};

const BracketPage = () => {
  const { eventId } = useParams();
  const [bracket, setBracket] = useState<Record<string, Match[]>>({});
  const [power8, setPower8] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [winnerConfirm, setWinnerConfirm] = useState<{ matchId: string; winnerId: string; teamName: string } | null>(null);
  const [voidConfirm, setVoidConfirm] = useState<{ matchId: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'auto';
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    fetchBracket();
    if (socket) {
      socket.emit('joinEvent', eventId);
      socket.on('bracket:generated', fetchBracket);

      socket.on('bracket:updated', fetchBracket);
      socket.on('match:updated', fetchBracket);
      return () => {
        socket.off('bracket:generated');
        socket.off('bracket:updated');
        socket.off('match:updated');
      };
    }
  }, [eventId, socket]);

  const fetchBracket = async () => {
    if (!eventId) return;
    try {
      const data = await bracketService.getBracket(eventId);
      setBracket(data);
      const isEmpty = Object.values(data).every((arr: any) => arr.length === 0);
      if (isEmpty) {
        const rankingsData = await teamService.getRankings(eventId);
        setPower8(rankingsData.slice(0, 8));
      }
    } catch { toast('Failed to load bracket', 'error'); }
    finally { setIsLoading(false); }
  };

  const generateBracket = async () => {
    if (!eventId) return;
    setIsGenerating(true);
    try {
      await bracketService.generateBracket(eventId);
      toast('Power 8 bracket generated!');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to generate bracket', 'error');
    } finally { setIsGenerating(false); }
  };

  const confirmSetWinner = async () => {
    if (!winnerConfirm) return;
    setActionLoading(true);
    try {
      await matchService.enterResult(winnerConfirm.matchId, { winnerId: winnerConfirm.winnerId });
      toast(`${winnerConfirm.teamName} advances — 3 points awarded`);
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


  const unassignedTeams = useMemo(() => {
    const assignedIds = new Set<string>();
    Object.values(bracket).forEach((matches: any[]) => {
      matches.forEach(m => {
        if (m.teamA) assignedIds.add(m.teamA._id);
        if (m.teamB) assignedIds.add(m.teamB._id);
      });
    });
    return power8.filter(t => !assignedIds.has(t.name)); // Using name for mock matching
  }, [power8, bracket]);

  const handleManualPlace = async (matchId: string, teamId: string, position: 'teamA' | 'teamB') => {
    if (!power8.some(t => t.name === teamId)) { // Using name for mock
      toast('Security Alert: This team was not selected for Power 8!', 'error');
      return;
    }

    try {
      await api.patch(`/matches/${matchId}/place`, { teamId, position });
      fetchBracket();
      toast('Team placed in bracket');
    } catch { toast('Failed to place team', 'error'); }
  };

  const handleInteractiveAdvance = async (match: Match, winner: Team) => {
    if (match.status === 'COMPLETED' && match.winner?._id === winner._id) return;
    setWinnerConfirm({ matchId: match._id, winnerId: winner._id, teamName: winner.name });
  };

  const isEmpty = Object.values(bracket).every((arr: any) => arr.length === 0);

  const renderStage = (stageName: string, isLast = false) => {
    const matches = bracket[stageName] || [];
    const totalExpected = stageName === 'QUARTER_FINAL' ? 4 : stageName === 'SEMI_FINAL' ? 2 : 1;

    return (
      <div className="flex-1 min-w-[280px] relative">
        <div className="text-center mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/30 py-2 border-y border-primary/5">{STAGE_LABELS[stageName]}</h3>
        </div>
        
        <div className="space-y-12 relative">
          {Array.from({ length: totalExpected }).map((_, i) => {
            const match = matches[i];
            return (
              <div key={match?._id || i} className="relative group">
                {!isLast && (
                  <div className="absolute -right-8 top-1/2 w-8 h-px bg-border group-hover:bg-accent/30 transition-colors" />
                )}
                
                <div className={`bg-white border-2 rounded-[2rem] overflow-hidden transition-all duration-500
                  ${match?.status === 'COMPLETED' ? 'border-accent shadow-xl shadow-accent/5' : 'border-border shadow-sm'}`}>
                  
                  {[0, 1].map((posIdx) => {
                    const team = posIdx === 0 ? match?.teamA : match?.teamB;
                    const position = posIdx === 0 ? 'teamA' : 'teamB';
                    const isWinner = match?.winner?._id === team?._id;
                    const canSelect = match?.status === 'PENDING' && team;

                    return (
                      <div key={posIdx} className="relative">
                        {posIdx === 1 && <div className="h-px bg-border/50 mx-4" />}
                        
                        <div className={`flex items-center justify-between p-5 transition-all
                          ${isWinner ? 'bg-accent/5' : ''}
                          ${canSelect ? 'hover:bg-secondary cursor-pointer' : ''}`}
                          onClick={() => canSelect && handleInteractiveAdvance(match, team)}
                        >
                          {team ? (
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px]
                                ${isWinner ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-secondary text-primary/30'}`}>
                                {isWinner ? '✓' : posIdx === 0 ? '1' : '2'}
                              </div>
                              <div>
                                <p className="font-black text-xs text-primary">{team.name}</p>
                                <p className="text-[8px] font-black uppercase text-primary/20 tracking-widest">{team.totalPoints} pts</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4 opacity-30">
                              <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center font-black text-[10px] text-primary/30">
                                {posIdx === 0 ? '1' : '2'}
                              </div>
                              {mode === 'manual' && stageName === 'QUARTER_FINAL' ? (
                                <select 
                                  className="bg-transparent border-none text-[10px] font-black uppercase text-accent outline-none"
                                  onChange={(e) => handleManualPlace(match?._id || `m_${i}`, e.target.value, position)}
                                >
                                  <option>Assign Team</option>
                                  {unassignedTeams.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                                </select>
                              ) : (
                                <p className="text-[10px] font-black uppercase tracking-widest">TBD</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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
      <div className="flex items-center justify-between border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-[9px] font-black uppercase tracking-widest">
              Live Tournament Logic
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-primary">Power 8 <span className="text-primary/20">Brackets</span></h1>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={fetchBracket}
            className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary/30 hover:text-accent transition-all"
          >
            <RotateCcw size={20} />
          </button>
          {isEmpty && mode === 'auto' && (
            <button
              onClick={generateBracket}
              disabled={isGenerating}
              className="btn-accent py-4 px-8 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-accent/20"
            >
              {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <Zap size={18} />}
              Auto-Seed Bracket
            </button>
          )}
        </div>
      </div>

      {mode === 'manual' && unassignedTeams.length > 0 && (
        <div className="bg-primary p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-2xl shadow-primary/20">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <Sword size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Staging Area</p>
              <p className="text-sm font-bold">{unassignedTeams.length} teams waiting to be assigned</p>
            </div>
          </div>
          <div className="flex gap-2">
            {unassignedTeams.slice(0, 4).map(t => (
              <div key={t.name} className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black border border-white/10">{t.name}</div>
            ))}
            {unassignedTeams.length > 4 && <div className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black opacity-40">+{unassignedTeams.length - 4} more</div>}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="h-96 bg-white/60 rounded-[3rem] animate-pulse" />
      ) : (
        <div className="relative pt-10">
          <div className="flex gap-16 items-start overflow-x-auto pb-10 px-4">
            {renderStage('QUARTER_FINAL')}
            <div className="pt-24">{renderStage('SEMI_FINAL')}</div>
            <div className="pt-48">{renderStage('FINAL', true)}</div>

            <div className="flex-1 min-w-[300px] flex flex-col items-center pt-64">
              <div className="text-center mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent py-2 border-y border-accent/10">Champion</h3>
              </div>
              
              {bracket['FINAL']?.[0]?.winner ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group">
                  <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full group-hover:bg-accent/40 transition-all duration-1000" />
                  <div className="relative bg-white p-12 rounded-[4rem] border-4 border-accent shadow-2xl flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-accent rounded-[2.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-accent/30">
                      <Trophy size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-primary tracking-tighter mb-2">{bracket['FINAL'][0].winner.name}</h2>
                    <p className="text-accent font-black text-[10px] uppercase tracking-[0.2em]">Grand Champion</p>
                  </div>
                </motion.div>
              ) : (
                <div className="w-64 h-64 border-4 border-dashed border-border/20 rounded-[4rem] flex flex-col items-center justify-center opacity-20">
                  <Trophy size={40} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Final</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!winnerConfirm}
        onClose={() => setWinnerConfirm(null)}
        onConfirm={confirmSetWinner}
        loading={actionLoading}
        variant="confirm"
        title="Advance Team"
        message={`Declare "${winnerConfirm?.teamName}" as the winner? They will flow to the next round.`}
        confirmLabel="Advance Winner"
      />
    </div>
  );
};

export default BracketPage;
