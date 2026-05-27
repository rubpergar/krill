import { describe, it, expect } from "vitest";

describe("render helper", () => {
  it("exports a render function", async () => {
    const mod = await import("./render");
    expect(mod.render).toBeInstanceOf(Function);
  });
});
