import { Users, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';
import staffadmin from '../../assets/staffadmin.jpeg';
import staff1 from '../../assets/staff1.jpeg';
import staff2 from '../../assets/staff2.jpeg';
import staff3 from '../../assets/staff3.jpeg';
import staff4 from '../../assets/staff4.jpeg';
import staff5 from '../../assets/staff5.jpeg';
import staff6 from '../../assets/staff6.jpeg';
import staff7 from '../../assets/staff7.jpeg';
import staff8 from '../../assets/staff8.jpeg';
import staff9 from '../../assets/staff9.jpeg';

const team = [
  {
    name: 'Uwase Sandra',
    role: 'Staff Admin',
    image: staffadmin,
    bio: 'Leading the Youth Contest with passion and dedication to empower the next generation.',
  },
  {
    name: 'papa wabo',
    role: 'Tournament Coordinator',
    image: staff1,
    bio: 'Ensuring every tournament runs smoothly and fairly for all participating schools.',
  },
  {
    name: 'papa wabo',
    role: 'Event Specialist',
    image: staff2,
    bio: 'Expert in logistics and event management with a focus on student experience.',
  },
  {
    name: 'papa wabo',
    role: 'Technical Support',
    image: staff3,
    bio: 'Providing technical excellence and real-time support for our digital platforms.',
  },
  {
    name: 'papa wabo',
    role: 'Community Outreach',
    image: staff4,
    bio: 'Connecting schools and students to our platform and fostering growth.',
  },
  {
    name: 'papa wabo',
    role: 'Judging Lead',
    image: staff5,
    bio: 'Maintaining the highest standards of competitive debate and fair adjudication.',
  },
  {
    name: 'papa wabo',
    role: 'Operations Lead',
    image: staff6,
    bio: 'Optimizing tournament workflows for maximum efficiency and transparency.',
  },
  {
    name: 'papa wabo',
    role: 'Data Specialist',
    image: staff7,
    bio: 'Analyzing results to improve future competitions and provide deep insights.',
  },
  {
    name: 'papa wabo',
    role: 'Media Coordinator',
    image: staff8,
    bio: 'Capturing the best moments and success stories of every event we host.',
  },
  {
    name: 'papa wabo',
    role: 'Support Staff',
    image: staff9,
    bio: 'Always ready to assist coaches, students, and staff throughout their journey.',
  },
];

const StaffPage = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />

    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-6"
        >
          Meet the Team
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-black text-primary mb-4"
        >
          Our Staff
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary/40 font-bold text-lg max-w-2xl mx-auto"
        >
          Passionate professionals dedicated to empowering young voices through competitive debate.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-border/50 rounded-3xl p-6 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden mb-6 relative bg-secondary/20 shadow-lg">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover transition-all duration-500 contrast-[1.05] brightness-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                <p className="text-white text-sm font-bold leading-relaxed">{member.bio}</p>
              </div>
            </div>
            <h3 className="text-2xl font-black text-primary mb-1 tracking-tight">{member.name}</h3>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">{member.role}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Shield, title: 'Experienced', desc: 'Years of tournament management expertise' },
          { icon: Users, title: 'Dedicated', desc: 'Committed to student success and growth' },
          { icon: Headphones, title: 'Supportive', desc: '24/7 assistance for all participants' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="bg-primary rounded-2xl p-8 text-center"
          >
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white mx-auto mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/50 font-bold">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default StaffPage;

