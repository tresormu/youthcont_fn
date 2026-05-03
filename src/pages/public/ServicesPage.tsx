import { Link } from 'react-router-dom';
import { Mic2, Users, Calendar, Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

const services = [
  {
    icon: Users,
    title: 'Debate Trainings',
    desc: 'Our experienced team members train students in debate and critical thinking through guided practice, structured feedback, and meaningful conversations.',
  },
  {
    icon: Mic2,
    title: 'Public Speaking Trainings',
    desc: 'We train students in public speaking to build confidence, improve delivery, and help them communicate ideas with clarity and impact.',
  },
  {
    icon: Calendar,
    title: 'Debate and Public Speaking Competitions',
    desc: 'After training, we provide real-life competition platforms where students test what they have learned with peers from different schools.',
  },
  {
    icon: Megaphone,
    title: 'Advocacy Training',
    desc: 'We equip young people with practical advocacy skills so they can raise awareness, engage communities, and champion positive civic change responsibly.',
  },
];

const ServicesPage = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />

    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-20">
      <div className="mb-10 sm:mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-5"
        >
          What We Offer
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-primary mb-3"
        >
          Our Services
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary/40 font-bold text-sm sm:text-lg max-w-2xl mx-auto"
        >
          We build confident communicators and responsible young leaders through training, competitions, and youth-centered advocacy.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-12 sm:mb-20">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border/50 rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group"
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
        className="bg-primary rounded-3xl p-8 sm:p-12 text-center"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
        <p className="text-white/50 font-bold mb-8 max-w-xl mx-auto">
          Contact us to join upcoming trainings, competitions, and civic engagement programs.
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


