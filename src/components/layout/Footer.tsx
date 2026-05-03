import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Share2, Rss } from 'lucide-react';

const Footer = () => (
  <footer className="bg-primary text-white">
    <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 sm:py-16 pb-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
        {/* Brand — full width on mobile */}
        <div className="col-span-2 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <img src="/LOGO.jpeg" alt="THEYOUTHCONTEST" className="w-9 h-9 object-contain" />
            <span className="text-base font-black tracking-tighter">THEYOUTHCONTEST</span>
          </div>
          <p className="text-white/40 text-sm font-bold leading-relaxed mb-5">
            Empowering young voices through competitive debate and public speaking tournaments.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, Share2, Rss].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white/50 hover:bg-accent hover:text-white transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4 sm:mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/events', label: 'Events' },
              { to: '/services', label: 'Services' },
              { to: '/staff', label: 'Staff' },
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
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4 sm:mb-6">Support</h4>
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
          <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4 sm:mb-6">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm font-bold text-white/50">
              <Mail size={15} className="text-accent flex-shrink-0" />
              <span className="break-all">theyouthcontest@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-sm font-bold text-white/50">
              <Phone size={15} className="text-accent flex-shrink-0" />
              0796870553
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-widest text-white/20 text-center sm:text-left">
          © {new Date().getFullYear()} THEYOUTHCONTEST. All rights reserved.
        </p>
        <div className="flex items-center gap-5 text-xs font-black uppercase tracking-widest text-white/20">
          <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
          <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;


