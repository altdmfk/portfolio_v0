import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { decryptSecretPayload, DEFAULT_ENCRYPTED_SECRET } from '../utils/cryptoUtils';

const About = ({ activeSkillIdx, setActiveSkillIdx }) => {
  const { t } = useLanguage();
  const [internalSkillIdx, setInternalSkillIdx] = useState(0);

  // Secret unlock state
  const [passwordInput, setPasswordInput] = useState('');
  const [unlockedData, setUnlockedData] = useState(null);
  const [unlockError, setUnlockError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  const currentIdx = activeSkillIdx !== undefined ? activeSkillIdx : internalSkillIdx;
  const setIdx = setActiveSkillIdx || setInternalSkillIdx;

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setIsDecrypting(true);
    setUnlockError('');
    try {
      const data = await decryptSecretPayload(DEFAULT_ENCRYPTED_SECRET, passwordInput);
      setUnlockedData(data);
      setPasswordInput('');
    } catch (err) {
      setUnlockError(t.about.wrongPassError || '비밀번호가 올바르지 않습니다.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRelock = () => {
    setUnlockedData(null);
    setPasswordInput('');
    setUnlockError('');
  };

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
                  const star = typeof skill === 'object' ? skill.star : null;

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
                        {(star || desc) && (
                          <span className={`text-xs text-cyan-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800/80">
                          {star ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              {/* 1. 언제·어디서 있었는가 */}
                              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/90 space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                  <span>{t.about.starLabels?.situation || "언제·어디서 있었는가"}</span>
                                </div>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                  {star.situation}
                                </p>
                              </div>

                              {/* 2. 내가 실제로 무엇을 했는가 */}
                              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/90 space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                  <span>{t.about.starLabels?.action || "내가 실제로 무엇을 했는가"}</span>
                                </div>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                  {star.action}
                                </p>
                              </div>

                              {/* 3. 어떤 결과가 생겼는가 */}
                              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/90 space-y-1">
                                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 font-sans">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  <span>{t.about.starLabels?.result || "어떤 결과가 생겼는가"}</span>
                                </div>
                                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                                  {star.result}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                              {desc}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar (Certifications & Encrypted Info) */}
          <div className="md:col-span-5 space-y-4">
            
            {/* AES Encrypted Personal Info Widget */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                  <span>{unlockedData ? '🔓' : '🔒'}</span>
                </h3>
                {unlockedData && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {t.about.secretBadge}
                  </span>
                )}
              </div>

              {unlockedData ? (
                <div className="space-y-3 pt-1 border-t border-slate-800/80">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400 text-xs font-sans">{t.about.nameLabel}</span>
                      <span className="text-cyan-300 font-semibold font-sans">{unlockedData.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-t border-slate-800/60 pt-2">
                      <span className="text-slate-400 text-xs font-sans">{t.about.schoolLabel}</span>
                      <span className="text-slate-200 font-medium font-sans">{unlockedData.school}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRelock}
                    className="w-full py-1.5 px-3 text-xs font-sans text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors border border-slate-700/50"
                  >
                    {t.about.relockBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUnlock} className="space-y-3">
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    {t.about.secretHint}
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={t.about.passPlaceholder}
                      className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans"
                    />
                    <button
                      type="submit"
                      disabled={isDecrypting}
                      className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-medium text-xs rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                    >
                      {isDecrypting ? '...' : t.about.unlockBtn}
                    </button>
                  </div>

                  {unlockError && (
                    <p className="text-xs text-rose-400 font-sans">{unlockError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Certifications Card */}
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

