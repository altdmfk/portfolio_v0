import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const emailAddress = "xnzktcm@naver.com";
  const linkedinUrl = "https://linkedin.com/in/ahrumkang";
  const githubUrl = "https://github.com/altdmfk";

  const handleCopyEmail = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailAddress);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = emailAddress;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 relative">
      
      {/* Copied Toast Notification */}
      {copied && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-sm font-mono shadow-2xl backdrop-blur-md animate-bounce">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{t.contact.emailCopied}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-sm font-semibold">{t.contact.sectionNum}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.contact.title}</h2>
          <div className="h-px bg-slate-800 flex-1 ml-4"></div>
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Contact Direct Links & Copy Cards */}
          <div className="grid sm:grid-cols-3 gap-4 font-mono text-sm pt-4">
            
            {/* Email Copy Card */}
            <button
              onClick={handleCopyEmail}
              type="button"
              title={t.contact.clickToCopy}
              className="group p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer"
            >
              <span className="text-2xl">📧</span>
              <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors truncate max-w-full">
                {emailAddress}
              </span>
              <span className="text-[10px] uppercase font-bold text-cyan-400 mt-1">
                {copied ? "✓ Copied" : "Copy Email"}
              </span>
            </button>

            {/* LinkedIn Redirect Link */}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center justify-center gap-2 text-center"
            >
              <span className="text-2xl">💼</span>
              <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                LinkedIn
              </span>
              <span className="text-[10px] uppercase font-bold text-cyan-400 mt-1 flex items-center gap-1">
                <span>Visit Profile</span>
                <span>↗</span>
              </span>
            </a>

            {/* GitHub Redirect Link */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col items-center justify-center gap-2 text-center"
            >
              <span className="text-2xl">🐙</span>
              <span className="text-xs text-slate-400 group-hover:text-cyan-300 transition-colors">
                GitHub
              </span>
              <span className="text-[10px] uppercase font-bold text-cyan-400 mt-1 flex items-center gap-1">
                <span>Visit Profile</span>
                <span>↗</span>
              </span>
            </a>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
