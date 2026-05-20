import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ADMIN_EMAIL = 'seeded-admin@test.com';
const ADMIN_PASSWORD = 'adminpass123';

process.env.ADMIN_EMAIL = ADMIN_EMAIL;
process.env.ADMIN_PASSWORD = ADMIN_PASSWORD;

const { buildApp } = await import('../src/app.js');
const { authService } = await import('../src/modules/auth/auth.service.js');

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('seed admin', () => {
  it('should have created admin user from env vars', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().data.user.role).toBe('admin');
  });

  it('should not duplicate admin on repeated seed', async () => {
    await authService.seedAdmin(ADMIN_EMAIL, ADMIN_PASSWORD);

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /api/v1/admin/health', () => {
  let userToken: string;
  let adminToken: string;

  beforeAll(async () => {
    const userRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: {
        email: 'regular@test.com',
        password: 'userpass123',
        name: 'Regular',
      },
    });
    userToken = userRes.json().data.token;

    const adminRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    adminToken = adminRes.json().data.token;
  });

  it('should return 401 without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/health',
    });
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 for regular user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/health',
      headers: { authorization: `Bearer ${userToken}` },
    });
    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('FORBIDDEN');
  });

  it('should return 200 for admin', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/admin/health',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().ok).toBe(true);
  });
});
