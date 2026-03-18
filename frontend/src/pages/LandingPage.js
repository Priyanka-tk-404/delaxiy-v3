import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/modals/AuthModal';

/* ── Rotating taglines ── */
const TAGLINES = [
  'Turn raw orders into stunning insights.',
  'Your data, beautifully visualised.',
  'From chaos to clarity — in one dashboard.',
  'The smarter way to manage orders.',
];

/* ── Features ── */
const FEATURES = [
  { icon:'◈', color:'#6366f1', title:'Smart Dashboard',  desc:'Drag-and-drop widgets with real-time live data.' },
  { icon:'⊞', color:'#22d3ee', title:'Order Management', desc:'Create, edit, delete orders. Auto-calculates ₹ totals.' },
  { icon:'◉', color:'#10b981', title:'KPI Analytics',    desc:'Sum, Average, Count — instant metric cards.' },
  { icon:'▐', color:'#f59e0b', title:'Rich Charts',      desc:'Bar, Line, Area, Scatter, Pie charts live.' },
  { icon:'⊡', color:'#f43f5e', title:'Smart Tables',     desc:'Configurable columns, sort, paginate, filter.' },
  { icon:'↔', color:'#ec4899', title:'Responsive Grid',  desc:'12-col Desktop · 8-col Tablet · 4-col Mobile.' },
];

