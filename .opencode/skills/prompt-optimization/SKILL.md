---
name: prompt-optimization
description: Turn a rough request into an optimized, role-based prompt. Use when a request is vague, when the user asks to improve or structure a prompt, or before executing a complex task that benefits from an explicit role, context, constraints, and output contract.
---

# Prompt Optimization

Transform a vague or short request into a high-quality prompt, then either return it or execute it.

## When to use
- The request is short, ambiguous, or missing constraints.
- The user asks to improve, structure, or rewrite a prompt.
- A complex task benefits from an explicit expert role, context, and output contract.

## Role selection
Infer one primary expert role from the task. Do not ask the user to pick it.

- Architecture/system design -> `senior software architect`
- Build or code generation -> `senior [language/framework] engineer`
- Debugging/bug fixing -> `debugging specialist` or `senior troubleshooting engineer`
- Code review -> `senior code reviewer`
- Refactor/performance -> `performance and clean code engineer`
- Testing -> `QA automation engineer`
- Documentation -> `technical writer`
- Security-sensitive request -> `application security reviewer`
- Unknown or mixed technical request -> `senior software engineer`

## Construction requirements
- Start with the selected role.
- State the exact task in 1-2 lines.
- Include the relevant context from the request.
- Add concrete delivery expectations when appropriate: separate code by file, explain trade-offs, include edge cases, preserve existing behavior, include validation steps.
- Tailor the output format to the task: code -> files plus test steps; debugging -> probable causes, root cause, fix, prevention; review -> findings ordered by severity; architecture -> stack, structure, data model, risks; testing -> scenarios, mocks, coverage.
- Preserve strong constraints already present; sharpen weak ones without changing the goal.
- Do not invent project facts, APIs, files, or constraints. Use explicit placeholders when critical context is missing.
- Avoid filler, motivational text, and generic statements.
- Do not reveal hidden reasoning or chain-of-thought.

## Quality bar
Specific, executable, unambiguous, context-aware, output-oriented, and safe against invented assumptions.

## Modes
- Optimize only: output `Recommended role`, then the `Optimized prompt` in a single fenced block, then `Assumptions or gaps` if important details are missing.
- Optimize and execute: build the prompt without printing it, then use it immediately as the instruction to complete the task. Ask before executing if critical information is missing or the task is risky.
