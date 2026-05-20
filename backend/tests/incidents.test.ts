import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ADMIN_EMAIL = 'incidents-admin@test.com';
const ADMIN_PASSWORD = 'adminpass123';

process.env.ADMIN_EMAIL = ADMIN_EMAIL;
process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;

const { buildApp } = await import('../src/app.js');

let app: Awaited<ReturnType<typeof buildApp>>;
let userToken: string;
let secondUserToken: string;
let adminToken: string;
let incidentId: string;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();

  const userRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: { email: 'user@test.com', password: '123456', name: 'Test User' },
  });
  userToken = userRes.json().data.token;

  const sndRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/register',
    payload: {
      email: 'user2@test.com',
      password: '123456',
      name: 'Second User',
    },
  });
  secondUserToken = sndRes.json().data.token;

  const adminRes = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  adminToken = adminRes.json().data.token;

  const createRes = await app.inject({
    method: 'POST',
    url: '/api/v1/incidents',
    headers: { authorization: `Bearer ${userToken}` },
    payload: {
      title: 'PC no enciende',
      description: 'La PC del puesto 3 no responde',
      category: 'hardware',
      priority: 'high',
    },
  });
  incidentId = createRes.json().data.incident.id;
});

afterAll(async () => {
  await app.close();
});

describe('POST /api/v1/incidents', () => {
  it('should create an incident and return 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'Proyector fundido',
        description: 'El proyector de la sala A no enciende',
        category: 'hardware',
        priority: 'medium',
      },
    });

    expect(res.statusCode).toBe(201);
    const json = res.json();
    expect(json.ok).toBe(true);
    expect(json.data.incident.title).toBe('Proyector fundido');
    expect(json.data.incident.category).toBe('hardware');
    expect(json.data.incident.priority).toBe('medium');
    expect(json.data.incident.status).toBe('open');
    expect(json.data.incident.userId).toBeDefined();
    expect(json.data.incident.id).toBeDefined();
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      payload: {
        title: 'Test',
        description: 'Test',
        category: 'other',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 for invalid body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: { title: '', category: 'invalid', priority: 'urgent' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for title too short', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'AB',
        description: 'Descripción válida',
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for title too long', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'A'.repeat(201),
        description: 'Descripción válida',
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for description too long', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'Título válido',
        description: 'A'.repeat(2001),
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should accept title of exactly 3 chars', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'ABC',
        description: 'Descripción válida',
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(201);
  });

  it('should accept title of exactly 200 chars', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'A'.repeat(200),
        description: 'Descripción válida',
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(201);
  });

  it('should accept description of exactly 2000 chars', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        title: 'Título válido',
        description: 'A'.repeat(2000),
        category: 'software',
        priority: 'low',
      },
    });

    expect(res.statusCode).toBe(201);
  });
});

describe('GET /api/v1/incidents', () => {
  it('should return only own incidents', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.ok).toBe(true);
    expect(json.data.incidents.length).toBeGreaterThanOrEqual(2);
    for (const inc of json.data.incidents as { userId: string }[]) {
      expect(inc.userId).toBeDefined();
    }
  });

  it('should return empty list for user with no incidents', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${secondUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incidents).toEqual([]);
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents',
    });

    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/v1/incidents/:id', () => {
  it('should return incident detail for owner', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.id).toBe(incidentId);
  });

  it('should return 404 for other user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}`,
      headers: { authorization: `Bearer ${secondUserToken}` },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 200 for admin', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.id).toBe(incidentId);
  });

  it('should return 404 for non-existent incident', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents/00000000-0000-0000-0000-000000000000',
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}`,
    });

    expect(res.statusCode).toBe(401);
  });
});

describe('PATCH /api/v1/incidents/:id/status', () => {
  it('should update incident status with valid transition', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { status: 'in_progress' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.status).toBe('in_progress');
  });

  it('should return 404 for other user', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${secondUserToken}` },
      payload: { status: 'resolved' },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid status value', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { status: 'invalid_status' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should reject invalid status transition in_progress → closed', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { status: 'closed' },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('INVALID_STATUS_TRANSITION');
  });

  it('should allow same status transition (no-op)', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { status: 'in_progress' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.status).toBe('in_progress');
  });

  it('should allow valid transition in_progress → resolved', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/status`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { status: 'resolved' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.status).toBe('resolved');
  });
});

describe('PATCH /api/v1/incidents/:id/priority', () => {
  it('should update incident priority', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/priority`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { priority: 'critical' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.priority).toBe('critical');
  });

  it('should return 404 for other user', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/priority`,
      headers: { authorization: `Bearer ${secondUserToken}` },
      payload: { priority: 'low' },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid priority', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/incidents/${incidentId}/priority`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { priority: 'urgent' },
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('POST /api/v1/incidents/:id/comments', () => {
  it('should add a comment and return 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${incidentId}/comments`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { content: 'Voy a revisar la PC' },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().data.comment.content).toBe('Voy a revisar la PC');
  });

  it('should return 404 for other user incident', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${incidentId}/comments`,
      headers: { authorization: `Bearer ${secondUserToken}` },
      payload: { content: 'Intento de comentario' },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${incidentId}/comments`,
      payload: { content: 'Sin token' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 for empty content', async () => {
    const res = await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${incidentId}/comments`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { content: '' },
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/v1/incidents/:id/comments', () => {
  it('should list comments for incident', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}/comments`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.comments.length).toBeGreaterThanOrEqual(1);
  });

  it('should return 404 for other user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${incidentId}/comments`,
      headers: { authorization: `Bearer ${secondUserToken}` },
    });

    expect(res.statusCode).toBe(404);
  });
});

