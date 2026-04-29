import { Link } from 'react-router-dom';
import { Trophy, Users, Sword, BarChart3, ChevronRight, Mic2, Star, ArrowRight, Calendar, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

import fun1 from '../../assets/fun1.jpeg';
import fun2 from '../../assets/fun2.jpeg';
import fun3 from '../../assets/fun3.jpeg';
import fun4 from '../../assets/fun4.jpeg';
import win2 from '../../assets/win2.jpeg';
import p1 from '../../assets/participant1.jpeg';
import staff1 from '../../assets/staff1.jpeg';
import staff2 from '../../assets/staff2.jpeg';
import staff4 from '../../assets/staff4.jpeg';
import staffcover from '../../assets/staffcover.jpeg';

const PublicLandingPage = () => (
  <div className="min-h-screen bg-background selection:bg-accent selection:text-white overflow-x-hidden">
    <PublicNav />

    {/* ── HERO ── */}
    <header className="relative min-h-[90vh] flex items-center justify-center py-16 sm:py-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src={p1} alt="" className="w-full h-full object-cover opacity-[0.15]" />
        <div className="absolute top-1/4 right-0 w-[400px] sm:w-[700px] h-[400px] sm:h-[700px] bg-accent/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-8"
        >
          <Star size={10} className="fill-accent" />
          Empowering the leaders of tomorrow
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[2.8rem] sm:text-6xl md:text-[7rem] font-black text-primary tracking-tight leading-[0.9] mb-6 sm:mb-8"
        >
          WHERE YOUNG<br />
          <span className="relative inline-block">
            <span className="relative z-10 text-accent">VOICES</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-accent/15 rounded-sm origin-left"
            />
          </span>{' '}RISE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base sm:text-lg md:text-xl text-primary/40 font-bold max-w-xl mx-auto mb-10 leading-relaxed px-2"
        >
          Real-time scoring, live brackets, and automated rankings — the complete platform for youth debate tournaments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link to="/events" className="w-full sm:w-auto btn-accent px-8 py-4 rounded-2xl text-sm font-black tracking-tight shadow-2xl shadow-accent/25 flex items-center justify-center gap-2 group text-white">
            Explore Active Events
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black tracking-tight border-2 border-border hover:border-accent/40 text-primary/60 hover:text-accent transition-all flex items-center justify-center gap-2">
            Get In Touch
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 mt-12"
        >
          {[
            { val: '24', label: 'Tournaments' },
            { val: '1.2k+', label: 'Students' },
            { val: '800+', label: 'Matches' },
            { val: '50+', label: 'Schools' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 bg-white border border-border/60 rounded-2xl px-4 py-3 shadow-sm justify-center">
              <span className="text-lg sm:text-xl font-black text-primary">{s.val}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </header>

    {/* ── SERVICES ── */}
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">What We Offer</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mb-3">Our Services</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto text-sm sm:text-base">
            A complete platform designed to power youth debate tournaments from start to finish.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 mb-10">
          {[
            { icon: Mic2, title: 'Dynamic Registration', desc: 'Staff-led entry for schools, teams, and public speakers with real-time availability checks.' },
            { icon: Sword, title: 'Real-time Scoring', desc: 'Instant win/loss entry during rounds with automatic point accumulation across the field.' },
            { icon: BarChart3, title: 'Automated Rankings', desc: 'Points, head-to-head, and strength of schedule calculated instantly to build the Power 8.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group"
            >
              <div className="w-11 h-11 bg-secondary/60 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all flex-shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-primary mb-1">{title}</h3>
                <p className="text-sm text-primary/40 font-bold leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-black text-accent hover:gap-3 transition-all">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* ── EVENTS ── */}
    <section className="py-16 sm:py-24 lg:py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={win2} alt="" className="w-full h-full object-cover opacity-[0.12]" />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Compete & Excel</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mb-5">Tournament Events</h2>
            <p className="text-primary/40 font-bold leading-relaxed mb-6 text-sm sm:text-base">
              Browse active tournaments, view live brackets, and track your school's performance in real-time. From local qualifiers to national championships.
            </p>
            <Link to="/events" className="inline-flex items-center gap-2 text-sm font-black text-accent hover:gap-3 transition-all">
              Browse All Events <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: Calendar, label: 'Active Tournaments', val: '8' },
              { icon: Trophy, label: 'Total Events', val: '24' },
              { icon: Users, label: 'Participating Schools', val: '50+' },
              { icon: Sword, label: 'Matches Played', val: '800+' },
            ].map(({ icon: Icon, label, val }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-border/50 rounded-2xl p-4 sm:p-6 text-center hover:border-accent/30 hover:shadow-lg transition-all"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-2 sm:mb-3">
                  <Icon size={18} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-primary mb-1">{val}</div>
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary/30 leading-tight">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── STAFF ── */}
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">The People Behind It</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mb-3">Our Staff</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto text-sm sm:text-base">
            Passionate professionals dedicated to empowering young voices through competitive debate.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 mb-10">
          {[
            { title: 'Experienced', desc: 'Years of tournament management expertise across all levels of competition.', img: staff1 },
            { title: 'Dedicated', desc: 'Committed to student success, fair play, and an exceptional experience.', img: staff2 },
            { title: 'Supportive', desc: 'Always available to assist schools, coaches, and participants with personalized care.', img: staff4 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary rounded-3xl overflow-hidden shadow-xl shadow-primary/10"
            >
              <div className="h-52 sm:h-64 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover contrast-[1.05] brightness-[1.02]" />
              </div>
              <div className="p-6 sm:p-8 text-center relative">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent rounded-2xl flex items-center justify-center text-white mx-auto mb-4 sm:mb-6 -mt-12 sm:-mt-14 relative z-10 border-4 border-primary shadow-lg shadow-black/20">
                  <Headphones size={22} />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 font-bold leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/staff" className="inline-flex items-center gap-2 text-sm font-black text-accent hover:gap-3 transition-all">
            Meet the Full Team <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    {/* ── FUN ── */}
    <section className="py-16 sm:py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={staffcover} alt="" className="w-full h-full object-cover opacity-[0.15]" />
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Beyond Competition</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary leading-tight mb-3">We Also Have Fun</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto text-sm sm:text-base">
            While we take debate seriously, we also celebrate the joy of learning and the friendships formed along the way.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[fun1, fun2, fun3, fun4].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
            >
              <img src={img} alt="Fun moments" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CONTACT CTA ── */}
    <section className="py-16 sm:py-24 lg:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-3 block">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary mb-5 leading-tight">Contact Us</h2>
          <p className="text-primary/40 font-bold mb-8 text-base sm:text-lg max-w-xl mx-auto">
            Have questions about tournaments, registration, or partnerships? We'd love to hear from you.
          </p>
          <Link to="/contact" className="inline-flex btn-accent px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-sm font-black tracking-tight shadow-2xl shadow-accent/25 items-center gap-3 group">
            Send a Message <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PublicLandingPage;
