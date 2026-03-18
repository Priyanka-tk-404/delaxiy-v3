// src/pages/DashboardPage.js
import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboard } from '../context/DashboardContext';
import { useOrders }    from '../context/OrdersContext';
import { useToast }     from '../context/ToastContext';
import Topbar           from '../components/layout/Topbar';
import WidgetRenderer   from '../components/widgets/WidgetRenderer';
import WidgetPanel      from '../components/modals/WidgetPanel';
import { fmtINR }       from '../utils/constants';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const RGL  = WidthProvider(Responsive);
const BP   = {lg:1200, md:996, sm:768, xs:480};
const COLS = {lg:12,   md:8,   sm:6,   xs:4};

const WIDGET_LIBRARY = [
  { section:'Charts', items:[
    {type:'bar',    label:'Bar Chart',    icon:'▐', color:'#10b981'},
    {type:'line',   label:'Line Chart',   icon:'∿', color:'#6366f1'},
    {type:'pie',    label:'Pie Chart',    icon:'◔', color:'#f59e0b'},
    {type:'area',   label:'Area Chart',   icon:'◓', color:'#06b6d4'},
    {type:'scatter',label:'Scatter Plot', icon:'⋰', color:'#f43f5e'},
  ]},
  { section:'Tables',  items:[{type:'table', label:'Table',     icon:'⊞', color:'#8b5cf6'}]},
  { section:'KPIs',    items:[{type:'kpi',   label:'KPI Value', icon:'◉', color:'#ec4899'}]},
];

