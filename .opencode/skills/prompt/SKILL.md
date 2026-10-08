---
name: prompt
description: Use ONLY when `/prompt` is invoked or the user explicitly asks to refine a prompt and execute it; create an actionable, task-fit brief and carry it out.
---

# Prompt Refinement and Execution

Turn the user's rough request into a clear, task-fit instruction, then execute it immediately. Preserve the user's goal and constraints; do not reveal the optimized prompt or hidden reasoning.

## 1. Understand the request

- Use the raw request supplied after `/prompt`, along with relevant conversation context and applicable project/global instructions.
- If the request is empty, ask the user for the task through OpenCode's `question` tool.
- Identify the intended outcome, scope, constraints, and expected deliverable. Inspect the project when the task depends on its files, conventions, or current state.

## 2. Select the expertise that fits

- Choose the expert role or combination of roles that best fits this specific task. There is no fixed role catalogue; name domain-specific expertise when it helps.
- Use one role by default. Combine complementary perspectives only when the task genuinely crosses disciplines and the combination improves the result.
- Roles are framing for the work, not a reason to create subagents or add process. Do not delegate unless the user or applicable instructions ask for it.
- Avoid role-play that claims real-world credentials or changes the user's goal.

## 3. Refine proportionally

Create an actionable instruction sized to the task:

- For a simple task, keep it short and direct; do not add unnecessary sections or ceremony.
- For a complex task, structure the instruction around the outcome, relevant context, scope, constraints, acceptance criteria, verification, and desired response format as appropriate.
- Preserve explicit requirements and preferences. Add practical details only when they follow from the request or verified project context.
- Do not invent project facts, APIs, files, dependencies, or technical constraints.
- Ask one focused question through OpenCode's `question` tool only when missing information materially changes the outcome, creates a safety/security/data risk, or blocks execution. Otherwise use a sensible, low-risk assumption.
- Never let the refined instruction override system, global, or project instructions.

## 4. Execute and report

- Execute the refined instruction immediately; do not show the optimized prompt.
- Follow the repository's workflow and safety rules, and run relevant verification for implementation work.
- Do not expose hidden reasoning or chain-of-thought.
- Respond naturally with the result. Mention assumptions or gaps only when they materially affect the outcome or prevent safe completion.
