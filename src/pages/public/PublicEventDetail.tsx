import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import bracketService from '../../services/bracketService';
import teamService from '../../services/teamService';
import schoolService from '../../services/schoolService';
import { useSocket } from '../../context/SocketContext';
import { Trophy, ArrowLeft, GitBranch, BarChart3, Building2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PublicEventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [bracket, setBracket] = useState<any>(null);
  const [rankings, setRankings] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bracket' | 'rankings' | 'schools'>('bracket');
  const { socket } = useSocket();

  useEffect(() => {
    fetchData();
    
    if (socket) {
      socket.emit('join:event', eventId);
      socket.on('match:updated', () => fetchData());
      socket.on('bracket:updated', () => fetchData());
      socket.on('event:statusChanged', (data: any) => setEvent((prev: any) => ({ ...prev, status: data.status })));
      
      return () => {
        socket.off('match:updated');
        socket.off('bracket:updated');
        socket.off('event:statusChanged');
      };
    }
  }, [eventId, socket]);

  const fetchData = async () => {
    if (!eventId) return;
    try {
      const [eventData, bracketData, rankingsData, schoolsData] = await Promise.all([
        eventService.getEvent(eventId),
        bracketService.getBracket(eventId),
        teamService.getRankings(eventId),
        schoolService.getSchools(eventId)
      ]);
      setEvent(eventData);
      setBracket(bracketData);
      setRankings(rankingsData);
      setSchools(schoolsData);
    } catch (err) {
      console.error('Error fetching spectator data', err);
    } finally {
      setIsLoading(false);
    }
  };


  if (isLoading) return <div className="h-screen flex items-center justify-center font-black text-accent animate-pulse text-2xl uppercase tracking-widest">Loading Live Coverage...</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Spectator Header */}
      <header className="bg-primary text-white pt-10 pb-20 px-6 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]" />
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between relative z-10">
            <div className="space-y-6">
               <Link to="/events-list" className="inline-flex items-center gap-2 text-accent font-black text-[10px] uppercase tracking-widest hover:text-white transition-all">
                  <ArrowLeft size={16} />
                  Back to All Events
               </Link>
               <div>
                  <div className="flex items-center gap-4 mb-2">
                     <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{event?.name}</h1>
                     <div className="px-4 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity size={12} className="text-emerald-400 animate-pulse" />
                        Live Status: {event?.status}
                     </div>
                  </div>
                  <p className="text-white/40 font-bold max-w-xl">{event?.description || 'Broadcasting live results and standings for this elite youth debate competition.'}</p>
               </div>
            </div>
            
            <div className="mt-10 md:mt-0 flex gap-4">
               <TabButton active={activeTab === 'bracket'} onClick={() => setActiveTab('bracket')} icon={GitBranch} label="Live Bracket" />
               <TabButton active={activeTab === 'rankings'} onClick={() => setActiveTab('rankings')} icon={BarChart3} label="Standings" />
               <TabButton active={activeTab === 'schools'} onClick={() => setActiveTab('schools')} icon={Building2} label="Schools" />
            </div>
         </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
         <AnimatePresence mode="wait">
            {activeTab === 'bracket' && (
              <motion.div key="bracket" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-panel p-10 rounded-[3rem] shadow-2xl">
                 <div className="flex gap-12 overflow-x-auto pb-10">
                    <StageView title="Quarter Finals" matches={bracket?.QUARTER_FINAL} />
                    <StageView title="Semi Finals" matches={bracket?.SEMI_FINAL} />
                    <StageView title="The Final" matches={bracket?.FINAL} />
                    
                    {/* Champion Section */}
                    {bracket?.FINAL?.[0]?.winner && (
                      <div className="flex-1 flex flex-col items-center justify-center min-w-[300px]">
                         <div className="text-center animate-bounce">
                            <div className="w-24 h-24 bg-accent rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-accent/40">
                               <Trophy size={48} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-2">Champion</p>
                            <h2 className="text-3xl font-black text-primary">{bracket.FINAL[0].winner.name}</h2>
                         </div>
                      </div>
                    )}
                 </div>
              </motion.div>
            )}

            {activeTab === 'rankings' && (
              <motion.div key="rankings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden">
                 <table className="w-full border-collapse">
                    <thead>
                       <tr className="bg-secondary/30">
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-primary/30">Pos</th>
                          <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-primary/30">Team</th>
                          <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-primary/30">Points</th>
                          <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-primary/30">W-L</th>
                          <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-primary/30">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                       {rankings.map((r, i) => (
                         <tr key={i} className="hover:bg-accent/[0.02] transition-colors">
                            <td className="px-8 py-6">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${i < 3 ? 'bg-accent text-white' : 'bg-primary/5 text-primary/30'}`}>
                                  {i + 1}
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="font-black text-primary">{r.teamName}</p>
                               <p className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">{r.school}</p>
                            </td>
                            <td className="px-8 py-6 text-center font-black text-primary text-xl">{r.totalPoints}</td>
                            <td className="px-8 py-6 text-center font-bold text-primary/40">{r.matchesWon} <span className="mx-1 text-primary/10">|</span> {r.matchesPlayed - r.matchesWon}</td>
                            <td className="px-8 py-6 text-right">
                               <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-widest text-primary/40 whitespace-nowrap">
                                  {r.furthestStage}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </motion.div>
            )}

            {activeTab === 'schools' && (
              <motion.div key="schools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {schools.map(s => (
                   <div key={s._id} className="bg-white p-8 rounded-[2.5rem] border border-border/50 flex items-center gap-6 shadow-xl shadow-black/[0.02]">
                      <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center text-primary/30 font-black text-2xl">
                         {s.name.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-primary tracking-tight leading-tight mb-1">{s.name}</h4>
                         <p className="text-xs font-bold text-primary/30 uppercase tracking-widest">{s.region || 'Nationals'}</p>
                      </div>
                   </div>
                 ))}
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
      ${active ? 'bg-accent text-white shadow-xl shadow-accent/20' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white'}
    `}
  >
     <Icon size={18} />
     {label}
  </button>
);

const StageView = ({ title, matches = [] }: { title: string, matches: any[] }) => (
  <div className="flex-1 min-w-[280px] space-y-8">
     <h4 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-primary/20">{title}</h4>
     <div className="space-y-4">
        {matches.map(m => (
          <div key={m._id} className="bg-secondary/20 border border-border/50 rounded-2xl p-4 space-y-2">
             <div className={`flex justify-between items-center px-4 py-2 rounded-xl ${m.winner?._id === m.teamA?._id ? 'bg-accent/10 border border-accent/20' : ''}`}>
                <span className={`text-xs font-black ${m.winner?._id === m.teamA?._id ? 'text-accent' : 'text-primary/60'}`}>{m.teamA?.name}</span>
                {m.winner?._id === m.teamA?._id && <Trophy size={12} className="text-accent" />}
             </div>
             <div className={`flex justify-between items-center px-4 py-2 rounded-xl ${m.winner?._id === m.teamB?._id ? 'bg-accent/10 border border-accent/20' : ''}`}>
                <span className={`text-xs font-black ${m.winner?._id === m.teamB?._id ? 'text-accent' : 'text-primary/60'}`}>{m.teamB?.name}</span>
                {m.winner?._id === m.teamB?._id && <Trophy size={12} className="text-accent" />}
             </div>
          </div>
        ))}
        {matches.length === 0 && <div className="h-40 border-2 border-dashed border-primary/5 rounded-[2rem] flex items-center justify-center font-black text-primary/10 text-[10px] uppercase tracking-widest">Bracket Locked</div>}
     </div>
  </div>
);

export default PublicEventDetail;
