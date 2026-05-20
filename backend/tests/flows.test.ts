import { afterAll, beforeAll, describe, expect, it } from 'vitest';

process.env.ADMIN_EMAIL = 'flows-admin@test.com';
process.env.ADMIN_PASSWORD = 'adminpass';

const { buildApp } = await import('../src/app.js');

let app: Awaited<ReturnType<typeof buildApp>>;

let userToken: string;
let userId: string;
let secondUserToken: string;
let adminToken: string;
let incidentId: string;
let commentId: string;

async function authed(
  method: string,
  url: string,
  token: string,
  payload?: unknown,
) {
  return app.inject({
    method: method as 'POST' | 'GET' | 'PATCH',
    url,
    headers: { authorization: `Bearer ${token}` },
    payload,
  });
}

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Full user journey', () => {
  it('Step 1: should register user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'journey@test.com',
        password: '123456',
        name: 'Journey User',
      },
    });
    expect(res.statusCode).toBe(201);
    userToken = res.json().data.token;
    userId = res.json().data.user.id;
  });

  it('Step 2: should login with registered user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'journey@test.com', password: '123456' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.user.id).toBe(userId);
  });

  it('Step 3: should create incident', async () => {
    const res = await authed('POST', '/api/v1/incidents', userToken, {
      title: 'Journey incident',
      description: 'Testing the full flow',
      category: 'network',
      priority: 'critical',
    });
    expect(res.statusCode).toBe(201);
    incidentId = res.json().data.incident.id;
  });

  it('Step 4: should list own incidents', async () => {
    const res = await authed('GET', '/api/v1/incidents', userToken);
    expect(res.statusCode).toBe(200);
    const ids = (res.json().data.incidents as { id: string }[]).map(
      (i: { id: string }) => i.id,
    );
    expect(ids).toContain(incidentId);
  });

  it('Step 5: should view incident detail', async () => {
    const res = await authed(
      'GET',
      `/api/v1/incidents/${incidentId}`,
      userToken,
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.id).toBe(incidentId);
  });

  it('Step 6: should add comment to incident', async () => {
    const res = await authed(
      'POST',
      `/api/v1/incidents/${incidentId}/comments`,
      userToken,
      { content: 'Comentario de prueba en el flujo completo' },
    );
    expect(res.statusCode).toBe(201);
    commentId = res.json().data.comment.id;
    expect(res.json().data.comment.content).toBe(
      'Comentario de prueba en el flujo completo',
    );
  });

  it('Step 7: should list comments on incident', async () => {
    const res = await authed(
      'GET',
      `/api/v1/incidents/${incidentId}/comments`,
      userToken,
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.comments.length).toBeGreaterThanOrEqual(1);
  });

  it('Step 8: should change incident status', async () => {
    const res = await authed(
      'PATCH',
      `/api/v1/incidents/${incidentId}/status`,
      userToken,
      { status: 'in_progress' },
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.status).toBe('in_progress');
  });

  it('Step 9: should change incident priority', async () => {
    const res = await authed(
      'PATCH',
      `/api/v1/incidents/${incidentId}/priority`,
      userToken,
      { priority: 'high' },
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.priority).toBe('high');
  });

  it('Step 10: other user cannot see the incident', async () => {
    const regRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'other-journey@test.com',
        password: '123456',
        name: 'Other User',
      },
    });
    secondUserToken = regRes.json().data.token;

    const res = await authed(
      'GET',
      `/api/v1/incidents/${incidentId}`,
      secondUserToken,
    );
    expect(res.statusCode).toBe(404);
  });

  it('Step 11: detail includes comments', async () => {
    const res = await authed(
      'GET',
      `/api/v1/incidents/${incidentId}`,
      userToken,
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.comments).toBeDefined();
    expect(res.json().data.incident.comments.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Full admin journey', () => {
  it('Admin Step 0: should login as admin', async () => {
    const adminRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: {
        email: 'flows-admin@test.com',
        password: 'adminpass',
      },
    });
    expect(adminRes.statusCode).toBe(200);
    adminToken = adminRes.json().data.token;
  });

  it('Admin Step 1: should list all incidents', async () => {
    const res = await authed('GET', '/api/v1/admin/incidents', adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.json().data.meta).toBeDefined();
    expect(res.json().data.meta.total).toBeGreaterThanOrEqual(1);
  });

  it('Admin Step 2: should view any incident detail', async () => {
    const res = await authed(
      'GET',
      `/api/v1/incidents/${incidentId}`,
      adminToken,
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.id).toBe(incidentId);
    expect(res.json().data.incident.comments).toBeDefined();
  });

  it('Admin Step 3: should change status of any incident', async () => {
    const res = await authed(
      'PATCH',
      `/api/v1/incidents/${incidentId}/status`,
      adminToken,
      { status: 'resolved' },
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.status).toBe('resolved');
  });

  it('Admin Step 4: should change priority of any incident', async () => {
    const res = await authed(
      'PATCH',
      `/api/v1/incidents/${incidentId}/priority`,
      adminToken,
      { priority: 'critical' },
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.incident.priority).toBe('critical');
  });

  it('Admin Step 5: should comment on any incident', async () => {
    const res = await authed(
      'POST',
      `/api/v1/incidents/${incidentId}/comments`,
      adminToken,
      { content: 'Comentario del admin en incidencia ajena' },
    );
    expect(res.statusCode).toBe(201);
  });

  it('Admin Step 6: should list incidents with filters', async () => {
    const res = await authed(
      'GET',
      '/api/v1/admin/incidents?status=resolved',
      adminToken,
    );
    expect(res.statusCode).toBe(200);
    for (const inc of res.json().data.incidents as { status: string }[]) {
      expect(inc.status).toBe('resolved');
    }
  });

  it('Admin Step 7: should list incidents with date filter', async () => {
    const res = await authed(
      'GET',
      '/api/v1/admin/incidents?dateFrom=2026-01-01&dateTo=2026-12-31',
      adminToken,
    );
    expect(res.statusCode).toBe(200);
    expect(res.json().data.meta).toBeDefined();
  });

  it('Admin Step 8: admin health returns ok', async () => {
    const res = await authed('GET', '/api/v1/admin/health', adminToken);
    expect(res.statusCode).toBe(200);
    expect(res.json().ok).toBe(true);
  });
});
