// src/components/widgets/WidgetRenderer.js
import React, { useMemo, useState } from 'react';
import { BarChart,Bar,LineChart,Line,AreaChart,Area,ScatterChart,Scatter,PieChart,Pie,Cell,XAxis,YAxis,CartesianGrid,Tooltip,Legend,LabelList,ResponsiveContainer } from 'recharts';
import { useOrders } from '../../context/OrdersContext';
import { aggregate,groupBy,fmtINR,fmtNum,CHART_COLORS,TABLE_COLS } from '../../utils/constants';

const Tip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--r2)',padding:'10px 14px',fontSize:12,boxShadow:'0 4px 20px rgba(0,0,0,.12)'}}>
      {label&&<div style={{color:'var(--t3)',marginBottom:4,fontSize:11,fontWeight:600}}>{label}</div>}
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color||'var(--t1)',fontWeight:600}}>
          {p.name}: {typeof p.value==='number'?p.value.toLocaleString('en-IN',{maximumFractionDigits:2}):p.value}
        </div>
      ))}
    </div>
  );
};

function WH({cfg}) {
  return (
    <div style={{padding:'14px 18px 6px',flexShrink:0,borderBottom:'1px solid var(--border)'}}>
      <div style={{fontFamily:'var(--ff-h)',fontSize:13,fontWeight:700,color:'var(--t1)'}}>{cfg.title||'Untitled'}</div>
      {cfg.description&&<div style={{fontSize:11,color:'var(--t3)',marginTop:2}}>{cfg.description}</div>}
    </div>
  );
}

// KPI
function KPIWidget({cfg}) {
  const {orders}=useOrders();
  const val=useMemo(()=>aggregate(orders,cfg.metric||'totalAmount',cfg.aggregation||'Sum'),[orders,cfg]);
  const fmt=cfg.format==='Currency'?fmtINR(val):fmtNum(val,cfg.decimals??0);
  const c=cfg.color||'#10b981';
  const prev=val*0.88;
  const pct=((val-prev)/prev*100).toFixed(1);
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',padding:'18px 20px',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-20,right:-20,width:100,height:100,borderRadius:'50%',background:`${c}15`,pointerEvents:'none'}}/>
      <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--t3)',marginBottom:10}}>{cfg.title}</div>
      <div style={{fontSize:'clamp(22px,3vw,36px)',fontWeight:800,fontFamily:'var(--ff-h)',color:c,lineHeight:1,marginBottom:8}}>{fmt}</div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
        <span style={{fontSize:11,color:'#16a34a',fontWeight:600,background:'#f0fdf4',padding:'2px 8px',borderRadius:99}}>↑ {pct}%</span>
        <span style={{fontSize:11,color:'var(--t3)'}}>vs last period</span>
      </div>
      <div style={{height:3,background:'var(--border)',borderRadius:99,overflow:'hidden'}}>
        <div style={{height:'100%',width:'72%',background:c,borderRadius:99,transition:'width 1s ease'}}/>
      </div>
    </div>
  );
}

// BAR
function BarWidget({cfg}) {
  const {orders}=useOrders();
  const data=useMemo(()=>groupBy(orders,cfg.xField||'product',cfg.yField||'totalAmount',cfg.aggregation||'Sum').slice(0,10),[orders,cfg]);
  const c=cfg.chartColor||CHART_COLORS[0];
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,minHeight:0,padding:'8px 4px 4px'}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{top:4,right:8,left:0,bottom:28}} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false} angle={-25} textAnchor="end" interval={0}/>
            <YAxis tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Bar dataKey="value" fill={c} radius={[4,4,0,0]} name={cfg.yField} maxBarSize={48}>
              {cfg.showLabel&&<LabelList dataKey="value" position="top" style={{fill:c,fontSize:9,fontWeight:700}}/>}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// LINE
function LineWidget({cfg}) {
  const {orders}=useOrders();
  const data=useMemo(()=>groupBy(orders,cfg.xField||'product',cfg.yField||'totalAmount',cfg.aggregation||'Sum').slice(0,12),[orders,cfg]);
  const c=cfg.chartColor||CHART_COLORS[1];
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,minHeight:0,padding:'8px 4px 4px'}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{top:4,right:8,left:0,bottom:28}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false} angle={-25} textAnchor="end"/>
            <YAxis tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Line type="monotone" dataKey="value" stroke={c} strokeWidth={2.5} dot={{r:4,fill:c,strokeWidth:2,stroke:'#fff'}} activeDot={{r:6}} name={cfg.yField}>
              {cfg.showLabel&&<LabelList dataKey="value" position="top" style={{fill:c,fontSize:9}}/>}
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// AREA
function AreaWidget({cfg}) {
  const {orders}=useOrders();
  const data=useMemo(()=>groupBy(orders,cfg.xField||'product',cfg.yField||'totalAmount',cfg.aggregation||'Sum').slice(0,12),[orders,cfg]);
  const c=cfg.chartColor||CHART_COLORS[2];
  const gid=`ag${c.replace('#','')}`;
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,minHeight:0,padding:'8px 4px 4px'}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{top:4,right:8,left:0,bottom:28}}>
            <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={c} stopOpacity={0.25}/><stop offset="95%" stopColor={c} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="name" tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false} angle={-25} textAnchor="end"/>
            <YAxis tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Area type="monotone" dataKey="value" stroke={c} fill={`url(#${gid})`} strokeWidth={2.5} name={cfg.yField}>
              {cfg.showLabel&&<LabelList dataKey="value" position="top" style={{fill:c,fontSize:9}}/>}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// SCATTER
