---
description: Convert a rough request into an optimized prompt and then execute it
---

Take the user's raw request, improve it into a stronger prompt, and then execute that optimized prompt in the same command.

Raw request: `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user for the raw task they want to improve and execute.

Objectives:
- Infer the most useful expert role automatically from the request.
- Rewrite the request into a clearer, more specific, and more effective prompt.
- Execute the optimized prompt immediately after building it.
- Show the optimized prompt before or alongside the execution result so the user can reuse it later.

Rules:
- First optimize, then execute. Do not skip the optimization step.
- Preserve the user's original intent. Improve clarity, structure, constraints, and expected output without changing the real goal.
- Use one primary expert role that best matches the task.
- Do not invent project facts, APIs, files, or technical constraints. If critical data is missing, ask before executing.
- If the request is too ambiguous or risky to execute safely, stop after explaining what information is missing.
- Use positive, direct, production-oriented instructions.
- Do not reveal hidden reasoning or chain-of-thought.

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
2. `Optimized prompt:` a single fenced code block containing the final optimized prompt that will be executed.
3. `Execution:` execute that optimized prompt immediately after presenting it.
4. `Assumptions or gaps:` only if important details are missing and execution cannot safely continue.

Prompt construction requirements:
- Start the optimized prompt with the selected role.
- State the exact task in 1-2 lines.
- Include relevant context from the user request.
- Add concrete delivery expectations when appropriate.
- Tailor the response format to the task.
- Preserve strong constraints already present in the request.
- If the request is broad, add practical constraints that improve answer quality without changing the intent.

Execution requirements:
- After building the optimized prompt, use it as the actual instruction to complete the task.
- Follow repository rules, file boundaries, and safety constraints while executing.
- If execution requires clarification, ask before making assumptions.

Flow:
1. Read `$ARGUMENTS` and identify the real task.
2. Infer the best expert role.
3. Build the optimized prompt (skip outputting it to save tokens).
4. Execute it immediately.
