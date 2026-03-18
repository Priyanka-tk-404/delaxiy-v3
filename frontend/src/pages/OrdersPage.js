// src/pages/OrdersPage.js
import React, { useState, useMemo, useEffect } from 'react';
import { useOrders } from '../context/OrdersContext';
import { useToast }  from '../context/ToastContext';
import Topbar        from '../components/layout/Topbar';
import OrderModal    from '../components/modals/OrderModal';
import { fmtINR, fmtDate, PRODUCTS } from '../utils/constants';

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return mobile;
}



export default function OrdersPage() {
  const {orders,loading,create,update,remove}=useOrders();
  const {add}=useToast();
  const isMobile = useIsMobile();
  const [modal,  setModal]  = useState(null);
  const [del,    setDel]    = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort,   setSort]   = useState({field:'createdAt',dir:'desc'});
  const [page,   setPage]   = useState(0);
  const [view,   setView]   = useState('table'); // 'table' | 'dashboard'
  const pageSize = 10;

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search) {
      const q=search.toLowerCase();
      list=list.filter(o=>[o.firstName,o.lastName,o.email,o.customerId,o.orderId,o.product].some(v=>String(v||'').toLowerCase().includes(q)));
    }
    if (status) list=list.filter(o=>o.status===status);
    list.sort((a,b)=>{
      const av=a[sort.field]||'', bv=b[sort.field]||'';
      return sort.dir==='asc'?String(av).localeCompare(String(bv)):String(bv).localeCompare(String(av));
    });
    return list;
  },[orders,search,status,sort]);

  const pages    = Math.ceil(filtered.length/pageSize);
  const slice    = filtered.slice(page*pageSize,(page+1)*pageSize);
  const totalRev = useMemo(()=>filtered.reduce((s,o)=>s+(o.totalAmount||0),0),[filtered]);

  function toggleSort(f){setSort(p=>p.field===f?{...p,dir:p.dir==='asc'?'desc':'asc'}:{field:f,dir:'asc'});}
  async function handleSave(data){
    if(modal==='new'){await create(data);add(`✅ Your new order is now in the list!`,'success');}
    else{await update(modal._id||modal.id,data);add('Order updated','success');}
  }
  async function handleDel(id){await remove(id);add('Order deleted','info');setDel(null);}

  const SortI=({f})=>sort.field!==f
    ?<span style={{opacity:.3,fontSize:10}}>⇅</span>
    :<span style={{color:'var(--accent)',fontSize:10}}>{sort.dir==='asc'?'↑':'↓'}</span>;

  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:isMobile?'auto':'100vh'}}>
      <Topbar
        title="Customer Orders"
        subtitle="View and manage customer orders and details"
        actions={
          <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
            <div style={{display:'flex',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'var(--r1)',padding:3,gap:2}}>
              {[{key:'dashboard',icon:'⊡',label:'Dashboard'},{key:'table',icon:'⊞',label:'Table'}].map(tab=>(
                <button key={tab.key}
                  onClick={()=>setView(tab.key)}
                  style={{
                    padding: isMobile ? '5px 8px' : '5px 14px',
                    borderRadius:6,border:'none',cursor:'pointer',
                    fontSize:12,fontWeight:600,fontFamily:'var(--ff-b)',
                    background: view===tab.key ? '#fff' : 'transparent',
                    color:      view===tab.key ? 'var(--t1)' : 'var(--t3)',
                    boxShadow:  view===tab.key ? 'var(--s1)' : 'none',
                    transition: 'var(--t)',
                    display:'flex',alignItems:'center',gap:4,whiteSpace:'nowrap',
                  }}>
                  <span>{tab.icon}</span>{!isMobile && ' '+tab.label}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')} style={{whiteSpace:'nowrap'}}>
              {isMobile ? '+ Order' : '+ Create Order'}
            </button>
          </div>
        }
      />

      <div style={{flex:1,overflow:isMobile?'visible':'auto',padding:isMobile?'10px 12px':'16px 20px',paddingTop:isMobile?'80px':'16px',background:'var(--bg)'}}>
        {/* Summary cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:isMobile?8:10,marginBottom:isMobile?10:16}}>
          {[
            {l:'Total Orders',   v:String(filtered.length),                                          c:'#6366f1', bg:'#eef2ff'},
            {l:'Total Revenue',  v:fmtINR(totalRev),                                                 c:'#10b981', bg:'#f0fdf4'},
            {l:'Total Units',    v:String(filtered.reduce((s,o)=>s+(o.quantity||0),0)),               c:'#06b6d4', bg:'#ecfeff'},
            {l:'Avg Order Value',v:fmtINR(filtered.length?totalRev/filtered.length:0),               c:'#f59e0b', bg:'#fffbeb'},
          ].map((s,i)=>(
            <div key={s.l} className={`card fade-up d${i+1}`}
              style={{padding:isMobile?'10px 12px':'12px 16px', borderLeft:`3px solid ${s.c}`, minWidth:0, overflow:'hidden'}}>
              <div style={{
                fontSize: isMobile ? '13px' : 'clamp(14px,2vw,18px)',
                fontWeight:800, fontFamily:'var(--ff-h)', color:s.c,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              }}>{s.v}</div>
              <div style={{fontSize:isMobile?9:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── DASHBOARD VIEW ── */}
        {view === 'dashboard' && (
          <div className="fade-in">
            {/* Chart summary cards */}
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(auto-fit,minmax(200px,1fr))',gap:isMobile?8:14,marginBottom:isMobile?12:20}}>
              {/* Status breakdown */}
              {['Pending','In progress','Completed'].map((s,i) => {
                const count = orders.filter(o=>o.status===s).length;
                const pct   = orders.length ? Math.round(count/orders.length*100) : 0;
                const colors= ['#f59e0b','#6366f1','#10b981'];
                return (
                  <div key={s} className="card" style={{padding:'18px 20px'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>{s}</div>
                    <div style={{fontSize:28,fontWeight:800,fontFamily:'var(--ff-h)',color:colors[i],lineHeight:1}}>{count}</div>
                    <div style={{marginTop:10,height:6,background:'#e2e8f0',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:colors[i],borderRadius:99,transition:'width 1s ease'}}/>
                    </div>
                    <div style={{fontSize:11,color:'#94a3b8',marginTop:4}}>{pct}% of total orders</div>
                  </div>
                );
              })}
            </div>

            {/* Product breakdown bars */}
            <div className="card" style={{padding:'20px 24px',marginBottom:14}}>
              <div style={{fontFamily:'var(--ff-h)',fontSize:14,fontWeight:700,marginBottom:16,color:'var(--t1)'}}>Orders by Product</div>
              {PRODUCTS.map((p,i) => {
                const count = orders.filter(o=>o.product===p).length;
                const pct   = orders.length ? Math.round(count/orders.length*100) : 0;
                const clrs  = ['#10b981','#6366f1','#06b6d4','#f59e0b','#f43f5e'];
                return (
                  <div key={p} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginBottom:4}}>
                      <span style={{color:'#1e293b',fontWeight:500}}>{p}</span>
                      <span style={{color:'#64748b',fontWeight:600}}>{count} orders ({pct}%)</span>
                    </div>
                    <div style={{height:8,background:'#f1f5f9',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:clrs[i%clrs.length],borderRadius:99,transition:'width 1s ease'}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue summary */}
            <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:isMobile?8:14}}>
              <div className="card" style={{padding:isMobile?'14px 16px':'18px 20px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Total Revenue</div>
                <div style={{fontSize:isMobile?18:26,fontWeight:800,fontFamily:'var(--ff-h)',color:'#10b981',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{fmtINR(orders.reduce((s,o)=>s+(o.totalAmount||0),0))}</div>
              </div>
              <div className="card" style={{padding:'18px 20px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Avg Order Value</div>
                <div style={{fontSize:isMobile?18:26,fontWeight:800,fontFamily:'var(--ff-h)',color:'#6366f1',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{fmtINR(orders.length ? orders.reduce((s,o)=>s+(o.totalAmount||0),0)/orders.length : 0)}</div>
              </div>
            </div>
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === 'table' && (<>
        {/* Filters */}
        <div className="card" style={{padding:isMobile?'10px 12px':'12px 16px',marginBottom:isMobile?8:14,display:'flex',gap:isMobile?8:12,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{position:'relative',flex:1,maxWidth:320}}>
            <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:'var(--t3)',fontSize:13,pointerEvents:'none'}}>🔍</span>
            <input className="form-control" placeholder="Search by name, email, Customer ID, Order ID…"
              value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}
              style={{paddingLeft:32,fontSize:12}}/>
          </div>
          <select className="form-control" value={status} onChange={e=>{setStatus(e.target.value);setPage(0);}} style={{maxWidth:160,fontSize:12}}>
            <option value="">All Statuses</option>
            {['Pending','In progress','Completed'].map(s=><option key={s}>{s}</option>)}
          </select>
          {(search||status)&&<button className="btn btn-ghost btn-sm" onClick={()=>{setSearch('');setStatus('');setPage(0);}}>✕ Clear</button>}
          <span style={{marginLeft:'auto',fontSize:12,color:'var(--t3)',fontWeight:600}}>{filtered.length} record{filtered.length!==1?'s':''}</span>
        </div>

        {loading?(
          <div style={{display:'flex',justifyContent:'center',padding:48}}><div className="spinner" style={{width:28,height:28}}/></div>
        ):isMobile?(
          /* ── MOBILE: card list ── */
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {slice.length===0?(
              <div className="card" style={{padding:32,textAlign:'center',color:'var(--t3)'}}>
                <div style={{fontSize:28,marginBottom:8,opacity:.2}}>⊞</div>
                No orders yet.
                <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')} style={{display:'block',margin:'12px auto 0'}}>Create first order</button>
              </div>
            ):slice.map((o,idx)=>(
              <div key={o._id||o.id} className="card" style={{padding:'12px 14px'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0,flex:1}}>
                    <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${['#10b981','#6366f1','#f59e0b','#f43f5e','#8b5cf6'][idx%5]},${['#06b6d4','#8b5cf6','#f43f5e','#ec4899','#06b6d4'][idx%5]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'#fff',flexShrink:0}}>
                      {(o.firstName||'?')[0].toUpperCase()}
                    </div>
                    <div style={{minWidth:0}}>
                      <div style={{fontWeight:600,fontSize:13,color:'#1e293b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.firstName} {o.lastName}</div>
                      <div style={{fontSize:11,color:'#64748b',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.email}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:4,flexShrink:0,marginLeft:8}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setModal(o)} style={{fontSize:11,padding:'4px 8px',color:'var(--accent)',borderColor:'rgba(99,102,241,.2)'}}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={()=>setDel(o._id||o.id)} style={{fontSize:11,padding:'4px 8px'}}>Del</button>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,fontSize:11}}>
                  <div><span style={{color:'#94a3b8',fontWeight:600}}>CUST: </span><span style={{fontFamily:'monospace',color:'#6366f1',fontWeight:600}}>{o.customerId||'—'}</span></div>
                  <div><span style={{color:'#94a3b8',fontWeight:600}}>ORDER: </span><span style={{fontFamily:'monospace',color:'#10b981',fontWeight:600}}>{o.orderId||'—'}</span></div>
                  <div><span style={{color:'#94a3b8',fontWeight:600}}>TOTAL: </span><span style={{color:'#10b981',fontWeight:700}}>{fmtINR(o.totalAmount)}</span></div>
                  <div><span style={{color:'#94a3b8',fontWeight:600}}>DATE: </span><span>{fmtDate(o.orderDate)}</span></div>
                </div>
                <div style={{marginTop:7}}>
                  <span className={`badge ${'Pending'===o.status?'badge-pending':'In progress'===o.status?'badge-inprogress':'badge-completed'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        ):(
          /* ── DESKTOP: full table ── */
          <div className="tbl-wrap card">
            <table>
              <thead>
                <tr>
                  <th style={{width:40}}>S.No</th>
                  {[
                    {f:'customerId',l:'Customer ID'},
                    {f:'firstName', l:'Customer Name'},
                    {f:'email',     l:'Email ID'},
                    {f:'phone',     l:'Phone Number'},
                    {f:'street',    l:'Address'},
                    {f:'orderId',   l:'Order ID'},
                    {f:'orderDate', l:'Order Date'},
                  ].map(col=>(
                    <th key={col.f} onClick={()=>toggleSort(col.f)} style={{cursor:'pointer',userSelect:'none'}}>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>{col.l}<SortI f={col.f}/></span>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slice.length===0?(
                  <tr><td colSpan={9} style={{textAlign:'center',padding:48,color:'var(--t3)'}}>
                    <div style={{fontSize:32,marginBottom:10,opacity:.2}}>⊞</div>
                    No orders found.
                    <button className="btn btn-primary btn-sm" onClick={()=>setModal('new')} style={{marginLeft:12}}>Create first order</button>
                  </td></tr>
                ):slice.map((o,idx)=>(
                  <tr key={o._id||o.id} className="fade-in" style={{animationDelay:`${idx*.02}s`}}>
                    <td style={{color:'var(--t3)',fontSize:12}}>{page*pageSize+idx+1}</td>
                    <td><span style={{fontFamily:'monospace',fontSize:12,color:'var(--accent)',fontWeight:600}}>{o.customerId||'—'}</span></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:8}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${['#10b981','#6366f1','#f59e0b','#f43f5e','#8b5cf6'][idx%5]},${['#06b6d4','#8b5cf6','#f43f5e','#ec4899','#06b6d4'][idx%5]})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:'#fff',flexShrink:0}}>
                          {(o.firstName||'?')[0].toUpperCase()}
                        </div>
                        <span style={{fontWeight:500,fontSize:13}}>{o.firstName} {o.lastName}</span>
                      </div>
                    </td>
                    <td style={{color:'var(--t2)',fontSize:12}}>{o.email}</td>
                    <td style={{color:'var(--t2)',fontSize:12}}>{o.phone}</td>
                    <td style={{color:'var(--t2)',fontSize:12,maxWidth:160}}>
                      <div style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:160}}>
                        {[o.street,o.city,o.state,o.postalCode,o.country].filter(Boolean).join(', ')}
                      </div>
                    </td>
                    <td><span style={{fontFamily:'monospace',fontSize:12,color:'var(--primary)',fontWeight:600}}>{o.orderId||'—'}</span></td>
                    <td style={{color:'var(--t2)',fontSize:12,whiteSpace:'nowrap'}}>{fmtDate(o.orderDate)}</td>
                    <td>
                      <div style={{display:'flex',gap:4}}>
                        <button className="btn btn-ghost btn-sm" onClick={()=>setModal(o)} style={{fontSize:11,padding:'4px 10px',color:'var(--accent)',borderColor:'rgba(99,102,241,.2)'}}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={()=>setDel(o._id||o.id)} style={{fontSize:11,padding:'4px 10px'}}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pages>1&&(
              <div style={{padding:'10px 16px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#f8fafc'}}>
                <span style={{fontSize:12,color:'var(--t3)'}}>
                  Showing {page*pageSize+1}–{Math.min((page+1)*pageSize,filtered.length)} of {filtered.length}
                </span>
                <div style={{display:'flex',gap:4}}>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setPage(0)} disabled={page===0}>«</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>‹</button>
                  {Array.from({length:Math.min(5,pages)}).map((_,i)=>{
                    const pg=Math.max(0,Math.min(page-2,pages-5))+i;
                    return <button key={pg} className="btn btn-ghost btn-sm" onClick={()=>setPage(pg)} style={{background:pg===page?'var(--accent)':'',color:pg===page?'#fff':'',borderColor:pg===page?'var(--accent)':''}}>{pg+1}</button>;
                  })}
                  <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}>›</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setPage(pages-1)} disabled={page===pages-1}>»</button>
                </div>
              </div>
            )}
          </div>
        )}
        </>)}
      </div>

      {modal&&<OrderModal order={modal!=='new'?modal:null} onClose={()=>setModal(null)} onSave={handleSave}/>}
      {del&&(
        <div className="overlay">
          <div className="modal modal-sm scale-in">
            <div className="modal-hd"><h2>Delete Order</h2><button className="btn-icon" onClick={()=>setDel(null)}>✕</button></div>
            <div className="modal-body"><p style={{color:'var(--t2)',fontSize:14,lineHeight:1.7}}>Are you sure you want to delete this order? This cannot be undone.</p></div>
            <div className="modal-ft">
              <button className="btn btn-ghost" onClick={()=>setDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={()=>handleDel(del)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
