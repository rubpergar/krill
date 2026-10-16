# Good and Bad Tests

## Good Tests

**Integration-style**: Test through real interfaces, not mocks of internal parts.

```typescript
// GOOD: Tests observable behavior
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

Characteristics:

- Tests behavior users/callers care about
- Uses public API only
- Survives internal refactors
- Describes WHAT, not HOW
- One logical assertion per test

## Bad Tests

**Implementation-detail tests**: Coupled to internal structure.

```typescript
// BAD: Tests implementation details
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

Red flags:

- Mocking internal collaborators
- Testing private methods
- Asserting on call counts/order
- Test breaks when refactoring without behavior change
- Test name describes HOW not WHAT
- Verifying through external means instead of interface

```typescript
// BAD: Bypasses interface to verify
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: Verifies through interface
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**Tautological tests**: Expected value restates the implementation, so the test passes by construction.

```typescript
// BAD: Expected value is recomputed the way the code computes it
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: Expected value is an independent, known literal
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

## Valid Test Criteria

A test is valid only if it meets every universal criterion and, when it applies, the conditional ones. The `audit-tests` skill and task validation apply this list. The anti-patterns and the contract rule in [SKILL.md](SKILL.md) are part of it.

### Universal (every test)

- **Independence:** each test runs on its own and in any order, with its own identifiers and state. It cleans up only the data it creates and always closes connections, threads, sockets, servers, and temporary files.
- **One behavior per test:** each case validates a single observable contract and has a descriptive name. Several assertions of that contract are fine; unrelated behaviors are not.
- **Clean initial state:** no test depends on residual state from another test. Setup produces a known state and cleanup leaves the environment reproducible.
- **Determinism:** the result must not depend on execution order, time, fixed ports, or real external services. For async behavior, wait for an observable condition with a bounded timeout; a fixed wait is never the only evidence.
- **No implicit dependencies:** do not assume services, databases, credentials, or network. External dependencies are injected or mocked at boundaries; unit tests never require a real database, socket, or live service.
- **Public behavior:** assert on observable results, states, and effects, not on internals (see [SKILL.md](SKILL.md)).
- **Pre-agreed seam:** tests live at public seams agreed before writing, never against internals (see [SKILL.md](SKILL.md)).
- **Independent expected values:** the expected value comes from a known-good literal, a worked example, or the spec, never recomputed the way the code computes it (see the tautological anti-pattern in [SKILL.md](SKILL.md)).
- **Contract-preserving:** tests adapt to the production contract, never the reverse; production code is never changed, branched, or widened only to satisfy a test.

### Conditional (only when the test touches the matching concern)

- **Production isolation** (tests that connect to a database or service): no automated test may target production data, services, or ports. Tests use a test-safe target; the project's concrete mechanism (naming convention, in-memory database, adapter) is a project detail.
- **Fail-closed config** (tests that load configuration or fixtures): any failure to create, open, write, or load configuration or fixtures fails the test with a diagnosis; it never fails silently or falls back to an automatic lookup that could reach production.
- **Visible errors** (tests that prepare or execute against a database or IO): check every result of `prepare`/`exec`, transactions, inserts, updates, state queries, and cleanup, and propagate the error visibly. A setup or cleanup failure fails the case instead of surfacing later as an ambiguous failure.
- **Valid-by-default builders** (tests that build domain entities): builders and helpers create domain-valid entities by default; an invalid value is named explicitly and tested as a negative case.
- **Safe fixtures** (tests that use fixtures or seed data): fixtures are deterministic and contain no real credentials, secrets, or production-like personal data.
- **Opt-in runner** (tests capable of contacting production or real services): the default runner does not execute them; each opt-in path documents its requirements, command, skip criteria, and remaining coverage.
