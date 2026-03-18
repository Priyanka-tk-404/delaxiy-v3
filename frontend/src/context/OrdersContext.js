import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { ordersApi } from '../api';
const Ctx = createContext(null);
const init = { orders:[], loading:false, error:null };

function r(s, a) {
  switch(a.type) {
    case 'LOAD': return {...s, loading:true};
    case 'SET':  return {...s, orders:a.p, loading:false};
    case 'ADD':  return {...s, orders:[a.p,...s.orders]};
    case 'UPD':  return {...s, orders:s.orders.map(o=>(o._id||o.id)===(a.p._id||a.p.id)?a.p:o)};
    case 'DEL':  return {...s, orders:s.orders.filter(o=>(o._id||o.id)!==a.p)};
    case 'ERR':  return {...s, error:a.p, loading:false};
    default: return s;
  }
}

export function OrdersProvider({ children }) {
  const [state, dispatch] = useReducer(r, init);
  const fetch = useCallback(async () => {
    dispatch({type:'LOAD'});
    try { dispatch({type:'SET', p: await ordersApi.getAll()}); }
    catch(e) { dispatch({type:'ERR', p:e.message}); }
  }, []);
  const create = useCallback(async d => { const o=await ordersApi.create(d); dispatch({type:'ADD',p:o}); return o; }, []);
  const update = useCallback(async (id,d) => { const o=await ordersApi.update(id,d); dispatch({type:'UPD',p:o}); return o; }, []);
  const remove = useCallback(async id => { await ordersApi.remove(id); dispatch({type:'DEL',p:id}); }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return <Ctx.Provider value={{...state, fetch, create, update, remove}}>{children}</Ctx.Provider>;
}
export const useOrders = () => useContext(Ctx);
