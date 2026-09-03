import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ShieldCheck, KeyRound, Trash2, LogOut, Plus, Loader2 } from 'lucide-react';
import { startRegistration, startAuthentication, WebAuthnAbortService } from '@simplewebauthn/browser';

export default function Vault() {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const [passkeys, setPasskeys] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('info'); // info, success, error

  const fetchVaultData = useCallback(async () => {
    try {
      const res = await fetch('/api/vault/data');
      if (res.ok) {
        const data = await res.json();
        setVaultData(data.items);
        setIsAuthenticated(true);
        fetchPasskeys();
      }
    } catch (e) {
      console.error('Error fetching vault data', e);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/status');
      if (res.ok) {
        const data = await res.json();
        if (data.isAuthenticated) {
          if (data.username) setUsername(data.username);
          fetchVaultData();
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  }, [fetchVaultData]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const fetchPasskeys = async () => {
    const res = await fetch('/api/auth/passkeys');
    if (res.ok) {
      setPasskeys(await res.json());
    }
  };

  const showMsg = (text, type = 'info') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const handleRegister = async () => {
    if (loading) return;
    if (!username) return showMsg(t.vault.usernameReqReg, 'error');
    setLoading(true);
    setActionType('register');
    try {
      const resp = await fetch('/api/auth/register/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get registration options');
      }
      const options = await resp.json();

      const attResp = await startRegistration({ optionsJSON: options });

      const verifyResp = await fetch('/api/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          name: `${username} - Device #${passkeys.length + 1} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
          response: attResp,
        }),
      });

      if (verifyResp.ok) {
        showMsg(t.vault.regSuccess, 'success');
        if (isAuthenticated) fetchPasskeys();
      } else {
        const errData = await verifyResp.json().catch(() => ({}));
        throw new Error(errData.error || 'Verification failed');
      }
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.message?.includes('timed out') || error.message?.includes('not allowed')) {
        showMsg(t.vault.authCancelledOrNoKey, 'error');
      } else {
        showMsg(error.message || 'Registration failed', 'error');
      }
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleCancel = () => {
    WebAuthnAbortService.cancelCeremony();
    setLoading(false);
    setActionType(null);
    showMsg(t.vault.authCancelledOrNoKey, 'error');
  };

  const handleLogin = async () => {
    if (loading) return;
    if (!username) return showMsg(t.vault.usernameReqLog, 'error');
    setLoading(true);
    setActionType('login');
    let abortTimer = null;
    try {
      const resp = await fetch('/api/auth/login/generate-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || t.vault.authFail);
      }
      const options = await resp.json();

      abortTimer = setTimeout(() => {
        WebAuthnAbortService.cancelCeremony();
      }, 6500);

      const asseResp = await startAuthentication({ optionsJSON: options });
      if (abortTimer) clearTimeout(abortTimer);

      const verifyResp = await fetch('/api/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, response: asseResp }),
      });

      if (verifyResp.ok) {
        showMsg(t.vault.authSuccess, 'success');
        fetchVaultData();
      } else {
        const errData = await verifyResp.json().catch(() => ({}));
        throw new Error(errData.error || t.vault.authFail);
      }
    } catch (error) {
      if (error.name === 'NotAllowedError' || error.name === 'AbortError' || error.message?.includes('timed out') || error.message?.includes('not allowed') || error.message?.includes('cancelling')) {
        showMsg(t.vault.authCancelledOrNoKey, 'error');
      } else {
        showMsg(error.message || t.vault.authFail, 'error');
      }
    } finally {
      if (abortTimer) clearTimeout(abortTimer);
      setLoading(false);
      setActionType(null);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setVaultData([]);
    setPasskeys([]);
  };

  const handleDeletePasskey = async (id) => {
    const res = await fetch(`/api/auth/passkeys/${id}`, { method: 'DELETE' });
    if (res.ok) {
      showMsg(t.vault.deleteSuccess, 'success');
      fetchPasskeys();
    } else {
      const err = await res.json().catch(() => ({}));
      showMsg(err.error || t.vault.cannotDeleteActiveKey, 'error');
    }
  };

  return (
    <section id="vault" className="py-24 px-6 md:px-12 max-w-6xl mx-auto border-t border-slate-800">
      <div className="flex items-center space-x-4 mb-12">
        <span className="text-cyan-400 font-mono text-sm tracking-widest">{t.vault.sectionNum}</span>
        <h2 className="text-3xl font-bold tracking-tight">{t.vault.title}</h2>
        <div className="h-px flex-1 bg-slate-800 ml-6"></div>
      </div>

      <div className={`p-8 rounded-xl border ${isAuthenticated ? 'border-cyan-500/30 bg-cyan-950/10' : 'border-slate-800 bg-slate-900/50'} relative overflow-hidden`}>
        {msg && (
          <div className={`absolute top-0 left-0 right-0 p-3 text-center text-sm font-mono ${msgType === 'error' ? 'bg-red-500/20 text-red-400' : msgType === 'success' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-300'}`}>
            {msg}
          </div>
        )}

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
            <Shield className="w-16 h-16 text-slate-600 mb-6" />
            <p className="text-slate-400 max-w-md mb-8">{t.vault.unauthDesc}</p>
            
            <div className="w-full max-w-sm space-y-4">
              <input
                type="text"
                placeholder={t.vault.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleRegister}
                  className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 py-3 rounded transition-colors font-mono text-sm"
                >
                  {loading && actionType === 'register' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>{t.vault.registering}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t.vault.registerBtn}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleLogin}
                  className="flex-1 flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded transition-colors font-mono text-sm"
                >
                  {loading && actionType === 'login' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>{t.vault.authenticating}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{t.vault.loginBtn}</span>
                    </>
                  )}
                </button>
              </div>
              {loading && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-xs text-slate-500 hover:text-red-400 underline font-mono transition-colors"
                  >
                    {t.vault.cancelBtn}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3 text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
                <span className="font-mono text-sm tracking-widest">{t.vault.decryptedBadge}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-mono text-sm">{t.vault.logoutBtn}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {vaultData.map(item => (
                  <div key={item.id} className="p-4 bg-slate-950/50 rounded border border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-950/80 p-6 rounded border border-slate-800 h-fit">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-mono text-sm text-slate-300">{t.vault.passkeysTitle}</h3>
                  <button
                    onClick={handleRegister}
                    className="text-cyan-500 hover:text-cyan-400 font-mono text-xs flex items-center"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {t.vault.addDevice}
                  </button>
                </div>
                {passkeys.length === 0 ? (
                  <p className="text-slate-500 text-sm font-mono">{t.vault.noPasskeys}</p>
                ) : (
                  <ul className="space-y-3">
                    {passkeys.map(pk => (
                      <li key={pk.id} className="flex justify-between items-center bg-slate-900 p-3 rounded">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-slate-200 font-medium">{pk.name}</p>
                            {pk.isCurrent && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {t.vault.currentDeviceBadge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-mono">{new Date(pk.createdAt).toLocaleDateString()}</p>
                        </div>
                        {pk.isCurrent ? (
                          <span className="text-slate-600 p-2 cursor-not-allowed flex items-center" title={t.vault.cannotDeleteActiveKey}>
                            <Shield className="w-4 h-4 text-emerald-500/60" />
                          </span>
                        ) : (
                          <button
                            onClick={() => handleDeletePasskey(pk.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-2"
                            title={t.vault.deleteBtn}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
