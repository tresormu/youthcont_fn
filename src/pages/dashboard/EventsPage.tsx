import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../../services/eventService';
import { Plus, Calendar, ChevronRight, Trophy, Trash2, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../components/common/Toast';

interface Event {
  _id: string;
  name: string;
  edition?: string;
  description?: string;
  status: 'Draft' | 'Registration Open' | 'Preliminary Rounds' | 'Bracket Stage' | 'Completed';
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  'Draft': 'bg-slate-100 text-slate-500',
  'Registration Open': 'bg-emerald-100 text-emerald-600',
  'Preliminary Rounds': 'bg-blue-100 text-blue-600',
  'Bracket Stage': 'bg-purple-100 text-purple-600',
  'Completed': 'bg-amber-100 text-amber-600',
};

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', edition: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [starting, setStarting] = useState<string | null>(null);

  useEffect(() => { fetchEvents(); }, []);

  const handleStart = async (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setStarting(eventId);
    try {
      const updated = await eventService.updateStatus(eventId, 'Registration Open');
      setEvents(prev => prev.map(ev => ev._id === eventId ? { ...ev, status: updated.status } : ev));
      toast('Registration is now open!');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to start registration', 'error');
    } finally {
      setStarting(null);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch {
      toast('Failed to load events', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const data = await eventService.createEvent(newEvent);
      setEvents([data, ...events]);
      setShowCreateModal(false);
      setNewEvent({ name: '', edition: '', description: '' });
      toast('Tournament created successfully!');
    } catch {
      toast('Failed to create tournament', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.status === 'Completed' && deleteConfirmName !== deleteTarget.name) {
      toast('Tournament name does not match', 'error');
      return;
    }
    setDeleting(true);
    try {
      await eventService.deleteEvent(deleteTarget._id);
      setEvents(events.filter(e => e._id !== deleteTarget._id));
      toast('Tournament deleted');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Failed to delete tournament', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
      setDeleteConfirmName('');
    }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Tournaments</h1>
          <p className="text-primary/40 font-medium mt-1">Manage and track your youth debate competitions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-accent flex items-center gap-2 py-3.5 px-6 rounded-2xl font-black text-sm shadow-xl shadow-accent/20"
        >
          <Plus size={18} />
          New Tournament
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-56 rounded-[2.5rem] bg-white/60 border border-border animate-pulse" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-border rounded-[3rem] p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center text-primary/20 mb-6">
            <Trophy size={40} />
          </div>
          <h3 className="text-2xl font-black text-primary mb-2">No Tournaments Yet</h3>
          <p className="text-primary/40 font-medium max-w-sm mb-8">Create your first tournament to get started.</p>
          <button onClick={() => setShowCreateModal(true)} className="btn-accent px-8 py-4 rounded-2xl font-black text-sm">
            Create First Tournament
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className="premium-card p-8 rounded-[2.5rem] cursor-pointer group relative overflow-hidden"
                onClick={() => navigate(`/dashboard/events/${event._id}/registration`)}
              >
                <div className="absolute top-6 right-6 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${STATUS_STYLES[event.status] || STATUS_STYLES['Draft']}`}>
                    {event.status}
                  </span>
                  {event.status === 'Draft' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStart(e, event._id); }}
                      disabled={starting === event._id}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-wider hover:bg-emerald-200 transition-all disabled:opacity-60"
                    >
                      <PlayCircle size={11} />
                      {starting === event._id ? '...' : 'Start'}
                    </button>
                  )}
                  {event.status !== 'Bracket Stage' && (
                    <button
                      onClick={() => { setDeleteTarget(event); setDeleteConfirmName(''); }}
                      className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center text-primary/20 hover:bg-destructive/10 hover:text-destructive transition-all"
                      title="Delete tournament"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <Trophy size={28} />
                </div>

                <h2 className="text-xl font-black text-primary leading-tight mb-1 pr-16">{event.name}</h2>
                <p className="text-xs font-bold text-primary/30 mb-6">{event.edition || '2026 Edition'}</p>

                <div className="flex items-center gap-3 text-xs font-bold text-primary/40 border-t border-border/50 pt-5">
                  <Calendar size={13} className="text-accent" />
                  {new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  <div className="ml-auto w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                    <ChevronRight size={15} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              <h2 className="text-3xl font-black text-primary mb-1">Create Tournament</h2>
              <p className="text-primary/40 font-medium mb-8 text-sm">Initialize a new competition instance</p>

              <form onSubmit={handleCreateEvent} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary/40 mb-2 ml-1">Tournament Name *</label>
                  <input
                    type="text" required
                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-accent/30 font-bold text-primary text-sm"
                    placeholder="e.g. National Youth Debate Championship"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary/40 mb-2 ml-1">Edition / Year</label>
                  <input
                    type="text"
                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-accent/30 font-bold text-primary text-sm"
                    placeholder="e.g. 2026 Edition"
                    value={newEvent.edition}
                    onChange={(e) => setNewEvent({ ...newEvent, edition: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary/40 mb-2 ml-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl bg-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-accent/30 font-bold text-primary text-sm resize-none"
                    placeholder="Brief details about the event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating}
                    className="flex-[2] btn-accent py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 disabled:opacity-60">
                    {creating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Create Tournament'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setDeleteTarget(null); setDeleteConfirmName(''); }}
              className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-destructive" />

              <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-5">
                <Trash2 size={22} />
              </div>

              <h2 className="text-xl font-black text-primary mb-1">Delete Tournament</h2>
              <p className="text-sm text-primary/50 font-medium mb-1">
                You are about to permanently delete
              </p>
              <p className="text-sm font-black text-primary mb-4">&ldquo;{deleteTarget.name}&rdquo;</p>

              {deleteTarget.status === 'Completed' ? (
                <>
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
                    <p className="text-xs font-black text-red-700 mb-1">⚠ This is a completed tournament</p>
                    <p className="text-xs text-red-600">All match results, scores, rankings, and school reports will be permanently erased. This cannot be undone.</p>
                  </div>
                  <label className="block text-xs font-black uppercase tracking-widest text-primary/40 mb-2">Type the tournament name to confirm</label>
                  <input
                    autoFocus
                    type="text"
                    placeholder={deleteTarget.name}
                    value={deleteConfirmName}
                    onChange={e => setDeleteConfirmName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-destructive/30 font-bold text-sm text-primary mb-5"
                  />
                </>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5">
                  <p className="text-xs text-amber-700 font-medium">All associated schools, teams, and match data will be deleted. This cannot be undone.</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteTarget(null); setDeleteConfirmName(''); }}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting || (deleteTarget.status === 'Completed' && deleteConfirmName !== deleteTarget.name)}
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm bg-destructive text-white hover:bg-red-700 transition-all disabled:opacity-40"
                >
                  {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Delete Permanently'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
