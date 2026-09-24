# When to Mock

Mock at **system boundaries** only:

- External APIs (payment, email, etc.)
- Databases (sometimes - prefer a test DB)
- Time and randomness
- File system (sometimes)

Do not mock:

- Your own classes or modules
- Internal collaborators
- Anything you control

## Designing for mockability

At system boundaries, design interfaces that are easy to mock.

**1. Use dependency injection.** Pass external dependencies in rather than creating them internally:

```typescript
// Easy to mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// Hard to mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. Prefer SDK-style interfaces over one generic fetcher.** Create specific functions per external operation:

```typescript
// GOOD: each function is independently mockable
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mocking requires conditional logic inside the mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

Each mock then returns one specific shape, with no conditional logic in test setup.

## Anti-patterns

### Testing mock behavior

Asserting that a mock exists or was called, instead of that the real component works. The test passes when the mock is present and fails when it is not, so it proves nothing.

Fix: test the real component, or unmock it. If a dependency must be mocked for isolation, assert on the component's behavior with the mock present, never on the mock itself.

Before asserting on any mock, ask: am I testing real behavior or mock existence? If it is mock existence, delete the assertion or unmock.

### Mocking without understanding

Mocking a high-level method whose side effects the test depends on (for example, mocking a call that writes config the test needs). The test then passes or fails for the wrong reason.

Fix: understand the dependency first. Mock the slow or external part at the lowest level, not the high-level method. If unsure what the test needs, run it with the real implementation first, observe, then add minimal mocking.

Red flags: "I'll mock this to be safe", "this might be slow, better mock it", mocking without tracing the dependency chain.

### Incomplete mocks

Mocking only the fields the immediate test uses. Downstream code may depend on fields you omitted, so the test passes while integration fails.

Rule: mirror the complete real structure. Check the real response schema and include every field the system might consume.

### Over-complex mocks

Warning signs: mock setup longer than the test logic, mocking everything to make the test pass, mocks missing methods the real component has, tests that break when the mock changes.

Consider an integration test with real components; it is often simpler than a complex mock.

## Red flags

- Assertions on `*-mock` test ids
- Methods that only tests call
- Mock setup is more than half the test
- The test fails when you remove the mock
- You cannot explain why the mock is needed

## Bottom line

Mocks are tools to isolate, not things to test. If TDD reveals you are testing mock behavior, you went wrong: test real behavior, or question why you are mocking at all.
