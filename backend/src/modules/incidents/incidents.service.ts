import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/errors/app-error.js';
import { incidentRepository } from './incidents.repository.js';
import type {
  CreateIncidentDto,
  Incident,
  IncidentListFilters,
  IncidentStatus,
  PaginationMeta,
  UpdatePriorityDto,
  UpdateStatusDto,
} from './incidents.types.js';

const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  open: ['open', 'in_progress', 'resolved', 'closed'],
  in_progress: ['open', 'in_progress', 'resolved'],
  resolved: ['open', 'in_progress', 'resolved', 'closed'],
  closed: ['open', 'closed'],
};

function applyFiltersAndPaginate(
  incidents: Incident[],
  filters: IncidentListFilters,
): { incidents: Incident[]; meta: PaginationMeta } {
  let filtered = incidents;

  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(
      (i) => filters.status?.includes(i.status) ?? false,
    );
  }

  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter(
      (i) => filters.priority?.includes(i.priority) ?? false,
    );
  }

  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(
      (i) => filters.category?.includes(i.category) ?? false,
    );
  }

  if (filters.dateFrom) {
    const from = new Date(filters.dateFrom);
    filtered = filtered.filter((i) => i.createdAt >= from);
  }

  if (filters.dateTo) {
    const to = new Date(filters.dateTo);
    to.setHours(23, 59, 59, 999);
    filtered = filtered.filter((i) => i.createdAt <= to);
  }

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / filters.limit));
  const start = (filters.page - 1) * filters.limit;
  const paginated = filtered.slice(start, start + filters.limit);

  return {
    incidents: paginated,
    meta: {
      page: filters.page,
      limit: filters.limit,
      total,
      pages,
    },
  };
}

export const incidentService = {
  create(dto: CreateIncidentDto, userId: string): Incident {
    const now = new Date();
    const incident: Incident = {
      id: randomUUID(),
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      priority: dto.priority,
      status: 'open',
      userId,
      createdAt: now,
      updatedAt: now,
    };

    incidentRepository.save(incident);
    return incident;
  },

  getById(id: string, userId: string, isAdmin: boolean): Incident {
    const incident = incidentRepository.findById(id);
    if (!incident) {
      throw new AppError(404, 'NOT_FOUND', 'Incidencia no encontrada');
    }

    if (!isAdmin && incident.userId !== userId) {
      throw new AppError(404, 'NOT_FOUND', 'Incidencia no encontrada');
    }

    return incident;
  },

  listByUser(userId: string): Incident[] {
    return incidentRepository.findByUser(userId);
  },

  listByUserFiltered(
    userId: string,
    filters: IncidentListFilters,
  ): { incidents: Incident[]; meta: PaginationMeta } {
    return applyFiltersAndPaginate(
      incidentRepository.findByUser(userId),
      filters,
    );
  },

  updateStatus(
    id: string,
    dto: UpdateStatusDto,
    userId: string,
    isAdmin: boolean,
  ): Incident {
    const incident = this.getById(id, userId, isAdmin);
    const allowed = VALID_TRANSITIONS[incident.status];
    if (!allowed.includes(dto.status)) {
      throw new AppError(
        400,
        'INVALID_STATUS_TRANSITION',
        `No se puede cambiar de ${incident.status} a ${dto.status}`,
      );
    }
    incident.status = dto.status;
    incident.updatedAt = new Date();
    incidentRepository.update(incident);
    return incident;
  },

  updatePriority(
    id: string,
    dto: UpdatePriorityDto,
    userId: string,
    isAdmin: boolean,
  ): Incident {
    const incident = this.getById(id, userId, isAdmin);
    incident.priority = dto.priority;
    incident.updatedAt = new Date();
    incidentRepository.update(incident);
    return incident;
  },

  listAll(): Incident[] {
    return incidentRepository.findAll();
  },

  listAllFiltered(filters: IncidentListFilters): {
    incidents: Incident[];
    meta: PaginationMeta;
  } {
    return applyFiltersAndPaginate(incidentRepository.findAll(), filters);
  },
};
