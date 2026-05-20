const BASE = '/api/v1';

class ApiError extends Error {
  code: string;
  statusCode: number;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok || !json.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
    }
    throw new ApiError(
      res.status,
      json.error?.code ?? 'UNKNOWN_ERROR',
      json.error?.message ?? 'Error desconocido',
    );
  }

  return json.data as T;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IncidentListData {
  incidents: Incident[];
  meta: PaginationMeta;
}

export function login(email: string, password: string): Promise<AuthData> {
  return request<AuthData>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(
  email: string,
  password: string,
  name: string,
): Promise<AuthData> {
  return request<AuthData>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

export function getMe(): Promise<{ user: User }> {
  return request<{ user: User }>('/auth/me');
}

export function getIncidents(
  params?: Record<string, string>,
): Promise<IncidentListData> {
  const qs = params ? `?${new URLSearchParams(params)}` : '';
  return request<IncidentListData>(`/incidents${qs}`);
}

export function createIncident(data: {
  title: string;
  description: string;
  category: string;
  priority: string;
}): Promise<{ incident: Incident }> {
  return request<{ incident: Incident }>('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
