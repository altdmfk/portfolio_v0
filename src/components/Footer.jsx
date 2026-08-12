import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800/80 bg-[#05070e] py-8 text-xs font-mono text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{t.footer.status}</span>
        </div>

        <div className="text-slate-400">
          © {new Date().getFullYear()} Security Candidate. {t.footer.rights}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
