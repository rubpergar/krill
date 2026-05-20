import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from './auth-storage'

const BASE_URL = '/api/v1'

let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
      clearTokens()
      return false
    }
    const json = await res.json()
    setAccessToken(json.data.accessToken)
    setRefreshToken(json.data.refreshToken)
    return true
  } catch {
    clearTokens()
    return false
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { params?: Record<string, string> } = {},
): Promise<T> {
  const { params, ...fetchOptions } = options
  let url = `${BASE_URL}${path}`

  if (params) {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') search.set(k, v)
    })
    const qs = search.toString()
    if (qs) url += `?${qs}`
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  }

  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res = await fetch(url, { ...fetchOptions, headers })

  if (res.status === 401 && getRefreshToken()) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshPromise = refreshAccessToken().finally(() => {
        isRefreshing = false
        refreshPromise = null
      })
    }
    const refreshed = await refreshPromise
    if (refreshed) {
      const newToken = getAccessToken()
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(url, { ...fetchOptions, headers })
    } else {
      clearTokens()
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(errBody.error ?? 'Request failed')
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

export const api = {
  get: <T>(path: string, params?: Record<string, string>) =>
    request<T>(path, { method: 'GET', params }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
}
