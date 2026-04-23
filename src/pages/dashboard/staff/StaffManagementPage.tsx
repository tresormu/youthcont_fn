import React, { useState, useEffect } from 'react';
import staffService from '../../../services/staffService';
import api from '../../../services/api';
import { UserCog, Plus, UserX, UserCheck, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '../../../components/common/ConfirmModal';
import { useToast } from '../../../components/common/Toast';

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  pendingActivation: boolean;
  createdAt: string;
}

const StaffManagementPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<StaffMember | null>(null);
  const [toggling, setToggling] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      const data = await staffService.getStaff();
      setStaff(data);
    } catch { toast('Failed to load staff', 'error'); }
    finally { setIsLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.post('/admin/staff', { email: inviteEmail });
      setStaff(prev => [res.data, ...prev]);
      setShowCreateModal(false);
      setInviteEmail('');
      toast('Invitation sent! Staff member will receive an email with their PIN.');
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to invite staff', 'error');
    } finally { setCreating(false); }
  };

  const handleToggleActive = async () => {
    if (!toggleTarget) return;
    setToggling(true);
    try {
      await staffService.updateStaff(toggleTarget._id, { isActive: !toggleTarget.isActive });
      setStaff(prev => prev.map(s => s._id === toggleTarget._id ? { ...s, isActive: !s.isActive } : s));
      toast(`Staff member ${toggleTarget.isActive ? 'deactivated' : 'reactivated'}`);
    } catch { toast('Failed to update staff status', 'error'); }
    finally { setToggling(false); setToggleTarget(null); }
  };


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Staff Management</h1>
          <p className="text-primary/40 font-medium mt-1">Manage platform staff accounts — Seed Admin only</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-accent flex items-center gap-2 py-3.5 px-6 rounded-2xl font-black text-sm shadow-xl shadow-accent/20"
        >
          <Plus size={18} />
          Add Staff Member
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white/60 rounded-[2rem] animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-border/50 overflow-hidden shadow-xl shadow-black/5">
          <div className="p-6 border-b border-border">
            <p className="text-xs font-black uppercase tracking-widest text-primary/30">{staff.length} Staff Members</p>
          </div>
          <div className="divide-y divide-border/30">
            <AnimatePresence>
              {staff.map((member) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-7 py-5 hover:bg-secondary/20 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm
                      ${member.isActive ? 'bg-accent/10 text-accent' : 'bg-secondary text-primary/30'}`}>
                      {(member.name || member.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-black text-primary">{member.name || <span className="text-primary/30 italic">Not set</span>}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest
                          ${member.role === 'seed_admin' ? 'bg-amber-100 text-amber-600' : 'bg-secondary text-primary/40'}`}>
                          {member.role.replace('_', ' ')}
                        </span>
                        {!member.isActive && member.pendingActivation && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-600">
                            <Clock size={9} /> Pending Activation
                          </span>
                        )}
                        {!member.isActive && !member.pendingActivation && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-destructive/10 text-destructive">
                            Deactivated
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-primary/40 mt-0.5">{member.email}</p>
                    </div>
                  </div>

                  {member.role !== 'seed_admin' && (
                    <button
                      onClick={() => setToggleTarget(member)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${member.isActive
                          ? 'text-destructive hover:bg-destructive/8 border border-destructive/20'
                          : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'}`}
                    >
                      {member.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Reactivate</>}
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowCreateModal(false); setInviteEmail(''); }} className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                <UserCog size={24} />
              </div>
              <h2 className="text-2xl font-black text-primary mb-1">Invite Staff Member</h2>
              <p className="text-primary/40 font-medium text-sm mb-8">An invitation email with a one-time PIN will be sent to activate their account.</p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-widest text-primary/30 mb-2 ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/25" />
                    <input type="email" required
                      className="w-full pl-10 pr-5 py-4 rounded-2xl bg-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-accent/30 font-bold text-sm"
                      placeholder="staff@youthcontest.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm text-primary/40 hover:bg-secondary transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={creating}
                    className="flex-[2] btn-accent py-4 rounded-2xl font-black text-sm shadow-xl shadow-accent/20 disabled:opacity-60">
                    {creating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : 'Send Invitation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleActive}
        loading={toggling}
        variant={toggleTarget?.isActive ? 'danger' : 'confirm'}
        title={toggleTarget?.isActive ? 'Deactivate Staff Member' : 'Reactivate Staff Member'}
        message={toggleTarget?.isActive
          ? `Deactivate "${toggleTarget?.name}"? They will lose access to the platform immediately.`
          : `Reactivate "${toggleTarget?.name}"? They will regain full staff access.`}
        confirmLabel={toggleTarget?.isActive ? 'Yes, Deactivate' : 'Yes, Reactivate'}
      />
    </div>
  );
};

export default StaffManagementPage;
