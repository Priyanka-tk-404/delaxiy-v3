import React, { useState, useEffect, useCallback, memo } from 'react';
import { PRODUCTS, UNIT_PRICES, STATUSES } from '../../utils/constants';

const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
const CREATORS   = ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin'];
const PHONE_CODES = [
  {code:'+91',flag:'🇮🇳',name:'IND'},{code:'+1',flag:'🇺🇸',name:'USA'},
  {code:'+44',flag:'🇬🇧',name:'GBR'},{code:'+61',flag:'🇦🇺',name:'AUS'},
  {code:'+65',flag:'🇸🇬',name:'SGP'},{code:'+81',flag:'🇯🇵',name:'JPN'},
  {code:'+82',flag:'🇰🇷',name:'KOR'},{code:'+86',flag:'🇨🇳',name:'CHN'},
  {code:'+49',flag:'🇩🇪',name:'DEU'},{code:'+33',flag:'🇫🇷',name:'FRA'},
  {code:'+39',flag:'🇮🇹',name:'ITA'},{code:'+34',flag:'🇪🇸',name:'ESP'},
  {code:'+966',flag:'🇸🇦',name:'SAU'},{code:'+971',flag:'🇦🇪',name:'ARE'},
  {code:'+20',flag:'🇪🇬',name:'EGY'},{code:'+27',flag:'🇿🇦',name:'ZAF'},
  {code:'+55',flag:'🇧🇷',name:'BRA'},{code:'+52',flag:'🇲🇽',name:'MEX'},
  {code:'+60',flag:'🇲🇾',name:'MYS'},{code:'+62',flag:'🇮🇩',name:'IDN'},
  {code:'+63',flag:'🇵🇭',name:'PHL'},{code:'+66',flag:'🇹🇭',name:'THA'},
  {code:'+92',flag:'🇵🇰',name:'PAK'},{code:'+880',flag:'🇧🇩',name:'BGD'},
];

/* ── Static styles ───────────────────────────────────────────────────────── */
const IN  = {background:'#fff',border:'1.5px solid #cbd5e1',borderRadius:'8px',padding:'10px 13px',color:'#1e293b',fontFamily:'inherit',fontSize:'13px',width:'100%',outline:'none',boxSizing:'border-box'};
const IE  = {...IN, border:'1.5px solid #f43f5e'};
const SL  = {...IN, cursor:'pointer'};
const onF = e => { e.target.style.borderColor='#6366f1'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,.1)'; };
const onB = e => { e.target.style.borderColor='#cbd5e1'; e.target.style.boxShadow='none'; };

