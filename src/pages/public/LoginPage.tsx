import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import { Trophy, ArrowRight, Mail, Lock, Mic2, GitBranch, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassInput } from '../../components/ui/GlassInput';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/events');
    }
  }, [isAuthenticated, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const data = await authService.login({ email, password });
      login(data);
      navigate('/dashboard/events');
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.requiresActivation) {
        navigate('/activate', { state: { email } });
        return;
      }
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/LOGO.jpeg" alt="Youth Contest" className="w-12 h-12 object-contain" />
            <div>
              <span className="text-xl font-black tracking-tighter text-primary block leading-none">YOUTH CONTEST</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Staff Portal</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight leading-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground font-medium">
              Securely access your tournament management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="staff@youthcontest.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <GlassInput
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  Sign In to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground pt-2">
            First time here?{' '}
            <button onClick={() => navigate('/activate')} className="text-accent font-bold hover:underline">
              Activate your account
            </button>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            &copy; 2026 The Youth Contest. Internal Platform Only.
          </p>
        </motion.div>
      </div>

      {/* Right: Visual panel */}
      <div className="hidden lg:flex flex-1 relative bg-primary items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
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
              Tournament Management Platform
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
              Run Competitions<br />
              <span className="text-accent">Without the Chaos</span>
            </h2>
            <p className="text-white/50 font-medium leading-relaxed">
              Real-time scoring, automated brackets, and instant rankings — all in one place.
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              { icon: Mic2, title: 'Multi-staff Registration', desc: 'Multiple staff can add schools simultaneously in real-time.' },
              { icon: GitBranch, title: 'Auto Bracket Generation', desc: 'Power 8 seedings calculated instantly from preliminary points.' },
              { icon: BarChart3, title: 'Live Rankings & Export', desc: 'Full rankings list exportable to Excel at any time.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center text-accent shrink-0">
                  <item.icon size={18} />
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

export default LoginPage;
