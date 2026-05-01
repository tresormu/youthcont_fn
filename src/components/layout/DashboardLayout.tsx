import { useState } from 'react';
import { Outlet, NavLink, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar, Users, Sword, GitBranch, BarChart3, LogOut,
  ChevronLeft, ChevronRight, Menu, X, Bell, UserCog, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const SidebarLink = ({
  to, icon: Icon, label, collapsed
}: { to: string; icon: any; label: string; collapsed: boolean }) => (
  <NavLink
    to={to}
    title={collapsed ? label : undefined}
    className={({ isActive }) => cn(
      'flex items-center rounded-2xl text-sm font-bold transition-all duration-200 group relative',
      collapsed ? 'justify-center p-3' : 'justify-between px-4 py-3.5',
      isActive
        ? 'bg-accent text-white shadow-lg shadow-accent/20'
        : 'text-primary/50 hover:bg-secondary hover:text-primary'
    )}
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-xl transition-all duration-200',
            isActive ? 'bg-white/20' : 'group-hover:bg-white/50'
          )}>
            <Icon size={16} />
          </div>
          {!collapsed && <span>{label}</span>}
        </div>
        {isActive && !collapsed && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
        {!isActive && !collapsed && <ChevronRight size={14} className="opacity-0 group-hover:opacity-30 transition-opacity" />}
      </>
    )}
  </NavLink>
);

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { eventId } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <div className={cn(
      'bg-white h-screen flex flex-col border-r border-border shadow-sm transition-all duration-300 overflow-hidden',
      collapsed ? 'w-20' : 'w-72'
    )}>
      {/* Brand */}
      <div className={cn('p-6 border-b border-border/50 flex items-center', collapsed ? 'justify-center' : 'justify-between')}>
        <Link to="/dashboard/events" className="flex items-center gap-3 group">
          <img src="/LOGO.jpeg" alt="Youth Contest" className="w-10 h-10 object-contain" />
          {!collapsed && (
            <div>
              <p className="text-sm font-black text-primary tracking-tighter leading-none">YOUTH CONTEST</p>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-accent mt-0.5">Staff Dashboard</p>
            </div>
          )}
        </Link>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-primary/30 hover:text-primary">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <SidebarLink to="/dashboard/events" icon={Calendar} label="Tournaments" collapsed={collapsed} />

        {eventId && (
          <>
            {!collapsed && (
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/25 px-4 pt-5 pb-2">Current Event</p>
            )}
            {collapsed && <div className="my-3 h-px bg-border/50 mx-2" />}
            <SidebarLink to={`/dashboard/events/${eventId}/registration`} icon={Users} label="Schools & Teams" collapsed={collapsed} />
            {localStorage.getItem(`matchmaking_mode_${eventId}`) === 'manual' && (
              <SidebarLink to={`/dashboard/events/${eventId}/manual-assign`} icon={Sword} label="Manual Assignment" collapsed={collapsed} />
            )}
            <SidebarLink to={`/dashboard/events/${eventId}/matchmaking`} icon={Sword} label="Match Console" collapsed={collapsed} />
            <SidebarLink to={`/dashboard/events/${eventId}/bracket`} icon={GitBranch} label="Bracket" collapsed={collapsed} />
            <SidebarLink to={`/dashboard/events/${eventId}/rankings`} icon={BarChart3} label="Rankings" collapsed={collapsed} />
          </>
        )}

        {user?.role === 'seed_admin' && (
          <>
            {!collapsed && (
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/25 px-4 pt-5 pb-2">Administration</p>
            )}
            {collapsed && <div className="my-3 h-px bg-border/50 mx-2" />}
            <SidebarLink to="/dashboard/staff" icon={UserCog} label="Staff Management" collapsed={collapsed} />
            <SidebarLink to={eventId ? `/dashboard/events/${eventId}/grant-access` : '/dashboard/events'} icon={KeyRound} label="Grant School Access" collapsed={collapsed} />
          </>
        )}
      </div>

      {/* Footer */}
      <div className={cn('p-4 border-t border-border/50 space-y-3', collapsed ? 'flex flex-col items-center' : '')}>
        <div className={cn('bg-secondary/50 rounded-2xl p-3 flex items-center gap-3', collapsed ? 'justify-center' : '')}>
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-black text-primary truncate leading-none">{user?.name}</p>
              <p className="text-[9px] uppercase font-bold text-primary/30 mt-0.5">{user?.role?.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-2xl text-sm font-bold text-destructive hover:bg-destructive/8 transition-all duration-200',
            collapsed ? 'justify-center p-3 w-full' : 'px-4 py-3 w-full'
          )}
        >
          <LogOut size={16} />
          {!collapsed && 'Logout'}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-secondary text-primary/40 hover:bg-primary hover:text-white transition-all mx-auto"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-border/50 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-primary/40 hover:text-primary rounded-xl hover:bg-secondary transition-all"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2.5 text-primary/30 hover:text-primary hover:bg-secondary rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-black text-primary leading-none">{user?.name}</p>
                <p className="text-[9px] text-primary/30 font-bold uppercase tracking-widest mt-0.5">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
