import { describe, expect, it } from 'vitest';
import { incidentRepository } from '../src/modules/incidents/incidents.repository.js';
import { incidentService } from '../src/modules/incidents/incidents.service.js';
import type {
  Incident,
  IncidentCategory,
  IncidentPriority,
  IncidentStatus,
} from '../src/modules/incidents/incidents.types.js';

const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  open: ['open', 'in_progress', 'resolved', 'closed'],
  in_progress: ['open', 'in_progress', 'resolved'],
  resolved: ['open', 'in_progress', 'resolved', 'closed'],
  closed: ['open', 'closed'],
};

function makeIncident(overrides: Partial<Incident> = {}): Incident {
  return {
    id: 'test-id',
    title: 'Test',
    description: 'Description',
    category: 'software',
    priority: 'medium',
    status: 'open',
    userId: 'user-1',
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    ...overrides,
  };
}

describe('VALID_TRANSITIONS', () => {
  const allStatuses: IncidentStatus[] = [
    'open',
    'in_progress',
    'resolved',
    'closed',
  ];

  it('should allow open → in_progress', () => {
    expect(VALID_TRANSITIONS.open).toContain('in_progress');
  });

  it('should allow open → resolved', () => {
    expect(VALID_TRANSITIONS.open).toContain('resolved');
  });

  it('should allow open → closed', () => {
    expect(VALID_TRANSITIONS.open).toContain('closed');
  });

  it('should allow in_progress → open', () => {
    expect(VALID_TRANSITIONS.in_progress).toContain('open');
  });

  it('should allow in_progress → resolved', () => {
    expect(VALID_TRANSITIONS.in_progress).toContain('resolved');
  });

  it('should reject in_progress → closed', () => {
    expect(VALID_TRANSITIONS.in_progress).not.toContain('closed');
  });

  it('should allow resolved → open', () => {
    expect(VALID_TRANSITIONS.resolved).toContain('open');
  });

  it('should allow resolved → closed', () => {
    expect(VALID_TRANSITIONS.resolved).toContain('closed');
  });

  it('should reject closed → in_progress', () => {
    expect(VALID_TRANSITIONS.closed).not.toContain('in_progress');
  });

  it('should reject closed → resolved', () => {
    expect(VALID_TRANSITIONS.closed).not.toContain('resolved');
  });

  it('should allow same-status transition (no-op) for all statuses', () => {
    for (const status of allStatuses) {
      expect(VALID_TRANSITIONS[status]).toContain(status);
    }
  });
});

describe('incidentService.updateStatus — state machine', () => {
  const userId = 'sm-user';

  it('should allow valid transition open → in_progress', () => {
    const inc = incidentService.create(
      {
        title: 'SM Test',
        description: 'Test',
        category: 'software',
        priority: 'low',
      },
      userId,
    );
    const updated = incidentService.updateStatus(
      inc.id,
      { status: 'in_progress' },
      userId,
      false,
    );
    expect(updated.status).toBe('in_progress');
  });

  it('should reject invalid transition in_progress → closed', () => {
    expect(() =>
      incidentService.updateStatus(
        'non-existent',
        { status: 'closed' },
        userId,
        false,
      ),
    ).toThrow();
  });

  it('should reject invalid transition open → invalid_status', () => {
    const inc = incidentService.create(
      {
        title: 'SM Invalid',
        description: 'Test',
        category: 'software',
        priority: 'low',
      },
      userId,
    );
    expect(() =>
      incidentService.updateStatus(
        inc.id,
        { status: 'invalid' as IncidentStatus },
        userId,
        false,
      ),
    ).toThrow();
  });
});

describe('incidentService — filtering', () => {
  const userId = 'filter-user';

  it('should filter by status', () => {
    const result = incidentService.listByUserFiltered(userId, {
      status: ['open'],
      page: 1,
      limit: 20,
    });
    for (const inc of result.incidents) {
      expect(inc.status).toBe('open');
    }
  });

  it('should filter by priority', () => {
    const result = incidentService.listByUserFiltered(userId, {
      priority: ['low'],
      page: 1,
      limit: 20,
    });
    for (const inc of result.incidents) {
      expect(inc.priority).toBe('low');
    }
  });

  it('should filter by category', () => {
    const result = incidentService.listByUserFiltered(userId, {
      category: ['software'],
      page: 1,
      limit: 20,
    });
    for (const inc of result.incidents) {
      expect(inc.category).toBe('software');
    }
  });

  it('should filter by dateFrom', () => {
    const result = incidentService.listByUserFiltered(userId, {
      dateFrom: '2026-07-01',
      page: 1,
      limit: 20,
    });
    for (const inc of result.incidents) {
      expect(inc.createdAt.getTime()).toBeGreaterThanOrEqual(
        new Date('2026-07-01').getTime(),
      );
    }
  });

  it('should filter by dateTo', () => {
    const result = incidentService.listByUserFiltered(userId, {
      dateTo: '2026-05-31',
      page: 1,
      limit: 20,
    });
    for (const inc of result.incidents) {
      expect(inc.createdAt.getTime()).toBeLessThanOrEqual(
        new Date('2026-05-31T23:59:59.999').getTime(),
      );
    }
  });

  it('should paginate results', () => {
    const all = incidentService.listByUserFiltered(userId, {
      page: 1,
      limit: 2,
    });
    expect(all.incidents.length).toBeLessThanOrEqual(2);
    expect(all.meta.total).toBeGreaterThanOrEqual(0);
    expect(all.meta.page).toBe(1);
    expect(all.meta.limit).toBe(2);
  });

  it('should return correct meta when no filters match', () => {
    const result = incidentService.listByUserFiltered(userId, {
      status: ['closed'],
      page: 1,
      limit: 10,
    });
    expect(result.incidents).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(result.meta.pages).toBe(1);
  });
});

describe('incidentService — admin filtering', () => {
  it('should return all incidents when no filters applied', () => {
    const result = incidentService.listAllFiltered({
      page: 1,
      limit: 100,
    });
    expect(result.meta.total).toBeGreaterThanOrEqual(1);
    expect(result.meta.page).toBe(1);
  });
});

describe('createIncident — trimming', () => {
  const userId = 'trim-user';

  it('should trim title', () => {
    const inc = incidentService.create(
      {
        title: '  Título con espacios  ',
        description: 'Descripción',
        category: 'software',
        priority: 'low',
      },
      userId,
    );
    expect(inc.title).toBe('Título con espacios');
  });

  it('should trim description', () => {
    const inc = incidentService.create(
      {
        title: 'Título',
        description: '  Descripción con espacios  ',
        category: 'network',
        priority: 'high',
      },
      userId,
    );
    expect(inc.description).toBe('Descripción con espacios');
  });
});

describe('createIncident — all category × priority combinations', () => {
  const userId = 'enum-user';
  const categories: IncidentCategory[] = [
    'hardware',
    'software',
    'network',
    'facilities',
    'other',
  ];
  const priorities: IncidentPriority[] = ['low', 'medium', 'high', 'critical'];

  for (const category of categories) {
    for (const priority of priorities) {
      it(`should create incident with category=${category} priority=${priority}`, () => {
        const inc = incidentService.create(
          {
            title: `Enum ${category} ${priority}`,
            description: 'Test',
            category,
            priority,
          },
          userId,
        );
        expect(inc.category).toBe(category);
        expect(inc.priority).toBe(priority);
      });
    }
  }
});
