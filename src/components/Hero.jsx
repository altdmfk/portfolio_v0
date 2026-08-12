import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Hero = ({ onSelectSkill }) => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-grid-pattern overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto text-center space-y-8">

        {/* Main Headline */}
        <div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-white font-sans">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm font-sans">
              {t.hero.headline}
            </span>
          </h1>
        </div>

        {/* Objective Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          {t.hero.description}
        </p>

        {/* Quick Highlights -> Links to Core Competencies */}
        <div className="pt-10 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {t.hero.stats.map((item, idx) => (
            <a
              key={idx}
              href="#competencies"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectSkill) onSelectSkill(item.skillIdx ?? idx);
              }}
              className="group p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/50 transition-all backdrop-blur-sm flex flex-col items-center justify-center text-center cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-center gap-1">
                <p className="text-xs font-mono text-slate-400 group-hover:text-cyan-400 uppercase transition-colors">{item.label}</p>
                <span className="text-xs text-slate-500 group-hover:text-cyan-400 transition-colors">↘</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 mt-1 transition-colors">{item.val}</p>
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">

          <a
            href="#experience"
            className="px-6 py-3 rounded-lg font-medium text-sm text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2"
          >
            <span>{t.hero.btnExperience}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
