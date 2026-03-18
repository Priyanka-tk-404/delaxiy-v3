// src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to:'/dashboard', icon:'⊡', label:'Dashboard' },
  { to:'/orders',    icon:'⊞', label:'Customer Orders' },
  { to:'/profile',   icon:'👤', label:'My Profile' },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function Sidebar() {
  const { user, isAuth, logout } = useAuth();
  const navigate   = useNavigate();
  const isMobile   = useIsMobile();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => { if (isMobile) setCollapsed(true); }, [isMobile]);

  const initials = user?.name
    ? user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    : 'DL';

  // On mobile: sidebar is a bottom-sheet drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <div style={{
          position:'fixed', top:0, left:0, right:0, height:52, zIndex:200,
          background:'var(--sidebar)',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 16px',
          borderBottom:'1px solid rgba(255,255,255,.08)',
          boxShadow:'0 2px 12px rgba(0,0,0,.3)',
        }}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:32,height:32,background:'linear-gradient(135deg,#10b981,#06b6d4)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 10px rgba(16,185,129,.4)'}}>
              <span style={{color:'#fff',fontFamily:'var(--ff-h)',fontWeight:800,fontSize:16}}>D</span>
            </div>
            <span style={{fontFamily:'var(--ff-h)',fontWeight:800,fontSize:17,color:'#fff',letterSpacing:'-0.02em'}}>DeLaxiY</span>
          </div>
          {/* Hamburger */}
          <button onClick={()=>setMobileOpen(!mobileOpen)}
            style={{background:'rgba(255,255,255,.1)',border:'none',color:'#fff',cursor:'pointer',borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,transition:'background .2s'}}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.18)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.1)'}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Drawer overlay */}
        {mobileOpen && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.5)',zIndex:300,backdropFilter:'blur(4px)'}}
            onClick={()=>setMobileOpen(false)}/>
        )}

        {/* Drawer panel */}
        <div style={{
          position:'fixed', top:0, left:0, bottom:0, width:260, zIndex:400,
          background:'var(--g-dark)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform .3s cubic-bezier(.4,0,.2,1)',
          display:'flex', flexDirection:'column',
          boxShadow:'4px 0 32px rgba(0,0,0,.4)',
        }}>
          {/* Drawer header */}
          <div style={{padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:34,height:34,background:'linear-gradient(135deg,#10b981,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <span style={{color:'#fff',fontFamily:'var(--ff-h)',fontWeight:800,fontSize:17}}>D</span>
              </div>
              <div>
                <div style={{fontFamily:'var(--ff-h)',fontWeight:800,fontSize:15,color:'#fff'}}>DeLaxiY</div>
                <div style={{fontSize:9,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.1em'}}>Dashboard</div>
              </div>
            </div>
            <button onClick={()=>setMobileOpen(false)}
              style={{background:'rgba(255,255,255,.1)',border:'none',color:'rgba(255,255,255,.7)',cursor:'pointer',borderRadius:6,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14}}>
              ✕
            </button>
          </div>

          {/* Nav items */}
          <nav style={{padding:'14px 10px',flex:1,display:'flex',flexDirection:'column',gap:4}}>
            <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.12em',padding:'4px 12px 10px'}}>Menu</div>
            {NAV.map(n=>(
              <NavLink key={n.to} to={n.to}
                onClick={()=>setMobileOpen(false)}
                style={({isActive})=>({
                  display:'flex', alignItems:'center', gap:12,
                  padding:'11px 14px', borderRadius:8,
                  background: isActive?'rgba(16,185,129,.2)':'transparent',
                  border:`1px solid ${isActive?'rgba(16,185,129,.35)':'transparent'}`,
                  color: isActive?'#10b981':'rgba(255,255,255,.7)',
                  fontFamily:'var(--ff-b)', fontSize:14, fontWeight: isActive?600:400,
                  textDecoration:'none', transition:'var(--t)',
                })}>
                <span style={{fontSize:18}}>{n.icon}</span>
                <span>{n.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* User section */}
          <div style={{padding:12,borderTop:'1px solid rgba(255,255,255,.08)'}}>
            {isAuth ? (
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)'}}>
                <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>
                  {initials}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
                </div>
                <button onClick={()=>{logout();navigate('/');setMobileOpen(false);}}
                  style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:16,padding:4,transition:'color .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.color='#f43f5e'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.4)'}>⎋</button>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <button className="btn btn-primary btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>{navigate('/');setMobileOpen(false);}}>Sign Up</button>
                <button className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center',color:'rgba(255,255,255,.7)',borderColor:'rgba(255,255,255,.15)'}} onClick={()=>{navigate('/');setMobileOpen(false);}}>Sign In</button>
              </div>
            )}
          </div>
        </div>

        {/* Spacer so content doesn't hide behind fixed topbar */}
        <div style={{height:52,flexShrink:0}}/>
      </>
    );
  }

  // ── Desktop sidebar ───────────────────────────────────────────────────────
  return (
    <aside style={{
      width: collapsed ? 62 : 220,
      flexShrink: 0,
      background: 'var(--g-dark)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      transition: 'width .28s var(--ease)',
      overflow: 'hidden',
      zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 14px' : '18px 20px',
        borderBottom:'1px solid rgba(255,255,255,.08)',
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap:10, minHeight:64,
      }}>
        {!collapsed && (
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:34,height:34,background:'linear-gradient(135deg,#10b981,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 4px 12px rgba(16,185,129,.45)',flexShrink:0}}>
              <span style={{color:'#fff',fontFamily:'var(--ff-h)',fontWeight:800,fontSize:17}}>D</span>
            </div>
            <div>
              <div style={{fontFamily:'var(--ff-h)',fontWeight:800,fontSize:15,color:'#fff',letterSpacing:'-0.02em'}}>DeLaxiY</div>
              <div style={{fontSize:9,color:'rgba(255,255,255,.4)',textTransform:'uppercase',letterSpacing:'.1em'}}>Dashboard</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div style={{width:34,height:34,background:'linear-gradient(135deg,#10b981,#06b6d4)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{color:'#fff',fontFamily:'var(--ff-h)',fontWeight:800,fontSize:17}}>D</span>
          </div>
        )}
        <button onClick={()=>setCollapsed(!collapsed)}
          style={{background:'rgba(255,255,255,.08)',border:'none',color:'rgba(255,255,255,.5)',cursor:'pointer',borderRadius:6,width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0,transition:'var(--t)'}}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
          onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.08)'}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Nav */}
      <nav style={{padding:'12px 8px',flex:1,display:'flex',flexDirection:'column',gap:3}}>
        {!collapsed && <div style={{fontSize:9,fontWeight:700,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.12em',padding:'4px 12px 8px'}}>Menu</div>}
        {NAV.map(n=>(
          <NavLink key={n.to} to={n.to} title={collapsed?n.label:''}
            style={({isActive})=>({
              display:'flex', alignItems:'center', gap:10,
              padding:collapsed?'10px 14px':'10px 14px',
              borderRadius:8,
              background: isActive?'rgba(16,185,129,.2)':'transparent',
              border:`1px solid ${isActive?'rgba(16,185,129,.35)':'transparent'}`,
              color: isActive?'#10b981':'rgba(255,255,255,.6)',
              fontFamily:'var(--ff-b)', fontSize:13, fontWeight:isActive?600:400,
              textDecoration:'none', transition:'var(--t)',
              justifyContent: collapsed?'center':'flex-start',
            })}
            onMouseEnter={e=>{if(!e.currentTarget.style.background.includes('.2')){e.currentTarget.style.background='rgba(255,255,255,.06)';e.currentTarget.style.color='rgba(255,255,255,.9)';}}}
            onMouseLeave={e=>{if(!e.currentTarget.style.background.includes('.2')){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.6)';}}}
          >
            <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
            {!collapsed && <span>{n.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{padding:collapsed?'12px 8px':'12px',borderTop:'1px solid rgba(255,255,255,.08)'}}>
        {isAuth ? (
          collapsed ? (
            <div style={{display:'flex',flexDirection:'column',gap:6,alignItems:'center'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff'}}>{initials}</div>
              <button onClick={()=>{logout();navigate('/');}} title="Sign out"
                style={{background:'rgba(255,255,255,.08)',border:'none',color:'rgba(255,255,255,.5)',cursor:'pointer',borderRadius:6,width:32,height:26,fontSize:12,transition:'var(--t)'}}>⎋</button>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:9,padding:'8px 10px',borderRadius:8,background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.08)'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>{initials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
                <div style={{fontSize:10,color:'rgba(255,255,255,.4)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.email}</div>
              </div>
              <button onClick={()=>{logout();navigate('/');}} title="Sign out"
                style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',cursor:'pointer',fontSize:14,padding:2,transition:'var(--t)'}}
                onMouseEnter={e=>e.currentTarget.style.color='#f43f5e'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.4)'}>⎋</button>
            </div>
          )
        ) : (
          !collapsed && (
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              <button className="btn btn-primary btn-sm" style={{width:'100%',justifyContent:'center'}} onClick={()=>navigate('/')}>Sign Up</button>
              <button className="btn btn-ghost btn-sm" style={{width:'100%',justifyContent:'center',color:'rgba(255,255,255,.7)',borderColor:'rgba(255,255,255,.15)'}} onClick={()=>navigate('/')}>Sign In</button>
            </div>
          )
        )}
      </div>
    </aside>
  );
}
