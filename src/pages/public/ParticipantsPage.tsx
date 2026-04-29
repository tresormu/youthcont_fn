import { Link } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

// Import participant images
import p1 from '../../assets/participant1.jpeg';
import p2 from '../../assets/participant2.jpeg';
import p3 from '../../assets/participant3.jpeg';
import p4 from '../../assets/participant4.jpeg';
import p5 from '../../assets/participant5.jpeg';
import p6 from '../../assets/participant6.jpeg';

const participants = [
  { img: p1, title: 'Youthful Energy', desc: 'Bringing together the brightest minds.' },
  { img: p2, title: 'Global Voices', desc: 'Representing diverse perspectives.' },
  { img: p3, title: 'Future Leaders', desc: 'Empowering tomorrow\'s champions.' },
  { img: p4, title: 'Competitive Spirit', desc: 'Fostering excellence through debate.' },
  { img: p5, title: 'Collaborative Growth', desc: 'Learning and winning together.' },
  { img: p6, title: 'Unforgettable Moments', desc: 'Creating memories that last a lifetime.' },
];

const ParticipantsPage = () => (
  <div className="min-h-screen bg-background selection:bg-accent selection:text-white">
    <PublicNav />

    {/* Hero Section */}
    <header className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-6"
        >
          Join the Movement
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-primary mb-6"
        >
          For the <span className="text-accent">Participants</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary/40 font-bold text-lg max-w-2xl mx-auto mb-10"
        >
          We've simplified the journey. Whether you're a school or an individual, starting your competition journey has never been easier.
        </motion.p>
      </div>
    </header>

    {/* Process Section */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-black text-primary mb-4">How to Access Our Service</h2>
              <p className="text-primary/40 font-bold leading-relaxed">
                We believe in human connection. No complex forms or automated bots. Just a simple conversation to get you started.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: MessageSquare, title: 'Step 1: Write to Us', desc: 'Visit our contact page and simply let us know you want to start working with us.' },
                { icon: Send, title: 'Step 2: We Reach Out', desc: 'Our dedicated team will review your message and reach out to you within 24 hours.' },
                { icon: Heart, title: 'Step 3: Start Growing', desc: 'We\'ll guide you through the registration and help you prepare for your first contest.' },
              ].map((step, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0">
                    <step.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-primary mb-1">{step.title}</h3>
                    <p className="text-sm text-primary/40 font-bold">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/contact" className="inline-flex items-center gap-3 btn-accent px-8 py-4 rounded-2xl text-sm font-black tracking-tight shadow-xl shadow-accent/25 group">
              Go to Contact Page
              <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {participants.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square rounded-3xl overflow-hidden relative group shadow-xl bg-white"
              >
                <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-all duration-500 contrast-[1.05]" />
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white text-xs font-black uppercase tracking-widest">{p.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ParticipantsPage;

