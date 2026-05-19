import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';

let app: Awaited<ReturnType<typeof buildApp>>;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

async function request(method: string, url: string, payload?: unknown) {
  const res = await app.inject({
    method: method as 'POST' | 'GET' | 'PATCH' | 'DELETE',
    url,
    payload,
  });
  return { status: res.statusCode, json: res.json() };
}

async function registerUser(email: string, password: string, name: string) {
  return request('POST', '/api/v1/auth/register', { email, password, name });
}

async function loginUser(email: string, password: string) {
  return request('POST', '/api/v1/auth/login', { email, password });
}

describe('POST /api/v1/auth/register', () => {
  it('should register a new user and return token', async () => {
    const { status, json } = await registerUser(
      'test@example.com',
      '123456',
      'Test User',
    );

    expect(status).toBe(201);
    expect(json.ok).toBe(true);
    expect(json.data.user).toBeDefined();
    expect(json.data.user.email).toBe('test@example.com');
    expect(json.data.user.name).toBe('Test User');
    expect(json.data.user.role).toBe('user');
    expect(json.data.user.password).toBeUndefined();
    expect(typeof json.data.token).toBe('string');
  });

  it('should reject duplicate email', async () => {
    const { status, json } = await registerUser(
      'test@example.com',
      '123456',
      'Dup User',
    );

    expect(status).toBe(409);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe('DUPLICATE_EMAIL');
  });

  it('should reject invalid email', async () => {
    const { status } = await registerUser(
      'not-an-email',
      '123456',
      'Bad Email',
    );
    expect(status).toBe(400);
  });

  it('should reject short password', async () => {
    const { status } = await registerUser('short@pw.com', '12345', 'Short PW');
    expect(status).toBe(400);
  });

  it('should reject empty name', async () => {
    const { status } = await registerUser('noname@test.com', '123456', '');
    expect(status).toBe(400);
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should login with correct credentials', async () => {
    const { status, json } = await loginUser('test@example.com', '123456');

    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.data.user.email).toBe('test@example.com');
    expect(json.data.user.password).toBeUndefined();
    expect(typeof json.data.token).toBe('string');
  });

  it('should reject wrong password', async () => {
    const { status, json } = await loginUser('test@example.com', 'wrongpass');

    expect(status).toBe(401);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('should reject unknown email', async () => {
    const { status, json } = await loginUser('unknown@test.com', '123456');

    expect(status).toBe(401);
    expect(json.ok).toBe(false);
    expect(json.error.code).toBe('INVALID_CREDENTIALS');
  });
});

describe('authenticate middleware', () => {
  let validToken: string;

  beforeAll(async () => {
    const { json } = await loginUser('test@example.com', '123456');
    validToken = json.data.token;
  });

  it('should reject requests without token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
    });

    expect(res.statusCode).toBe(401);
  });

  it('should reject invalid token', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: 'Bearer invalid-token' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('should allow request with valid token and expose user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(res.statusCode).toBe(200);
    const json = res.json();
    expect(json.ok).toBe(true);
    expect(json.data.user.email).toBe('test@example.com');
    expect(json.data.user.role).toBe('user');
  });
});
