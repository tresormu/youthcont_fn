import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

// Assets
import win1 from '../../assets/win1.jpeg';
import fun1 from '../../assets/fun1.jpeg';
import p1 from '../../assets/participant1.jpeg';
import p2 from '../../assets/participant2.jpeg';
import win2 from '../../assets/win2.jpeg';
import fun2 from '../../assets/fun2.jpeg';

const posts = [
  {
    tag: 'Tournament Tips',
    title: 'How to Prepare Your Team for a Debate Tournament',
    excerpt: "From research strategies to managing nerves on the day, here's a complete guide for coaches and team captains.",
    date: 'June 12, 2026',
    readTime: '5 min read',
    accent: 'bg-accent/10 text-accent',
    image: win1,
  },
  {
    tag: 'Platform Update',
    title: 'Introducing Real-Time Bracket Tracking',
    excerpt: 'Spectators and coaches can now follow live bracket updates as matches are scored — no refresh needed.',
    date: 'May 28, 2026',
    readTime: '3 min read',
    accent: 'bg-emerald-100 text-emerald-600',
    image: fun1,
  },
  {
    tag: 'Community',
    title: 'Meet the Schools Dominating the 2026 Season',
    excerpt: 'We spotlight the top-ranked schools and the strategies that have kept them at the top of the leaderboard.',
    date: 'May 10, 2026',
    readTime: '7 min read',
    accent: 'bg-amber-100 text-amber-600',
    image: p1,
  },
  {
    tag: 'Public Speaking',
    title: 'The Art of the Opening Statement',
    excerpt: 'A strong opening can define the entire round. Learn the techniques used by national champions.',
    date: 'April 22, 2026',
    readTime: '4 min read',
    accent: 'bg-purple-100 text-purple-600',
    image: p2,
  },
  {
    tag: 'Tournament Tips',
    title: 'Understanding the Power 8 Ranking System',
    excerpt: 'Points, head-to-head, and strength of schedule — we break down exactly how teams qualify for the finals.',
    date: 'April 5, 2026',
    readTime: '6 min read',
    accent: 'bg-accent/10 text-accent',
    image: win2,
  },
  {
    tag: 'Platform Update',
    title: 'New Export & Reporting Features for Organizers',
    excerpt: 'Admins can now export full tournament data to CSV and PDF with a single click from the dashboard.',
    date: 'March 18, 2026',
    readTime: '2 min read',
    accent: 'bg-emerald-100 text-emerald-600',
    image: fun2,
  },
];

const BlogPage = () => (
  <div className="min-h-screen bg-background">
    <PublicNav />

    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10 sm:py-20">
      <div className="mb-10 sm:mb-16 text-center">
        <h1 className="text-3xl sm:text-5xl font-black text-primary mb-3">The Blog</h1>
        <p className="text-primary/40 font-bold text-sm sm:text-lg max-w-xl mx-auto">
          Insights, updates, and stories from the world of youth debate and public speaking.
        </p>
      </div>

      {/* Featured post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary rounded-3xl overflow-hidden mb-12 group cursor-pointer hover:bg-primary/95 transition-all"
      >
        <div className="grid md:grid-cols-2">
          <div className="h-56 sm:h-64 md:h-auto overflow-hidden">
            <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center">
            <span className="inline-block self-start px-4 py-1.5 bg-accent rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-6">
              Featured
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
              {posts[0].title}
            </h2>
            <p className="text-white/50 font-bold mb-6 sm:mb-8 max-w-xl">{posts[0].excerpt}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-4 text-white/30 text-xs font-black uppercase tracking-widest">
                <span>{posts[0].date}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{posts[0].readTime}</span>
              </div>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
        {posts.slice(1).map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border border-border/50 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex flex-col"
          >
            <div className="h-48 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="p-8 flex-1 flex flex-col">
              <span className={`inline-block self-start px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${post.accent}`}>
                {post.tag}
              </span>
              <h3 className="text-xl font-black text-primary mb-3 leading-snug">{post.title}</h3>
              <p className="text-sm text-primary/40 font-bold leading-relaxed flex-1">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 text-[10px] font-black text-primary/30 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} />{post.readTime}</span>
                </div>
                <ArrowRight size={16} className="text-primary/20 group-hover:text-accent transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

export default BlogPage;

