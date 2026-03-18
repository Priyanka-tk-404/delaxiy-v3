// src/components/modals/WidgetPanel.js
import React, { useState, useEffect } from 'react';
import { KPI_METRICS, CHART_FIELDS, TABLE_COLS, CHART_COLORS } from '../../utils/constants';

const WIDGET_TYPES = [
  { section:'Charts',  items:[
    {v:'bar',    l:'Bar Chart',   i:'▐'},
    {v:'line',   l:'Line Chart',  i:'∿'},
    {v:'pie',    l:'Pie Chart',   i:'◔'},
    {v:'area',   l:'Area Chart',  i:'◓'},
    {v:'scatter',l:'Scatter Plot',i:'⋰'},
  ]},
  { section:'Tables',  items:[{v:'table', l:'Table', i:'⊞'}]},
  { section:'KPIs',    items:[{v:'kpi',   l:'KPI Value', i:'◉'}]},
];
const ALL_TYPES = WIDGET_TYPES.flatMap(s=>s.items);

const DEFS = {
  kpi:     {title:'KPI Value',description:'',width:3,height:2,metric:'totalAmount',aggregation:'Sum',format:'Currency',decimals:0,color:'#10b981'},
  bar:     {title:'Bar Chart',  description:'',width:6,height:5,xField:'product',   yField:'totalAmount',aggregation:'Sum',chartColor:'#10b981',showLabel:false},
  line:    {title:'Line Chart', description:'',width:6,height:5,xField:'product',   yField:'totalAmount',aggregation:'Sum',chartColor:'#6366f1',showLabel:false},
  area:    {title:'Area Chart', description:'',width:6,height:5,xField:'product',   yField:'totalAmount',aggregation:'Sum',chartColor:'#06b6d4',showLabel:false},
  scatter: {title:'Scatter',    description:'',width:5,height:5,xField:'quantity',  yField:'totalAmount',chartColor:'#f59e0b',showLabel:false},
  pie:     {title:'Pie Chart',  description:'',width:4,height:5,dataField:'totalAmount', showLegend:true},
  table:   {title:'Orders Table',description:'',width:12,height:6,columns:['customerId','firstName','email','phone','street','orderId','orderDate'],sortBy:'',pagination:5},
};

const IS = {background:'#fff',border:'1.5px solid var(--border2)',borderRadius:'var(--r1)',padding:'9px 12px',color:'var(--t1)',fontFamily:'var(--ff-b)',fontSize:'13px',width:'100%',outline:'none'};
const SS = {...IS, cursor:'pointer'};

