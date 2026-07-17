---
description: Convert a rough request into an optimized prompt only
---

Generate an optimized prompt from the user's raw request.

Raw request: `$ARGUMENTS`

Goal:
- Transform a vague or short instruction into a high-quality prompt that helps an agent produce better results.
- Infer the most useful expert role automatically from the task instead of asking the user to define it manually.
- Preserve the user's intent while adding structure, constraints, missing quality criteria, and a clearer expected output.
- Return the optimized prompt only. Do not execute it.

If `$ARGUMENTS` is empty, ask the user for the raw idea or task they want to turn into a prompt.

Rules:
- This command never executes the task. Its only job is to output the optimized prompt.
- Infer the primary task type from the request. Typical categories include: architecture, implementation, debugging, code review, refactoring, testing, documentation, learning, automation, analysis, and planning.
- Choose one primary expert role that best matches the task. Use a concrete role, not a generic one. Examples: `software architect`, `senior TypeScript backend engineer`, `debugging specialist`, `security reviewer`, `technical writer`, `QA automation engineer`.
- If the request mixes multiple goals, keep one primary role and mention any secondary perspectives only when they materially improve the result.
- Add missing prompt structure when useful: role, objective, context, inputs, constraints, output format, acceptance criteria, and clarification clause.
- Use positive and direct instructions.
- Increase specificity. Replace generic wording with concrete expectations whenever the request already implies them.
- Do not invent technical facts that the user did not provide. When critical context is missing, either infer safely from the request or insert explicit placeholders like `[completa este dato]`.
- Prefer prompts that are actionable and production-oriented over academic or verbose prompts.
- Avoid filler, motivational text, and generic statements like `be precise` unless followed by a concrete requirement.
- Do not reveal hidden reasoning or chain-of-thought. Return only the useful result.

Role selection guide:
- Architecture/system design -> `senior software architect`
- Build or code generation -> `senior [language/framework] engineer`
- Debugging/bug fixing -> `debugging specialist` or `senior troubleshooting engineer`
- Code review -> `senior code reviewer`
- Refactor/performance -> `performance and clean code engineer`
- Testing -> `QA automation engineer`
- Documentation -> `technical writer`
- Security-sensitive request -> `application security reviewer`
- Unknown or mixed technical request -> `senior software engineer`

Output format:
1. `Recommended role:` one line.
2. `Optimized prompt:` a single fenced code block containing the final prompt.
3. `Assumptions or gaps:` only if there are important missing details the user should complete.

Prompt construction requirements:
- Start the prompt with the selected role.
- State the exact task in 1-2 lines.
- Include relevant context from the user request.
- Add concrete delivery expectations when appropriate, for example:
  - separate code by file
  - explain trade-offs
  - include edge cases
  - preserve existing behavior
  - include validation steps
  - ask clarifying questions before assuming critical missing information
- Tailor the response format to the task. Examples:
  - code generation -> files + test steps
  - debugging -> probable causes + root cause + fix + prevention
  - review -> findings ordered by severity
  - architecture -> stack + structure + data model + risks
  - testing -> scenarios + mocks + coverage summary
  - docs -> README/API/docs structure
- When the request already contains strong constraints, keep them and sharpen them.
- When the request is weak or broad, add practical constraints that improve answer quality without changing the original goal.

Quality bar for the optimized prompt:
- Specific
- Executable
- Unambiguous
- Context-aware
- Output-oriented
- Safe against invented assumptions

Flow:
1. Read `$ARGUMENTS` and identify the underlying task.
2. Infer the best expert role.
3. Extract explicit context, constraints, and desired output.
4. Add the missing structure that would materially improve the prompt.
5. Return the optimized prompt in the required format.
