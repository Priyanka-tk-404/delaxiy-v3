// src/components/layout/Topbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}

export default function Topbar({ title, subtitle, actions }) {
  const { user }  = useAuth();
  const isMobile  = useIsMobile();
  const navigate  = useNavigate();
  const initials  = user?.name
    ? user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    : 'U';

  if (isMobile) {
    return (
      /* Sticky on mobile — stays visible as you scroll.
         top:52 = sits directly below the fixed hamburger nav bar */
      <div style={{
        position: 'sticky',
        top: 52,
        zIndex: 90,
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        padding: '8px 14px',
        boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      }}>
        {/* Row 1: title + avatar */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom: actions ? 6 : 0}}>
          <div style={{minWidth:0,flex:1}}>
            <h1 style={{fontSize:15,fontWeight:700,color:'var(--t1)',fontFamily:'var(--ff-h)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{title}</h1>
            {subtitle && !actions && (
              <p style={{fontSize:11,color:'var(--t3)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{subtitle}</p>
            )}
          </div>
          {user && (
            <div onClick={()=>navigate('/profile')} style={{width:30,height:30,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0,marginLeft:10,cursor:'pointer'}}>
              {initials}
            </div>
          )}
        </div>
        {/* Row 2: actions */}
        {actions && (
          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
            {actions}
          </div>
        )}
      </div>
    );
  }

  // Desktop — sticky at top:0
  return (
    <div style={{
      height:60, background:'#fff',
      borderBottom:'1px solid var(--border)',
      display:'flex', alignItems:'center',
      padding:'0 24px',
      justifyContent:'space-between',
      flexShrink:0,
      position:'sticky', top:0, zIndex:40,
    }}>
      <div style={{minWidth:0}}>
        <h1 style={{fontSize:16,fontWeight:700,color:'var(--t1)',fontFamily:'var(--ff-h)'}}>{title}</h1>
        {subtitle && <p style={{fontSize:12,color:'var(--t3)',marginTop:1}}>{subtitle}</p>}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
        {actions}
        {user && (
          <div onClick={()=>navigate('/profile')} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 10px',background:'var(--bg)',borderRadius:8,border:'1px solid var(--border)',cursor:'pointer',transition:'background .15s'}}
            onMouseEnter={e=>e.currentTarget.style.background='#e8e8f0'}
            onMouseLeave={e=>e.currentTarget.style.background='var(--bg)'}>
            <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>
              {initials}
            </div>
            <span style={{fontSize:12,fontWeight:600,color:'var(--t1)'}}>{user.name?.split(' ')[0]}</span>
          </div>
        )}
      </div>
    </div>
  );
}
