// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth }   from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { useToast }  from '../context/ToastContext';
import Topbar        from '../components/layout/Topbar';
import { fmtINR }   from '../utils/constants';

function useIsMobile() {
  const [m, setM] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setM(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
}

const AVATAR_COLORS = [
  ['#6366f1','#8b5cf6'],['#10b981','#06b6d4'],
  ['#f59e0b','#f43f5e'],['#ec4899','#8b5cf6'],
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { orders }       = useOrders();
  const { add }          = useToast();
  const isMobile         = useIsMobile();

  const [editMode, setEditMode] = useState(false);
  const [name,     setName]     = useState(user?.name  || '');
  const [email,    setEmail]    = useState(user?.email || '');

  const initials = user?.name
    ? user.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    : 'DL';

  const colorIdx  = (user?.name?.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  const [c1, c2]  = AVATAR_COLORS[colorIdx];

  // Stats from orders
  const totalOrders    = orders.length;
  const totalRevenue   = orders.reduce((s,o) => s + (o.totalAmount||0), 0);
  const completedOrders= orders.filter(o => o.status === 'Completed').length;
  const pendingOrders  = orders.filter(o => o.status === 'Pending').length;
  const memberSince    = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})
    : 'Mar 2026';

  function handleSave() {
    add('Profile updated!', 'success');
    setEditMode(false);
  }

  /* ── Styles ── */
  const card = {
    background:'#fff', borderRadius:12, border:'1px solid #f1f5f9',
    boxShadow:'0 1px 4px rgba(0,0,0,.06)', overflow:'hidden',
  };
  const labelSt = {fontSize:11,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:5,display:'block'};
  const valueSt = {fontSize:14,fontWeight:500,color:'#1e293b'};
  const inputSt = {width:'100%',padding:'10px 13px',border:'1.5px solid #cbd5e1',borderRadius:8,fontSize:13,fontFamily:'inherit',color:'#1e293b',outline:'none',boxSizing:'border-box',background:'#fff'};

  const statCards = [
    {label:'Total Orders',    value:totalOrders,              color:'#6366f1', bg:'#eef2ff', icon:'⊞'},
    {label:'Total Revenue',   value:fmtINR(totalRevenue),     color:'#10b981', bg:'#f0fdf4', icon:'₹'},
    {label:'Completed',       value:completedOrders,          color:'#06b6d4', bg:'#ecfeff', icon:'✓'},
    {label:'Pending',         value:pendingOrders,            color:'#f59e0b', bg:'#fffbeb', icon:'⏳'},
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'auto'}}>
      <Topbar title="My Profile" subtitle="Manage your account details"/>

      <div style={{flex:1,padding:isMobile?'80px 14px 20px':'24px 28px',background:'#f8fafc'}}>

        {/* ── Profile Header Card ── */}
        <div style={{...card,marginBottom:16}}>
          {/* Banner */}
          <div style={{height:isMobile?80:110,background:`linear-gradient(135deg,${c1},${c2})`,position:'relative'}}>
            <div style={{position:'absolute',bottom:-40,left:isMobile?20:28,width:isMobile?72:88,height:isMobile?72:88,borderRadius:'50%',background:`linear-gradient(135deg,${c1},${c2})`,border:'4px solid #fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile?26:32,fontWeight:800,color:'#fff',fontFamily:'var(--ff-h)',boxShadow:'0 4px 16px rgba(0,0,0,.15)'}}>
              {initials}
            </div>
          </div>

          {/* Info row */}
          <div style={{padding:isMobile?'50px 20px 20px':'52px 28px 24px',display:'flex',alignItems:isMobile?'flex-start':'center',justifyContent:'space-between',flexDirection:isMobile?'column':'row',gap:12}}>
            <div>
              <div style={{fontSize:isMobile?18:22,fontWeight:800,fontFamily:'var(--ff-h)',color:'#1e293b'}}>{user?.name||'User'}</div>
              <div style={{fontSize:13,color:'#64748b',marginTop:3}}>{user?.email}</div>
              <div style={{display:'flex',alignItems:'center',gap:6,marginTop:8}}>
                <span style={{background:'#f0fdf4',color:'#10b981',fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:99,border:'1px solid #bbf7d0'}}>● Active</span>
                <span style={{fontSize:11,color:'#94a3b8'}}>Member since {memberSince}</span>
              </div>
            </div>
            <div style={{display:'flex',gap:8,flexShrink:0,width:isMobile?'100%':'auto'}}>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{flex:isMobile?1:0,padding:'9px 20px',borderRadius:8,border:'1.5px solid #6366f1',background:editMode?'#6366f1':'#fff',color:editMode?'#fff':'#6366f1',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:'pointer',transition:'all .2s'}}>
                {editMode ? 'Cancel' : '✏ Edit Profile'}
              </button>
              <button
                onClick={()=>{logout();window.location.href='/';}}
                style={{flex:isMobile?1:0,padding:'9px 20px',borderRadius:8,border:'1.5px solid #fecaca',background:'#fef2f2',color:'#f43f5e',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:'pointer'}}>
                ⎋ Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:isMobile?8:12,marginBottom:16}}>
          {statCards.map((s,i) => (
            <div key={i} style={{...card,padding:isMobile?'14px 14px':'18px 20px',display:'flex',alignItems:'center',gap:12,minWidth:0}}>
              <div style={{width:isMobile?36:44,height:isMobile?36:44,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile?16:20,color:s.color,flexShrink:0}}>{s.icon}</div>
              <div style={{minWidth:0}}>
                <div style={{fontSize:isMobile?16:22,fontWeight:800,fontFamily:'var(--ff-h)',color:s.color,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.value}</div>
                <div style={{fontSize:isMobile?9:11,color:'#94a3b8',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ── */}
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>

          {/* Personal Information */}
          <div style={card}>
            <div style={{padding:isMobile?'16px 18px':'18px 22px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#1e293b',fontFamily:'var(--ff-h)'}}>Personal Information</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Your account details</div>
              </div>
              <span style={{fontSize:20}}>👤</span>
            </div>
            <div style={{padding:isMobile?'16px 18px':'20px 22px',display:'flex',flexDirection:'column',gap:18}}>
              {editMode ? (
                <>
                  <div>
                    <label style={labelSt}>Full Name</label>
                    <input value={name} onChange={e=>setName(e.target.value)}
                      style={inputSt}
                      onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,.1)';}}
                      onBlur={e=>{e.target.style.borderColor='#cbd5e1';e.target.style.boxShadow='none';}}/>
                  </div>
                  <div>
                    <label style={labelSt}>Email Address</label>
                    <input value={email} onChange={e=>setEmail(e.target.value)}
                      style={inputSt}
                      onFocus={e=>{e.target.style.borderColor='#6366f1';e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,.1)';}}
                      onBlur={e=>{e.target.style.borderColor='#cbd5e1';e.target.style.boxShadow='none';}}/>
                  </div>
                  <button onClick={handleSave}
                    style={{padding:'10px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 4px 12px rgba(99,102,241,.3)'}}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  {[
                    {l:'Full Name',      v:user?.name  || '—'},
                    {l:'Email Address',  v:user?.email || '—'},
                    {l:'Account Status', v:'Active'},
                    {l:'Member Since',   v:memberSince},
                  ].map((r,i) => (
                    <div key={i} style={{display:'flex',flexDirection:'column',gap:4,paddingBottom:i<3?'14px':0,borderBottom:i<3?'1px solid #f8fafc':'none'}}>
                      <span style={labelSt}>{r.l}</span>
                      <span style={{...valueSt,color:r.l==='Account Status'?'#10b981':valueSt.color}}>{r.v}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Activity Summary */}
          <div style={card}>
            <div style={{padding:isMobile?'16px 18px':'18px 22px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#1e293b',fontFamily:'var(--ff-h)'}}>Order Activity</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Your order breakdown</div>
              </div>
              <span style={{fontSize:20}}>📊</span>
            </div>
            <div style={{padding:isMobile?'16px 18px':'20px 22px',display:'flex',flexDirection:'column',gap:14}}>
              {[
                {l:'Total Orders',    v:totalOrders,                    color:'#6366f1', pct:100},
                {l:'Completed',       v:completedOrders,                color:'#10b981', pct:totalOrders?Math.round(completedOrders/totalOrders*100):0},
                {l:'In Progress',     v:orders.filter(o=>o.status==='In progress').length, color:'#6366f1', pct:totalOrders?Math.round(orders.filter(o=>o.status==='In progress').length/totalOrders*100):0},
                {l:'Pending',         v:pendingOrders,                  color:'#f59e0b', pct:totalOrders?Math.round(pendingOrders/totalOrders*100):0},
              ].map((r,i) => (
                <div key={i}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <span style={{fontSize:12,fontWeight:600,color:'#1e293b'}}>{r.l}</span>
                    <span style={{fontSize:13,fontWeight:800,color:r.color}}>{r.v}</span>
                  </div>
                  <div style={{height:6,background:'#f1f5f9',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${r.pct}%`,background:r.color,borderRadius:99,transition:'width 1s ease'}}/>
                  </div>
                  <div style={{fontSize:10,color:'#94a3b8',marginTop:3,textAlign:'right'}}>{r.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{...card, gridColumn: isMobile?'auto':'1/-1'}}>
            <div style={{padding:isMobile?'16px 18px':'18px 22px',borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#1e293b',fontFamily:'var(--ff-h)'}}>Recent Orders</div>
                <div style={{fontSize:11,color:'#94a3b8',marginTop:2}}>Last 5 orders</div>
              </div>
              <span style={{fontSize:20}}>🧾</span>
            </div>
            <div style={{padding:isMobile?'12px 0':'0'}}>
              {orders.length === 0 ? (
                <div style={{padding:'32px',textAlign:'center',color:'#94a3b8'}}>
                  <div style={{fontSize:32,marginBottom:8,opacity:.3}}>⊞</div>
                  No orders yet
                </div>
              ) : (
                orders.slice(0,5).map((o,i) => (
                  <div key={o._id||i} style={{
                    display:'flex', alignItems:'center', gap:12,
                    padding: isMobile?'10px 18px':'12px 22px',
                    borderBottom: i<Math.min(4,orders.length-1) ? '1px solid #f8fafc' : 'none',
                    transition:'background .15s',
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    {/* Avatar */}
                    <div style={{width:36,height:36,borderRadius:'50%',background:`linear-gradient(135deg,${['#10b981','#6366f1','#f59e0b','#f43f5e','#8b5cf6'][i%5]},${['#06b6d4','#8b5cf6','#f43f5e','#ec4899','#06b6d4'][i%5]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>
                      {(o.firstName||'?')[0].toUpperCase()}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:13,fontWeight:600,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.firstName} {o.lastName}</div>
                      <div style={{fontSize:11,color:'#94a3b8',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.product}</div>
                    </div>
                    {!isMobile && (
                      <div style={{fontSize:11,color:'#94a3b8',flexShrink:0,textAlign:'right',minWidth:80}}>
                        <div>{o.orderId||'—'}</div>
                        <div style={{marginTop:2}}>{o.orderDate?new Date(o.orderDate).toLocaleDateString('en-IN',{day:'numeric',month:'short'}):''}</div>
                      </div>
                    )}
                    <div style={{flexShrink:0,textAlign:'right'}}>
                      <div style={{fontSize:13,fontWeight:700,color:'#10b981'}}>{fmtINR(o.totalAmount)}</div>
                      <div style={{marginTop:3}}>
                        <span style={{
                          fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,
                          background: o.status==='Completed'?'#f0fdf4':o.status==='In progress'?'#eef2ff':'#fffbeb',
                          color: o.status==='Completed'?'#10b981':o.status==='In progress'?'#6366f1':'#f59e0b',
                          border: `1px solid ${o.status==='Completed'?'#bbf7d0':o.status==='In progress'?'#c7d2fe':'#fde68a'}`,
                        }}>{o.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
