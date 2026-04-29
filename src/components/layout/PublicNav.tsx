import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/staff', label: 'Staff' },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-3">
          <div className="bg-white/90 backdrop-blur-xl border border-border/50 rounded-2xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between shadow-lg shadow-black/5">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <img src="/LOGO.jpeg" alt="Youth Contest" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <span className="text-sm sm:text-base font-black text-primary tracking-tighter">YOUTH CONTEST</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-primary/40">
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

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="hidden sm:flex text-[11px] font-black uppercase tracking-widest text-accent px-3 py-2 bg-accent/10 rounded-xl hover:bg-accent/20 transition-all">
                  Dashboard
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:flex text-[11px] font-black uppercase tracking-widest text-primary/50 hover:text-primary transition-all px-3 py-2">
                  Staff Login
                </Link>
              )}
              <button
                className="md:hidden w-10 h-10 flex items-center justify-center text-primary/60 hover:text-primary rounded-xl hover:bg-secondary transition-all"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden"
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-x-4 top-[calc(100%+8px)] bg-white border border-border/50 rounded-2xl shadow-xl overflow-hidden md:hidden"
              >
                <div className="p-2">
                  {navLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center px-4 py-3.5 rounded-xl text-sm font-black transition-colors ${
                        pathname === link.to
                          ? 'bg-accent/10 text-accent'
                          : 'text-primary/60 hover:bg-secondary hover:text-primary'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-border/50 mt-2 pt-2">
                    {isAuthenticated ? (
                      <Link
                        to="/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-4 py-3.5 rounded-xl text-sm font-black text-accent bg-accent/5 hover:bg-accent/10 transition-colors"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center px-4 py-3.5 rounded-xl text-sm font-black text-primary/60 hover:bg-secondary hover:text-primary transition-colors"
                      >
                        Staff Login
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-20 sm:h-24" />
    </>
  );
};

export default PublicNav;
