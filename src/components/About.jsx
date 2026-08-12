import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const About = ({ activeSkillIdx, setActiveSkillIdx }) => {
  const { t } = useLanguage();
  const [internalSkillIdx, setInternalSkillIdx] = useState(0);

  const currentIdx = activeSkillIdx !== undefined ? activeSkillIdx : internalSkillIdx;
  const setIdx = setActiveSkillIdx || setInternalSkillIdx;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-[#090e1a]/40">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <span className="text-cyan-400 font-mono text-sm font-semibold">{t.about.sectionNum}</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.about.title}</h2>
          <div className="h-px bg-slate-800 flex-1 ml-4"></div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Narrative & Competencies */}
          <div className="md:col-span-7 space-y-6 text-slate-300 leading-relaxed">
            <div className="space-y-4">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>

            {/* Interactive Core Competencies */}
            <div className="pt-4 space-y-3" id="competencies">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-sans font-semibold text-cyan-400 uppercase tracking-wider">
                  {t.about.competenciesTitle}
                </h3>
                {t.about.clickHint && (
                  <span className="text-[11px] font-sans text-slate-500">{t.about.clickHint}</span>
                )}
              </div>

              <div className="space-y-2">
                {t.about.skills.map((skill, idx) => {
                  const isExpanded = currentIdx === idx;
                  const title = typeof skill === 'object' ? skill.title : skill;
                  const desc = typeof skill === 'object' ? skill.desc : null;

                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => setIdx(isExpanded ? null : idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIdx(isExpanded ? null : idx);
                        }
                      }}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                        isExpanded
                          ? 'bg-slate-900/90 border-cyan-500/60 shadow-lg'
                          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200 font-sans">
                          <span className="text-cyan-400 font-sans text-xs">▸</span>
                          <span className={isExpanded ? 'text-cyan-300 font-semibold font-sans' : 'font-sans'}>{title}</span>
                        </div>
                        {desc && (
                          <span className={`text-xs text-cyan-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        )}
                      </div>

                      {isExpanded && desc && (
                        <p className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                          {desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Certifications Sidebar */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-sm">
              <h3 className="text-lg font-bold tracking-tight text-white font-sans">
                {t.about.certTitle}
              </h3>
              
              <div className="space-y-3">
                {t.about.certs.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-slate-800/80 pb-2">
                    <span className="text-slate-300">{cert.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
