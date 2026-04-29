import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Share2, Rss } from 'lucide-react';

const Footer = () => (
  <footer className="bg-primary text-white">
    <div className="max-w-7xl mx-auto px-6 py-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/LOGO.jpeg" alt="Youth Contest" className="w-10 h-10 object-contain" />
            <span className="text-lg font-black tracking-tighter">YOUTH CONTEST</span>
          </div>
          <p className="text-white/40 text-sm font-bold leading-relaxed mb-6">
            Empowering young voices through competitive debate and public speaking tournaments.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, Share2, Rss].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/50 hover:bg-accent hover:text-white transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/events', label: 'Events' },
              { to: '/services', label: 'Our Services' },
              { to: '/staff', label: 'Our Staff' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm font-bold text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-6">Support</h4>
          <ul className="space-y-3">
            {[
              { to: '/contact', label: 'Contact Us' },
              { to: '/login', label: 'Staff Login' },
              { to: '/blog', label: 'Blog' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm font-bold text-white/50 hover:text-white transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-bold text-white/50">
              <Mail size={16} className="text-accent flex-shrink-0" />
              contact@youthcontest.com
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-white/50">
              <Phone size={16} className="text-accent flex-shrink-0" />
              +1 (555) 123-4567
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 pb-2 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-widest text-white/20">
          © {new Date().getFullYear()} Youth Contest. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs font-black uppercase tracking-widest text-white/20">
          <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/50 transition-colors">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
