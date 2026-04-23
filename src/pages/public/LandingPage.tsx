import { Link } from 'react-router-dom';
import { Trophy, Users, Sword, BarChart3, ChevronRight, Mic2, Star, ArrowRight, Calendar, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

// Assets
import fun1 from '../../assets/fun1.jpeg';
import fun2 from '../../assets/fun2.jpeg';
import fun3 from '../../assets/fun3.jpeg';
import fun4 from '../../assets/fun4.jpeg';
import win1 from '../../assets/win1.jpeg';
import win2 from '../../assets/win2.jpeg';
import p1 from '../../assets/participant1.jpeg';
import p2 from '../../assets/participant2.jpeg';
import staff1 from '../../assets/staff1.jpeg';
import staff2 from '../../assets/staff2.jpeg';
import staff3 from '../../assets/staff3.jpeg';
import staff4 from '../../assets/staff4.jpeg';
import staffcover from '../../assets/staffcover.jpeg';

const PublicLandingPage = () => (
  <div className="min-h-screen bg-background selection:bg-accent selection:text-white overflow-x-hidden">

    <PublicNav />

    {/* ── HERO ── */}
    <header className="relative min-h-screen flex items-center justify-center pt-28 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-0">
          <img src={p1} alt="background" className="w-full h-full object-cover opacity-[0.18]" />
        </div>
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-accent/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(hsl(222 47% 11%) 1px, transparent 1px), linear-gradient(90deg, hsl(222 47% 11%) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-black text-[10px] uppercase tracking-[0.2em] mb-10"
        >
          <Star size={10} className="fill-accent" />
          Empowering the leaders of tomorrow
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-[7rem] font-black text-primary tracking-tight leading-[0.88] mb-8"
        >
          WHERE YOUNG<br />
          <span className="relative inline-block">
            <span className="relative z-10 text-accent">VOICES</span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-2 left-0 right-0 h-4 bg-accent/15 rounded-sm origin-left"
            />
          </span>{' '}RISE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-lg md:text-xl text-primary/40 font-bold max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Real-time scoring, live brackets, and automated rankings — the complete platform for youth debate tournaments.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/events" className="btn-accent px-8 py-4 rounded-2xl text-sm font-black tracking-tight shadow-2xl shadow-accent/25 flex items-center gap-2 group text-white">
            Explore Active Events
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contact" className="px-8 py-4 rounded-2xl text-sm font-black tracking-tight border-2 border-border hover:border-accent/40 text-primary/60 hover:text-accent transition-all flex items-center gap-2">
            Get In Touch
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-16"
        >
          {[
            { val: '24', label: 'Tournaments' },
            { val: '1.2k+', label: 'Students' },
            { val: '800+', label: 'Matches' },
            { val: '50+', label: 'Schools' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-border/60 rounded-2xl px-5 py-3 shadow-sm">
              <span className="text-xl font-black text-primary">{s.val}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/30">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </header>

    {/* ── SERVICES SECTION ── */}
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">What We Offer</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-4">Our Services</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto">
            A complete platform designed to power youth debate tournaments from start to finish.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {[
            { icon: Mic2, title: 'Dynamic Registration', desc: 'Staff-led entry for schools, teams, and public speakers with real-time availability checks.' },
            { icon: Sword, title: 'Real-time Scoring', desc: 'Instant win/loss entry during rounds with automatic point accumulation across the field.' },
            { icon: BarChart3, title: 'Automated Rankings', desc: 'Points, head-to-head, and strength of schedule calculated instantly to build the Power 8.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-5 p-6 rounded-2xl border border-border/50 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group"
            >
              <div className="w-12 h-12 bg-secondary/60 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all flex-shrink-0">
                <Icon size={22} />
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

    {/* ── EVENTS SECTION ── */}
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={win2} alt="background" className="w-full h-full object-cover opacity-[0.15]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">Compete & Excel</span>
            <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-6">Tournament Events</h2>
            <p className="text-primary/40 font-bold leading-relaxed mb-8">
              Browse active tournaments, view live brackets, and track your school's performance in real-time. From local qualifiers to national championships.
            </p>
            <Link to="/events" className="inline-flex items-center gap-2 text-sm font-black text-accent hover:gap-3 transition-all">
              Browse All Events <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
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
                className="bg-white border border-border/50 rounded-2xl p-6 text-center hover:border-accent/30 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-3">
                  <Icon size={20} />
                </div>
                <div className="text-2xl font-black text-primary mb-1">{val}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/30">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* ── STAFF SECTION ── */}
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">The People Behind It</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-4">Our Staff</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto">
            Passionate professionals dedicated to empowering young voices through competitive debate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
              className="bg-primary rounded-3xl overflow-hidden group shadow-xl shadow-primary/10"
            >
              <div className="h-64 overflow-hidden bg-secondary/20">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-all duration-700 contrast-[1.05] brightness-[1.02]" />
              </div>
              <div className="p-8 text-center relative">
                <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white mx-auto mb-6 -mt-14 relative z-10 border-4 border-primary shadow-lg shadow-black/20">
                  <Headphones size={28} />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
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

    {/* ── FUN SECTION ── */}
    <section className="py-32 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src={staffcover} alt="background" className="w-full h-full object-cover opacity-[0.18]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">Beyond Competition</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary leading-tight mb-4">We Also Have Fun</h2>
          <p className="text-primary/40 font-bold max-w-xl mx-auto">
            While we take debate seriously, we also celebrate the joy of learning and the friendships formed along the way.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[fun1, fun2, fun3, fun4].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="aspect-square rounded-3xl overflow-hidden shadow-lg bg-white"
            >
              <img src={img} alt="Fun moments" className="w-full h-full object-cover transition-transform duration-700 contrast-[1.02]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CONTACT SECTION ── */}
    <section className="py-32 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4 block">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">Contact Us</h2>
          <p className="text-primary/40 font-bold mb-10 text-lg max-w-xl mx-auto">
            Have questions about tournaments, registration, or partnerships? We'd love to hear from you.
          </p>
          <div className="flex items-center justify-center">
            <Link to="/contact" className="btn-accent px-12 py-5 rounded-2xl text-sm font-black tracking-tight shadow-2xl shadow-accent/25 flex items-center gap-3 group">
              Send a Message <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default PublicLandingPage;
