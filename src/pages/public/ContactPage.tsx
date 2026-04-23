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
      await contactService.submitInquiry(form);
      setStatus('success');
      setForm({ email: '', phone: '', reason: 'General Inquiry' as string, message: '' });
    } catch {
      setStatus('error');
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-primary mb-4">Get In Touch</h1>
          <p className="text-primary/40 font-bold text-lg">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-border/50 rounded-3xl p-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary mb-1">Email Us</h3>
              <p className="text-sm text-primary/40 font-bold">contact@youthcontest.com</p>
            </div>
          </div>
          <div className="bg-white border border-border/50 rounded-3xl p-8 flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-primary mb-1">Call Us</h3>
              <p className="text-sm text-primary/40 font-bold">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-border/50 rounded-3xl p-10">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-3">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-3">Phone</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-3">Reason</label>
            <select
              value={form.reason}
              onChange={e => setForm({ ...form, reason: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Registration Help">Registration Help</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Partnership">Partnership</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-black uppercase tracking-widest text-primary/60 mb-3">Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 font-medium resize-none"
              placeholder="Tell us how we can help..."
            />
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-bold">
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-bold">
              Failed to send message. Please try again.
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-accent px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : (
              <>
                Send Message
                <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