function useIsMobile() {
  const [m, setM] = React.useState(window.innerWidth <= 768);
  React.useEffect(() => {
    const h = () => setM(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return m;
}

function ErrMsg({ msg }) {
  if (!msg) return null;
  return <span style={{fontSize:'11px',color:'#f43f5e',display:'flex',alignItems:'center',gap:3,marginTop:3,fontWeight:500}}><span style={{fontSize:9}}>●</span>{msg}</span>;
}

/* ── Memoised field components ───────────────────────────────────────────── */
const TF = memo(function TF({ label, placeholder, value, onChange, hasErr, autoComplete, full, isMobile }) {
  return (
    <div style={full ? {gridColumn:'1/-1'} : {}}>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
        {label} <span style={{color:'#f43f5e'}}>*</span>
      </label>
      <input type="text" placeholder={placeholder} value={value}
        autoComplete={autoComplete||'off'}
        style={hasErr ? IE : IN}
        onFocus={onF} onBlur={onB} onChange={onChange}/>
      {hasErr && <ErrMsg msg="Please fill the field"/>}
    </div>
  );
});

const SF = memo(function SF({ label, value, onChange, children, full }) {
  return (
    <div style={full ? {gridColumn:'1/-1'} : {}}>
      <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
        {label} <span style={{color:'#f43f5e'}}>*</span>
      </label>
      <select value={value} onChange={onChange} style={SL} onFocus={onF} onBlur={onB}>
        {children}
      </select>
    </div>
  );
});

export default function OrderModal({ order, onClose, onSave }) {
  const isEdit   = !!order;
  const isMobile = useIsMobile();

  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [dialCode,   setDialCode]   = useState('+91');
  const [street,     setStreet]     = useState('');
  const [city,       setCity]       = useState('');
  const [stateVal,   setStateVal]   = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country,    setCountry]    = useState('United States');
  const [product,    setProduct]    = useState('Fiber Internet 300 Mbps');
  const [qty,        setQty]        = useState(1);
  const [unitPrice,  setUnitPrice]  = useState(UNIT_PRICES['Fiber Internet 300 Mbps']);
  const [status,     setStatus]     = useState('Pending');
  const [createdBy,  setCreatedBy]  = useState('Mr. Michael Harris');
  const [errs,       setErrs]       = useState({});
  const [saving,     setSaving]     = useState(false);

  useEffect(() => {
    if (!order) return;
    const o = order;
    let dc = '+91', ph = o.phone || '';
    const m = PHONE_CODES.find(p => ph.startsWith(p.code+' '));
    if (m) { dc = m.code; ph = ph.replace(m.code+' ',''); }
    setFirstName(o.firstName||''); setLastName(o.lastName||'');
    setEmail(o.email||''); setPhone(ph); setDialCode(dc);
    setStreet(o.street||''); setCity(o.city||'');
    setStateVal(o.state||''); setPostalCode(o.postalCode||'');
    setCountry(o.country||'United States');
    setProduct(o.product||'Fiber Internet 300 Mbps');
    setQty(o.quantity||1);
    setUnitPrice(o.unitPrice||UNIT_PRICES['Fiber Internet 300 Mbps']);
    setStatus(o.status||'Pending');
    setCreatedBy(o.createdBy||'Mr. Michael Harris');
  }, []); // eslint-disable-line

  const clr = k => () => setErrs(p => ({...p,[k]:''}));
  const onFN  = useCallback(e => { setFirstName(e.target.value);  clr('firstName')(); }, []); // eslint-disable-line
  const onLN  = useCallback(e => { setLastName(e.target.value);   clr('lastName')(); },  []); // eslint-disable-line
  const onEM  = useCallback(e => { setEmail(e.target.value);      clr('email')(); },     []); // eslint-disable-line
  const onPH  = useCallback(e => { setPhone(e.target.value);      clr('phone')(); },     []); // eslint-disable-line
  const onST  = useCallback(e => { setStreet(e.target.value);     clr('street')(); },    []); // eslint-disable-line
  const onCI  = useCallback(e => { setCity(e.target.value);       clr('city')(); },      []); // eslint-disable-line
  const onSV  = useCallback(e => { setStateVal(e.target.value);   clr('stateVal')(); },  []); // eslint-disable-line
  const onPC  = useCallback(e => { setPostalCode(e.target.value); clr('postalCode')(); },[]); // eslint-disable-line

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName='err'; if (!lastName.trim()) e.lastName='err';
    if (!email.trim()) e.email='err';
    else if (!/^[^@]+@[^@]+\.[^@]{2,}$/.test(email)) e.email='invalid';
    if (!phone.trim()) e.phone='err';
    if (!street.trim()) e.street='err'; if (!city.trim()) e.city='err';
    if (!stateVal.trim()) e.stateVal='err'; if (!postalCode.trim()) e.postalCode='err';
    return e;
  }

  async function submit(e) {
    e.preventDefault();
    const ev = validate();
    if (Object.keys(ev).length) { setErrs(ev); return; }
    setSaving(true);
    try {
      await onSave({ firstName, lastName, email, phone:(dialCode+' '+phone).trim(),
        street, city, state:stateVal, postalCode, country, product,
        quantity:qty, unitPrice, totalAmount:qty*unitPrice, status, createdBy });
      onClose();
    } catch(err) { setErrs({_:err.message}); }
    finally { setSaving(false); }
  }

  const onProd = useCallback(e => { const p=e.target.value; setProduct(p); setUnitPrice(UNIT_PRICES[p]||0); }, []);

  /* ── Grid: 2 cols on desktop, 1 col on mobile ── */
  const grid = (cols) => ({
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : cols || '1fr 1fr',
    gap: isMobile ? 12 : 14,
  });

  const sectionTitle = {
    fontSize: 11, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '.08em',
    marginBottom: isMobile ? 10 : 12, marginTop: 4,
    paddingBottom: 8, borderBottom: '1px solid #f1f5f9',
  };

  return (
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal modal-xl" onClick={e=>e.stopPropagation()} style={{
        maxHeight: isMobile ? '100dvh' : '90vh',
        height: isMobile ? '100dvh' : 'auto',
        margin: isMobile ? 0 : 'auto',
        borderRadius: isMobile ? 0 : undefined,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Header ── */}
        <div style={{height:3,background:'linear-gradient(90deg,#10b981,#06b6d4,#6366f1)',borderRadius:isMobile?0:'var(--r3) var(--r3) 0 0',flexShrink:0}}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:isMobile?'14px 16px':'16px 24px',borderBottom:'1px solid #f1f5f9',flexShrink:0}}>
          <div>
            <h2 style={{fontSize:isMobile?16:18,fontWeight:700,color:'#1e293b',fontFamily:'var(--ff-h)'}}>{isEdit?'Edit Order':'Create Order'}</h2>
            <p style={{fontSize:11,color:'#94a3b8',marginTop:2}}>All fields marked * are mandatory</p>
          </div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,background:'#f1f5f9',border:'none',fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#64748b',flexShrink:0}}>✕</button>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:isMobile?'16px':'20px 24px'}}>
          {errs._ && <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:8,padding:'10px 14px',color:'#f43f5e',fontSize:13,marginBottom:14}}>{errs._}</div>}

          {/* ══ CUSTOMER INFORMATION ══ */}
          <div style={sectionTitle}>Customer Information</div>
          <div style={grid()}>
            <TF label="First Name"       placeholder="First name"           value={firstName}  onChange={onFN}  hasErr={!!errs.firstName}  autoComplete="given-name"    isMobile={isMobile}/>
            <TF label="Last Name"        placeholder="Last name"            value={lastName}   onChange={onLN}  hasErr={!!errs.lastName}   autoComplete="family-name"   isMobile={isMobile}/>
            <TF label="Email ID"         placeholder="email@example.com"    value={email}      onChange={onEM}  hasErr={!!errs.email}      autoComplete="email"         isMobile={isMobile}/>

            {/* Phone */}
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
                Phone Number <span style={{color:'#f43f5e'}}>*</span>
              </label>
              <div style={{display:'flex',border:`1.5px solid ${errs.phone?'#f43f5e':'#cbd5e1'}`,borderRadius:'8px',overflow:'hidden',background:'#fff'}}
                onFocusCapture={e=>{e.currentTarget.style.borderColor='#6366f1';e.currentTarget.style.boxShadow='0 0 0 3px rgba(99,102,241,.1)';}}
                onBlurCapture={e=>{e.currentTarget.style.borderColor='#cbd5e1';e.currentTarget.style.boxShadow='none';}}>
                <select value={dialCode} onChange={e=>setDialCode(e.target.value)}
                  style={{border:'none',outline:'none',background:'#f8fafc',borderRight:'1px solid #e2e8f0',padding:'10px 6px',fontFamily:'inherit',fontSize:'12px',color:'#1e293b',cursor:'pointer',flexShrink:0,minWidth:isMobile?80:90,fontWeight:600}}>
                  {PHONE_CODES.map((p,i)=><option key={i} value={p.code}>{p.flag} {p.code} {p.name}</option>)}
                </select>
                <input type="tel" placeholder="9876543210" value={phone} onChange={onPH}
                  style={{flex:1,border:'none',outline:'none',padding:'10px 12px',fontFamily:'inherit',fontSize:'13px',color:'#1e293b',background:'transparent',minWidth:0}}/>
              </div>
              {errs.phone && <ErrMsg msg="Please fill the field"/>}
            </div>

            <TF label="Street Address"   placeholder="123 Main Street, Area" value={street}    onChange={onST}  hasErr={!!errs.street}    autoComplete="street-address" full isMobile={isMobile}/>
            <TF label="City"             placeholder="City"                   value={city}      onChange={onCI}  hasErr={!!errs.city}       isMobile={isMobile}/>
            <TF label="State / Province" placeholder="State"                  value={stateVal}  onChange={onSV}  hasErr={!!errs.stateVal}   isMobile={isMobile}/>
            <TF label="Postal Code"      placeholder="600001"                 value={postalCode}onChange={onPC}  hasErr={!!errs.postalCode}  isMobile={isMobile}/>

            <SF label="Country" value={country} onChange={e=>setCountry(e.target.value)}>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </SF>
          </div>

          {/* ══ ORDER INFORMATION ══ */}
          <div style={{...sectionTitle, marginTop:20}}>Order Information</div>
          <div style={grid()}>
            <SF label="Choose Product" value={product} onChange={onProd} full={!isMobile}>
              {PRODUCTS.map(p=><option key={p} value={p}>{p}</option>)}
            </SF>

            {/* Quantity */}
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
                Quantity <span style={{color:'#f43f5e'}}>*</span>
              </label>
              <div style={{display:'flex',alignItems:'center',border:'1.5px solid #cbd5e1',borderRadius:'8px',overflow:'hidden',background:'#fff',height:42}}>
                <button type="button" onClick={()=>setQty(q=>Math.max(1,q-1))}
                  style={{width:44,height:'100%',background:'#f8fafc',border:'none',borderRight:'1px solid #e2e8f0',cursor:'pointer',fontSize:20,fontWeight:600,color:'#1e293b',flexShrink:0,userSelect:'none'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#e2e8f0'}
                  onMouseLeave={e=>e.currentTarget.style.background='#f8fafc'}>−</button>
                <input type="number" min="1" value={qty}
                  onChange={e=>setQty(Math.max(1,parseInt(e.target.value,10)||1))}
                  style={{flex:1,border:'none',outline:'none',textAlign:'center',fontWeight:800,fontSize:16,fontFamily:'inherit',color:'#1e293b',background:'transparent'}}/>
                <button type="button" onClick={()=>setQty(q=>q+1)}
                  style={{width:44,height:'100%',background:'#f8fafc',border:'none',borderLeft:'1px solid #e2e8f0',cursor:'pointer',fontSize:20,fontWeight:600,color:'#1e293b',flexShrink:0,userSelect:'none'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#e2e8f0'}
                  onMouseLeave={e=>e.currentTarget.style.background='#f8fafc'}>+</button>
              </div>
            </div>

            {/* Unit Price */}
            <div>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
                Unit Price ($) <span style={{color:'#f43f5e'}}>*</span>
              </label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#94a3b8',fontSize:13,fontWeight:600,pointerEvents:'none'}}>$</span>
                <input type="number" min="0" value={unitPrice}
                  onChange={e=>setUnitPrice(Math.max(0,parseFloat(e.target.value)||0))}
                  onFocus={onF} onBlur={onB}
                  style={{...IN,paddingLeft:26,fontSize:14,fontWeight:600}}/>
              </div>
            </div>

            {/* Total Amount */}
            <div style={isMobile ? {} : {gridColumn:'1/-1'}}>
              <label style={{display:'block',fontSize:'11px',fontWeight:700,color:'#64748b',marginBottom:5,textTransform:'uppercase',letterSpacing:'.04em'}}>
                Total Amount (Auto)
              </label>
              <div style={{background:'#f0fdf4',border:'1.5px solid #86efac',borderRadius:'8px',padding:'10px 16px',display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:15,color:'#10b981',fontWeight:600}}>$</span>
                <span style={{fontSize:isMobile?16:20,fontWeight:800,fontFamily:'var(--ff-h)',color:'#10b981'}}>{(qty*unitPrice).toLocaleString('en-US',{minimumFractionDigits:2})}</span>
                <span style={{fontSize:11,color:'#86efac',marginLeft:4}}>{qty} × ${unitPrice.toLocaleString('en-US')}</span>
              </div>
            </div>

            <SF label="Status" value={status} onChange={e=>setStatus(e.target.value)}>
              {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
            </SF>

            <SF label="Created By" value={createdBy} onChange={e=>setCreatedBy(e.target.value)}>
              {CREATORS.map(c=><option key={c} value={c}>{c}</option>)}
            </SF>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{display:'flex',gap:10,justifyContent:'flex-end',padding:isMobile?'14px 16px':'16px 24px',borderTop:'1px solid #f1f5f9',flexShrink:0,background:'#fff'}}>
          <button type="button" onClick={onClose}
            style={{padding:isMobile?'10px 20px':'9px 20px',borderRadius:8,border:'1.5px solid #e2e8f0',background:'#fff',color:'#64748b',fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer',flex:isMobile?1:0}}>
            Cancel
          </button>
          <button type="button" onClick={submit} disabled={saving}
            style={{padding:isMobile?'10px 20px':'9px 24px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#6366f1,#8b5cf6)',color:'#fff',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:saving?'not-allowed':'pointer',flex:isMobile?1:0,display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:saving?.7:1}}>
            {saving?<><span className="spinner" style={{borderTopColor:'#fff',width:14,height:14}}/>Saving…</>:isEdit?'Update Order':'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
