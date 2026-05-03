import { useState } from 'react';
import { Mail, Phone, Send } from 'lucide-react';
import contactService from '../../services/contactService';
import PublicNav from '../../components/layout/PublicNav';
import Footer from '../../components/layout/Footer';

const ContactPage = () => {
  const [form, setForm] = useState({ email: '', phone: '', reason: 'General Inquiry' as string, message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await contactService.submitContact(form);
      setStatus('success');
      setForm({ email: '', phone: '', reason: 'General Inquiry', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <div className="mb-10 sm:mb-12 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-primary mb-3">Get In Touch</h1>
          <p className="text-primary/40 font-bold text-base sm:text-lg">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
          <div className="bg-white border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex items-center gap-4">
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-primary mb-0.5">Email Us</h3>
              <p className="text-sm text-primary/40 font-bold break-all">theyouthcontest@gmail.com</p>
            </div>
          </div>
          <div className="bg-white border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex items-center gap-4">
            <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h3 className="text-base font-black text-primary mb-0.5">Call Us</h3>
              <p className="text-sm text-primary/40 font-bold">0796870553</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border/50 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Reason</label>
            <select
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium text-sm"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Registration Help">Registration Help</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Partnership">Partnership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium text-sm resize-none"
              placeholder="Tell us how we can help..."
            />
          </div>

          {status === 'success' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-bold">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold">
              Failed to send message. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-accent px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : (
              <>Send Message <Send size={16} /></>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;


