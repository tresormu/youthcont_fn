import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';
import schoolService from '../../services/schoolService';
import { useSocket } from '../../context/SocketContext';
import { Building2, Users, Plus, ChevronRight, Trash2, Mic2, ArrowRight, Zap, Sword } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { useToast } from '../../components/common/Toast';

interface School {
  _id: string;
  name: string;
  region?: string;
  teams: any[];
  publicSpeakers: any[];
  teamCount?: number;
  publicSpeakerCount?: number;
}

const RegistrationPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    region: '',
    teams: [] as { name: string; members: [string, string, string] }[],
    publicSpeakers: [] as { fullName: string }[]
  });
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<School | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [advanceConfirm, setAdvanceConfirm] = useState(false);  const [advancing, setAdvancing] = useState(false);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [eventId]);

  useEffect(() => {
    if (!socket || !eventId) return;
    socket.emit('joinEvent', eventId);
    const handleSchoolAdded = (school: School) => {
      setSchools(prev => prev.some(s => s._id === school._id) ? prev : [...prev, school]);
    };
    socket.on('school:added', handleSchoolAdded);
    return () => {
      socket.off('school:added', handleSchoolAdded);
    };
  }, [eventId, socket]);

  const fetchData = async () => {
    if (!eventId) return;
    try {
      const [eventData, schoolsData] = await Promise.all([
        eventService.getEvent(eventId),
        schoolService.getSchools(eventId)
      ]);
      setEvent(eventData);
      setSchools(schoolsData);
    } catch {
      toast('Failed to load registration data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setAdding(true);
    try {
      await schoolService.registerSchool(eventId, {
        ...newSchool,
        teams: newSchool.teams.map(t => ({
          name: t.name,
          members: t.members.map((fullName, i) => ({ fullName, speakerOrder: i + 1 })),
        })),
      });
      setShowAddSchool(false);
      setNewSchool({ name: '', region: '', teams: [], publicSpeakers: [] });
      toast('School registered successfully!');
      if (!socket?.connected) await fetchData();
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to add school', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSchool = async () => {
    if (!deleteTarget || !eventId) return;
    setDeleting(true);
    try {
      await schoolService.deleteSchool(eventId, deleteTarget._id);
      setSchools(prev => prev.filter(s => s._id !== deleteTarget._id));
      toast('School removed');
    } catch {
      toast('Failed to remove school', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleAdvanceStage = async (mode: 'manual' | 'auto') => {
    if (!eventId) return;
    setAdvancing(true);
    try {
      await eventService.updateStatus(eventId, 'Preliminary Rounds');
      toast('Advanced to Preliminary Rounds!');
      if (mode === 'manual') {
        navigate(`/dashboard/events/${eventId}/manual-assign`);
      } else {
        navigate(`/dashboard/events/${eventId}/matchmaking?mode=auto`);
      }
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to advance stage', 'error');
    } finally {
      setAdvancing(false);
      setAdvanceConfirm(false);
    }
  };


  const totalTeams = schools.reduce((acc, s) => acc + (s.teamCount ?? 0), 0);
  const totalSpeakers = schools.reduce((acc, s) => acc + (s.publicSpeakerCount ?? 0), 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">{event?.name || '...'}</h1>
          <p className="text-primary/40 font-medium mt-1">Register participating institutions and their delegations</p>
        </div>
        <button
          onClick={() => setAdvanceConfirm(true)}
          disabled={schools.length < 2}
          className="btn-accent py-3.5 px-7 rounded-2xl font-black text-sm flex items-center gap-3 shadow-2xl shadow-accent/20 disabled:opacity-40 disabled:shadow-none"
        >
          Open Matchmaking
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* School List */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-primary flex items-center gap-3">
              <Building2 size={20} className="text-accent" />
              Registered Schools
              <span className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center text-xs text-primary font-black">
                {schools.length}
              </span>
            </h2>
            <button
              onClick={() => setShowAddSchool(true)}
              className="text-accent font-black text-sm flex items-center gap-2 hover:bg-accent/5 px-4 py-2 rounded-xl transition-all"
            >
              <Plus size={16} />
              Add School
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 rounded-[2rem] bg-white/60 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {schools.map((school) => (
                  <motion.div
                    key={school._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-lg hover:border-accent/20 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-secondary rounded-2xl flex items-center justify-center font-black text-lg text-primary/40">
                        {school.name.charAt(0)}
                      </div>
                      <button
                        onClick={() => setDeleteTarget(school)}
                        className="p-2 text-primary/15 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-primary mb-0.5">{school.name}</h3>
                    <p className="text-[10px] font-bold text-primary/25 uppercase tracking-wider mb-5">
                      {school.region || 'Unspecified Region'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                        <span>{school.teamCount ?? school.teams?.length ?? 0}/3 Teams</span>
                        <span className="w-1 h-1 rounded-full bg-primary/20" />
                        <span>{school.publicSpeakerCount ?? school.publicSpeakers?.length ?? 0}/5 Speakers</span>
                      </div>
                      <button
                        onClick={() => navigate(`/dashboard/schools/${school._id}/teams`)}
                        className="w-9 h-9 rounded-xl bg-secondary text-primary/30 hover:bg-accent hover:text-white transition-all flex items-center justify-center"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Inline add form */}
              <AnimatePresence>
                {showAddSchool && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-accent/5 border-2 border-dashed border-accent/30 p-6 rounded-[2rem]"
                  >
                    <form onSubmit={handleAddSchool} className="space-y-4">
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2">New School</p>
                      
                      <div className="space-y-2">
                        <input
                          autoFocus required
                          placeholder="School Name *"
                          className="w-full bg-white border border-border px-4 py-3 rounded-xl font-bold text-sm focus:ring-2 focus:ring-accent/30 outline-none transition-all"
                          value={newSchool.name}
                          onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        />
                        <input
                          placeholder="Region (Optional)"
                          className="w-full bg-white border border-border px-4 py-3 rounded-xl font-bold text-sm focus:ring-2 focus:ring-accent/30 outline-none transition-all"
                          value={newSchool.region}
                          onChange={(e) => setNewSchool({ ...newSchool, region: e.target.value })}
                        />
                      </div>

                      {/* Teams Section */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Teams ({newSchool.teams.length}/3)</p>
                          {newSchool.teams.length < 3 && (
                            <button
                              type="button"
                              onClick={() => setNewSchool(prev => ({ ...prev, teams: [...prev.teams, { name: '', members: ['', '', ''] }] }))}
                              className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline"
                            >
                              + Add Team
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {newSchool.teams.map((team, idx) => (
                            <div key={idx} className="bg-white border border-border rounded-xl p-3 space-y-2">
                              <div className="flex gap-2">
                                <input
                                  required
                                  placeholder={`Team ${idx + 1} Name`}
                                  className="flex-1 bg-secondary border border-transparent px-3 py-2 rounded-lg font-bold text-xs focus:ring-2 focus:ring-accent/20 outline-none"
                                  value={team.name}
                                  onChange={(e) => {
                                    const teams = [...newSchool.teams];
                                    teams[idx] = { ...teams[idx], name: e.target.value };
                                    setNewSchool({ ...newSchool, teams });
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setNewSchool(prev => ({ ...prev, teams: prev.teams.filter((_, i) => i !== idx) }))}
                                  className="p-1.5 text-primary/20 hover:text-destructive transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              <p className="text-[8px] font-black text-primary/30 uppercase tracking-widest px-1">Members</p>
                              {([0, 1, 2] as const).map(pos => (
                                <div key={pos} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                  <span className="text-[8px] font-black text-accent w-3">{pos + 1}</span>
                                  <input
                                    required
                                    placeholder={`Speaker ${pos + 1} full name`}
                                    className="flex-1 bg-transparent outline-none font-bold text-xs text-primary placeholder:text-primary/20"
                                    value={team.members[pos]}
                                    onChange={(e) => {
                                      const teams = [...newSchool.teams];
                                      const members = [...teams[idx].members] as [string, string, string];
                                      members[pos] = e.target.value;
                                      teams[idx] = { ...teams[idx], members };
                                      setNewSchool({ ...newSchool, teams });
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Speakers Section */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Speakers ({newSchool.publicSpeakers.length}/5)</p>
                          {newSchool.publicSpeakers.length < 5 && (
                            <button 
                              type="button" 
                              onClick={() => setNewSchool(prev => ({ ...prev, publicSpeakers: [...prev.publicSpeakers, { fullName: '' }] }))}
                              className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline"
                            >
                              + Add Speaker
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {newSchool.publicSpeakers.map((speaker, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                required
                                placeholder={`Speaker ${idx + 1} Full Name`}
                                className="flex-1 bg-white border border-border px-4 py-2 rounded-lg font-bold text-xs focus:ring-2 focus:ring-accent/20 outline-none"
                                value={speaker.fullName}
                                onChange={(e) => {
                                  const speakers = [...newSchool.publicSpeakers];
                                  speakers[idx].fullName = e.target.value;
                                  setNewSchool({ ...newSchool, publicSpeakers: speakers });
                                }}
                              />
                              <button 
                                type="button"
                                onClick={() => setNewSchool(prev => ({ ...prev, publicSpeakers: prev.publicSpeakers.filter((_, i) => i !== idx) }))}
                                className="p-2 text-primary/20 hover:text-destructive transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-accent/10">
                        <button type="submit" disabled={adding}
                          className="flex-1 bg-accent text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all disabled:opacity-60">
                          {adding ? '...' : 'Register School'}
                        </button>
                        <button type="button" onClick={() => setShowAddSchool(false)}
                          className="px-4 text-primary/40 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-5">
          <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-5">Live Statistics</p>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <p className="text-4xl font-black mb-1">{schools.length}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Schools</p>
              </div>
              <div>
                <p className="text-4xl font-black mb-1">{totalTeams}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Teams</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Mic2 size={14} className="text-accent" />
                  <span className="text-2xl font-black">{totalSpeakers}</span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Public Speakers</p>
              </div>
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center">
                <Users size={18} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-border/50 shadow-sm">
            <h3 className="text-sm font-black text-primary mb-4">Requirements</h3>
            <div className="space-y-3">
              {[
                { label: 'Min. 2 schools to start matchmaking', met: schools.length >= 2 },
                { label: 'Min. 8 teams for Power 8 bracket', met: totalTeams >= 8 },
              ].map((req, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold ${req.met ? 'bg-emerald-50 text-emerald-700' : 'bg-secondary text-primary/40'}`}>
                  <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-emerald-500' : 'bg-primary/20'}`} />
                  {req.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteSchool}
        loading={deleting}
        variant="danger"
        title="Remove School"
        message={`Remove "${deleteTarget?.name}" from this event? All associated teams and speakers will also be removed.`}
        confirmLabel="Yes, Remove"
      />

      <ConfirmModal
        open={advanceConfirm}
        onClose={() => setAdvanceConfirm(false)}
        onConfirm={() => {}} // Not used as we have custom buttons
        loading={advancing}
        variant="confirm"
        title="Open Matchmaking"
        message={`You're about to close registration and move to Preliminary Rounds with ${schools.length} schools. How would you like to assign matchups?`}
        confirmLabel="" // Hidden
      >
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => handleAdvanceStage('auto')}
            disabled={advancing}
            className="flex items-center justify-between p-5 bg-accent/5 hover:bg-accent/10 border border-accent/20 rounded-[1.5rem] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <Zap size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-primary text-base">Automatic Assignment</p>
                <p className="text-primary/40 text-[10px] font-bold">System generates balanced matches instantly</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-accent opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
          </button>

          <button
            onClick={() => handleAdvanceStage('manual')}
            disabled={advancing}
            className="flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-[1.5rem] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Sword size={24} />
              </div>
              <div className="text-left">
                <p className="font-black text-primary text-base">Manual Assignment</p>
                <p className="text-primary/40 text-[10px] font-bold">You control every pairing and match</p>
              </div>
            </div>
            <ArrowRight size={20} className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
          </button>
        </div>
      </ConfirmModal>
    </div>
  );
};

export default RegistrationPage;

