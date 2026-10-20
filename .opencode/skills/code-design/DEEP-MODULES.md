# Deep Modules

## Vocabulary

Use these concepts to explain architectural trade-offs, while preserving the project's established names.

- **Module**: a function, class, package, or cohesive slice with an interface and an implementation.
- **Interface**: everything a caller must know to use the module correctly, including parameters, invariants, ordering, errors, configuration, and relevant performance expectations. It is not just a language's `interface` declaration.
- **Implementation**: the behavior hidden behind that interface.
- **Depth**: the useful behavior available per amount of interface knowledge a caller needs. A deep module hides meaningful complexity; a shallow one exposes almost as much as it implements.
- **Seam**: a place where behavior can vary without editing the caller. An adapter is a concrete implementation used at that seam.
- **Leverage**: callers obtain substantial capability through a small interface.
- **Locality**: related knowledge, changes, bugs, and verification concentrate in one cohesive place.

## Reasoning about a candidate

- **Depth is about the interface, not line count.** A large implementation does not prove depth, and a small module is not automatically shallow. Private composition can remain small and focused.
- **Deletion test.** Imagine removing the module. If complexity vanishes, it may be a dispensable pass-through. If coordination and invariants reappear across callers, it earns its keep. A useful refactor removes unnecessary indirection or concentrates scattered complexity behind a smaller interface; it does not push that complexity onto callers.
- **The interface is the test surface.** Test observable behavior through the same contract callers use. Isolated tests of extracted internals do not prove their coordination works.
- **Variation must be real.** Apply the abstraction thresholds in `SKILL.md`; do not invent seams or adapters for hypothetical future implementations.

Before recommending a refactor, identify a representative caller or maintenance change. Explain what that caller would no longer need to know, which coordinated edits would disappear, and how tests would exercise the preserved behavior. If none of those improves, prefer keeping the current structure.
