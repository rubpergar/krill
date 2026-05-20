import { afterEach, describe, expect, it, vi } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const fakeToken = 'fake-jwt-token';
const fakeUser = {
  id: '1',
  email: 'test@test.com',
  name: 'Test',
  role: 'user',
};

afterEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

async function importApi() {
  return await import('../src/services/api');
}

function mockResponse(data: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve({ ok: true, data }),
  };
}

function mockError(status: number, code: string, message: string) {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({ ok: false, error: { code, message } }),
  };
}

describe('api.login', () => {
  it('should return user and token on success', async () => {
    mockFetch.mockResolvedValue(
      mockResponse({ user: fakeUser, token: fakeToken }),
    );

    const api = await importApi();
    const result = await api.login('test@test.com', '123456');

    expect(result.user.email).toBe('test@test.com');
    expect(result.token).toBe(fakeToken);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/auth/login',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: '123456' }),
      }),
    );
  });

  it('should throw ApiError on wrong credentials', async () => {
    mockFetch.mockResolvedValue(
      mockError(401, 'INVALID_CREDENTIALS', 'Credenciales inválidas'),
    );

    const api = await importApi();
    await expect(api.login('test@test.com', 'wrong')).rejects.toThrow(
      'Credenciales inválidas',
    );
  });
});

describe('api.getMe', () => {
  it('should return user with valid token', async () => {
    localStorage.setItem('token', fakeToken);
    mockFetch.mockResolvedValue(mockResponse({ user: fakeUser }));

    const api = await importApi();
    const result = await api.getMe();

    expect(result.user.email).toBe('test@test.com');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/auth/me',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${fakeToken}`,
        }),
      }),
    );
  });

  it('should throw on 401 and clear token', async () => {
    localStorage.setItem('token', 'expired-token');
    mockFetch.mockResolvedValue(
      mockError(401, 'UNAUTHORIZED', 'Token inválido'),
    );

    const api = await importApi();
    await expect(api.getMe()).rejects.toThrow();
    expect(localStorage.getItem('token')).toBeNull();
  });
});

describe('api.getIncidents', () => {
  it('should return incidents list', async () => {
    localStorage.setItem('token', fakeToken);
    mockFetch.mockResolvedValue(
      mockResponse({
        incidents: [{ id: '1', title: 'Test' }],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      }),
    );

    const api = await importApi();
    const result = await api.getIncidents({ status: 'open' });

    expect(result.incidents).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/v1/incidents?status=open',
      expect.any(Object),
    );
  });
});

describe('api.createIncident', () => {
  it('should create incident and return it', async () => {
    localStorage.setItem('token', fakeToken);
    mockFetch.mockResolvedValue(
      mockResponse({
        incident: {
          id: 'new-id',
          title: 'New Incident',
          description: 'Desc',
          category: 'software',
          priority: 'high',
          status: 'open',
          userId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    );

    const api = await importApi();
    const result = await api.createIncident({
      title: 'New Incident',
      description: 'Desc',
      category: 'software',
      priority: 'high',
    });

    expect(result.incident.title).toBe('New Incident');
    expect(result.incident.status).toBe('open');
  });
});
