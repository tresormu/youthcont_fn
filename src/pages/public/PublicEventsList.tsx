import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/eventService';
import { Trophy, Calendar, ChevronRight } from 'lucide-react';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

const PublicEventsList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (_err) {
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
         <div className="mb-12">
            <h1 className="text-4xl font-black text-primary mb-2">Tournament Gallery</h1>
            <p className="text-primary/40 font-bold">Browse active matches, upcoming qualifiers, and historic results.</p>
         </div>

         {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse" />)}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {events.map((event) => (
                  <Link 
                     key={event._id} 
                     to={`/events-view/${event._id}`}
                     className="bg-white border border-border/50 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-300 group"
                  >
                     <div className="flex justify-between items-start mb-10">
                        <div className="w-16 h-16 bg-accent/5 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                           <Trophy size={32} />
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           event.status === 'Completed' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                           {event.status}
                        </div>
                     </div>

                     <h3 className="text-2xl font-black text-primary leading-tight mb-2">{event.name}</h3>
                     <p className="text-sm font-bold text-primary/30 mb-8">{event.edition || '2026 Edition'}</p>

                     <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                           <Calendar size={14} className="text-accent" />
                           {new Date(event.createdAt).toLocaleDateString()}
                        </div>
                        <ChevronRight size={20} className="text-primary/10 group-hover:text-accent transition-colors" />
                     </div>
                  </Link>
               ))}
            </div>
         )}
      </div>
      <Footer />
    </div>
  );
};

export default PublicEventsList;
