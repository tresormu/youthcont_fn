import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Mail, KeyRound, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassInput } from '../../components/ui/GlassInput';

const ActivatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState((location.state as any)?.email || '');
  const [pinCode, setPinCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard/events');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.activate({ email, pinCode: pinCode.trim().toUpperCase(), newPassword });
      login(data);
      navigate('/dashboard/events');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Activation failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/LOGO.jpeg" alt="THEYOUTHCONTEST" className="w-12 h-12 object-contain" />
            <div>
              <span className="text-xl font-black tracking-tighter text-primary block leading-none">THEYOUTHCONTEST</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Account Activation</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <ShieldCheck size={20} />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight leading-tight">
                Activate Account
              </h1>
            </div>
            <p className="text-muted-foreground font-medium text-sm">
              Enter the PIN from your invitation email and set a new password to activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <GlassInput
              label="Invitation PIN Code"
              type="text"
              placeholder="e.g. A3BX9Z"
              icon={<KeyRound className="w-4 h-4" />}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.toUpperCase())}
              required
            />
            <GlassInput
              label="New Password"
              type="password"
              placeholder="Min. 8 characters"
              icon={<Lock className="w-4 h-4" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <GlassInput
              label="Confirm New Password"
              type="password"
              placeholder="Repeat your password"
              icon={<Lock className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 py-4 rounded-2xl bg-destructive/8 border border-destructive/20 text-destructive text-sm font-bold"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-60 disabled:scale-100 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Activate & Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Already activated?{' '}
            <button onClick={() => navigate('/login')} className="text-accent font-bold hover:underline">
              Sign in here
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[60px]" />

        <div className="relative z-10 w-full max-w-lg space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              One-Time Setup
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
              You're one step<br />
              <span className="text-accent">away from access</span>
            </h2>
            <p className="text-white/50 font-medium leading-relaxed">
              Use the PIN from your invitation email to verify your identity and set a permanent password.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: '1', title: 'Enter your PIN', desc: 'Copy the 6-character PIN from your invitation email.' },
              { step: '2', title: 'Set your password', desc: 'Choose a strong password you\'ll use going forward.' },
              { step: '3', title: 'Access the dashboard', desc: 'Your account activates instantly — no extra steps.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent font-black text-sm shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-black text-white mb-1">{item.title}</p>
                  <p className="text-xs text-white/40 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivatePage;


