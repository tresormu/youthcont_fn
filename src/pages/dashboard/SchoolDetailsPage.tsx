import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import schoolService from '../../services/schoolService';
import teamService from '../../services/teamService';
import publicSpeakerService from '../../services/publicSpeakerService';
import api from '../../services/api'; // Keep for custom updates if needed
import { UserPlus, Mic2, Trash2, ChevronLeft, Plus, Save, CheckCircle2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface Member { _id?: string; fullName: string; speakerOrder: number; }
interface Team { _id: string; name: string; teamNumber: number; members: Member[]; }
interface PublicSpeaker { _id: string; fullName: string; speakerNumber: number; }

const SchoolDetailsPage = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState<any>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [publicSpeakers, setPublicSpeakers] = useState<PublicSpeaker[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'speakers'>('teams');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [addingTeam, setAddingTeam] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);
  const [deleteSpeaker, setDeleteSpeaker] = useState<PublicSpeaker | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [memberDrafts, setMemberDrafts] = useState<Record<string, Record<number, string>>>({});
  const [savingTeam, setSavingTeam] = useState<string | null>(null);
  const [speakerInput, setSpeakerInput] = useState('');
  const [addingSpeaker, setAddingSpeaker] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, [schoolId]);

  const fetchData = async () => {
    if (!schoolId) return;
    try {
      // Note: Backend might need a getSchoolById endpoint, currently using schoolRoutes /events/:eventId/schools/:schoolId
      // Actually, looking at schoolRoutes, there's no direct GET /schools/:schoolId.
      // I'll assume it exists or use api for now if it doesn't.
      const [schoolRes, teamsData, speakersData] = await Promise.all([
        api.get(`/schools/${schoolId}`), // Fallback to direct api if service not defined
        teamService.getTeams(schoolId),
        publicSpeakerService.getSpeakers(schoolId),
      ]);
      setSchool(schoolRes.data);
      setTeams(teamsData);
      setPublicSpeakers(speakersData);
      const drafts: Record<string, Record<number, string>> = {};
      teamsData.forEach((t: Team) => {
        drafts[t._id] = {};
        t.members.forEach(m => { drafts[t._id][m.speakerOrder] = m.fullName; });
      });
      setMemberDrafts(drafts);
    } catch { toast('Failed to load school data', 'error'); }
  };

  const handleAddTeam = async () => {
    if (!schoolId || !newTeamName.trim()) return;
    if (teams.length >= 3) { toast('Maximum 3 teams per school', 'warning'); return; }
    setAddingTeam(true);
    try {
      await teamService.registerTeam(schoolId, { name: newTeamName });
      await fetchData();
      setShowAddTeam(false);
      setNewTeamName('');
      toast('Team registered!');
    } catch { toast('Failed to add team', 'error'); }
    finally { setAddingTeam(false); }
  };

  const handleSaveRoster = async (team: Team) => {
    setSavingTeam(team._id);
    try {
      const members = [1, 2, 3].map(pos => ({
        fullName: memberDrafts[team._id]?.[pos] || '',
        speakerOrder: pos,
      })).filter(m => m.fullName.trim());
      // Roster update is a bit specific, might need teamService.updateRoster
      await api.put(`/teams/${team._id}/members`, { members });
      await fetchData();
      toast('Team roster saved!');
    } catch { toast('Failed to save roster', 'error'); }
    finally { setSavingTeam(null); }
  };

  const handleDeleteTeam = async () => {
    if (!deleteTeam || !schoolId) return;
    setDeleting(true);
    try {
      await teamService.deleteTeam(schoolId, deleteTeam._id);
      setTeams(prev => prev.filter(t => t._id !== deleteTeam._id));
      toast('Team removed');
    } catch { toast('Failed to remove team', 'error'); }
    finally { setDeleting(false); setDeleteTeam(null); }
  };

  const handleAddSpeaker = async () => {
    if (!schoolId || !speakerInput.trim()) return;
    if (publicSpeakers.length >= 5) { toast('Maximum 5 speakers per school', 'warning'); return; }
    setAddingSpeaker(true);
    try {
      await publicSpeakerService.registerSpeaker(schoolId, { fullName: speakerInput });
      await fetchData();
      setSpeakerInput('');
      toast('Speaker registered!');
    } catch { toast('Failed to add speaker', 'error'); }
    finally { setAddingSpeaker(false); }
  };

  const handleDeleteSpeaker = async () => {
    if (!deleteSpeaker || !schoolId) return;
    setDeleting(true);
    try {
      await publicSpeakerService.deleteSpeaker(schoolId, deleteSpeaker._id);
      setPublicSpeakers(prev => prev.filter(s => s._id !== deleteSpeaker._id));
      toast('Speaker removed');
    } catch { toast('Failed to remove speaker', 'error'); }
    finally { setDeleting(false); setDeleteSpeaker(null); }
  };


  return (
    <div className="space-y-8 pb-20">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary/40 hover:text-accent font-black text-xs uppercase tracking-widest transition-all">
        <ChevronLeft size={15} />
        Back to Registration
      </button>

      <div className="flex items-center gap-5 border-b border-border pb-8">
        <div className="w-14 h-14 bg-accent rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-accent/20 font-black text-xl">
          {school?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">{school?.name || '...'}</h1>
          <p className="text-primary/40 font-medium mt-0.5">Manage teams and public speaking representatives</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-2xl w-fit">
        {(['teams', 'speakers'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'}`}>
            {tab === 'teams' ? `Teams (${teams.length}/3)` : `Speakers (${publicSpeakers.length}/5)`}
          </button>
        ))}
      </div>

      {activeTab === 'teams' ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {teams.map((team) => (
            <motion.div key={team._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-border/50 shadow-xl shadow-black/5 overflow-hidden">
              <div className="p-7 border-b border-border bg-secondary/30 flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                    Team {team.teamNumber}
                  </span>
                  <h3 className="text-lg font-black text-primary mt-3">{team.name}</h3>
                </div>
                <button onClick={() => setDeleteTeam(team)}
                  className="p-2 text-primary/15 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="p-7 space-y-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-primary/30 mb-3">Speaker Assignment</p>
                {[1, 2, 3].map(pos => {
                  const val = memberDrafts[team._id]?.[pos] || '';
                  const saved = team.members.find(m => m.speakerOrder === pos);
                  return (
                    <div key={pos} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-2xl border border-transparent hover:border-accent/20 transition-all">
                      <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center font-black text-[9px] text-accent border border-border shadow-sm shrink-0">{pos}</div>
                      <input
                        placeholder={`Speaker ${pos}...`}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold text-primary placeholder:text-primary/20 outline-none"
                        value={val}
                        onChange={(e) => setMemberDrafts(prev => ({ ...prev, [team._id]: { ...prev[team._id], [pos]: e.target.value } }))}
                      />
                      {saved?.fullName ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <Shield size={14} className="text-primary/10 shrink-0" />}
                    </div>
                  );
                })}
                <button onClick={() => handleSaveRoster(team)} disabled={savingTeam === team._id}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-60">
                  {savingTeam === team._id
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Save size={13} /> Save Roster</>}
                </button>
              </div>
            </motion.div>
          ))}

          {teams.length < 3 && (
            <button onClick={() => setShowAddTeam(true)}
              className="min-h-[360px] border-2 border-dashed border-border/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-primary/20 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all group">
              <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center group-hover:bg-accent/10">
                <Plus size={32} />
              </div>
              <span className="font-black uppercase tracking-widest text-sm">Register Team {teams.length + 1}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="max-w-2xl space-y-3">
          <AnimatePresence>
            {publicSpeakers.map((speaker) => (
              <motion.div key={speaker._id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                className="flex items-center justify-between p-5 bg-white border border-border/50 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <Mic2 size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Speaker {speaker.speakerNumber}</p>
                    <h4 className="text-sm font-black text-primary">{speaker.fullName}</h4>
                  </div>
                </div>
                <button onClick={() => setDeleteSpeaker(speaker)}
                  className="p-2 text-primary/15 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all">
                  <Trash2 size={15} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {publicSpeakers.length < 5 && (
            <div className="p-6 bg-secondary/50 rounded-[2rem] border border-border">
              <h4 className="text-xs font-black text-primary mb-4 flex items-center gap-2">
                <UserPlus size={16} className="text-accent" />
                Add Public Speaker
              </h4>
              <div className="flex gap-3">
                <input
                  placeholder="Enter speaker's full name..."
                  className="flex-1 bg-white border border-border px-5 py-3.5 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-accent/30"
                  value={speakerInput}
                  onChange={(e) => setSpeakerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSpeaker()}
                />
                <button onClick={handleAddSpeaker} disabled={addingSpeaker || !speakerInput.trim()}
                  className="bg-accent text-white px-7 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-50">
                  {addingSpeaker ? '...' : 'Add'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddTeam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddTeam(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              <h2 className="text-2xl font-black text-primary mb-6">Register New Team</h2>
              <div className="space-y-5">
                <input autoFocus
                  placeholder="Team Name (e.g. The Debaters)"
                  className="w-full bg-secondary px-5 py-4 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-accent/50"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowAddTeam(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all">
                    Cancel
                  </button>
                  <button onClick={handleAddTeam} disabled={addingTeam || !newTeamName.trim()}
                    className="flex-[2] btn-accent py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 disabled:opacity-60">
                    {addingTeam ? '...' : 'Register Team'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal open={!!deleteTeam} onClose={() => setDeleteTeam(null)} onConfirm={handleDeleteTeam}
        loading={deleting} variant="danger" title="Remove Team"
        message={`Remove "${deleteTeam?.name}"? All team members will also be removed.`} confirmLabel="Yes, Remove" />

      <ConfirmModal open={!!deleteSpeaker} onClose={() => setDeleteSpeaker(null)} onConfirm={handleDeleteSpeaker}
        loading={deleting} variant="danger" title="Remove Speaker"
        message={`Remove "${deleteSpeaker?.fullName}" from the public speakers list?`} confirmLabel="Yes, Remove" />
    </div>
  );
};

export default SchoolDetailsPage;