describe('GET /api/v1/admin/incidents', () => {
  it('should return all incidents for admin with meta', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents.length).toBeGreaterThanOrEqual(2);
    expect(json.data.meta).toBeDefined();
    expect(json.data.meta.page).toBe(1);
    expect(json.data.meta.limit).toBe(20);
    expect(json.data.meta.total).toBeGreaterThanOrEqual(2);
    expect(json.data.meta.pages).toBeGreaterThanOrEqual(1);
  });

  it('should accept pagination params', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?page=1&limit=2',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents.length).toBeLessThanOrEqual(2);
    expect(json.data.meta.page).toBe(1);
    expect(json.data.meta.limit).toBe(2);
  });

  it('should return empty array beyond last page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?page=999&limit=10',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents).toEqual([]);
    expect(json.data.meta.page).toBe(999);
  });

  it('should filter by status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?status=open',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    for (const inc of json.data.incidents as { status: string }[]) {
      expect(inc.status).toBe('open');
    }
  });

  it('should filter by priority', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?priority=high',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    for (const inc of json.data.incidents as { priority: string }[]) {
      expect(inc.priority).toBe('high');
    }
  });

  it('should combine filters', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?status=open&priority=high',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
  });

  it('should filter by date range', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?dateFrom=2026-01-01&dateTo=2026-12-31',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.meta).toBeDefined();
    expect(res.json().data.meta.total).toBeGreaterThanOrEqual(0);
  });

  it('should return empty array when no incidents match', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?status=closed',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents).toEqual([]);
    expect(json.data.meta.total).toBe(0);
  });

  it('should return 400 for invalid filter values', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?status=invalid_status',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents?page=0',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents',
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 403 for regular user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/incidents',
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(403);
  });
});

