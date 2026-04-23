import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import { Trophy, Calendar, ChevronRight, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

const EventsPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-black uppercase tracking-widest mb-6"
          >
            Compete & Excel
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-primary mb-4"
          >
            Tournament Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary/40 font-bold text-lg max-w-2xl mx-auto"
          >
            Browse active tournaments, view live brackets, and track your school's performance in real-time.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary/20 mx-auto mb-6">
              <Trophy size={40} />
            </div>
            <h3 className="text-2xl font-black text-primary mb-2">No Events Yet</h3>
            <p className="text-primary/40 font-bold">Check back soon for upcoming tournaments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/events-view/${event._id}`}
                  className="block bg-white border border-border/50 rounded-3xl p-8 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 group h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <Trophy size={28} />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      event.status === 'Completed' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {event.status}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-primary leading-tight mb-2">{event.name}</h3>
                  <p className="text-sm font-bold text-primary/30 mb-6">{event.edition || '2026 Edition'}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary/40">
                      <Calendar size={14} className="text-accent" />
                      {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary/40">
                        <MapPin size={14} className="text-accent" />
                        {event.location}
                      </div>
                    )}
                    {event.participantCount && (
                      <div className="flex items-center gap-2 text-xs font-bold text-primary/40">
                        <Users size={14} className="text-accent" />
                        {event.participantCount} Teams
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <span className="text-xs font-black text-accent uppercase tracking-widest">View Details</span>
                    <ChevronRight size={20} className="text-primary/10 group-hover:text-accent transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EventsPage;
