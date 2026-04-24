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
    const token = getToken();
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
  const session = getSession();
    return session;
}
function isLoggedIn() { return !!getCurrentUser(); }

/* -- TOKEN -- */
function getToken() {
    try { return JSON.parse(localStorage.getItem('asm_token') || 'null'); } catch { return null; }
}
function saveToken(token)
{
    localStorage.setItem('asm_token', JSON.stringify(token));
}
function clearToken() { localStorage.removeItem('asm_token'); }


/* ── REGISTER ── */
async function authRegister(username, password, email, phonenumber, firstname, lastname) {
    const base = (localStorage.getItem('apiBase') || `${window.location.origin}/api/v1`).replace(/\/$/, '');
    const res = await fetch(`${base}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, phonenumber, firstname, lastname }),
    });
    const data = await res.json().catch(() => null);

    const session = data.data;
    saveSession(session);
    return data;
}

/* ── LOGIN ── */
async function authLogin(username, password) {
    const base = (localStorage.getItem('apiBase') || `${window.location.origin}/api/v1`).replace(/\/$/, '');
    
    const res = await fetch(`${base}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data) throw new Error(data?.message || 'Неверные данные для входа');
    const token = data?.data?.token;
    if (!token) throw new Error('Токен не получен от сервера');
    saveToken(token);

    const queryUrl = `${base}/user/get-by-user-name?username=${encodeURIComponent(username)}`;

    const saveUserRes = await fetch(queryUrl, {
        method: 'GET', // Явно указываем метод GET
        headers: {
            'Authorization': `Bearer ${token}`, // Добавляем Bearer, если сервер этого требует
            'Accept': 'application/json',
        }
        // body: JSON.stringify({ username }) -- ЭТО НУЖНО УДАЛИТЬ!
    });

    const rows = await saveUserRes.json().catch(() => null);
    console.log('[LOGIN] save session:', JSON.stringify(rows));
    saveSession(rows);


    return data;
}

/* ── LOGOUT ── */
async function authLogout() {
  try {
      const accessToken = getToken();
      if (accessToken) {
        await fetch(`/api/v1/user/revoke-refresh-token`, {
            method: 'POST',
            headers: { 'Authorization': `${accessToken}` },
      });
    }
  } catch { /* ignore */ }
    clearSession();
    clearToken();
}

/* ── FETCH USER PROFILE ── */
async function fetchUserProfile() {
    const user = getCurrentUser();
    console.log('[fetchUserProfile] Current user from session:', user);
    console.log('[fetchUserProfile] UserName:', user.UserName);
    if (!user.UserName) return null;
    const token = getToken();
    console.log('[fetchUserProfile] Token:', token);
    const base = (localStorage.getItem('apiBase') || `${window.location.origin}/api/v1`).replace(/\/$/, '');
    console.log('[fetchUserProfile] API Base:', `${base}/user/get-by-user-name`);
    const res = await fetch(`${base}/user/get-by-user-name`, {
        headers: {
                'Authorization': `${token}`,
                'Accept': 'application/json',
        },
        body: JSON.stringify({ userName: user.UserName }),
    });
    const rows = await data.json().catch(() => []);
    console.log('[fetchUserProfile] rows:', JSON.stringify(rows));

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