function ScatterWidget({cfg}) {
  const {orders}=useOrders();
  const data=useMemo(()=>orders.map(o=>({x:parseFloat(o[cfg.xField||'quantity'])||0,y:parseFloat(o[cfg.yField||'totalAmount'])||0})),[orders,cfg]);
  const c=cfg.chartColor||CHART_COLORS[3];
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,minHeight:0,padding:'8px 4px 4px'}}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{top:4,right:8,left:0,bottom:8}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
            <XAxis dataKey="x" tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false}/>
            <YAxis dataKey="y" tick={{fill:'var(--t3)',fontSize:10}} tickLine={false} axisLine={false}/>
            <Tooltip content={<Tip/>}/>
            <Scatter data={data} fill={c} fillOpacity={0.8}/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// PIE
function PieWidget({cfg}) {
  const {orders}=useOrders();
  const data=useMemo(()=>{
    const g={};
    orders.forEach(o=>{const k=String(o[cfg.dataField||'status']||'N/A');g[k]=(g[k]||0)+1;});
    return Object.entries(g).map(([name,value])=>({name,value}));
  },[orders,cfg]);
  const [active,setActive]=useState(null);
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,minHeight:0,padding:'4px'}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="68%" innerRadius="40%"
              onMouseEnter={(_,i)=>setActive(i)} onMouseLeave={()=>setActive(null)}
              stroke="#fff" strokeWidth={2}>
              {data.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]} opacity={active===null||active===i?1:.55}/>)}
            </Pie>
            <Tooltip content={<Tip/>}/>
            {cfg.showLegend&&<Legend wrapperStyle={{fontSize:11,color:'var(--t2)'}}/>}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// TABLE
function TableWidget({cfg}) {
  const {orders}=useOrders();
  const [page,setPage]=useState(0);
  const cols=cfg.columns?.length?cfg.columns:['customerId','firstName','email','phone','street','orderId','orderDate'];
  const pageSize=cfg.pagination||5;
  const LABELS=Object.fromEntries(TABLE_COLS.map(c=>[c.key,c.label]));
  let rows=[...orders];
  if(cfg.sortBy==='asc')  rows.sort((a,b)=>String(a[cols[0]]||'').localeCompare(String(b[cols[0]]||'')));
  if(cfg.sortBy==='desc') rows.sort((a,b)=>String(b[cols[0]]||'').localeCompare(String(a[cols[0]]||'')));
  if(cfg.sortBy==='date') rows.sort((a,b)=>new Date(b.orderDate)-new Date(a.orderDate));
  const pages=Math.ceil(rows.length/pageSize);
  const slice=rows.slice(page*pageSize,(page+1)*pageSize);
  function cell(row,col){
    if(col==='totalAmount'||col==='unitPrice') return <span style={{color:'var(--primary)',fontWeight:700}}>{fmtINR(row[col])}</span>;
    if(col==='status'){const m={'Pending':'badge-pending','In progress':'badge-inprogress','Completed':'badge-completed'};return <span className={`badge ${m[row[col]]||'badge-pending'}`}>{row[col]}</span>;}
    if(col==='orderDate') return <span style={{color:'var(--t2)',fontSize:12}}>{row[col]?new Date(row[col]).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}):'—'}</span>;
    if(col==='customerId'||col==='orderId') return <span style={{fontFamily:'monospace',fontSize:12,color:'var(--accent)',fontWeight:600}}>{row[col]||'—'}</span>;
    if(col==='firstName') return <span style={{fontWeight:500}}>{row.firstName} {row.lastName}</span>;
    return row[col]||'—';
  }
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <WH cfg={cfg}/>
      <div style={{flex:1,overflow:'auto'}}>
        <table>
          <thead><tr>{cols.map(c=><th key={c}>{LABELS[c]||c}</th>)}</tr></thead>
          <tbody>
            {slice.map((row,i)=><tr key={row._id||i}>{cols.map(c=><td key={c}>{cell(row,c)}</td>)}</tr>)}
            {!slice.length&&<tr><td colSpan={cols.length} style={{textAlign:'center',padding:28,color:'var(--t3)',fontSize:13}}>No data — create orders first</td></tr>}
          </tbody>
        </table>
      </div>
      {pages>1&&(
        <div style={{padding:'8px 14px',borderTop:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:12,flexShrink:0}}>
          <span style={{color:'var(--t3)'}}>Page {page+1}/{pages}</span>
          <div style={{display:'flex',gap:6}}>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0}>‹</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WidgetRenderer({widget}) {
  const MAP={kpi:KPIWidget,bar:BarWidget,line:LineWidget,area:AreaWidget,scatter:ScatterWidget,pie:PieWidget,table:TableWidget};
  const C=MAP[widget.type];
  if(!C) return <div style={{padding:20,color:'var(--t3)',fontSize:13}}>Unknown: {widget.type}</div>;
  return <C cfg={widget}/>;
}
