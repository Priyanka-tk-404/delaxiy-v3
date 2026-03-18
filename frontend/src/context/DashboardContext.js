import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { dashApi } from '../api';
import { v4 as uuid } from 'uuid';
const Ctx = createContext(null);
const SIZES = { kpi:{w:2,h:2}, bar:{w:5,h:5}, line:{w:5,h:5}, area:{w:5,h:5}, scatter:{w:5,h:5}, pie:{w:4,h:4}, table:{w:4,h:4} };
const init = { widgets:[], layouts:{}, editMode:false, saved:true, loading:false };

function makeL(id, type) {
  const s = SIZES[type]||{w:4,h:4};
  return { i:id, x:0, y:Infinity, ...s, minW:1, minH:1 };
}

function r(s, a) {
  switch(a.type) {
    case 'LOAD':        return {...s, ...a.p, loading:false, saved:true};
    case 'SET_LOADING': return {...s, loading:a.p};
    case 'TOGGLE_EDIT': return {...s, editMode:!s.editMode};
    case 'SET_SAVED':   return {...s, saved:a.p};
    case 'ADD': {
      const id=uuid(); const l=makeL(id,a.p.type);
      const nl={}; ['lg','md','sm','xs'].forEach(bp=>{nl[bp]=[...(s.layouts[bp]||[]),{...l}];});
      return {...s, widgets:[...s.widgets,{...a.p,id}], layouts:nl, saved:false};
    }
    case 'UPD': return {...s, widgets:s.widgets.map(w=>w.id===a.p.id?{...w,...a.p}:w), saved:false};
    case 'DEL': {
      const nl={}; ['lg','md','sm','xs'].forEach(bp=>{nl[bp]=(s.layouts[bp]||[]).filter(l=>l.i!==a.p);});
      return {...s, widgets:s.widgets.filter(w=>w.id!==a.p), layouts:nl, saved:false};
    }
    case 'SET_LAYOUTS': return {...s, layouts:a.p, saved:false};
    default: return s;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(r, init);
  useEffect(() => {
    dispatch({type:'SET_LOADING',p:true});
    dashApi.get().then(d=>dispatch({type:'LOAD',p:d||{widgets:[],layouts:{}}})).catch(()=>dispatch({type:'SET_LOADING',p:false}));
  }, []);
  const addWidget    = useCallback(c  => dispatch({type:'ADD', p:c}), []);
  const updateWidget = useCallback(c  => dispatch({type:'UPD', p:c}), []);
  const delWidget    = useCallback(id => dispatch({type:'DEL', p:id}), []);
  const setLayouts   = useCallback(l  => dispatch({type:'SET_LAYOUTS', p:l}), []);
  const toggleEdit   = useCallback(()  => dispatch({type:'TOGGLE_EDIT'}), []);
  const save = useCallback(async () => {
    await dashApi.save({widgets:state.widgets, layouts:state.layouts});
    dispatch({type:'SET_SAVED', p:true});
  }, [state.widgets, state.layouts]);
  return <Ctx.Provider value={{...state, addWidget, updateWidget, delWidget, setLayouts, toggleEdit, save}}>{children}</Ctx.Provider>;
}
export const useDashboard = () => useContext(Ctx);
