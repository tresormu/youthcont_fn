import { Link } from 'react-router-dom';
import { Mic2, Sword, BarChart3, Users, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

const services = [
  {
    icon: Calendar,
    title: 'Tournament Management',
    desc: 'End-to-end event organization from registration to final rankings with automated scheduling and bracket generation.',
  },
  {
    icon: Users,
    title: 'Team Registration',
    desc: 'Streamlined registration system for schools, teams, and individual public speakers with real-time capacity tracking.',
  },
  {
    icon: Sword,
    title: 'Live Scoring',
    desc: 'Real-time match scoring with instant updates to brackets, rankings, and leaderboards visible to all participants.',
  },
  {
    icon: BarChart3,
    title: 'Automated Rankings',
    desc: 'Sophisticated ranking algorithm considering points, head-to-head records, and strength of schedule for fair competition.',
  },
  {
    icon: Mic2,
    title: 'Public Speaking Events',
    desc: 'Dedicated support for individual public speaking competitions with specialized judging and scoring systems.',
  },
  {
    icon: Award,
    title: 'Results & Analytics',
    desc: 'Comprehensive tournament reports, performance analytics, and exportable data for coaches and organizers.',
  },
];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />

    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-6"
        >
          What We Offer
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-black text-primary mb-4"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary/40 font-bold text-lg max-w-2xl mx-auto"
        >
          A complete platform designed to power youth debate tournaments from start to finish.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all mb-6">
              <service.icon size={28} />
            </div>
            <h3 className="text-xl font-black text-primary mb-3">{service.title}</h3>
            <p className="text-sm text-primary/40 font-bold leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-primary rounded-3xl p-12 text-center"
      >
        <h2 className="text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
        <p className="text-white/50 font-bold mb-8 max-w-xl mx-auto">
          Contact us to learn how we can support your next tournament.
        </p>
        <Link to="/contact" className="inline-block btn-accent px-8 py-4 rounded-2xl text-sm font-black tracking-tight shadow-2xl shadow-accent/30">
          Contact Us
        </Link>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default ServicesPage;