const STAT_CFG = [
  {label:'Total Revenue', calc:o=>o.reduce((s,x)=>s+(x.totalAmount||0),0), fmt:fmtINR,  color:'#10b981', icon:'₹', bg:'#f0fdf4'},
  {label:'Total Orders',  calc:o=>o.length,                                  fmt:v=>v,    color:'#6366f1', icon:'⊞', bg:'#eef2ff'},
  {label:'Completed',     calc:o=>o.filter(x=>x.status==='Completed').length, fmt:v=>v,   color:'#06b6d4', icon:'✓', bg:'#ecfeff'},
  {label:'In Progress',   calc:o=>o.filter(x=>x.status==='In progress').length,fmt:v=>v,  color:'#f59e0b', icon:'⟳', bg:'#fffbeb'},
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

export default function DashboardPage() {
  const {widgets,layouts,editMode,saved,addWidget,updateWidget,delWidget,setLayouts,toggleEdit,save} = useDashboard();
  const {orders}   = useOrders();
  const {add}      = useToast();
  const isMobile   = useIsMobile();
  const [panel,    setPanel]    = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [delId,    setDelId]    = useState(null);
  const [dateRange,setDateRange]= useState('All time');
  const [libOpen,  setLibOpen]  = useState(false);

  const handleLayout = useCallback((_,all) => setLayouts(all), [setLayouts]);

  async function handleSave() {
    setSaving(true);
    try { await save(); add('Dashboard saved!','success'); toggleEdit(); }
    catch { add('Save failed','error'); }
    finally { setSaving(false); }
  }

  function quickAdd(type) {
    addWidget({type, title: type.charAt(0).toUpperCase()+type.slice(1)+' Chart'});
    add('Widget added!','success');
    if (isMobile) setLibOpen(false);
  }

  // ── CONFIGURE MODE ────────────────────────────────────────────────────────
  if (editMode) {
    return (
      <div style={{display:'flex',flexDirection:'column',minHeight:'auto'}}>

        {/* Configure topbar — sticky on mobile */}
        <div style={{
          background:'#fff', borderBottom:'1px solid var(--border)',
          display:'flex', alignItems:'center', flexWrap:'wrap',
          padding:'10px 14px', gap:8, flexShrink:0,
          position: isMobile ? 'sticky' : 'relative',
          top: isMobile ? 52 : 'auto',
          zIndex: isMobile ? 90 : 'auto',
          boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,.06)' : 'none',
        }}>
          <button className="btn btn-ghost btn-sm" onClick={toggleEdit}>← Back</button>
          {!isMobile && <div style={{width:1,height:20,background:'var(--border)'}}/>}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,fontFamily:'var(--ff-h)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
              Configure dashboard
            </div>
          </div>
          <div style={{display:'flex',gap:6,marginLeft:'auto',flexShrink:0}}>
            {isMobile && (
              <button className="btn btn-ghost btn-sm" onClick={()=>setLibOpen(!libOpen)}>
                {libOpen ? '✕ Close' : '⊞ Widgets'}
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={toggleEdit}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving?<><span className="spinner"/>Saving…</>:'Save'}
            </button>
          </div>
        </div>

        {/* Mobile widget library — opens above canvas */}
        {isMobile && libOpen && (
          <div style={{
            background:'#fff', borderBottom:'1px solid var(--border)',
            padding:'12px 14px',
          }}>
            <div style={{fontSize:11,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:8}}>
              Tap a widget to add it to the canvas
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {WIDGET_LIBRARY.flatMap(s=>s.items).map(item=>(
                <button key={item.type} onClick={()=>quickAdd(item.type)}
                  style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5,padding:'10px 6px',borderRadius:'var(--r2)',background:`${item.color}10`,border:`1px solid ${item.color}30`,cursor:'pointer',fontFamily:'var(--ff-b)'}}>
                  <div style={{width:28,height:28,borderRadius:7,background:`${item.color}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:item.color}}>
                    {item.icon}
                  </div>
                  <span style={{fontSize:10,fontWeight:600,color:'var(--t1)',textAlign:'center',lineHeight:1.3}}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{display:'flex',flex:1,minHeight:0}}>
          {/* Desktop widget library sidebar */}
          {!isMobile && (
            <div style={{width:180,flexShrink:0,background:'#fff',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <div style={{padding:'12px 14px 10px',borderBottom:'1px solid var(--border)',flexShrink:0}}>
                <div style={{fontSize:11,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6}}>Show data for</div>
                <select value={dateRange} onChange={e=>setDateRange(e.target.value)}
                  style={{width:'100%',padding:'7px 10px',border:'1px solid var(--border2)',borderRadius:'var(--r1)',fontSize:12,color:'var(--t1)',background:'#fff',outline:'none',cursor:'pointer',fontFamily:'var(--ff-b)'}}>
                  {['All time','Today','This week','This month','This year'].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{flex:1,overflowY:'auto',padding:'10px 0'}}>
                <div style={{padding:'0 14px 4px',fontSize:11,fontWeight:700,color:'var(--t3)',textTransform:'uppercase',letterSpacing:'.06em'}}>Widget library</div>
                <div style={{padding:'0 14px',fontSize:11,color:'var(--t3)',marginBottom:8}}>Drag and drop to canvas</div>
                {WIDGET_LIBRARY.map(section=>(
                  <div key={section.section}>
                    <div style={{padding:'8px 14px 4px',fontSize:11,fontWeight:700,color:'var(--t2)'}}>{section.section}</div>
                    {section.items.map(item=>(
                      <button key={item.type} draggable onDragEnd={()=>quickAdd(item.type)} onClick={()=>setPanel({type:item.type,isNew:true})}
                        style={{display:'flex',alignItems:'center',gap:8,padding:'7px 14px',width:'100%',background:'transparent',border:'none',cursor:'grab',fontSize:12,color:'var(--t1)',fontFamily:'var(--ff-b)',transition:'background .15s',userSelect:'none'}}
                        onMouseEnter={e=>e.currentTarget.style.background='var(--bg)'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        <span style={{fontSize:8,color:'var(--t3)'}}>⠿</span>
                        <div style={{width:18,height:18,borderRadius:4,background:`${item.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,color:item.color}}>{item.icon}</div>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Canvas */}
          <div style={{flex:1,background:'var(--bg)',padding:isMobile?10:16,paddingTop:isMobile?70:16,overflowY:'auto',overflowX:'hidden',minHeight:isMobile?'60vh':0}}>
            {widgets.length === 0 ? (
              <div style={{display:'grid',gridTemplateColumns:`repeat(auto-fill,minmax(${isMobile?56:80}px,1fr))`,gap:6}}>
                {Array.from({length:isMobile?48:130}).map((_,i)=>(
                  <div key={i} style={{height:isMobile?22:32,background:'rgba(0,0,0,.04)',borderRadius:4}}/>
                ))}
              </div>
            ) : isMobile ? (
              /* Mobile configure: vertical stack with big edit/delete buttons */
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {widgets.map(w=>(
                  <div key={w.id} style={{background:'#fff',borderRadius:'var(--r2)',border:'2px solid rgba(99,102,241,.25)',overflow:'hidden',position:'relative'}}>
                    {/* Large accessible edit/delete bar at bottom */}
                    <div style={{background:'rgba(99,102,241,.06)',borderBottom:'1px solid rgba(99,102,241,.15)',padding:'8px 12px',display:'flex',gap:8,alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--t2)'}}>{w.title||'Widget'}</span>
                      <div style={{display:'flex',gap:8}}>
                        <button onClick={()=>setPanel(w)}
                          style={{background:'#6366f1',color:'#fff',border:'none',borderRadius:6,padding:'5px 12px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--ff-b)'}}>
                          ⚙ Edit
                        </button>
                        <button onClick={()=>setDelId(w.id)}
                          style={{background:'#fef2f2',color:'#f43f5e',border:'1px solid #fecaca',borderRadius:6,padding:'5px 12px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--ff-b)'}}>
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                    <div style={{height:260}}>
                      <WidgetRenderer widget={w}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <RGL layouts={layouts} breakpoints={BP} cols={COLS} rowHeight={60}
                isDraggable isResizable onLayoutChange={handleLayout}
                margin={[8,8]} containerPadding={[0,0]}>
                {widgets.map(w=>(
                  <div key={w.id} style={{background:'#fff',borderRadius:'var(--r2)',border:'2px solid rgba(99,102,241,.35)',overflow:'hidden',cursor:'grab',position:'relative'}}>
                    <div style={{position:'absolute',top:4,right:4,display:'flex',gap:3,zIndex:10}}>
                      <button className="btn-icon" style={{width:22,height:22,fontSize:10}} onClick={()=>setPanel(w)}>⚙</button>
                      <button className="btn-icon btn-icon-danger" style={{width:22,height:22,fontSize:10}} onClick={()=>setDelId(w.id)}>✕</button>
                    </div>
                    <WidgetRenderer widget={w}/>
                  </div>
                ))}
              </RGL>
            )}
          </div>
        </div>

        {/* Widget Panel */}
        {panel&&(
          <>
            <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.25)',zIndex:799}} onClick={()=>setPanel(null)}/>
            <WidgetPanel
              existing={panel.isNew?null:panel}
              onClose={()=>setPanel(null)}
              onSave={cfg=>{
                if(cfg.id){updateWidget(cfg);add('Widget updated','success');}
                else{addWidget(cfg);add('Widget added','success');}
                setPanel(null);
              }}
            />
          </>
        )}

        {delId&&(
          <div className="overlay">
            <div className="modal modal-sm">
              <div className="modal-hd"><h2>Remove Widget</h2><button className="btn-icon" onClick={()=>setDelId(null)}>✕</button></div>
              <div className="modal-body"><p style={{color:'var(--t2)',fontSize:14}}>Remove this widget from the dashboard?</p></div>
              <div className="modal-ft">
                <button className="btn btn-ghost" onClick={()=>setDelId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={()=>{delWidget(delId);setDelId(null);add('Widget removed','info');}}>Remove</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── VIEW MODE ─────────────────────────────────────────────────────────────
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'auto'}}>
      <Topbar
        title="Dashboard"
        subtitle={`${widgets.length} widget${widgets.length!==1?'s':''} · View mode${!saved?' · Unsaved changes':''}`}
        actions={
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {!saved&&<button className="btn btn-primary btn-sm" onClick={async()=>{setSaving(true);try{await save();add('Saved!','success');}finally{setSaving(false);}}} disabled={saving}>{saving?'Saving…':'Save'}</button>}
            <button className="btn btn-primary btn-sm" onClick={toggleEdit}>
              {isMobile ? '⚙ Config' : '⚙ Configure Dashboard'}
            </button>
          </div>
        }
      />

      <div style={{flex:1,padding:isMobile?10:20,paddingTop:isMobile?80:20,background:'var(--bg)'}}>
        {/* KPI Strip */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'1fr 1fr',
          gap: isMobile ? 8 : 12,
          marginBottom: isMobile ? 12 : 20,
        }}>
          {STAT_CFG.map((s,i)=>{
            const val=s.calc(orders);
            return (
              <div key={s.label} className={`card fade-up d${i+1}`}
                style={{padding:isMobile?'10px 12px':'16px 18px',display:'flex',alignItems:'center',gap:isMobile?8:14,minWidth:0,overflow:'hidden'}}>
                <div style={{width:isMobile?30:42,height:isMobile?30:42,borderRadius:10,background:s.bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile?14:18,color:s.color,flexShrink:0}}>{s.icon}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:isMobile?'12px':'clamp(14px,2vw,20px)',fontWeight:800,fontFamily:'var(--ff-h)',color:s.color,lineHeight:1.1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.fmt(val)}</div>
                  <div style={{fontSize:isMobile?9:11,color:'var(--t3)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em',marginTop:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Widget canvas */}
        {widgets.length===0?(
          <div className="card fade-in" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:isMobile?200:360,gap:14,borderStyle:'dashed',padding:24}}>
            <div style={{fontSize:40,opacity:.15}}>◈</div>
            <div style={{fontFamily:'var(--ff-h)',fontSize:16,fontWeight:700,color:'var(--t2)',textAlign:'center'}}>No widgets configured</div>
            <p style={{fontSize:13,color:'var(--t3)',textAlign:'center',maxWidth:300,lineHeight:1.7}}>
              Tap <strong>⚙ Config</strong> to add charts and KPI cards.
            </p>
            <button className="btn btn-primary btn-sm" onClick={toggleEdit}>⚙ Configure Dashboard</button>
          </div>
        ) : isMobile ? (
          /* Mobile: full-width vertical stack — no RGL overflow */
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {widgets.map(w=>(
              <div key={w.id} style={{background:'#fff',borderRadius:'var(--r2)',border:'1px solid var(--border)',overflow:'hidden',boxShadow:'var(--s1)',height:300}}>
                <WidgetRenderer widget={w}/>
              </div>
            ))}
          </div>
        ):(
          /* Desktop: react-grid-layout */
          <RGL layouts={layouts} breakpoints={BP} cols={COLS} rowHeight={60}
            isDraggable={false} isResizable={false}
            onLayoutChange={handleLayout} margin={[12,12]} containerPadding={[0,0]}>
            {widgets.map(w=>(
              <div key={w.id} style={{background:'#fff',borderRadius:'var(--r2)',border:'1px solid var(--border)',overflow:'hidden',boxShadow:'var(--s1)'}}>
                <WidgetRenderer widget={w}/>
              </div>
            ))}
          </RGL>
        )}
      </div>
    </div>
  );
}
