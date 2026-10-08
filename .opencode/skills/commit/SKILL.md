---
name: commit
description: Use ONLY when /commit is invoked; inspect changed files and hunks, group them into precise Conventional Commits without over-splitting, and push.
---

# Commit Discipline

Create a small, coherent set of Conventional Commits from all available changes, then push to the active branch. Optimize for clear intent, not for the number of files or hunks.

## 1. Inspect all changes

Run:

```bash
git status --short
git diff --cached
git diff
git ls-files --others --exclude-standard
```

Review the full diff for every changed file. Read untracked files before staging them. Understand existing staged changes as well as unstaged changes; do not assume the whole file has one purpose just because it is one file.

## 2. Decide commit groups before staging

Review changes at hunk level and map each hunk to its intent, then group related hunks and files into the fewest commits that still have clear, distinct purposes.

**A hunk is something to review, not an automatic commit.** Never create one commit per file or per hunk by default.

Split changes only when all of the following are true:
- They represent genuinely different purposes, not just different locations or edit types.
- Each proposed group can be described by its own accurate commit message.
- Each group is independently meaningful and can be staged without making an awkward or broken intermediate change.
- The split improves the history enough to justify another commit.

Keep changes together when they contribute to the same outcome. In particular:
- Keep an implementation and its directly related tests together; include feature documentation when it describes that same feature.
- Keep a dependency change and its generated lockfile together.
- Keep related hunks in the same file or across files together even if they could technically be staged separately.
- Split formatting, refactoring, or unrelated behavior changes only when each part is clearly independent and cleanly separable. If intertwined, keep them together.
- Treat a new untracked file as one unit by default; split it only when separate parts are independently meaningful and safe to stage.

Do not split a mixed-purpose diff when the patch boundaries are ambiguous, staging would require reconstructing code, or the result would make an intermediate commit misleading. Keep it together or ask the user if the intent cannot be determined safely.

## 3. Stage and verify one group at a time

For each planned commit:
1. Stage only the files or hunks in that group. Use `git add -p` for cleanly separable hunks; never use `git add -A` blindly.
2. Inspect `git diff --cached` and confirm it contains the complete intended group and no unrelated changes.
3. Create the commit, then inspect `git status --short` before staging the next group.

Preserve changes the user already staged. Do not reset or unstage staged work wholesale. If existing staged hunks belong to different groups, separate them only when the exact boundaries are clear and safe; otherwise stop and ask before changing the index or committing them together.

## 4. Write Conventional Commit messages

Use this standard format:

```text
type(scope): summary
```

- Choose the most accurate lowercase type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`.
- Use a short scope when it adds useful context; omit it when it does not.
- Keep the full subject to 72 characters or fewer, use imperative wording, and omit the final period.
- Describe the purpose, not merely the changed file.
- Do not detect or prepend an issue key before the type. Do not use a non-standard prefix such as `PROJ-123: fix(...)`.

## 5. Safety and push

Never commit secrets, real `.env` values, credentials, debug logs, local editor files, temporary files, unintended build artifacts, or unrelated experiments. If a change is ambiguous or unsafe, leave it uncommitted and report why; ask the user when their decision is needed.

Do not amend existing commits, rewrite history, or force-push. Once all intended groups are committed, verify `git status --short`, then run:

```bash
git push
```

If the push fails because there is no upstream or the remote rejects it, stop and report the exact blocker instead of guessing a workaround.

## Final report

Briefly report the commits created, anything intentionally left uncommitted or skipped for safety, and the push result.
