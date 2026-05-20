import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Incident, ApiResponse, PriorityFilter, StatusFilter } from '../types'

export function useIncidents(page: number = 1, status?: StatusFilter, priority?: PriorityFilter) {
  return useQuery({
    queryKey: ['incidents', page, status, priority],
    queryFn: () => {
      const params: Record<string, string> = { page: String(page), limit: '10' }
      if (status) params.status = status
      if (priority) params.priority = priority
      return api.get<ApiResponse<Incident[]>>('/incidents', params)
    },
  })
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incident', id],
    queryFn: () => api.get<ApiResponse<{ incident: Incident }>>(`/incidents/${id}`),
    enabled: !!id,
  })
}

export function useCreateIncident() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { title: string; description: string; priority?: string }) =>
      api.post<ApiResponse<{ incident: Incident }>>('/incidents', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['incidents'] })
    },
  })
}
