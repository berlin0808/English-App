// =====================================================
// Supabase Configuration, Auth & REST Client
// =====================================================
// Uses the Supabase REST + Auth (GoTrue) APIs directly via fetch (no library).
// The anon key is a PUBLIC key — safe to include in frontend code.
// Row Level Security (RLS) on the database keeps each user's data private.

const SUPABASE_URL = 'https://mzxynyhynyoqodtwqizf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16eHlueWh5bnlvcW9kdHdxaXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjUxNDgsImV4cCI6MjEwNDAwMTE0OH0.QwtQZTnhKGv9AC2-Phdk1cWzi_xTZ2eXGC8WBOScngw';

const SESSION_KEY = 'vocab_supabase_session';

// =====================================================
// Auth (GoTrue REST)
// =====================================================
const auth = {
    // Current session { access_token, refresh_token, user: { id, email } }
    _session: null,

    // Load a saved session from localStorage
    loadSession() {
        const raw = localStorage.getItem(SESSION_KEY);
        this._session = raw ? JSON.parse(raw) : null;
        return this._session;
    },

    saveSession(session) {
        this._session = session;
        if (session) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } else {
            localStorage.removeItem(SESSION_KEY);
        }
    },

    isLoggedIn() {
        return !!(this._session && this._session.access_token);
    },

    getUserId() {
        return this._session?.user?.id || null;
    },

    getEmail() {
        return this._session?.user?.email || null;
    },

    getAccessToken() {
        return this._session?.access_token || SUPABASE_ANON_KEY;
    },

    // Sign up a new account
    async signUp(email, password) {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || data.error || 'Sign up failed');
        // If "Confirm email" is OFF, signup returns a session directly
        if (data.access_token) {
            this.saveSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                user: data.user,
            });
            return { session: true, data };
        }
        // Otherwise the user must confirm their email first
        return { session: false, data };
    },

    // Log in with email + password
    async signIn(email, password) {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || data.error || 'Login failed');
        this.saveSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            user: data.user,
        });
        return data;
    },

    // Refresh an expired access token using the refresh token
    async refresh() {
        if (!this._session?.refresh_token) throw new Error('No refresh token');
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
            method: 'POST',
            headers: { 'apikey': SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this._session.refresh_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error('Session expired');
        this.saveSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            user: data.user,
        });
        return data;
    },

    // Change password for the currently logged-in user
    async updatePassword(newPassword) {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${this.getAccessToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || data.error_description || data.error || 'Failed to update password');
        return data;
    },

    // Log out
    async signOut() {
        try {
            await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${this.getAccessToken()}`,
                },
            });
        } catch (e) { /* ignore network errors on logout */ }
        this.saveSession(null);
    },
};

// Build request headers using the logged-in user's token (falls back to anon)
function sbHeaders(extra = {}) {
    return {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${auth.getAccessToken()}`,
        'Content-Type': 'application/json',
        ...extra,
    };
}

// =====================================================
// Data client (PostgREST) — token-aware, retries once on expiry
// =====================================================
async function sbFetch(url, options) {
    let res = await fetch(url, options);
    // If token expired (401), try to refresh once, then retry
    if (res.status === 401 && auth.isLoggedIn()) {
        try {
            await auth.refresh();
            options.headers = { ...options.headers, 'Authorization': `Bearer ${auth.getAccessToken()}` };
            res = await fetch(url, options);
        } catch (e) {
            // refresh failed — session is dead
            auth.saveSession(null);
            throw new Error('Your session expired. Please log in again.');
        }
    }
    return res;
}

const sb = {
    async select(table, query = '') {
        const url = `${SUPABASE_URL}/rest/v1/${table}?select=*${query}`;
        const res = await sbFetch(url, { headers: sbHeaders() });
        if (!res.ok) throw new Error(`Supabase select ${table} failed: ${res.status} ${await res.text()}`);
        return res.json();
    },

    async insert(table, row) {
        const url = `${SUPABASE_URL}/rest/v1/${table}`;
        const res = await sbFetch(url, {
            method: 'POST',
            headers: sbHeaders({ 'Prefer': 'return=representation' }),
            body: JSON.stringify(row),
        });
        if (!res.ok) throw new Error(`Supabase insert ${table} failed: ${res.status} ${await res.text()}`);
        return res.json();
    },

    async update(table, match, updates) {
        const filter = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
        const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;
        const res = await sbFetch(url, {
            method: 'PATCH',
            headers: sbHeaders({ 'Prefer': 'return=representation' }),
            body: JSON.stringify(updates),
        });
        if (!res.ok) throw new Error(`Supabase update ${table} failed: ${res.status} ${await res.text()}`);
        return res.json();
    },

    async remove(table, match) {
        const filter = Object.entries(match).map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`).join('&');
        const url = `${SUPABASE_URL}/rest/v1/${table}?${filter}`;
        const res = await sbFetch(url, { method: 'DELETE', headers: sbHeaders() });
        if (!res.ok) throw new Error(`Supabase delete ${table} failed: ${res.status} ${await res.text()}`);
        return true;
    },

    async upsert(table, row) {
        const url = `${SUPABASE_URL}/rest/v1/${table}`;
        const res = await sbFetch(url, {
            method: 'POST',
            headers: sbHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
            body: JSON.stringify(row),
        });
        if (!res.ok) throw new Error(`Supabase upsert ${table} failed: ${res.status} ${await res.text()}`);
        return res.json();
    },
};