/* ── Floating particle component ── */
function Particle({ style }) {
  return <div style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none', ...style }} />;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [auth,      setAuth]      = useState(null);
  const [tagline,   setTagline]   = useState(0);
  const [tagFade,   setTagFade]   = useState(true);
  const [scrollY,   setScrollY]   = useState(0);
  const [mouseX,    setMouseX]    = useState(0);
  const [mouseY,    setMouseY]    = useState(0);
  const [counter,   setCounter]   = useState({ orders:0, revenue:0, widgets:0 });
  const heroRef = useRef(null);

  /* Scroll listener */
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  /* Mouse parallax */
  useEffect(() => {
    const h = e => { setMouseX(e.clientX / window.innerWidth - 0.5); setMouseY(e.clientY / window.innerHeight - 0.5); };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  /* Rotating tagline */
  useEffect(() => {
    const t = setInterval(() => {
      setTagFade(false);
      setTimeout(() => { setTagline(i => (i+1) % TAGLINES.length); setTagFade(true); }, 400);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  /* Animated counters */
  useEffect(() => {
    const targets = { orders:1240, revenue:486920, widgets:7 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        orders:  Math.floor(targets.orders  * ease),
        revenue: Math.floor(targets.revenue * ease),
        widgets: Math.floor(targets.widgets * ease),
      });
      if (step >= steps) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, []);

  /* Particles config */
  const particles = [
    { width:8,  height:8,  top:'12%', left:'8%',   background:'#6366f1', opacity:.7, animation:'float 4s ease-in-out infinite',         animationDelay:'0s'   },
    { width:12, height:12, top:'25%', left:'88%',  background:'#22d3ee', opacity:.6, animation:'float 6s ease-in-out infinite reverse',  animationDelay:'.5s'  },
    { width:6,  height:6,  top:'65%', left:'6%',   background:'#10b981', opacity:.8, animation:'float 5s ease-in-out infinite',          animationDelay:'1s'   },
    { width:10, height:10, top:'75%', left:'92%',  background:'#f59e0b', opacity:.6, animation:'float 7s ease-in-out infinite reverse',  animationDelay:'1.5s' },
    { width:14, height:14, top:'40%', left:'3%',   background:'#ec4899', opacity:.5, animation:'float 8s ease-in-out infinite',          animationDelay:'2s'   },
    { width:7,  height:7,  top:'55%', left:'95%',  background:'#8b5cf6', opacity:.7, animation:'float 5.5s ease-in-out infinite reverse',animationDelay:'2.5s' },
    { width:5,  height:5,  top:'85%', left:'18%',  background:'#f43f5e', opacity:.6, animation:'float 4.5s ease-in-out infinite',        animationDelay:'3s'   },
    { width:9,  height:9,  top:'18%', left:'60%',  background:'#38bdf8', opacity:.5, animation:'float 6.5s ease-in-out infinite reverse',animationDelay:'.8s'  },
    { width:11, height:11, top:'45%', left:'75%',  background:'#a78bfa', opacity:.5, animation:'float 7.5s ease-in-out infinite',        animationDelay:'1.2s' },
    { width:6,  height:6,  top:'90%', left:'70%',  background:'#22d3ee', opacity:.6, animation:'float 5s ease-in-out infinite reverse',  animationDelay:'3.5s' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', overflowX:'hidden', position:'relative' }}>

      {/* ════ ANIMATED PARTICLES ════ */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* ════ GIANT GRADIENT MESH BACKGROUND ════ */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        background:`
          radial-gradient(ellipse 60% 50% at ${50 + mouseX*8}% ${30 + mouseY*8}%, rgba(99,102,241,.22) 0%, transparent 70%),
          radial-gradient(ellipse 50% 45% at ${80 + mouseX*6}% ${70 + mouseY*6}%, rgba(139,92,246,.18) 0%, transparent 70%),
          radial-gradient(ellipse 45% 40% at ${20 + mouseX*5}% ${60 + mouseY*5}%, rgba(34,211,238,.12) 0%, transparent 70%),
          radial-gradient(ellipse 55% 50% at ${60 + mouseX*7}% ${20 + mouseY*7}%, rgba(236,72,153,.1)  0%, transparent 70%)
        `,
        transition:'background 0.1s ease',
      }} />

      {/* ════ GRID PATTERN OVERLAY ════ */}
      <div style={{
        position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
        backgroundImage:`
          linear-gradient(rgba(99,102,241,.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,.04) 1px, transparent 1px)
        `,
        backgroundSize:'60px 60px',
        mask:'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* ════ NAVBAR ════ */}
      <nav style={{
        position:'sticky', top:0, zIndex:300,
        padding:'0 clamp(16px,4vw,52px)', height:66,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        background:     scrollY>10 ? 'rgba(6,11,24,.92)' : 'transparent',
        backdropFilter: scrollY>10 ? 'blur(20px)' : 'none',
        borderBottom:   scrollY>10 ? '1px solid rgba(99,102,241,.2)' : '1px solid transparent',
        transition:'all .5s ease',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Animated logo */}
          <div style={{
            width:40, height:40, borderRadius:12,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee)',
            backgroundSize:'200% 200%', animation:'gradMove 3s ease infinite',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 0 20px rgba(99,102,241,.6), 0 0 40px rgba(99,102,241,.2)',
          }}>
            <span style={{ color:'#fff', fontFamily:'var(--ff-h)', fontWeight:800, fontSize:20 }}>D</span>
          </div>
          <span style={{ fontFamily:'var(--ff-h)', fontWeight:800, fontSize:22, letterSpacing:'-0.03em' }}>
            DeLaxiY
          </span>
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setAuth('login')}
            style={{ borderColor:'rgba(99,102,241,.3)' }}>
            Sign In
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setAuth('register')}
            style={{ boxShadow:'0 0 18px rgba(99,102,241,.5)' }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* ════ HERO SECTION ════ */}
      <section ref={heroRef} style={{
        position:'relative', zIndex:1,
        display:'flex', flexDirection:'column', alignItems:'center',
        textAlign:'center',
        padding:'clamp(60px,10vh,100px) clamp(16px,4vw,32px) clamp(40px,6vh,70px)',
      }}>

        {/* Glowing ring behind title */}
        <div style={{
          position:'absolute', top:'10%', left:'50%', transform:'translateX(-50%)',
          width:'clamp(300px,50vw,600px)', height:'clamp(300px,50vw,600px)',
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(99,102,241,.15) 0%, transparent 70%)',
          filter:'blur(40px)',
          pointerEvents:'none',
          animation:'pulse 4s ease-in-out infinite',
        }} />

        {/* Live badge */}
        <div className="fade-up d1" style={{ marginBottom:24, zIndex:2 }}>
          <span style={{
            display:'inline-flex', alignItems:'center', gap:8,
            background:'linear-gradient(135deg, rgba(99,102,241,.2), rgba(34,211,238,.15))',
            border:'1px solid rgba(99,102,241,.4)',
            borderRadius:99, padding:'7px 20px',
            fontSize:12, fontWeight:700, color:'#a78bfa',
            letterSpacing:'.07em', textTransform:'uppercase',
            boxShadow:'0 0 20px rgba(99,102,241,.2)',
          }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', boxShadow:'0 0 8px #10b981', animation:'pulse 2s infinite' }}/>
            Smart Order Management Platform
          </span>
        </div>

        {/* Main headline */}
        <h1 className="fade-up d2" style={{
          fontFamily:'var(--ff-h)', fontWeight:800,
          letterSpacing:'-0.04em', lineHeight:1.1,
          maxWidth:800, marginBottom:16, zIndex:2,
        }}>
          <span style={{
            display:'block',
            fontSize:'clamp(28px,5vw,58px)',
            color:'var(--t1)',
          }}>
            Your Orders. Your Data.
          </span>
          <span style={{
            display:'block',
            fontSize:'clamp(30px,5.5vw,64px)',
            background:'linear-gradient(135deg, #6366f1 0%, #a78bfa 35%, #22d3ee 65%, #10b981 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            backgroundClip:'text',
            backgroundSize:'300% 300%',
            animation:'gradMove 4s ease infinite',
            marginTop:6,
            filter:'drop-shadow(0 0 30px rgba(99,102,241,.4))',
          }}>
            One Powerful Dashboard.
          </span>
        </h1>

        {/* Rotating tagline */}
        <div style={{ minHeight:32, marginBottom:16, zIndex:2 }}>
          <p style={{
            fontSize:'clamp(14px,1.8vw,18px)',
            color:'var(--cyan)',
            fontStyle:'italic',
            fontWeight:500,
            opacity: tagFade ? 1 : 0,
            transform: tagFade ? 'translateY(0)' : 'translateY(8px)',
            transition:'opacity .4s ease, transform .4s ease',
            letterSpacing:'0.01em',
          }}>
            ✦ {TAGLINES[tagline]}
          </p>
        </div>

        {/* Subtext */}
        <p className="fade-up d3" style={{
          fontSize:'clamp(13px,1.6vw,16px)',
          color:'var(--t2)', maxWidth:520,
          lineHeight:1.85, marginBottom:40, zIndex:2,
        }}>
          Manage customer orders, build drag-and-drop dashboards,
          and visualise live revenue data — all in one place.
        </p>

        {/* CTA buttons */}
        <div className="fade-up d4" style={{
          display:'flex', gap:14, flexWrap:'wrap',
          justifyContent:'center', marginBottom:64, zIndex:2,
        }}>
          <button onClick={() => setAuth('register')} style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'14px 32px', borderRadius:'var(--r2)',
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color:'#fff', border:'none', cursor:'pointer',
            fontSize:15, fontWeight:700, fontFamily:'var(--ff-b)',
            boxShadow:'0 0 30px rgba(99,102,241,.55), 0 4px 20px rgba(99,102,241,.4)',
            transition:'all .3s ease', letterSpacing:'0.01em',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 0 50px rgba(99,102,241,.7), 0 8px 30px rgba(99,102,241,.5)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 30px rgba(99,102,241,.55), 0 4px 20px rgba(99,102,241,.4)'; }}>
            🚀 Start for Free
          </button>
          <button onClick={() => navigate('/dashboard')} style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'14px 32px', borderRadius:'var(--r2)',
            background:'rgba(255,255,255,.05)',
            color:'var(--t1)', cursor:'pointer',
            fontSize:15, fontWeight:600, fontFamily:'var(--ff-b)',
            border:'1px solid rgba(99,102,241,.35)',
            boxShadow:'0 0 20px rgba(99,102,241,.1)',
            transition:'all .3s ease',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(99,102,241,.15)'; e.currentTarget.style.borderColor='rgba(99,102,241,.6)'; e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,.05)'; e.currentTarget.style.borderColor='rgba(99,102,241,.35)'; e.currentTarget.style.transform='none'; }}>
            ◈ View Dashboard
          </button>
        </div>

        {/* Animated counter cards */}
        <div className="fade-up d5" style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)',
          gap:16, maxWidth:640, width:'100%', zIndex:2,
        }}>
          {[
            { label:'Orders Managed',  value:`${counter.orders.toLocaleString('en-IN')}+`, color:'#6366f1', icon:'⊞', glow:'rgba(99,102,241,.4)'  },
            { label:'Revenue Tracked', value:`₹${(counter.revenue/100000).toFixed(1)}L`,   color:'#10b981', icon:'₹', glow:'rgba(16,185,129,.4)'  },
            { label:'Widget Types',    value:`${counter.widgets}+`,                          color:'#22d3ee', icon:'◈', glow:'rgba(34,211,238,.4)'  },
          ].map(c => (
            <div key={c.label} style={{
              background:'rgba(255,255,255,.04)',
              border:`1px solid ${c.color}44`,
              borderRadius:'var(--r2)', padding:'18px 14px',
              textAlign:'center',
              boxShadow:`0 0 20px ${c.glow}`,
              transition:'transform .3s ease',
            }}
            onMouseEnter={e=>e.currentTarget.style.transform='translateY(-4px) scale(1.02)'}
            onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              <div style={{ fontSize:22, marginBottom:8 }}>{c.icon}</div>
              <div style={{
                fontFamily:'var(--ff-h)', fontSize:'clamp(18px,3vw,26px)',
                fontWeight:800, color:c.color,
                textShadow:`0 0 20px ${c.glow}`,
              }}>{c.value}</div>
              <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', marginTop:4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ DASHBOARD PREVIEW ════ */}
      <section style={{ position:'relative', zIndex:1, maxWidth:860, margin:'0 auto clamp(48px,8vh,80px)', padding:'0 clamp(16px,4vw,24px)' }}>
        <div className="fade-up" style={{
          background:'linear-gradient(135deg, var(--card) 0%, rgba(99,102,241,.08) 100%)',
          border:'1px solid rgba(99,102,241,.25)',
          borderRadius:'var(--r4)', padding:'clamp(16px,3vw,24px)',
          boxShadow:'0 0 60px rgba(99,102,241,.2), 0 32px 80px rgba(0,0,0,.7)',
        }}>
          {/* Browser chrome */}
          <div style={{ display:'flex', gap:7, marginBottom:14, alignItems:'center' }}>
            {['#f43f5e','#f59e0b','#10b981'].map(c=><div key={c} style={{ width:11,height:11,borderRadius:'50%',background:c,boxShadow:`0 0 8px ${c}` }}/>)}
            <div style={{ flex:1, background:'rgba(255,255,255,.06)', borderRadius:99, height:10, marginLeft:8 }}/>
          </div>
          {/* KPI row */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10, marginBottom:12 }}>
            {[
              {l:'Revenue',   v:'₹4,86,920', c:'#10b981'},
              {l:'Orders',    v:'142',        c:'#6366f1'},
              {l:'Completed', v:'98',         c:'#22d3ee'},
              {l:'Active',    v:'28',         c:'#f59e0b'},
            ].map(s=>(
              <div key={s.l} style={{ background:'var(--surface)', borderRadius:'var(--r2)', padding:'12px 14px', border:`1px solid ${s.c}33`, boxShadow:`0 0 14px ${s.c}22` }}>
                <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:5 }}>{s.l}</div>
                <div style={{ fontSize:'clamp(13px,2vw,17px)', fontWeight:800, fontFamily:'var(--ff-h)', color:s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          {/* Charts */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:10 }}>
            <div style={{ background:'var(--surface)', borderRadius:'var(--r2)', padding:14, border:'1px solid var(--border)', height:80, display:'flex', alignItems:'flex-end', gap:4 }}>
              {[38,62,44,78,52,88,68,84,58,94,72,86].map((h,i)=>{
                const colors=['#6366f1','#8b5cf6','#22d3ee','#10b981','#f59e0b','#f43f5e'];
                return <div key={i} style={{ flex:1, background:`linear-gradient(to top,${colors[i%colors.length]},${colors[i%colors.length]}88)`, borderRadius:'3px 3px 0 0', height:`${h}%`, transition:'height .5s ease', boxShadow:`0 0 6px ${colors[i%colors.length]}55` }}/>;
              })}
            </div>
            <div style={{ background:'var(--surface)', borderRadius:'var(--r2)', padding:14, border:'1px solid var(--border)', height:80, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ position:'relative', width:52, height:52 }}>
                {[{c:'#10b981'},{c:'#6366f1'},{c:'#f59e0b'},{c:'#ec4899'}].map((d,i)=>(
                  <div key={i} style={{ position:'absolute', inset:i*5, border:`4px solid ${d.c}`, borderRadius:'50%', borderTopColor:'transparent', transform:`rotate(${i*55}deg)`, boxShadow:`0 0 8px ${d.c}66`, animation:`spin ${2.5+i*.5}s linear infinite` }}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ QUOTE BANNER ════ */}
      <section style={{ position:'relative', zIndex:1, maxWidth:760, margin:'0 auto clamp(48px,6vh,72px)', padding:'0 clamp(16px,4vw,24px)' }}>
        <div className="fade-up" style={{
          background:'linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.12), rgba(34,211,238,.1))',
          border:'1px solid rgba(99,102,241,.3)',
          borderRadius:'var(--r3)', padding:'clamp(24px,4vw,40px)',
          textAlign:'center',
          boxShadow:'0 0 40px rgba(99,102,241,.15), 0 0 80px rgba(139,92,246,.1)',
        }}>
          <div style={{ fontSize:40, marginBottom:14, filter:'drop-shadow(0 0 12px rgba(99,102,241,.6))' }}>❝</div>
          <p style={{ fontSize:'clamp(15px,2vw,20px)', fontFamily:'var(--ff-h)', fontWeight:600, color:'var(--t1)', lineHeight:1.65, maxWidth:580, margin:'0 auto', letterSpacing:'-0.01em' }}>
            The goal is to turn data into information,<br/>and information into insight.
          </p>
        </div>
      </section>

      {/* ════ FEATURES GRID ════ */}
      <section style={{ position:'relative', zIndex:1, maxWidth:1100, margin:'0 auto clamp(48px,8vh,80px)', padding:'0 clamp(16px,4vw,32px)' }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(28px,4vh,48px)' }}>
          <h2 className="fade-up" style={{ fontSize:'clamp(22px,4vw,40px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:10 }}>
            Built with everything you need
          </h2>
          <p className="fade-up d1" style={{ color:'var(--t2)', fontSize:'clamp(13px,1.5vw,16px)', maxWidth:480, margin:'0 auto', lineHeight:1.75 }}>
            A complete toolkit for modern order management and data visualisation.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))', gap:18 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`fade-up d${(i%3)+1}`}
              style={{
                background:`linear-gradient(135deg, var(--card) 0%, ${f.color}10 100%)`,
                border:`1px solid ${f.color}30`,
                borderRadius:'var(--r3)', padding:'clamp(18px,3vw,26px)',
                borderTop:`3px solid ${f.color}`,
                boxShadow:`0 0 20px ${f.color}15`,
                transition:'all .3s ease', cursor:'default',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow=`0 0 40px ${f.color}35, 0 12px 40px rgba(0,0,0,.4)`; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 0 20px ${f.color}15`; }}
            >
              <div style={{ width:48, height:48, borderRadius:'var(--r2)', background:`${f.color}20`, border:`1px solid ${f.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, color:f.color, marginBottom:16, boxShadow:`0 0 16px ${f.color}40` }}>
                {f.icon}
              </div>
              <div style={{ fontFamily:'var(--ff-h)', fontSize:'clamp(14px,1.5vw,16px)', fontWeight:700, marginBottom:7, color:'var(--t1)' }}>{f.title}</div>
              <div style={{ fontSize:13, color:'var(--t2)', lineHeight:1.75 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section style={{ position:'relative', zIndex:1, textAlign:'center', padding:'clamp(40px,6vh,60px) clamp(16px,4vw,24px) clamp(56px,8vh,90px)' }}>
        <div className="fade-up" style={{
          background:'linear-gradient(135deg, rgba(99,102,241,.18), rgba(139,92,246,.14), rgba(34,211,238,.1))',
          border:'1px solid rgba(99,102,241,.35)',
          borderRadius:'var(--r4)', padding:'clamp(36px,6vw,60px) clamp(24px,4vw,48px)',
          maxWidth:700, margin:'0 auto',
          boxShadow:'0 0 60px rgba(99,102,241,.2), 0 0 120px rgba(139,92,246,.1)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Inner glow */}
          <div style={{ position:'absolute', top:'-50%', left:'50%', transform:'translateX(-50%)', width:'80%', height:'100%', background:'radial-gradient(ellipse, rgba(99,102,241,.12) 0%, transparent 70%)', pointerEvents:'none' }}/>
          <h2 className="fade-up" style={{ fontSize:'clamp(20px,4vw,36px)', fontWeight:800, letterSpacing:'-0.03em', marginBottom:12 }}>
            Ready to build smarter?
          </h2>
          <p className="fade-up d1" style={{ color:'var(--t2)', marginBottom:32, fontSize:'clamp(13px,1.5vw,16px)', lineHeight:1.75 }}>
            Join DeLaxiY and transform the way you manage orders and visualise data.
          </p>
          <div className="fade-up d2" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => setAuth('register')} style={{
              padding:'13px 32px', borderRadius:'var(--r2)',
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color:'#fff', border:'none', cursor:'pointer', fontSize:15,
              fontWeight:700, fontFamily:'var(--ff-b)',
              boxShadow:'0 0 30px rgba(99,102,241,.5)',
              transition:'all .3s ease',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 50px rgba(99,102,241,.7)';}}
            onMouseLeave={e=>{e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 0 30px rgba(99,102,241,.5)';}}>
              Create Free Account →
            </button>
            <button onClick={() => setAuth('login')} style={{
              padding:'13px 32px', borderRadius:'var(--r2)',
              background:'rgba(255,255,255,.06)', color:'var(--t1)',
              border:'1px solid rgba(99,102,241,.35)', cursor:'pointer',
              fontSize:15, fontWeight:600, fontFamily:'var(--ff-b)',
              transition:'all .3s ease',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,.18)'; e.currentTarget.style.transform='translateY(-2px)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.06)'; e.currentTarget.style.transform='none';}}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop:'1px solid rgba(99,102,241,.2)',
        padding:'clamp(14px,2vw,20px) clamp(16px,4vw,48px)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:12, position:'relative', zIndex:1,
        background:'rgba(6,11,24,.6)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:30, height:30, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px rgba(99,102,241,.5)' }}>
            <span style={{ color:'#fff', fontFamily:'var(--ff-h)', fontWeight:800, fontSize:15 }}>D</span>
          </div>
          <span style={{ fontFamily:'var(--ff-h)', fontWeight:700, fontSize:16 }}>DeLaxiY</span>
        </div>
        <span style={{ fontSize:12, color:'var(--t3)' }}>© 2025 DeLaxiY. Built with ♥ using MERN Stack.</span>
      </footer>

      {auth && <AuthModal mode={auth} onClose={() => setAuth(null)} onSwitch={m => setAuth(m)} />}
    </div>
  );
}
