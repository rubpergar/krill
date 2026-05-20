export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IncidentPriority = 'low' | 'medium' | 'high' | 'critical';
export type IncidentCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'facilities'
  | 'other';

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  status: IncidentStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  category: IncidentCategory;
  priority: IncidentPriority;
}

export interface UpdateStatusDto {
  status: IncidentStatus;
}

export interface UpdatePriorityDto {
  priority: IncidentPriority;
}

export interface IncidentListFilters {
  status?: string[];
  priority?: string[];
  category?: string[];
  dateFrom?: string;
  dateTo?: string;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
