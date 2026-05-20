import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Incident, ApiResponse, PriorityFilter, StatusFilter } from '../types'

export function useAdminIncidents(
  page: number = 1,
  status?: StatusFilter,
  priority?: PriorityFilter,
  createdBy?: string,
) {
  return useQuery({
    queryKey: ['admin-incidents', page, status, priority, createdBy],
    queryFn: () => {
      const params: Record<string, string> = { page: String(page), limit: '10' }
      if (status) params.status = status
      if (priority) params.priority = priority
      if (createdBy) params.created_by = createdBy
      return api.get<ApiResponse<Incident[]>>('/admin/incidents', params)
    },
  })
}

export function useAdminIncident(id: string) {
  return useQuery({
    queryKey: ['admin-incident', id],
    queryFn: () => api.get<ApiResponse<{ incident: Incident }>>(`/admin/incidents/${id}`),
    enabled: !!id,
  })
}

export function useUpdateIncidentStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch<ApiResponse<{ incident: Incident }>>(`/admin/incidents/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-incidents'] })
    },
  })
}

export function useUpdateIncidentPriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: string }) =>
      api.patch<ApiResponse<{ incident: Incident }>>(`/admin/incidents/${id}/priority`, { priority }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-incidents'] })
    },
  })
}

export function useAssignIncident() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo?: string }) =>
      api.patch<ApiResponse<{ incident: Incident }>>(`/admin/incidents/${id}/assign`, { assignedTo }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-incidents'] })
    },
  })
}
