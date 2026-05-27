import { describe, it, expect, beforeAll, afterAll } from "vitest";

beforeAll(() => {
  process.env.DATABASE_URL = ":memory:";
});

afterAll(() => {
  delete process.env.DATABASE_URL;
});

describe("database connection", () => {
  it("exports db and sqlite from connection module", async () => {
    const mod = await import("./index");
    expect(mod.db).toBeDefined();
    expect(mod.sqlite).toBeDefined();
  });

  it("sqlite connection is open", async () => {
    const { sqlite } = await import("./index");
    expect(sqlite.open).toBe(true);
  });
});
