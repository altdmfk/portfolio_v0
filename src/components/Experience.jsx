import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-sm font-semibold">{t.experience.sectionNum}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.experience.title}</h2>
          <div className="h-px bg-slate-800 flex-1 ml-4"></div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 sm:before:left-1/2 before:-ml-px before:w-0.5 before:bg-slate-800">
          {t.experience.roles.map((exp, idx) => (
            <div key={idx} className="relative flex flex-col md:flex-row items-start group">
              
              {/* Timeline Dot */}
              <div className="absolute left-3 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors z-10"></div>

              {/* Card Container */}
              <div className={`w-full md:w-[calc(50%-2rem)] pl-10 md:pl-0 ${idx % 2 === 0 ? 'md:mr-auto md:pr-4' : 'md:ml-auto md:pl-4'}`}>
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded border border-cyan-500/20">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-sm font-mono text-slate-400">{exp.company} • {exp.location}</p>

                  <ul className="space-y-2 pt-2 text-sm text-slate-300">
                    {exp.bulletPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 text-xs mt-1">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tools & Tech Stack */}
                  {exp.tools && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                      {exp.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/50"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
