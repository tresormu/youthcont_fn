import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import matchService from '../../services/matchService';
import { ChevronLeft, CheckCircle2, Plus } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

interface TeamMember { _id: string; fullName: string; speakerOrder: number; }
interface Team { _id: string; name: string; members?: TeamMember[]; }
interface Match { _id: string; teamA: Team; teamB: Team | null; isBye?: boolean; status: string; }
interface TeamSchedule { _id: string; team: Team; matches: Match[]; }

const ManualAssignPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [schedules, setSchedules] = useState<TeamSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [opponents, setOpponents] = useState<string[]>(['', '', '']);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (eventId) localStorage.setItem(`matchmaking_mode_${eventId}`, 'manual');
  }, [eventId]);

  useEffect(() => { fetchSchedules(); }, [eventId]);

  const fetchSchedules = async () => {
    if (!eventId) return;
    try {
      const data = await matchService.getMatchups(eventId);
      setSchedules(data);
    } catch {
      toast('Failed to load teams', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSchedule = useMemo(
    () => schedules.find(s => s.team._id === selectedTeamId),
    [schedules, selectedTeamId]
  );

  const existingMatchCount = useMemo(
    () => selectedSchedule?.matches.filter(m => !m.isBye).length ?? 0,
    [selectedSchedule]
  );

  const remainingSlots = 3 - existingMatchCount;

  const availableOpponents = useMemo(() => {
    if (!selectedTeamId) return [];
    return schedules.filter(s => {
      if (s.team._id === selectedTeamId) return false;
      const alreadyPaired = selectedSchedule?.matches.some(
        m => m.teamA?._id === s.team._id || m.teamB?._id === s.team._id
      );
      const full = s.matches.filter(m => !m.isBye).length >= 3;
      return !alreadyPaired && !full;
    }).map(s => s.team);
  }, [schedules, selectedTeamId, selectedSchedule]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setOpponents(['', '', '']);
  };

  const handleSave = async () => {
    if (!eventId || !selectedTeamId) return;
    const filled = opponents.filter(o => o.trim());
    if (filled.length === 0) { toast('Select at least one opponent', 'error'); return; }
    setSaving(true);
    try {
      await matchService.manualAssignTeam(eventId, { teamId: selectedTeamId, opponents: filled });
      toast(`${filled.length} match(es) saved!`);
      setSelectedTeamId('');
      setOpponents(['', '', '']);
      await fetchSchedules();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to save matches', 'error');
    } finally {
      setSaving(false);
    }
  };

  const anyAssigned = schedules.length > 0 && schedules.some(
    s => s.matches.filter(m => !m.isBye).length >= 1
  );

  const fullyAssigned = schedules.length > 0 && schedules.every(
    s => s.matches.filter(m => !m.isBye).length >= 3
  );

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <button
            onClick={() => navigate(`/dashboard/events/${eventId}/matchmaking`)}
            className="flex items-center gap-2 text-primary/40 hover:text-accent font-black text-xs uppercase tracking-widest mb-3 transition-all"
          >
            <ChevronLeft size={15} /> Back to Match Console
          </button>
          <h1 className="text-4xl font-black tracking-tight text-primary">Manual Assignment</h1>
          <p className="text-primary/40 font-medium mt-1">Pick a team and assign their opponents for each round</p>
        </div>
        {anyAssigned && (
          <div className="flex flex-col items-end">
            {!fullyAssigned && (
              <p className="text-[10px] text-amber-500 font-bold mb-2 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded">⚠️ Some teams have &lt; 3 matches</p>
            )}
            <button
              onClick={() => navigate(`/dashboard/events/${eventId}/matchmaking`)}
              className="btn-accent py-3.5 px-7 rounded-2xl font-black text-sm flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Go to Match Console
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Team list */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Teams</p>
          {schedules.map(s => {
            const count = s.matches.filter(m => !m.isBye).length;
            const isSelected = selectedTeamId === s.team._id;
            const full = count >= 3;
            return (
              <button
                key={s._id}
                onClick={() => !full && handleTeamSelect(s.team._id)}
                disabled={full}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                    : full
                    ? 'bg-secondary/50 border-border opacity-50 cursor-not-allowed'
                    : 'bg-white border-border hover:border-accent/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black truncate">{s.team.name}</span>
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                    full
                      ? isSelected ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-100 text-emerald-700'
                      : isSelected ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {full && <CheckCircle2 size={10} className="inline mr-1" />}
                    {count}/3
                  </span>
                </div>
                {s.matches.filter(m => !m.isBye).length > 0 && (
                  <div className="mt-2 space-y-1">
                    {s.matches.filter(m => !m.isBye).map((m, i) => {
                      const opp = m.teamA._id === s.team._id ? m.teamB : m.teamA;
                      return (
                        <p key={m._id} className={`text-[10px] font-bold ${isSelected ? 'text-white/60' : 'text-primary/40'}`}>
                          R{i + 1}: vs {opp?.name ?? '—'}
                        </p>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Assignment form */}
        <div className="col-span-12 lg:col-span-8">
          {!selectedTeamId ? (
            <div className="bg-white border-2 border-dashed border-border rounded-[2.5rem] p-16 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center text-primary/20 mb-4">
                <Plus size={32} />
              </div>
              <h3 className="text-xl font-black text-primary mb-2">Select a Team</h3>
              <p className="text-primary/40 font-medium text-sm">Pick a team from the left to assign their opponents</p>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-[2.5rem] p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-black text-primary">{selectedSchedule?.team.name}</h2>
                <p className="text-xs text-primary/40 font-medium mt-1">
                  {existingMatchCount} match(es) already assigned — {remainingSlots} slot(s) remaining
                </p>
              </div>

              {/* Existing matches */}
              {existingMatchCount > 0 && (
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Already Assigned</p>
                  {selectedSchedule?.matches.filter(m => !m.isBye).map((m, i) => {
                    const opp = m.teamA._id === selectedTeamId ? m.teamB : m.teamA;
                    return (
                      <div key={m._id} className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl">
                        <span className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-[9px] font-black text-white shrink-0">R{i + 1}</span>
                        <span className="text-sm font-bold text-emerald-800">vs {opp?.name ?? '—'}</span>
                        <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* New opponent slots */}
              {remainingSlots > 0 && (
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/30">Assign Opponents</p>
                  {Array.from({ length: remainingSlots }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-[10px] font-black text-accent shrink-0">
                        R{existingMatchCount + i + 1}
                      </span>
                      <select
                        value={opponents[i] || ''}
                        onChange={e => {
                          const updated = [...opponents];
                          updated[i] = e.target.value;
                          setOpponents(updated);
                        }}
                        className="flex-1 bg-secondary border border-border px-4 py-3 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-accent/30"
                      >
                        <option value="">No opponent (leave empty for BYE)</option>
                        {availableOpponents
                          .filter(t => !opponents.some((o, oi) => oi !== i && o === t._id))
                          .map(t => {
                            const oppSchedule = schedules.find(s => s.team._id === t._id);
                            const oppCount = oppSchedule?.matches.filter(m => !m.isBye).length ?? 0;
                            return (
                              <option key={t._id} value={t._id}>
                                {t.name} ({oppCount}/3 matches)
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setSelectedTeamId(''); setOpponents(['', '', '']); }}
                  className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || opponents.every(o => !o)}
                  className="flex-[2] btn-accent py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Matches'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualAssignPage;