export default function WidgetPanel({ existing, onClose, onSave }) {
  const isEdit = !!existing;
  const [type, setType] = useState(existing?.type||'bar');
  const [cfg,  setCfg]  = useState({});

  useEffect(() => {
    if (existing) { setType(existing.type); setCfg({...existing}); }
    else setCfg({...DEFS[type]});
  }, []);// eslint-disable-line

  useEffect(() => { if (!existing) setCfg({...DEFS[type]}); }, [type]); // eslint-disable-line

  const set = (k,v) => setCfg(p=>({...p,[k]:v}));
  const toggleCol = col => setCfg(p=>({...p,columns:p.columns?.includes(col)?p.columns.filter(c=>c!==col):[...(p.columns||[]),col]}));

  return (
    <div className="side-panel">
      <div style={{height:3,background:'linear-gradient(90deg,#10b981,#6366f1)',flexShrink:0}}/>
      <div className="side-panel-hd">
        <div>
          <h3 style={{fontFamily:'var(--ff-h)',fontSize:15,fontWeight:700}}>{isEdit?'Edit Widget':'Add Widget'}</h3>
          <p style={{fontSize:11,color:'var(--t3)',marginTop:2}}>Configure widget settings</p>
        </div>
        <button className="btn-icon" onClick={onClose}>✕</button>
      </div>

      <div className="side-panel-body">
        {/* Type picker */}
        {!isEdit && WIDGET_TYPES.map(section=>(
          <div key={section.section}>
            <div className="section-title">{section.section}</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {section.items.map(t=>(
                <button key={t.v} onClick={()=>setType(t.v)} style={{
                  display:'flex',alignItems:'center',gap:10,padding:'9px 12px',
                  borderRadius:'var(--r1)',background:type===t.v?'rgba(16,185,129,.08)':'transparent',
                  border:`1px solid ${type===t.v?'rgba(16,185,129,.3)':'transparent'}`,
                  color:type===t.v?'var(--primary)':'var(--t2)',cursor:'pointer',
                  transition:'var(--t)',fontFamily:'var(--ff-b)',fontSize:13,fontWeight:type===t.v?600:400,
                  width:'100%',
                }}>
                  <span style={{fontSize:16,width:22}}>{t.i}</span>
                  <span>{t.l}</span>
                  {type===t.v && <span style={{marginLeft:'auto',fontSize:11}}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* General */}
        <div>
          <div className="section-title">General</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="form-group">
              <label className="form-label">Widget Title</label>
              <input style={IS} value={cfg.title||''} onChange={e=>set('title',e.target.value)} placeholder="Untitled"/>
            </div>
            <div className="form-group">
              <label className="form-label">Widget Type</label>
              <input style={{...IS,opacity:.6,cursor:'default'}} value={ALL_TYPES.find(t=>t.v===type)?.l||''} readOnly/>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea style={{...IS,resize:'vertical'}} rows={2} value={cfg.description||''} onChange={e=>set('description',e.target.value)} placeholder="Optional…"/>
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <div className="section-title">Widget Size</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div className="form-group"><label className="form-label">Width (Cols)</label><input style={IS} type="number" min="1" max="12" value={cfg.width||4} onChange={e=>set('width',Math.max(1,Number(e.target.value)))}/></div>
            <div className="form-group"><label className="form-label">Height (Rows)</label><input style={IS} type="number" min="1" value={cfg.height||4} onChange={e=>set('height',Math.max(1,Number(e.target.value)))}/></div>
          </div>
        </div>

        {/* KPI */}
        {type==='kpi'&&(
          <div>
            <div className="section-title">Data Settings</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div className="form-group"><label className="form-label">Select Metric</label><select style={SS} value={cfg.metric||'totalAmount'} onChange={e=>set('metric',e.target.value)}>{KPI_METRICS.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Aggregation</label><select style={SS} value={cfg.aggregation||'Sum'} onChange={e=>set('aggregation',e.target.value)}>{['Sum','Average','Count'].map(a=><option key={a}>{a}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Data Format</label><select style={SS} value={cfg.format||'Currency'} onChange={e=>set('format',e.target.value)}><option value="Currency">Currency (₹)</option><option value="Number">Number</option></select></div>
              <div className="form-group"><label className="form-label">Decimal Precision</label><input style={IS} type="number" min="0" value={cfg.decimals??0} onChange={e=>set('decimals',Math.max(0,Number(e.target.value)))}/></div>
              <div className="form-group">
                <label className="form-label">Accent Color</label>
                <div style={{display:'flex',gap:7,flexWrap:'wrap',paddingTop:4}}>
                  {CHART_COLORS.map(c=><button key={c} onClick={()=>set('color',c)} className={`swatch${cfg.color===c?' active':''}`} style={{background:c}}/>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {['bar','line','area','scatter'].includes(type)&&(
          <div>
            <div className="section-title">Data Settings</div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div className="form-group"><label className="form-label">X-Axis Data</label><select style={SS} value={cfg.xField||'product'} onChange={e=>set('xField',e.target.value)}>{CHART_FIELDS.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select></div>
              <div className="form-group"><label className="form-label">Y-Axis Data</label><select style={SS} value={cfg.yField||'totalAmount'} onChange={e=>set('yField',e.target.value)}>{CHART_FIELDS.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select></div>
              {type!=='scatter'&&<div className="form-group"><label className="form-label">Aggregation</label><select style={SS} value={cfg.aggregation||'Sum'} onChange={e=>set('aggregation',e.target.value)}>{['Sum','Average','Count'].map(a=><option key={a}>{a}</option>)}</select></div>}
              <div className="form-group">
                <label className="form-label">Chart Color</label>
                <div style={{display:'flex',gap:7,flexWrap:'wrap',paddingTop:4}}>
                  {CHART_COLORS.map(c=><button key={c} onClick={()=>set('chartColor',c)} className={`swatch${cfg.chartColor===c?' active':''}`} style={{background:c}}/>)}
                </div>
                <div style={{display:'flex',gap:8,marginTop:8,alignItems:'center'}}>
                  <input type="color" value={cfg.chartColor||'#10b981'} onChange={e=>set('chartColor',e.target.value)} style={{width:32,height:28,border:'none',background:'none',cursor:'pointer'}}/>
                  <input style={{...IS,fontFamily:'monospace',fontSize:12}} value={cfg.chartColor||''} onChange={e=>set('chartColor',e.target.value)} placeholder="#10b981"/>
                </div>
              </div>
              <label className="check-row"><input type="checkbox" checked={!!cfg.showLabel} onChange={e=>set('showLabel',e.target.checked)}/>Show data labels</label>
            </div>
          </div>
        )}

        {/* Pie */}
        {type==='pie'&&(
          <div>
            <div className="section-title">Data Settings</div>
            <div className="form-group"><label className="form-label">Chart Data</label><select style={SS} value={cfg.dataField||'totalAmount'} onChange={e=>set('dataField',e.target.value)}>{CHART_FIELDS.map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select></div>
            <label className="check-row" style={{marginTop:8}}><input type="checkbox" checked={!!cfg.showLegend} onChange={e=>set('showLegend',e.target.checked)}/>Show Legend</label>
          </div>
        )}

        {/* Table */}
        {type==='table'&&(
          <div>
            <div className="section-title">Choose Columns</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {TABLE_COLS.map(c=>(
                <label key={c.key} className="check-row" style={{padding:'5px 8px',borderRadius:'var(--r1)',background:'var(--bg)',border:'1px solid var(--border)',margin:0,fontSize:12}}>
                  <input type="checkbox" checked={(cfg.columns||[]).includes(c.key)} onChange={()=>toggleCol(c.key)}/>
                  {c.label}
                </label>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:14}}>
              <div className="form-group"><label className="form-label">Sort By</label><select style={SS} value={cfg.sortBy||''} onChange={e=>set('sortBy',e.target.value)}><option value="">None</option><option value="asc">Ascending</option><option value="desc">Descending</option><option value="date">Order Date</option></select></div>
              <div className="form-group"><label className="form-label">Pagination</label><select style={SS} value={cfg.pagination||5} onChange={e=>set('pagination',Number(e.target.value))}>{[5,10,15].map(n=><option key={n} value={n}>{n} rows</option>)}</select></div>
            </div>
          </div>
        )}
      </div>

      <div className="side-panel-ft">
        <button className="btn btn-ghost" style={{flex:1}} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{flex:2,justifyContent:'center'}} onClick={()=>onSave({...cfg,type,id:existing?.id})}>
          {isEdit?'Update Widget':'Add Widget'}
        </button>
      </div>
    </div>
  );
}
