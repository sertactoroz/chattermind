const API_BASE = process.env.NEXT_PUBLIC_API_URL
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '');

type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: { message: string; status: number };
  timestamp: string;
};

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

function clearToken(): void {
  localStorage.removeItem('auth_token');
}

function getGuestId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('guest_user_id');
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE) {
    throw new Error('Backend API is not configured. Set NEXT_PUBLIC_API_URL.');
  }

  const url = `${API_BASE}${path}`;

  const resp = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!resp.ok) {
    let errorMessage = `Request failed: ${resp.status}`;
    try {
      const body = await resp.json() as ApiResult<unknown>;
      if (body.error?.message) {
        errorMessage = body.error.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  const raw = await resp.json() as ApiResult<T>;
  return (raw.data ?? raw) as T;
}

function mapSender(sender: string): 'user' | 'ai' {
  return sender === 'USER' ? 'user' : 'ai';
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),

  getToken,
  setToken,
  clearToken,
  getGuestId,
  getBaseUrl: () => API_BASE,
  mapSender,
};
