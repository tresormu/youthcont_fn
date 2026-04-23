import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Our Services' },
  { to: '/staff', label: 'Our Staff' },
  { to: '/participants', label: 'Participants' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' },
];

const PublicNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <>
    <nav className="fixed top-0 inset-x-0 z-[100]">
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="bg-white/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 h-16 flex items-center justify-between shadow-lg shadow-black/5">
          <Link to="/" className="flex items-center gap-3">
            <img src="/LOGO.jpeg" alt="Youth Contest" className="w-10 h-10 object-contain" />
            <span className="text-base font-black text-primary tracking-tighter">YOUTH CONTEST</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-primary/40">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`hover:text-accent transition-colors ${pathname === link.to ? 'text-accent' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-all hidden sm:block px-4 py-2 bg-accent/10 rounded-xl">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-all hidden sm:block">
                Staff Login
              </Link>
            )}

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center text-primary/60 hover:text-primary"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-4 shadow-lg flex flex-col gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${pathname === link.to ? 'text-accent' : 'text-primary/50 hover:text-accent'}`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-[11px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-[11px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-all"
              >
                Staff Login
              </Link>
            )}

          </div>
        )}
      </div>
    </nav>
    <div className="h-28" />
    </>  
  );
};

export default PublicNav;
