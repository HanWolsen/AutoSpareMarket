/* ============================================================
   AUTH.JS — Shared Supabase Auth for Customer Storefront
   ============================================================ */

const SUPABASE_URL  = 'https://exvbhqoiqwyxbffzfemy.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dmJocW9pcXd5eGJmZnpmZW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MTg0OTgsImV4cCI6MjA5MjA5NDQ5OH0.AVJw1JbKz0SkvtBhjmIxAH7EeSoZnBFB1Zyg77dl0HI';

const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON,
  'Authorization': `Bearer ${SUPABASE_ANON}`,
};

async function sbFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: { ...SB_HEADERS, ...(options.headers || {}) },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error_description || json?.message || json?.error || `HTTP ${res.status}`);
  return json;
}

async function sbAuthFetch(path, options = {}) {
  const session = getSession();
  const token = session?.access_token || SUPABASE_ANON;
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    },
    ...options,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || json?.error || `HTTP ${res.status}`);
  return json;
}

/* ── SESSION ── */
function getSession() {
  try { return JSON.parse(localStorage.getItem('asm_session') || 'null'); } catch { return null; }
}
function saveSession(session) { localStorage.setItem('asm_session', JSON.stringify(session)); }
function clearSession() { localStorage.removeItem('asm_session'); }

function getCurrentUser() {
  const s = getSession();
  return s?.user || null;
}
function isLoggedIn() { return !!getCurrentUser(); }

/* ── REGISTER ── */
async function authRegister(username, email, password, firstName, lastName, phone) {
  const data = await sbFetch('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!data.user && !data.access_token) throw new Error('Ошибка регистрации');

  const session = data.session || data;
  saveSession(session);

  const userId = data.user?.id || session?.user?.id;
  if (userId) {
    const token = session?.access_token || SUPABASE_ANON;
    await fetch(`${SUPABASE_URL}/rest/v1/store_users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${token}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ id: userId, username, first_name: firstName, last_name: lastName, email, phone: phone || null }),
    });
  }
  return data;
}

/* ── LOGIN ── */
async function authLogin(email, password) {
  const data = await sbFetch('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveSession(data);
  return data;
}

/* ── LOGOUT ── */
async function authLogout() {
  try {
    const session = getSession();
    if (session?.access_token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: { ...SB_HEADERS, 'Authorization': `Bearer ${session.access_token}` },
      });
    }
  } catch { /* ignore */ }
  clearSession();
}

/* ── FETCH USER PROFILE ── */
async function fetchUserProfile() {
  const user = getCurrentUser();
  if (!user) return null;
  const session = getSession();
  const token = session?.access_token || SUPABASE_ANON;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/store_users?id=eq.${user.id}&select=*`, {
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${token}`,
    },
  });
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}


//[9] Заменить во всех местах, где используется SUPBASE на вызов нашего АПИ запроса
/* ── PRODUCT SPECS ── */
async function fetchProductSpecs(productId) {
  const res = await fetch(`/api/v1/products_images/${productId}`, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
  });
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) ? rows : [];
}

//[9] Заменить во всех местах, где используется SUPBASE на вызов нашего АПИ запроса

/* ── PRODUCT IMAGE ── */
async function fetchProductImage(productId) {
  const res = await fetch(`/api/v1/products_images/${productId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
  })
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0 ? rows[0].image_url : null;
}
