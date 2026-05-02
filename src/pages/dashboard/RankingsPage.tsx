import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import teamService from '../../services/teamService';
import schoolService from '../../services/schoolService';
import bracketService from '../../services/bracketService';
import { useSocket } from '../../context/SocketContext';
import { Search, Trophy, Medal, Star, FileSpreadsheet, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../components/common/Toast';
import { ConfirmModal } from '../../components/common/ConfirmModal';

interface RankingEntry {
  _id: string;
  rank: number;
  teamName: string;
  school: string;
  totalPoints: number;
  matchesPlayed: number;
  matchesWon: number;
  furthestStage: string;
}

const STAGE_BADGE: Record<string, string> = {
  Champion: 'bg-amber-100 text-amber-600 border-amber-200',
  FINAL: 'bg-primary text-white border-primary',
  SEMI_FINAL: 'bg-purple-100 text-purple-600 border-purple-200',
  QUARTER_FINAL: 'bg-blue-100 text-blue-600 border-blue-200',
  PRELIMINARY: 'bg-slate-100 text-slate-500 border-slate-200',
};

const RankingsPage = () => {
  const { eventId } = useParams();
  const [rankings, setRankings] = useState<RankingEntry[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showBracketModal, setShowBracketModal] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    fetchRankings();
    if (socket) {
      socket.emit('joinEvent', eventId);
      socket.on('match:updated', fetchRankings);
      socket.on('bracket:updated', fetchRankings);
      return () => { socket.off('match:updated'); socket.off('bracket:updated'); };
    }
  }, [eventId, socket]);

  const fetchRankings = async () => {
    if (!eventId) return;
    try {
      const [data, schoolsData] = await Promise.all([
        teamService.getRankings(eventId),
        schoolService.getSchools(eventId)
      ]);
      setRankings(data);
      setSchools(schoolsData);
    } catch { toast('Failed to load data', 'error'); }
    finally { setIsLoading(false); }
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) return prev.filter(id => id !== teamId);
      if (prev.length >= 8) {
        toast('Maximum 8 teams can be selected for Power 8', 'warning');
        return prev;
      }
      return [...prev, teamId];
    });
  };

  const handleAdvanceToBracket = async (mode: 'manual' | 'auto') => {
    if (!eventId) return;
    setAdvancing(true);
    try {
      // Bracket initialization might need a specific endpoint in bracketService
      await bracketService.generateBracket(eventId); 
      toast(`Power 8 Initialized (${mode})!`);
      navigate(`/dashboard/events/${eventId}/bracket?mode=${mode}`);
    } catch {
      toast('Failed to initialize bracket', 'error');
    } finally {
      setAdvancing(false);
      setShowBracketModal(false);
    }
  };

  const handleExportExcel = async () => {
    if (!eventId) return;
    setExportingExcel(true);
    try {
      const blob = await teamService.exportRankings(eventId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rankings-${eventId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast('Excel exported!');
    } catch { toast('Failed to export Excel', 'error'); }
    finally { setExportingExcel(false); }
  };

  const handleExportPDF = async () => {
    if (!eventId) return;
    setExportingPDF(true);
    try {
      const blob = await teamService.exportRankingsPDF(eventId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rankings-${eventId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast('PDF exported!');
    } catch { toast('Failed to export PDF', 'error'); }
    finally { setExportingPDF(false); }
  };


  const filtered = rankings.filter(r =>
    r.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = filtered.slice(0, 3);

  const useRoundOf16 = schools.length > 18;
  const advanceCount = useRoundOf16 ? 16 : 8;


  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Standings & Results</h1>
          <p className="text-primary/40 font-medium mt-1">Official rankings and performance metrics for all teams</p>
        </div>
        <div className="flex gap-3">
          {selectedTeams.length === 8 && (
            <button
              onClick={() => setShowBracketModal(true)}
              className="btn-accent py-3.5 px-7 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-accent/20 animate-bounce"
            >
              <Trophy size={18} />
              Setup Power 8
            </button>
          )}
          <button
            onClick={handleExportPDF}
            disabled={exportingPDF || rankings.length === 0}
            className="px-5 py-3.5 rounded-2xl font-black text-xs text-primary/60 hover:bg-white hover:text-red-500 border border-border transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileText size={16} />
            {exportingPDF ? 'Exporting...' : 'PDF'}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exportingExcel || rankings.length === 0}
            className="px-5 py-3.5 rounded-2xl font-black text-xs text-primary/60 hover:bg-white hover:text-emerald-600 border border-border transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileSpreadsheet size={16} />
            {exportingExcel ? 'Exporting...' : 'Excel'}
          </button>
        </div>
      </div>

      {/* Podium */}
      {!searchTerm && top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-5 pt-6">
          {/* 2nd */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
            <div className="bg-white border border-border/50 rounded-[2.5rem] p-7 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-300" />
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-5">
                <Medal size={28} />
              </div>
              <h3 className="text-base font-black text-primary truncate">{top3[1].teamName}</h3>
              <p className="text-[9px] font-black uppercase text-primary/25 tracking-widest mb-3">{top3[1].school}</p>
              <div className="text-2xl font-black text-slate-400">2<span className="text-xs">ND</span></div>
              <p className="text-xs font-black text-primary/40 mt-1">{top3[1].totalPoints} pts</p>
            </div>
          </motion.div>

          {/* 1st */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-primary rounded-[3rem] p-9 text-center relative overflow-hidden shadow-2xl shadow-primary/20 scale-105 z-10">
              <div className="absolute top-0 inset-x-0 h-2 bg-accent" />
              <div className="w-18 h-18 w-16 h-16 bg-accent rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-5 shadow-xl shadow-accent/30">
                <Trophy size={32} />
              </div>
              <h3 className="text-lg font-black text-white truncate">{top3[0].teamName}</h3>
              <p className="text-[9px] font-black uppercase text-accent tracking-widest mb-3">{top3[0].school}</p>
              <div className="text-3xl font-black text-white">1<span className="text-sm">ST</span></div>
              <p className="text-xs font-black text-white/50 mt-1">{top3[0].totalPoints} pts</p>
            </div>
          </motion.div>

          {/* 3rd */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-14">
            <div className="bg-white border border-border/50 rounded-[2.5rem] p-7 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-400/40" />
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500/50 mx-auto mb-5">
                <Star size={28} />
              </div>
              <h3 className="text-base font-black text-primary truncate">{top3[2].teamName}</h3>
              <p className="text-[9px] font-black uppercase text-primary/25 tracking-widest mb-3">{top3[2].school}</p>
              <div className="text-2xl font-black text-amber-500/50">3<span className="text-xs">RD</span></div>
              <p className="text-xs font-black text-primary/40 mt-1">{top3[2].totalPoints} pts</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-border/50 overflow-hidden shadow-xl shadow-black/5">
        <div className="p-6 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" size={16} />
            <input
              type="text"
              placeholder="Search teams or schools..."
              className="w-full bg-secondary/50 pl-11 pr-5 py-3.5 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-accent/30 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-xs font-black text-primary/30 uppercase tracking-widest">{filtered.length} teams</span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-secondary/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-primary/30 font-bold">No results found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="px-7 py-4 text-[9px] font-black uppercase tracking-widest text-primary/30 text-left">Select</th>
                  {['Rank', 'Team & School', 'Points', 'Record (W/P)', 'Furthest Stage'].map(h => (
                    <th key={h} className={`px-7 py-4 text-[9px] font-black uppercase tracking-widest text-primary/30 ${h === 'Points' || h === 'Record (W/P)' ? 'text-center' : h === 'Furthest Stage' ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((team, idx) => (
                  <React.Fragment key={team._id}>
                    {idx === advanceCount && !searchTerm && (
                      <tr className="bg-slate-50/50">
                        <td colSpan={6} className="px-7 py-3 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <div className="h-px bg-slate-300 flex-1"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Cutoff Line — Top {advanceCount} Advance to Bracket</span>
                            <div className="h-px bg-slate-300 flex-1"></div>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr
                      onClick={() => toggleTeamSelection(team._id)}
                      className={`hover:bg-accent/3 transition-all group cursor-pointer ${selectedTeams.includes(team._id) ? 'bg-accent/5' : ''}`}
                    >
                      <td className="px-7 py-5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                          ${selectedTeams.includes(team._id) ? 'bg-accent border-accent text-white' : 'border-border'}`}>
                          {selectedTeams.includes(team._id) && <Star size={10} fill="currentColor" />}
                        </div>
                      </td>
                      <td className="px-7 py-5">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs
                          ${idx < 3 ? 'bg-accent text-white' : 'bg-secondary text-primary/40'}`}>
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-7 py-5">
                        <p
                          className="font-black text-primary text-sm group-hover:text-accent transition-colors cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/events/${eventId}/teams/${team._id}`); }}
                        >
                          {team.teamName}
                        </p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary/25 mt-0.5">{team.school}</p>
                      </td>
                      <td className="px-7 py-5 text-center">
                        <span className="text-xl font-black text-primary">{team.totalPoints}</span>
                      </td>
                      <td className="px-7 py-5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-xs font-black text-primary/50">
                          {team.matchesWon}<span className="opacity-30">/</span>{team.matchesPlayed}
                        </span>
                      </td>
                      <td className="px-7 py-5 text-right">
                        <span className={`px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${STAGE_BADGE[team.furthestStage] || STAGE_BADGE.PRELIMINARY}`}>
                          {team.furthestStage?.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showBracketModal}
        onClose={() => setShowBracketModal(false)}
        onConfirm={() => {}}
        loading={advancing}
        variant="confirm"
        title="Power 8 Bracket Setup"
        message={`You've selected 8 teams to advance. How would you like to seed the bracket?`}
        confirmLabel=""
      >
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => handleAdvanceToBracket('auto')}
            disabled={advancing}
            className="flex items-center justify-between p-5 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-[1.5rem] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                <Star size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-primary text-base">Automatic Seeding</p>
                <p className="text-primary/40 text-[10px] font-bold">System seeds based on current rankings</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleAdvanceToBracket('manual')}
            disabled={advancing}
            className="flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-[1.5rem] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                <Medal size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-primary text-base">Manual Seeding</p>
                <p className="text-primary/40 text-[10px] font-bold">You decide the bracket placements</p>
              </div>
            </div>
          </button>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default RankingsPage;

