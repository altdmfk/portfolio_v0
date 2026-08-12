import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, href: '#hero', id: 'hero' },
    { name: t.nav.about, href: '#about', id: 'about' },
    { name: t.nav.experience, href: '#experience', id: 'experience' },
    { name: t.nav.contact, href: '#contact', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#070a12]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-2 text-slate-100 font-mono font-bold tracking-tight hover:text-cyan-400 transition-colors">
          <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
            &lt;/&gt;
          </span>
          <span className="text-lg tracking-wider">PORTFOLIO</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeSection === link.id
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Controls: Language Toggle & Mobile Menu */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5 font-mono text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('ko')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                lang === 'ko'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              KO
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070a12] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
