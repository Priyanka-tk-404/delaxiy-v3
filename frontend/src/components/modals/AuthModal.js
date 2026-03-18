import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Logo = () => (
  <div style={{display:'flex',alignItems:'center',gap:12,justifyContent:'center',marginBottom:24}}>
    <div style={{width:42,height:42,background:'linear-gradient(135deg,#6366f1,#8b5cf6)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 20px rgba(99,102,241,.5)'}}>
      <span style={{color:'#fff',fontFamily:'var(--ff-h)',fontWeight:800,fontSize:21}}>D</span>
    </div>
    <span style={{fontFamily:'var(--ff-h)',fontWeight:800,fontSize:22,letterSpacing:'-0.03em'}}>DeLaxiY</span>
  </div>
);

/* ─── Validators ─────────────────────────────────────────────────────────── */
function vName(v) {
  if (!v.trim())           return 'Please fill the field';
  if (v.trim().length < 2) return 'Name must be at least 2 characters';
  if (/\d/.test(v))        return 'Name cannot contain numbers';
  if (/[^a-zA-Z\s-]/.test(v)) return 'Name can only contain letters';
  return '';
}
function vEmail(v) {
  if (!v.trim())           return 'Please fill the field';
  if (!v.includes('@'))    return 'Email must contain @';
  const p = v.split('@');
  if (p.length !== 2 || !p[1]) return 'Enter a valid email';
  if (!p[1].includes('.')) return 'Domain must contain a dot (e.g. @gmail.com)';
  if (!/^[^@]+@[^@]+\.[^@]{2,}$/.test(v.trim())) return 'Enter a valid email (e.g. name@gmail.com)';
  return '';
}
function vPw(v) {
  if (!v)             return 'Please fill the field';
  if (v.length < 6)   return 'Password must be at least 6 characters';
  if (!/[A-Z]/.test(v)) return 'Must contain at least 1 uppercase letter (A-Z)';
  if (!/[0-9]/.test(v)) return 'Must contain at least 1 number (0-9)';
  if (!/[!@#$%^&*()_+={}|,.<>?/-]/.test(v)) return 'Must contain at least 1 special character (!@#$)';
  return '';
}
function vCfm(v, pw) {
  if (!v)        return 'Please fill the field';
  if (v !== pw)  return 'Passwords do not match';
  return '';
}
function calcStrength(v) {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 6)  s++;
  if (v.length >= 10) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[!@#$%^&*()_+={}|,.<>?/-]/.test(v)) s++;
  return Math.min(4, s);
}

/* ─── Per-field error display ────────────────────────────────────────────── */
function ErrMsg({ msg }) {
  if (!msg) return null;
  return (
    <span style={{fontSize:'12px',color:'#f43f5e',display:'flex',alignItems:'center',gap:4,fontWeight:500,marginTop:3}}>
      <span style={{fontSize:9}}>●</span> {msg}
    </span>
  );
}
function OkMsg({ msg }) {
  if (!msg) return null;
  return (
    <span style={{fontSize:'12px',color:'#10b981',display:'flex',alignItems:'center',gap:4,marginTop:3}}>
      <span>✓</span> {msg}
    </span>
  );
}

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, register, loading } = useAuth();
  const { add }  = useToast();
  const navigate = useNavigate();

  /* ── Refs — DOM owns the value, React never touches input after mount ── */
  const nameRef  = useRef(null);
  const emailRef = useRef(null);
  const pwRef    = useRef(null);
  const cfmRef   = useRef(null);

  /* ── Validation state only — no input values stored in state ── */
  const [nameErr,  setNameErr]  = useState('');
  const [nameOk,   setNameOk]   = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailOk,  setEmailOk]  = useState('');
  const [pwErr,    setPwErr]    = useState('');
  const [pwStr,    setPwStr]    = useState(0);
  const [cfmErr,   setCfmErr]   = useState('');
  const [cfmOk,    setCfmOk]    = useState('');
  const [apiErr,   setApiErr]   = useState('');
  const [show,     setShow]     = useState(false);
  const [showC,    setShowC]    = useState(false);

  /* ── onChange handlers — update ONLY error state, never the input ── */
  function onNameChange(e) {
    const v = e.target.value;
    const err = vName(v);
    setNameErr(err);
    setNameOk(err ? '' : v ? 'Looks good!' : '');
  }

  function onEmailChange(e) {
    const v = e.target.value;
    const err = vEmail(v);
    setEmailErr(err);
    setEmailOk(err ? '' : v ? 'Valid email ✓' : '');
  }

  function onPwChange(e) {
    const v = e.target.value;
    setPwErr(vPw(v));
    setPwStr(calcStrength(v));
    // Re-validate confirm if already typed
    if (cfmRef.current?.value) {
      const ce = vCfm(cfmRef.current.value, v);
      setCfmErr(ce);
      setCfmOk(ce ? '' : 'Passwords match ✓');
    }
  }

  function onCfmChange(e) {
    const v = e.target.value;
    const err = vCfm(v, pwRef.current?.value || '');
    setCfmErr(err);
    setCfmOk(err ? '' : v ? 'Passwords match ✓' : '');
  }

  /* ── Submit ── */
  async function submit(e) {
    e.preventDefault();
    const name  = nameRef.current?.value  || '';
    const email = emailRef.current?.value || '';
    const pw    = pwRef.current?.value    || '';
    const cfm   = cfmRef.current?.value   || '';

    // Validate all
    const ne = mode === 'register' ? vName(name)  : '';
    const ee = vEmail(email);
    const pe = vPw(pw);
    const ce = mode === 'register' ? vCfm(cfm, pw) : '';

    if (mode === 'register') { setNameErr(ne); setNameOk(ne ? '' : name ? 'Looks good!' : ''); }
    setEmailErr(ee); setEmailOk(ee ? '' : email ? 'Valid email ✓' : '');
    setPwErr(pe);
    if (mode === 'register') { setCfmErr(ce); setCfmOk(ce ? '' : cfm ? 'Passwords match ✓' : ''); }

    if (ne || ee || pe || ce) return;
    setApiErr('');

    try {
      if (mode === 'login') await login(email, pw);
      else                  await register(name, email, pw);
      add(mode === 'login' ? '🎉 Welcome back!' : '🚀 Account created!', 'success');
      onClose();
      navigate('/dashboard');
    } catch(err) { setApiErr(err.message); }
  }

  /* ── Input base style (static — never changes during typing) ── */
  function iSt(err, ok) {
    return {
      background: '#fff',
      border: `1.5px solid ${err ? '#f43f5e' : ok ? '#10b981' : '#cbd5e1'}`,
      borderRadius: '10px',
      padding: '11px 15px',
      color: '#1e293b',
      fontFamily: 'inherit',
      fontSize: '14px',
      width: '100%',
      outline: 'none',
      boxSizing: 'border-box',
    };
  }

  const onF = e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,.15)'; };
  const onB = e => { e.target.style.boxShadow = 'none'; };

  const sColor = ['transparent','#f43f5e','#f59e0b','#06b6d4','#10b981'][pwStr];
  const sLabel = ['','Weak','Fair','Good','Strong'][pwStr];

  const pw = pwRef.current?.value || '';

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm scale-in" onClick={e => e.stopPropagation()}>
        <div style={{height:4,background:'linear-gradient(90deg,#6366f1,#8b5cf6)',borderRadius:'20px 20px 0 0'}}/>

        <div style={{padding:'30px 32px 24px'}}>
          <Logo />

          <div style={{textAlign:'center',marginBottom:22}}>
            <h2 style={{fontSize:20,marginBottom:5,color:'#1e293b'}}>{mode==='login'?'Welcome back':'Create account'}</h2>
            <p style={{fontSize:13,color:'#64748b'}}>{mode==='login'?'Sign in to your DeLaxiY account':'Start managing orders and dashboards'}</p>
          </div>

          {apiErr && (
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:'10px',padding:'10px 14px',color:'#f43f5e',fontSize:13,marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              <span>✕</span> {apiErr}
            </div>
          )}

          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:14}} noValidate>

            {/* ── Full Name ── */}
            {mode === 'register' && (
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                <label htmlFor="am-name" style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>Full Name</label>
                <input id="am-name" ref={nameRef} type="text" name="fullname"
                  placeholder="Enter your full name"
                  defaultValue=""
                  autoComplete="name"
                  style={iSt(nameErr, nameOk)}
                  onFocus={onF} onBlur={onB}
                  onChange={onNameChange}
                />
                <ErrMsg msg={nameErr}/>
                <OkMsg msg={nameOk}/>
              </div>
            )}

            {/* ── Email ── */}
            <div style={{display:'flex',flexDirection:'column',gap:0}}>
              <label htmlFor="am-email" style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>Email Address</label>
              <input id="am-email" ref={emailRef} type="text" name="email"
                placeholder="you@example.com"
                defaultValue=""
                autoComplete="email"
                style={iSt(emailErr, emailOk)}
                onFocus={onF} onBlur={onB}
                onChange={onEmailChange}
              />
              <ErrMsg msg={emailErr}/>
              <OkMsg msg={emailOk}/>
            </div>

            {/* ── Password ── */}
            <div style={{display:'flex',flexDirection:'column',gap:0}}>
              <label htmlFor="am-pwd" style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>Password</label>
              <div style={{position:'relative'}}>
                <input id="am-pwd" ref={pwRef}
                  type={show ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 6 chars, 1 uppercase, 1 number, 1 special"
                  defaultValue=""
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{...iSt(pwErr, ''), paddingRight:44}}
                  onFocus={onF} onBlur={onB}
                  onChange={onPwChange}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:15,padding:2,lineHeight:1}}>
                  {show ? '🙈' : '👁'}
                </button>
              </div>
              <ErrMsg msg={pwErr}/>
              {/* Password checklist */}
              {mode === 'register' && pwStr > 0 && (
                <div style={{fontSize:11,marginTop:6,lineHeight:1.8}}>
                  {[
                    {ok: pw.length >= 6,                               msg:'6+ characters'},
                    {ok: /[A-Z]/.test(pw),                             msg:'1 uppercase letter (A-Z)'},
                    {ok: /[0-9]/.test(pw),                             msg:'1 number (0-9)'},
                    {ok: /[!@#$%^&*()_+={}|,.<>?/-]/.test(pw),        msg:'1 special character (!@#$)'},
                  ].map((r,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:5,color:r.ok?'#10b981':'#94a3b8'}}>
                      <span style={{fontSize:10}}>{r.ok ? '✓' : '○'}</span> {r.msg}
                    </div>
                  ))}
                </div>
              )}
              {/* Strength bar */}
              {mode === 'register' && pwStr > 0 && (
                <div style={{marginTop:6}}>
                  <div style={{display:'flex',gap:4}}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{flex:1,height:3,borderRadius:99,background:i<=pwStr?sColor:'#e2e8f0',transition:'background .3s'}}/>
                    ))}
                  </div>
                  <span style={{fontSize:11,color:sColor,fontWeight:600,marginTop:3,display:'block'}}>{sLabel}</span>
                </div>
              )}
            </div>

            {/* ── Confirm Password ── */}
            {mode === 'register' && (
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                <label htmlFor="am-conf" style={{fontSize:'11px',fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:5}}>Confirm Password</label>
                <div style={{position:'relative'}}>
                  <input id="am-conf" ref={cfmRef}
                    type={showC ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    defaultValue=""
                    autoComplete="new-password"
                    style={{...iSt(cfmErr, cfmOk), paddingRight:44}}
                    onFocus={onF} onBlur={onB}
                    onChange={onCfmChange}
                  />
                  <button type="button" onClick={() => setShowC(s => !s)}
                    style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#94a3b8',cursor:'pointer',fontSize:15,padding:2,lineHeight:1}}>
                    {showC ? '🙈' : '👁'}
                  </button>
                </div>
                <ErrMsg msg={cfmErr}/>
                <OkMsg msg={cfmOk}/>
              </div>
            )}

            {/* ── Submit ── */}
            <button type="submit" disabled={loading}
              style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,width:'100%',padding:'13px',marginTop:4,fontSize:15,fontWeight:700,fontFamily:'inherit',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',border:'none',borderRadius:'10px',cursor:loading?'not-allowed':'pointer',boxShadow:'0 4px 16px rgba(99,102,241,.4)',opacity:loading?.7:1,transition:'opacity .2s'}}>
              {loading
                ? <><span className="spinner" style={{borderTopColor:'#fff',width:14,height:14}}/>{mode==='login'?' Signing in…':' Creating account…'}</>
                : mode==='login' ? '→ Sign In' : '→ Create Account'
              }
            </button>
          </form>

          <div style={{textAlign:'center',marginTop:18,fontSize:13,color:'#64748b'}}>
            {mode==='login'
              ? <>Don't have an account?{' '}<button type="button" onClick={()=>onSwitch('register')} style={{background:'none',border:'none',color:'#6366f1',cursor:'pointer',fontWeight:700,fontSize:13}}>Register free</button></>
              : <>Already have an account?{' '}<button type="button" onClick={()=>onSwitch('login')} style={{background:'none',border:'none',color:'#6366f1',cursor:'pointer',fontWeight:700,fontSize:13}}>Sign in</button></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
