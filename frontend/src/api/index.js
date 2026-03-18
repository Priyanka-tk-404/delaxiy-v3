const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const tk = () => localStorage.getItem('dlx_token');

async function req(path, opts = {}) {
  const token = tk();
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

export const authApi = {
  register: d => req('/auth/register', { method:'POST', body:JSON.stringify(d) }),
  login:    d => req('/auth/login',    { method:'POST', body:JSON.stringify(d) }),
  me:       () => req('/auth/me'),
};
export const ordersApi = {
  getAll:  ()      => req('/orders'),
  create:  d       => req('/orders',       { method:'POST',   body:JSON.stringify(d) }),
  update:  (id, d) => req(`/orders/${id}`, { method:'PUT',    body:JSON.stringify(d) }),
  remove:  id      => req(`/orders/${id}`, { method:'DELETE' }),
};
export const dashApi = {
  get:  ()  => req('/dashboard'),
  save: d   => req('/dashboard', { method:'PUT', body:JSON.stringify(d) }),
};
