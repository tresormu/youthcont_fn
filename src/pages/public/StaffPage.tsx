import { Users, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';
import gianne from '../../assets/Gianne.jpeg';
import klepper from '../../assets/klepper.jpeg';
import robert from '../../assets/robert.jpeg';
import queen from '../../assets/queen.jpeg';
import gretta from '../../assets/gretta.jpeg';
import gaella from '../../assets/gaella.jpeg';
import elisa from '../../assets/elisaa.jpeg';
import linka from '../../assets/Linka.jpeg';
import ramona from '../../assets/ramona.jpeg';
import prosper from '../../assets/prosper.jpeg';
import sandrah from '../../assets/sandrah.jpeg';

const team = [
  { name: 'Mugisha Prosper', role: 'CEO', image: prosper, bio: 'Leads the overall vision and strategic direction of THEYOUTHCONTEST.' },
  { name: 'Agasaro Uwase Sandrah', role: 'Managing Director', image: sandrah, bio: 'Oversees programs, operations, and implementation across teams and events.' },
  { name: 'Ruhingira Iriza Gianne', role: 'Data Entry', image: gianne, bio: 'Supports accurate and timely entry of tournament data and records.' },
  { name: 'Ivan Klepper', role: 'Head Judge', image: klepper, bio: 'Leads judging quality, consistency, and fairness across rounds.' },
  { name: 'Segikwiye Robert', role: 'Head Judge', image: robert, bio: 'Oversees judging standards and supports adjudication decisions.' },
  { name: 'Gwiza Queen Callixte', role: 'Judge', image: queen, bio: 'Evaluates debates and provides constructive scoring and feedback.' },
  { name: 'Atete Gretta', role: 'Judge', image: gretta, bio: 'Assesses speaker performance and helps ensure fair outcomes.' },
  { name: 'Mwiza Gaella', role: 'Judge', image: gaella, bio: 'Judges debate rounds using clear criteria and balanced evaluation.' },
  { name: 'Mugisha Elisa', role: 'Judge', image: elisa, bio: 'Supports high-quality adjudication and participant development.' },
  { name: 'Atete Linka Divine', role: 'Facilitator', image: linka, bio: 'Facilitates sessions and supports participant engagement and flow.' },
  { name: 'Irakoze Ramona', role: 'Judge', image: ramona, bio: 'Provides fair judgment, scoring, and actionable feedback to speakers.' },
];

const StaffPage = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />

    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-20">
      <div className="mb-10 sm:mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-5"
        >
          Meet the Team
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-black text-primary mb-3"
        >
          Our Staff
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary/40 font-bold text-sm sm:text-lg max-w-2xl mx-auto"
        >
          Passionate professionals dedicated to empowering young voices through competitive debate.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mb-12 sm:mb-20">
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
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
            className="bg-primary rounded-2xl p-6 sm:p-8 text-center"
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