describe('GET /api/v1/incidents — pagination', () => {
  let manyUserToken: string;
  let totalCreated = 0;

  beforeAll(async () => {
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'pagination@test.com',
        password: '123456',
        name: 'Pagination User',
      },
    });
    manyUserToken = regRes.json().data.token;

    for (let i = 0; i < 7; i++) {
      await app.inject({
        method: 'POST',
        url: '/api/v1/incidents',
        headers: { authorization: `Bearer ${manyUserToken}` },
        payload: {
          title: `Incident ${i + 1}`,
          description: `Description for incident ${i + 1}`,
          category: 'software',
          priority: i < 2 ? 'high' : i < 5 ? 'medium' : 'low',
        },
      });
      totalCreated++;
    }
  });

  it('should return page 1 with default limit (20)', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.ok).toBe(true);
    expect(json.data.incidents.length).toBeLessThanOrEqual(20);
    expect(json.data.meta.page).toBe(1);
    expect(json.data.meta.limit).toBe(20);
    expect(json.data.meta.total).toBe(totalCreated);
    expect(json.data.meta.pages).toBe(1);
  });

  it('should return page 1 with custom limit', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?page=1&limit=3',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents.length).toBe(3);
    expect(json.data.meta.page).toBe(1);
    expect(json.data.meta.limit).toBe(3);
    expect(json.data.meta.total).toBe(totalCreated);
    expect(json.data.meta.pages).toBe(3);
  });

  it('should return page 2 with remaining items', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?page=2&limit=3',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents.length).toBe(3);
    expect(json.data.meta.page).toBe(2);
    expect(json.data.meta.total).toBe(totalCreated);
  });

  it('should return page 3 with 1 remaining item', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?page=3&limit=3',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents.length).toBe(1);
    expect(json.data.meta.page).toBe(3);
    expect(json.data.meta.total).toBe(totalCreated);
    expect(json.data.meta.pages).toBe(3);
  });

  it('should return empty array beyond last page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?page=99&limit=3',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incidents).toEqual([]);
    expect(json.data.meta.page).toBe(99);
    expect(json.data.meta.total).toBe(totalCreated);
  });

  it('should return 400 for invalid page value', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?page=-1',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid limit (0)', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?limit=0',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for limit over 100', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?limit=200',
      headers: { authorization: `Bearer ${manyUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/v1/incidents — filtering', () => {
  let filterUserToken: string;

  beforeAll(async () => {
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'filter@test.com',
        password: '123456',
        name: 'Filter User',
      },
    });
    filterUserToken = regRes.json().data.token;
  });

  it('should filter by status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?status=open',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    for (const inc of json.data.incidents as { status: string }[]) {
      expect(inc.status).toBe('open');
    }
  });

  it('should filter by multiple statuses', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?status=open,resolved',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
  });

  it('should filter by priority', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?priority=high',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    for (const inc of json.data.incidents as { priority: string }[]) {
      expect(inc.priority).toBe('high');
    }
  });

  it('should filter by category', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?category=software',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    for (const inc of json.data.incidents as { category: string }[]) {
      expect(inc.category).toBe('software');
    }
  });

  it('should combine multiple filters', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?status=open&priority=high&category=software',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
  });

  it('should return empty array when no incidents match', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?status=closed',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incidents).toEqual([]);
    expect(res.json().data.meta.total).toBe(0);
  });

  it('should return 400 for invalid status value', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?status=invalid_status',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid priority value', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?priority=urgent',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid category value', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?category=invalid_cat',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid dateFrom format', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/incidents?dateFrom=not-a-date',
      headers: { authorization: `Bearer ${filterUserToken}` },
    });

    expect(res.statusCode).toBe(400);
  });
});

describe('GET /api/v1/incidents/:id — detail with comments', () => {
  let detailToken: string;
  let detailIncidentId: string;
  let detailCommentId: string;

  beforeAll(async () => {
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'detail@test.com',
        password: '123456',
        name: 'Detail User',
      },
    });
    detailToken = regRes.json().data.token;

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${detailToken}` },
      payload: {
        title: 'Detail incident',
        description: 'Testing detail with comments',
        category: 'network',
        priority: 'critical',
      },
    });
    detailIncidentId = createRes.json().data.incident.id;

    const commentRes1 = await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${detailIncidentId}/comments`,
      headers: { authorization: `Bearer ${detailToken}` },
      payload: { content: 'First comment' },
    });
    detailCommentId = commentRes1.json().data.comment.id;

    await app.inject({
      method: 'POST',
      url: `/api/v1/incidents/${detailIncidentId}/comments`,
      headers: { authorization: `Bearer ${detailToken}` },
      payload: { content: 'Second comment' },
    });
  });

  it('should include comments array in incident detail', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${detailIncidentId}`,
      headers: { authorization: `Bearer ${detailToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.data.incident.comments).toBeDefined();
    expect(Array.isArray(json.data.incident.comments)).toBe(true);
    expect(json.data.incident.comments.length).toBe(2);
  });

  it('should include correct comment data', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${detailIncidentId}`,
      headers: { authorization: `Bearer ${detailToken}` },
    });

    const json = res.json();
    const comments = json.data.incident.comments;
    const firstComment = comments.find(
      (c: { id: string }) => c.id === detailCommentId,
    );
    expect(firstComment).toBeDefined();
    expect(firstComment.content).toBe('First comment');
  });

  it('should return empty comments array when no comments', async () => {
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'detail-no-comments@test.com',
        password: '123456',
        name: 'Detail No Comments',
      },
    });
    const token = regRes.json().data.token;

    const createRes = await app.inject({
      method: 'POST',
      url: '/api/v1/incidents',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        title: 'No comments incident',
        description: 'This incident has no comments',
        category: 'other',
        priority: 'low',
      },
    });
    const id = createRes.json().data.incident.id;

    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/incidents/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.comments).toEqual([]);
  });
});
