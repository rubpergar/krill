---
name: code-review
description: Review a task's diff on three independent axes (Spec, Standards, Improvement) to find defects, simplifications, and more maintainable alternatives. Use when reviewing the active task before closeout, a branch, a PR, or work-in-progress changes, or when the user asks to review a diff.
---

# Code Review

Read-only, independent review of a task's diff against a fixed point (its own commits and working-tree changes by default). This skill owns the review method. `agents/docs/task-lifecycle.md` owns the review gate and the phase transition that follows.

Independence comes from two levers: the whole review should run without the implementation context (prefer a fresh session), and each axis runs in its own sub-agent so they do not contaminate each other. Sub-agents receive only the diff command, the spec and standards, and the brief; they never see the planning or implementation conversation.

## Three axes

Run each axis in its own sub-agent so their contexts do not contaminate each other, then aggregate. Never merge or rerank findings across axes.

- **Spec**: does the diff implement the approved plan and every acceptance criterion? Report requirements that are missing, partial, implemented incorrectly, or present but unrequested (scope creep).
- **Standards**: does the diff follow the repository's documented conventions (`AGENTS.md`, the relevant `agents/docs/*`, `.opencode/skills/code-design/SKILL.md`) and the smell baseline below? The repo overrides the baseline.
- **Improvement**: is there a simpler, clearer, or more maintainable alternative? Look for duplicated logic, premature abstraction, unnecessary indirection, dead code, and weaker-than-necessary naming. Each suggestion is a judgement call with a concrete recommendation, ordered by leverage.

## Process

1. **Pin the fixed point.** Default to the point where the task started (its own commits and working-tree changes, scoped to the files the task touched). `$ARGUMENTS` may override it. Verify the ref resolves (`git rev-parse`) and the diff is non-empty before spawning sub-agents.
2. **Identify the spec source.** The active `agents/tasks/current/TASK-XXX.md` (Plan plus acceptance criteria). If there is no task, the Spec axis reports `no spec available`.
3. **Identify the standards sources.** `AGENTS.md`, the relevant `agents/docs/*`, `.opencode/skills/code-design/SKILL.md`, and repository conventions.
4. **Spawn one sub-agent per axis in the same turn.** Give each: the diff command and commit list, its source material, and a brief. Include the smell baseline only for the Standards axis. Ask for findings with `file:line`, severity (`blocking`, `important`, `nit`), and under 400 words.
5. **Aggregate** under `## Spec`, `## Standards`, and `## Improvement`, keeping the axes separate. End with the finding count per axis and the worst finding within each axis; never pick a single winner across axes.

## Smell baseline

A fixed set of Fowler smells (_Refactoring_, ch. 3) that applies even when a repository documents nothing. Two rules bind it: the repository's documented standards override it, and every smell is a labelled judgement call, never a hard violation. Skip anything tooling already enforces.

- **Mysterious Name**: a name that does not reveal what it does or holds. Rename it; if no honest name comes, the design is murky.
- **Duplicated Code**: the same logic shape appears in more than one place. Extract the shared shape.
- **Feature Envy**: a method reaching into another object's data more than its own. Move it onto the data it envies.
- **Data Clumps**: the same fields or parameters travel together. Bundle them into one type.
- **Primitive Obsession**: a primitive standing in for a domain concept. Give the concept its own small type.
- **Repeated Switches**: the same `switch` or `if` cascade on the same type recurs. Replace with polymorphism or one shared map.
- **Shotgun Surgery**: one logical change forces scattered edits. Gather what changes together.
- **Divergent Change**: one module is edited for several unrelated reasons. Split so each changes for one reason.
- **Speculative Generality**: abstraction or hooks for needs the spec does not have. Delete them.
- **Message Chains**: long `a.b().c().d()` navigation. Hide the walk behind one method.
- **Middle Man**: a class or function that mostly delegates. Cut it.
- **Refused Bequest**: a subclass that ignores most of what it inherits. Prefer composition.

## Why separate axes

A change can pass one axis and fail another: code that follows every standard but implements the wrong thing fails Spec; code that does exactly what was asked but breaks conventions fails Standards. Reporting them separately stops one axis from masking the other.

## Constraints

- Review-only. Never edit code, tests, docs, or the task file.
- Out-of-scope findings are proposed for `agents/docs/debt.md`, never applied.
- Reject speculative findings and refactors with no concrete impact.
- A test that only passes because production was bent to it is a finding, not a pass.
