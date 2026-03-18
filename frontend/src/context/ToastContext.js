import React, { createContext, useContext, useState, useCallback } from 'react';
const Ctx = createContext(null);
let tid = 0;
const ICONS = { success:'✓', error:'✕', info:'ℹ', warning:'⚠' };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type='info', ms=3800) => {
    const id = ++tid;
    setToasts(p => [...p, {id, msg, type}]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), ms);
  }, []);
  return (
    <Ctx.Provider value={{add}}>
      {children}
      <div className="toast-wrap">
        {toasts.map((t,i) => (
          <div key={t.id} className={`toast toast-${t.type}`}
            onClick={() => setToasts(p => p.filter(x => x.id !== t.id))}
            style={{animationDelay:`${i*0.05}s`}}>
            <span style={{fontSize:16, color: t.type==='success'?'var(--emerald)':t.type==='error'?'var(--rose)':'var(--indigo)'}}>{ICONS[t.type]}</span>
            <span style={{flex:1}}>{t.msg}</span>
            <span style={{fontSize:11, color:'var(--t3)', marginLeft:8}}>✕</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export const useToast = () => useContext(Ctx);
