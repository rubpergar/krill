export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface Incident {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_by: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  pagination?: Pagination
}

export interface ApiError {
  error: string
}

export type PriorityFilter = 'low' | 'medium' | 'high' | 'critical' | ''
export type StatusFilter = 'open' | 'in_progress' | 'resolved' | 'closed' | ''
