// src/utils/constants.js
export const PRODUCTS = [
  'Fiber Internet 300 Mbps',
  '5G Unlimited Mobile Plan',
  'Fiber Internet 1 Gbps',
  'Business Internet 500 Mbps',
  'VoIP Corporate Package',
];
export const UNIT_PRICES = {
  'Fiber Internet 300 Mbps':   2999,
  '5G Unlimited Mobile Plan':  999,
  'Fiber Internet 1 Gbps':     4999,
  'Business Internet 500 Mbps':6999,
  'VoIP Corporate Package':    3499,
};
export const COUNTRIES   = ['United States','Canada','Australia','Singapore','Hong Kong'];
export const STATUSES    = ['Pending','In progress','Completed'];
export const CREATORS    = ['Mr. Michael Harris','Mr. Ryan Cooper','Ms. Olivia Carter','Mr. Lucas Martin'];
export const CHART_COLORS= ['#10b981','#6366f1','#06b6d4','#f59e0b','#f43f5e','#8b5cf6','#ec4899','#38bdf8'];

export const KPI_METRICS = [
  {key:'totalAmount', label:'Total Amount',  numeric:true},
  {key:'unitPrice',   label:'Unit Price',    numeric:true},
  {key:'quantity',    label:'Quantity',      numeric:true},
  {key:'status',      label:'Status',        numeric:false},
  {key:'product',     label:'Product',       numeric:false},
  {key:'createdBy',   label:'Created By',    numeric:false},
];
export const CHART_FIELDS = [
  {key:'product',     label:'Product'},
  {key:'quantity',    label:'Quantity'},
  {key:'unitPrice',   label:'Unit Price'},
  {key:'totalAmount', label:'Total Amount'},
  {key:'status',      label:'Status'},
  {key:'createdBy',   label:'Created By'},
];
export const TABLE_COLS = [
  {key:'customerId',  label:'Customer ID'},
  {key:'firstName',   label:'Customer Name'},
  {key:'email',       label:'Email ID'},
  {key:'phone',       label:'Phone Number'},
  {key:'street',      label:'Address'},
  {key:'orderId',     label:'Order ID'},
  {key:'orderDate',   label:'Order Date'},
  {key:'product',     label:'Product'},
  {key:'quantity',    label:'Quantity'},
  {key:'unitPrice',   label:'Unit Price'},
  {key:'totalAmount', label:'Total Amount'},
  {key:'status',      label:'Status'},
  {key:'createdBy',   label:'Created By'},
];

export function aggregate(orders, field, method) {
  const vals = orders.map(o => parseFloat(o[field])||0);
  if (!vals.length) return 0;
  switch(method) {
    case 'Sum':     return vals.reduce((a,b)=>a+b,0);
    case 'Average': return vals.reduce((a,b)=>a+b,0)/vals.length;
    case 'Count':   return orders.length;
    default:        return vals.reduce((a,b)=>a+b,0);
  }
}
export function groupBy(orders, field, valueField, method) {
  const groups = {};
  orders.forEach(o => {
    const k = String(o[field]||'N/A');
    if (!groups[k]) groups[k]=[];
    groups[k].push(o);
  });
  return Object.entries(groups)
    .map(([name,items])=>({name, value:parseFloat(aggregate(items,valueField,method).toFixed(2))}))
    .sort((a,b)=>b.value-a.value);
}
export function fmtINR(v) {
  return '₹' + Number(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
}
export function fmtNum(v, d=2) {
  return Number(v).toLocaleString('en-IN',{minimumFractionDigits:d,maximumFractionDigits:d});
}
export function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
}
